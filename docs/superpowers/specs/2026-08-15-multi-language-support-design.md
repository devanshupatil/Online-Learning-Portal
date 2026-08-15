# Multi-Language Support (English / Hindi / Marathi) — Design

## Goal

Support English, Hindi, and Marathi across the whole site: both static UI text
(nav, buttons, labels, headings) and dynamic, user-entered content (course
info, announcements, results remarks, profile text, etc.), using only free
tooling.

## Constraints & Decisions

- **Translation engine**: reuse the existing Gemini setup already wired into
  `Backend/llm.js` (`GOOGLE_API_KEY` / `@google/generative-ai`). No new
  accounts, no paid API.
- **Rollout scope**: whole site at once (public pages + Admin/Teacher/Parent
  dashboards), not phased.
- **Dynamic content scope**: all user-entered text content across the app
  (course info, announcements/notices, results remarks, profile text, and
  anything added later) — not a fixed list of tables/fields.
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
    const translated = await geminiTranslate(text, targetLang); // via existing gemini() pattern in llm.js
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

async function translateFields(obj, fields, targetLang) {
  for (const field of fields) {
    if (obj[field]) obj[field] = await translateText(obj[field], targetLang);
  }
  return obj;
}
```

- `translateFields` is called explicitly in controllers on the specific
  free-text fields that should be translated (e.g. `description`, `remarks`,
  `title`) — never blindly across an entire JSON object, so IDs, emails,
  dates, and enum values are never mistranslated.
- Because this is generic (hash of text, not tied to a table), adding a new
  translatable field anywhere in the app later requires zero schema changes
  — just one `translateFields(...)` call in the relevant controller.

**Request flow**:

- Frontend sends the current locale as a header, `X-Lang: hi|mr|en`, on API
  requests (read from the same i18next locale state used for static text).
- A small Express middleware reads `X-Lang` and attaches `req.lang` for
  controllers to use.
- Controllers fetch data from Postgres as normal (always English at rest),
  then call `translateFields(row, [...], req.lang)` before responding when
  `req.lang !== 'en'`.

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
