# Dynamic Content Translation Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a generic, hash-keyed translation cache service (Postgres/Supabase + Gemini) that any backend controller can call to translate free-text fields to Hindi or Marathi, plus the Express middleware that reads the caller's requested language. No existing endpoint has translatable free-text content yet, so this plan produces tested, standalone infrastructure — not wired into any route.

**Architecture:** A `translations` table (keyed by `sha256(original English text) + target_lang`) backs a small service module (`Backend/services/translate.js`) with three functions: `translateText` (single string, cache-or-Gemini), `translateFields` (translate several fields on one object in parallel), and `translateRows` (translate many objects with bounded concurrency). A separate Express middleware (`Backend/middleware/lang-middleware.js`) reads an `X-Lang` request header into `req.lang`, defaulting to `'en'`.

**Tech Stack:** Node.js/Express (CommonJS), Supabase JS client (`@supabase/supabase-js`, already a dependency), `@google/generative-ai` (already a dependency), Jest (new devDependency — no test framework exists in `Backend` yet), Node's built-in `crypto` for hashing.

**Reference spec:** `docs/superpowers/specs/2026-08-15-multi-language-support-design.md`

---

## Before You Start

- This plan only touches `Backend/`. It does not modify any route, controller, or the frontend.
- `Backend/.env` already has `GEMINI_API_KEY` set (confirmed present, value not inspected). Do **not** use `GOOGLE_API_KEY` — that variable is not set in this repo's `.env` and is a pre-existing, unrelated bug in `Backend/llm.js`'s `gemini()` function. Not your concern to fix here.
- The repo's live DB access path is the Supabase JS client (`Backend/config/supabaseDB.js`). Do not use `Backend/postgresDB.js` (raw `pg`/Cloud SQL pool) — it's dead code, already commented out where it used to be called.
- There is no migrations tool in this repo. Schema changes are hand-written SQL appended to the root `postgreSQL querys` file and run manually in the Supabase SQL editor. Task 1 below is a manual step for the human running this plan — an agentic worker should still write the SQL to the file, but flag that a human needs to actually run it against Supabase before Task 6's tests will pass against a real DB (the tests themselves mock Supabase, so this doesn't block automated progress).

---

### Task 1: Add the `translations` table schema

**Files:**
- Modify: `postgreSQL querys` (repo root)

- [ ] **Step 1: Append the table definition**

Add this to the end of the root `postgreSQL querys` file:

```sql

-- Generic translation cache: keyed by hash of the original English text,
-- not by table/row/column, so any free-text field anywhere in the app can
-- share cache entries and requires no schema change to become translatable.
CREATE TABLE translations (
    id SERIAL PRIMARY KEY,
    content_hash CHAR(64) NOT NULL,   -- sha256 of the original English text
    target_lang VARCHAR(5) NOT NULL,  -- 'hi' | 'mr'
    translated_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (content_hash, target_lang)
);
```

- [ ] **Step 2: Commit**

```bash
git add "postgreSQL querys"
git commit -m "Add translations table schema for dynamic content translation cache"
```

- [ ] **Step 3: Flag for the human operator**

Note in your final report to the user: "The `translations` table SQL was added to `postgreSQL querys` — you need to run it manually in the Supabase SQL editor before dynamic-content translation can hit a real database. Automated tests in this plan mock Supabase, so this doesn't block the rest of the plan."

---

### Task 2: Add Jest test framework to Backend

**Files:**
- Modify: `Backend/package.json`

- [ ] **Step 1: Install Jest as a dev dependency**

Run: `cd "Backend" && npm install --save-dev jest`
Expected: `jest` added under `devDependencies` in `Backend/package.json`, `node_modules/.bin/jest` exists.

- [ ] **Step 2: Add the test script**

In `Backend/package.json`, change:

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "npm run dev",
    "dev": "node server.js"
},
```

to:

```json
"scripts": {
    "test": "jest",
    "start": "npm run dev",
    "dev": "node server.js"
},
```

- [ ] **Step 3: Verify Jest runs (with no tests yet)**

Run: `cd "Backend" && npm test`
Expected: Jest reports "No tests found" (exit code may be non-zero — that's fine, it means Jest itself is wired up). This is just confirming the binary runs; real test files come in later tasks.

- [ ] **Step 4: Commit**

```bash
git add Backend/package.json Backend/package-lock.json
git commit -m "Add Jest test framework to Backend"
```

---

### Task 3: `translateText` — cache hit path

**Files:**
- Create: `Backend/services/translate.js`
- Create: `Backend/services/translate.test.js`

- [ ] **Step 1: Write the failing test**

Create `Backend/services/translate.test.js`:

```js
jest.mock('../config/supabaseDB');
jest.mock('@google/generative-ai');

const supabase = require('../config/supabaseDB');
const { translateText } = require('./translate');

describe('translateText', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the cached translation without calling Gemini on a cache hit', async () => {
    const maybeSingle = jest.fn().mockResolvedValue({
      data: { translated_text: 'नमस्ते' },
      error: null,
    });
    const eq2 = jest.fn().mockReturnValue({ maybeSingle });
    const eq1 = jest.fn().mockReturnValue({ eq: eq2 });
    const select = jest.fn().mockReturnValue({ eq: eq1 });
    supabase.from = jest.fn().mockReturnValue({ select });

    const result = await translateText('Hello', 'hi');

    expect(result).toBe('नमस्ते');
    expect(supabase.from).toHaveBeenCalledWith('translations');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd "Backend" && npx jest services/translate.test.js`
Expected: FAIL — `Cannot find module './translate'` (file doesn't exist yet).

- [ ] **Step 3: Create the Supabase mock so Jest can auto-mock it**

Jest's `jest.mock('../config/supabaseDB')` needs a real module at that path to auto-mock — it already exists (`Backend/config/supabaseDB.js`), so no action needed here. Jest will replace its exported object's methods with mocks automatically for `.from`, since we explicitly assign `supabase.from = jest.fn()...` in the test.

- [ ] **Step 4: Write minimal implementation**

Create `Backend/services/translate.js`:

```js
const crypto = require('crypto');
const supabase = require('../config/supabaseDB');

function hashText(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

async function translateText(text, targetLang) {
  if (!text || targetLang === 'en') return text;

  const hash = hashText(text);

  const { data: cached } = await supabase
    .from('translations')
    .select('translated_text')
    .eq('content_hash', hash)
    .eq('target_lang', targetLang)
    .maybeSingle();

  if (cached) return cached.translated_text;

  return text; // cache-miss path implemented in the next task
}

module.exports = { translateText, hashText };
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd "Backend" && npx jest services/translate.test.js`
Expected: PASS (1 test).

- [ ] **Step 6: Commit**

```bash
git add Backend/services/translate.js Backend/services/translate.test.js
git commit -m "Add translateText cache-hit path"
```

---

### Task 4: `translateText` — cache miss (Gemini call) and error fallback

**Files:**
- Modify: `Backend/services/translate.js`
- Modify: `Backend/services/translate.test.js`

- [ ] **Step 1: Write the failing tests**

Add to `Backend/services/translate.test.js` (inside the existing `describe('translateText', ...)` block, after the cache-hit test):

```js
  it('calls Gemini and caches the result on a cache miss', async () => {
    const maybeSingle = jest.fn().mockResolvedValue({ data: null, error: null });
    const eq2 = jest.fn().mockReturnValue({ maybeSingle });
    const eq1 = jest.fn().mockReturnValue({ eq: eq2 });
    const select = jest.fn().mockReturnValue({ eq: eq1 });
    const upsert = jest.fn().mockResolvedValue({ data: null, error: null });
    supabase.from = jest.fn().mockReturnValue({ select, upsert });

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const generateContent = jest.fn().mockResolvedValue({
      response: { text: () => 'नमस्ते' },
    });
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({ generateContent }),
    }));

    const result = await translateText('Hello', 'hi');

    expect(result).toBe('नमस्ते');
    expect(generateContent).toHaveBeenCalledTimes(1);
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({ target_lang: 'hi', translated_text: 'नमस्ते' }),
      expect.objectContaining({ onConflict: 'content_hash,target_lang' })
    );
  });

  it('falls back to the original English text if Gemini throws', async () => {
    const maybeSingle = jest.fn().mockResolvedValue({ data: null, error: null });
    const eq2 = jest.fn().mockReturnValue({ maybeSingle });
    const eq1 = jest.fn().mockReturnValue({ eq: eq2 });
    const select = jest.fn().mockReturnValue({ eq: eq1 });
    supabase.from = jest.fn().mockReturnValue({ select, upsert: jest.fn() });

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({
        generateContent: jest.fn().mockRejectedValue(new Error('quota exceeded')),
      }),
    }));

    const result = await translateText('Hello', 'hi');

    expect(result).toBe('Hello');
  });
```

**Why these tests will actually work**: the implementation in Step 3 below constructs the `GoogleGenerativeAI` client *lazily, inside* `geminiTranslate` on each call — not once at module load. If it were constructed once at the top of the file (a module-level singleton), the singleton would be built from `@google/generative-ai`'s default automock (before any test's `.mockImplementation(...)` runs), and every test in this file would silently get that same stale, unconfigured client — no test would ever reach the real mock behavior it sets up. Constructing it fresh inside `geminiTranslate` avoids this entirely: each call to `new GoogleGenerativeAI(...)` picks up whatever `.mockImplementation(...)` the current test configured first.

- [ ] **Step 2: Run tests to verify the new ones fail**

Run: `cd "Backend" && npx jest services/translate.test.js`
Expected: The cache-hit test still passes; the two new tests FAIL (current implementation returns `text` unchanged on a miss instead of calling Gemini).

- [ ] **Step 3: Implement the cache-miss and error-fallback paths**

Replace the contents of `Backend/services/translate.js` with:

```js
const crypto = require('crypto');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const supabase = require('../config/supabaseDB');

function hashText(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

// Constructed fresh on every call, deliberately — see the note above Task 4's
// tests for why this must not be a module-level singleton built once at
// require time.
async function geminiTranslate(text, targetLang) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-pro',
  });
  const langName = targetLang === 'hi' ? 'Hindi' : 'Marathi';
  const result = await model.generateContent(
    `Translate the following text to ${langName}. Return ONLY the translated text, no explanation:\n\n${text}`
  );
  return result.response.text().trim();
}

async function translateText(text, targetLang) {
  if (!text || targetLang === 'en') return text;

  const hash = hashText(text);

  const { data: cached } = await supabase
    .from('translations')
    .select('translated_text')
    .eq('content_hash', hash)
    .eq('target_lang', targetLang)
    .maybeSingle();

  if (cached) return cached.translated_text;

  try {
    const translated = await geminiTranslate(text, targetLang);
    await supabase.from('translations').upsert(
      { content_hash: hash, target_lang: targetLang, translated_text: translated },
      { onConflict: 'content_hash,target_lang', ignoreDuplicates: true }
    );
    return translated;
  } catch (err) {
    console.error('Translation failed, falling back to English:', err.message);
    return text;
  }
}

module.exports = { translateText, hashText, geminiTranslate };
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd "Backend" && npx jest services/translate.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add Backend/services/translate.js Backend/services/translate.test.js
git commit -m "Add translateText cache-miss (Gemini) and error-fallback paths"
```

---

### Task 5: `translateFields` — parallel field translation on one object

**Files:**
- Modify: `Backend/services/translate.js`
- Modify: `Backend/services/translate.test.js`

- [ ] **Step 1: Write the failing test**

Add a new `describe` block to `Backend/services/translate.test.js`:

```js
describe('translateFields', () => {
  it('translates only the specified fields, in parallel, leaving others untouched', async () => {
    const translate = require('./translate');
    const spy = jest.spyOn(translate, 'translateText').mockImplementation(
      async (text, lang) => `[${lang}] ${text}`
    );

    const obj = { title: 'Hello', description: 'World', id: 42 };
    const result = await translate.translateFields(obj, ['title', 'description'], 'hi');

    expect(result.title).toBe('[hi] Hello');
    expect(result.description).toBe('[hi] World');
    expect(result.id).toBe(42); // untouched — not in the fields list
    expect(spy).toHaveBeenCalledTimes(2);

    spy.mockRestore();
  });

  it('skips fields that are falsy without calling translateText', async () => {
    const translate = require('./translate');
    const spy = jest.spyOn(translate, 'translateText');

    const obj = { title: '', description: null };
    await translate.translateFields(obj, ['title', 'description'], 'hi');

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd "Backend" && npx jest services/translate.test.js`
Expected: FAIL — `translate.translateFields is not a function`.

- [ ] **Step 3: Implement `translateFields`**

Add to `Backend/services/translate.js` (before `module.exports`):

```js
async function translateFields(obj, fields, targetLang) {
  await Promise.all(
    fields.map(async (field) => {
      if (obj[field]) obj[field] = await translateText(obj[field], targetLang);
    })
  );
  return obj;
}
```

Update `module.exports` to include it:

```js
module.exports = { translateText, translateFields, hashText, geminiTranslate };
```

**Note on the `jest.spyOn(translate, 'translateText')` pattern used in the test**: this only works if calls to `translateText` inside `translateFields` go through the exported object (`module.exports.translateText(...)`), not a bare local function reference. Since `translateFields` calls the bare `translateText(...)` identifier directly, `jest.spyOn` on the exported object won't intercept it. Fix this by having `translateFields` call `module.exports.translateText(...)` instead:

```js
async function translateFields(obj, fields, targetLang) {
  await Promise.all(
    fields.map(async (field) => {
      if (obj[field]) obj[field] = await module.exports.translateText(obj[field], targetLang);
    })
  );
  return obj;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd "Backend" && npx jest services/translate.test.js`
Expected: PASS (5 tests total).

- [ ] **Step 5: Commit**

```bash
git add Backend/services/translate.js Backend/services/translate.test.js
git commit -m "Add translateFields for parallel per-object field translation"
```

---

### Task 6: `translateRows` — bounded-concurrency translation across many objects

**Files:**
- Modify: `Backend/services/translate.js`
- Modify: `Backend/services/translate.test.js`

- [ ] **Step 1: Write the failing test**

Add a new `describe` block to `Backend/services/translate.test.js`:

```js
describe('translateRows', () => {
  it('translates every row and never exceeds the given concurrency', async () => {
    const translate = require('./translate');
    let inFlight = 0;
    let maxInFlight = 0;

    const spy = jest.spyOn(translate, 'translateText').mockImplementation(async (text) => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await new Promise((resolve) => setTimeout(resolve, 5));
      inFlight -= 1;
      return `translated:${text}`;
    });

    const rows = Array.from({ length: 20 }, (_, i) => ({ title: `row${i}` }));
    await translate.translateRows(rows, ['title'], 'hi', 5);

    expect(rows.every((r) => r.title.startsWith('translated:'))).toBe(true);
    expect(maxInFlight).toBeLessThanOrEqual(5);
    expect(spy).toHaveBeenCalledTimes(20);

    spy.mockRestore();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd "Backend" && npx jest services/translate.test.js`
Expected: FAIL — `translate.translateRows is not a function`.

- [ ] **Step 3: Implement `translateRows`**

Add to `Backend/services/translate.js` (before `module.exports`), and make `translateFields` route through `module.exports` the same way for consistency:

```js
async function translateRows(rows, fields, targetLang, concurrency = 5) {
  const queue = [...rows];
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length) {
      const row = queue.shift();
      await module.exports.translateFields(row, fields, targetLang);
    }
  });
  await Promise.all(workers);
  return rows;
}
```

Update `module.exports`:

```js
module.exports = { translateText, translateFields, translateRows, hashText, geminiTranslate };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd "Backend" && npx jest services/translate.test.js`
Expected: PASS (6 tests total).

- [ ] **Step 5: Run the full test file once more to confirm nothing regressed**

Run: `cd "Backend" && npx jest services/translate.test.js --verbose`
Expected: All 6 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add Backend/services/translate.js Backend/services/translate.test.js
git commit -m "Add translateRows for bounded-concurrency translation of many objects"
```

---

### Task 7: `X-Lang` request middleware

**Files:**
- Create: `Backend/middleware/lang-middleware.js`
- Create: `Backend/middleware/lang-middleware.test.js`

- [ ] **Step 1: Write the failing test**

Create `Backend/middleware/lang-middleware.test.js`:

```js
const langMiddleware = require('./lang-middleware');

function mockReqRes(headers = {}) {
  return {
    req: { headers },
    res: {},
    next: jest.fn(),
  };
}

describe('langMiddleware', () => {
  it('sets req.lang from the X-Lang header when present', () => {
    const { req, res, next } = mockReqRes({ 'x-lang': 'hi' });
    langMiddleware(req, res, next);
    expect(req.lang).toBe('hi');
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('defaults req.lang to "en" when the header is absent', () => {
    const { req, res, next } = mockReqRes({});
    langMiddleware(req, res, next);
    expect(req.lang).toBe('en');
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('defaults to "en" for an unrecognized language value', () => {
    const { req, res, next } = mockReqRes({ 'x-lang': 'fr' });
    langMiddleware(req, res, next);
    expect(req.lang).toBe('en');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd "Backend" && npx jest middleware/lang-middleware.test.js`
Expected: FAIL — `Cannot find module './lang-middleware'`.

- [ ] **Step 3: Implement the middleware**

Create `Backend/middleware/lang-middleware.js`:

```js
const SUPPORTED_LANGS = new Set(['en', 'hi', 'mr']);

function langMiddleware(req, res, next) {
  const requested = (req.headers['x-lang'] || 'en').toLowerCase();
  req.lang = SUPPORTED_LANGS.has(requested) ? requested : 'en';
  next();
}

module.exports = langMiddleware;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd "Backend" && npx jest middleware/lang-middleware.test.js`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add Backend/middleware/lang-middleware.js Backend/middleware/lang-middleware.test.js
git commit -m "Add X-Lang request middleware defaulting to English"
```

---

### Task 8: Wire the middleware into the Express app and allow the header through CORS

**Files:**
- Modify: `Backend/server.js:8` (add require), `Backend/server.js:45` (CORS `allowedHeaders`), `Backend/server.js:62` (app.use) — line numbers as of this writing; use the anchor text in each step below to locate them if the file has shifted

- [ ] **Step 1: Add the require**

In `Backend/server.js`, after the existing `const supabase = require('./config/supabaseDB');` line, add:

```js
const langMiddleware = require('./middleware/lang-middleware');
```

- [ ] **Step 2: Allow the `X-Lang` header through CORS**

In the existing `cors({...})` config, change:

```js
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
```

to:

```js
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Lang'],
```

This is required — without it, a browser sending a custom `X-Lang` header will be blocked by the CORS preflight check, and `req.headers['x-lang']` will simply never arrive.

- [ ] **Step 3: Apply the middleware**

After the existing `app.use(express.json());` line, add:

```js
app.use(langMiddleware);
```

- [ ] **Step 4: Verify the server still starts**

Run: `cd "Backend" && node -e "require('./server.js')"` and check for startup errors in the output, then stop it (Ctrl+C or let the command's own timeout end it — do not leave a long-running dev server hanging in the background for this check). Expected: "Server listening at http://localhost:..." with no thrown errors, confirming `require('./middleware/lang-middleware')` resolves and Express accepts the middleware.

- [ ] **Step 5: Commit**

```bash
git add Backend/server.js
git commit -m "Wire X-Lang middleware into the Express app and allow it through CORS"
```

---

### Task 9: Full test suite sanity check

- [ ] **Step 1: Run the whole Backend test suite**

Run: `cd "Backend" && npm test`
Expected: All test suites pass (`translate.test.js`, `lang-middleware.test.js`), 0 failures.

- [ ] **Step 2: Confirm nothing outside `Backend/` changed unexpectedly**

Run: `git status`
Expected: Clean working tree (everything already committed task-by-task above) other than the `postgreSQL querys` and `Backend/` files touched by this plan.

---

## What This Plan Does Not Do (by design — see spec's Constraints section)

- Does not add `translateFields`/`translateRows` calls to any controller — no live endpoint has free-text content yet (Courses, Results, etc. are still on frontend mock data).
- Does not build a frontend API client or axios interceptor to send the `X-Lang` header — deferred until a real endpoint consumes it.
- Does not run the `translations` table SQL against Supabase — that's a manual step for a human with Supabase access (flagged in Task 1).
