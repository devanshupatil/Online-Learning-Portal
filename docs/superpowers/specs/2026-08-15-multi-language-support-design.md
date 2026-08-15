# Multi-Language Support (English / Hindi / Marathi) — Design

## Goal

Support English, Hindi, and Marathi across the whole site: both static UI text
(nav, buttons, labels, headings) and dynamic, user-entered content (course
info, announcements, results remarks, profile text, etc.), using only free
tooling.

## Constraints & Decisions

- **Translation engine**: reuse the existing Gemini setup already wired into
  `Backend/llm.js` (`GOOGLE_API_KEY` / `@google/generative-ai`, though as a
  new function — see below). No new accounts, no paid API.
- **Rollout scope**: whole site at once (public pages + Admin/Teacher/Parent
  dashboards), not phased — for **static UI text**.
- **Dynamic content scope, revised after codebase check**: most pages
  (Results, Courses, Contact, Parents, and much of Admin/Teacher) are
  currently built against `Frontend/src/mockData/mockFetch.js` — a
  documented stand-in for a disconnected real backend — not live Postgres
  data. A grep of `Backend/models` and `Backend/controllers` also found no
  existing free-text content fields (title/description/remark/announcement)
  on any currently-real endpoint; live routes today cover study materials,
  test materials, attendance, and student info, which are file/numeric data,
  not translatable prose. There is also no shared API client (no
  `axios.create`, no central fetch wrapper) to attach an `X-Lang` header to.
  Given this, **v1 builds the dynamic-content translation infrastructure
  (table + service functions below) but does not wire it into any endpoint
  yet**, since no real endpoint currently has free-text content to
  translate. It's built as a ready-to-use foundation: the next time a
  feature adds a real free-text field (e.g. course descriptions once
  Courses moves off mock data), wiring it in is one `translateFields(...)`
  call plus one `X-Lang` header — no new schema or service work. Building
  the missing CRUD/backend wiring for those pages is a separate, larger
  effort, out of scope here.
- **Source language**: all content is always authored in English. Hindi and
  Marathi versions are always derived from the English original — no
  source-language detection needed.
- **Language persistence**: browser-only (`localStorage`), not tied to user
  accounts. No DB migration for user preference.

## Architecture

Two independent mechanisms, both backed by Gemini:

1. **Static UI text** — `react-i18next`, translation JSON files per locale.
2. **Dynamic content** — a generic, hash-keyed translation cache table in
   Postgres, populated on demand via Gemini.

### 1. Static UI text (react-i18next)

- Add `i18next`, `react-i18next` to `Frontend`.
- Translation files: `Frontend/src/locales/{en,hi,mr}/translation.json`,
  organized by feature/page (nested keys, e.g. `nav.home`, `results.title`).
- All existing hardcoded strings in components are replaced with `t('key')`
  calls, across the whole site (public pages, Admin/Teacher/Parent
  dashboards, shared nav/header/footer).
- **Bootstrap script** (`Backend/scripts/generate-ui-translations.js`, run
  once manually, not part of the request path): reads `en/translation.json`,
  sends each string to Gemini asking for a Hindi and Marathi translation,
  writes `hi/translation.json` and `mr/translation.json`. This is a one-time
  (or re-run-when-strings-change) offline step — it does not run at request
  time and costs nothing on an ongoing basis beyond the one-off Gemini calls.
- Developers can hand-edit the generated JSON afterward if a translation
  needs correction; the script only overwrites keys it's asked to generate.

### 2. Dynamic content (generic translation cache)

**Table** (Postgres):

```sql
CREATE TABLE translations (
  id SERIAL PRIMARY KEY,
  content_hash CHAR(64) NOT NULL,   -- sha256 of the original English text
  target_lang VARCHAR(5) NOT NULL,  -- 'hi' | 'mr'
  translated_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (content_hash, target_lang)
);
```

- Keyed by a hash of the **original English text**, not by table/row/column.
  This means identical strings anywhere in the app share a cache entry, and
  edited text naturally gets a new hash (no invalidation logic needed —
  the old row just stops being referenced).

**`geminiTranslate` is a new function**, not the existing `gemini()` export
from `llm.js`. `llm.js`'s `gemini()` is hard-wired for image/PDF question
extraction (it calls `readInputToImages()` and forces a fixed exam-Q&A
response schema) — it cannot take a plain string. The new function lives in
`Backend/services/translate.js`, initializes its own
`GoogleGenerativeAI(process.env.GOOGLE_API_KEY)` client (same env var,
independent of `llm.js`), and sends a plain translation prompt, e.g.:

```js
async function geminiTranslate(text, targetLang) {
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-pro' });
  const langName = targetLang === 'hi' ? 'Hindi' : 'Marathi';
  const result = await model.generateContent(
    `Translate the following text to ${langName}. Return ONLY the translated text, no explanation:\n\n${text}`
  );
  return result.response.text().trim();
}
```

**Backend helper** (`Backend/services/translate.js`):

```js
async function translateText(text, targetLang) {
  if (!text || targetLang === 'en') return text;
  const hash = sha256(text);
  const cached = await db.query(
    'SELECT translated_text FROM translations WHERE content_hash=$1 AND target_lang=$2',
    [hash, targetLang]
  );
  if (cached.rows[0]) return cached.rows[0].translated_text;

  try {
    const translated = await geminiTranslate(text, targetLang);
    // ON CONFLICT DO NOTHING: benign if two concurrent requests race to
    // translate the same new string — both succeed, one INSERT is dropped.
    await db.query(
      'INSERT INTO translations (content_hash, target_lang, translated_text) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING',
      [hash, targetLang, translated]
    );
    return translated;
  } catch (err) {
    console.error('Translation failed, falling back to English:', err.message);
    return text; // graceful fallback — never block the response on translation failure
  }
}

// Translates all given fields on one object in parallel (not sequentially).
async function translateFields(obj, fields, targetLang) {
  await Promise.all(fields.map(async (field) => {
    if (obj[field]) obj[field] = await translateText(obj[field], targetLang);
  }));
  return obj;
}

// For list endpoints: translates rows with bounded concurrency so a
// cold-cache list page doesn't fire 50+ simultaneous Gemini calls.
async function translateRows(rows, fields, targetLang, concurrency = 5) {
  const queue = [...rows];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const row = queue.shift();
      await translateFields(row, fields, targetLang);
    }
  });
  await Promise.all(workers);
  return rows;
}
```

- `translateFields`/`translateRows` are called explicitly in controllers on
  the specific free-text fields that should be translated (e.g.
  `description`, `remarks`, `title`) — never blindly across an entire JSON
  object, so IDs, emails, dates, and enum values are never mistranslated.
- Because this is generic (hash of text, not tied to a table), adding a new
  translatable field anywhere in the app later requires zero schema changes
  — just one `translateFields`/`translateRows` call in the relevant
  controller.

**Cache warming on write** (avoids cold-cache latency on read): when
translatable content is created or updated (course saved, announcement
posted, remarks entered), the controller fires `translateText` for `hi` and
`mr` in the background, without awaiting it in the response cycle:

```js
// after saving `course` in the create/update controller:
res.json(course); // respond immediately, don't block on translation
translateFields({ ...course }, ['description'], 'hi').catch(() => {});
translateFields({ ...course }, ['description'], 'mr').catch(() => {});
```

This means the common case (many reads, few writes) almost always hits a
warm cache. The synchronous on-read path in `translateText`/`translateRows`
still exists as a fallback for content created before this feature shipped,
or in the rare case a read races ahead of the background warm-up — it will
simply pay the one-time Gemini latency for that specific string, once.

**Request flow (infrastructure only — not wired into any endpoint in v1, per
the scope note above)**:

- Frontend sends the current locale as a header, `X-Lang: hi|mr|en`, on API
  requests (read from the same i18next locale state used for static text).
  If the header is absent, the middleware defaults `req.lang` to `'en'`
  (untranslated passthrough) — this covers non-browser callers and any
  request made before the frontend sets the header.
- A small Express middleware reads `X-Lang` and attaches `req.lang` for
  controllers to use.
- Controllers fetch data from Postgres as normal (always English at rest),
  then call `translateFields`/`translateRows` before responding when
  `req.lang !== 'en'`.
- Note: there is no shared frontend API client today (no `axios.create`, no
  central fetch wrapper) — this middleware and header convention are new
  infrastructure to build, and since v1 has no real endpoint to attach them
  to, they're implemented and unit-tested in isolation, ready for the next
  real endpoint to use.

### 3. Language switcher (frontend)

- A dropdown/toggle component (in the header/nav, near where the hamburger
  menu lives) with the three languages.
- On change: calls `i18next.changeLanguage(lang)`, writes `lang` to
  `localStorage`, and updates the `X-Lang` header used by the API client for
  subsequent requests (e.g. via an axios/fetch interceptor reading from the
  same localStorage key).
- On app load: reads `localStorage`, falls back to `'en'` if unset.

## Data Flow Summary

```
User picks "हिंदी" → localStorage['lang']='hi' → i18next.changeLanguage('hi')
                                                 → static text re-renders from hi/translation.json
API calls now send X-Lang: hi
  → Controller fetches English row from Postgres
  → translateFields(row, [...], 'hi')
      → cache hit  → instant DB lookup
      → cache miss → Gemini call (~1-2s) → cached for all future requests
  → response returned with Hindi text
```

## Error Handling

- Gemini failures/timeouts/rate-limits: log and fall back to English text.
  Translation is a display enhancement, never a hard dependency — a failed
  translation must not break the page or the request.
- Missing/corrupt static translation key: i18next's built-in fallback to the
  default language (`en`) handles this without extra code.

## Testing

- Unit test `translateText`: cache hit path, cache miss path (mocked Gemini
  call), and fallback-to-English on error.
- Unit test `translateRows` bounded concurrency (e.g. 20 rows, concurrency 5,
  mocked Gemini calls — verify all rows get translated and no more than 5
  calls are in flight at once).
- Verify write-time background warming: after creating/updating content,
  confirm a `translations` row appears for `hi`/`mr` without a subsequent
  read ever needing to call Gemini synchronously.
- Manual pass through each major page (Home, About, Results, Courses,
  Contact, Admin/Teacher/Parent dashboards) in all three languages to catch
  missing i18next keys and layout issues from longer Hindi/Marathi strings.
- Verify editing a piece of content (e.g. a course description) produces a
  new translation on next view rather than showing stale cached text.

## Out of Scope

- Per-user account language preference (explicitly deferred — browser-only
  for now).
- Source-language auto-detection (all content is authored in English).
- Real-time/streaming translation UI (e.g. as-you-type preview).
- Wiring dynamic-content translation into any specific endpoint (no real
  endpoint has translatable free-text content yet — see Constraints above).
  Building that CRUD/backend wiring for Courses/Results/etc. is a separate
  effort.
- Cleanup of stale `translations` rows: the table grows unboundedly as
  content is edited (old hashes are simply never referenced again, not
  deleted). Acceptable for v1 given the free-tooling goal and expected
  content volume; can be revisited later with a simple periodic cleanup job
  if it ever matters.
