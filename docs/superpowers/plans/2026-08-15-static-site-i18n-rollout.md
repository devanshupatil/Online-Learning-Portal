# Static Site Translation (i18next) Rollout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every static UI string on the site (nav, buttons, labels, headings — across public pages and Admin/Teacher/Parent dashboards) render in English, Hindi, or Marathi via `react-i18next`, switchable from a language selector in the nav, persisted in `localStorage`.

**Architecture:** `react-i18next` with three flat-ish JSON resource files (`en`, `hi`, `mr`) under `Frontend/src/i18n/locales/`. A one-time script bootstraps `hi`/`mr` from whatever keys exist in `en.json` by calling the free, unofficial Google Translate endpoint (`translate.googleapis.com/translate_a/single`) — no API key, no account, no backend involvement. This is the same approach already proven in a sibling project (`devanshupatil/MediFind`), reused here directly. A `<LanguageSwitcher>` component changes the active language; `i18next-browser-languagedetector` handles persistence/detection (localStorage + browser language, no hand-rolled logic needed). Component migration (replacing hardcoded JSX text with `t('key')`) happens directory-by-directory using one repeatable procedure, since ~100 component files need the same mechanical treatment.

**Tech Stack:** React 19 + Vite, `i18next` + `react-i18next` + `i18next-browser-languagedetector` (new dependencies). No backend dependency at all — this whole feature is client-side only.

**Revision note:** this plan originally used a Gemini-powered bootstrap script (`Backend/scripts/generate-ui-translations.js`) requiring `GEMINI_API_KEY`, paired with a separate backend plan (`2026-08-15-dynamic-translation-infrastructure.md`) for a Supabase-cached dynamic-content translation service. Both were fully implemented and tested, then **replaced** on the user's direction with the simpler, already-proven MediFind approach below — no backend, no API key, no database. The backend plan is now superseded in full; see the note at the top of that file.

**Reference spec:** `docs/superpowers/specs/2026-08-15-multi-language-support-design.md`

---

## Before You Start — scope of Tasks 5+

Tasks 1–4 below are fully specified with exact code, same as the rest of this repo's plans. Tasks 5 onward (per-directory string migration across ~100 files in `Frontend/src/components/`) are **not** written as 100 individual literal diffs — that would require reading every file up front, produces an unmanageably long plan, and the work itself is mechanical and repetitive once the pattern is established in Task 4. Instead, Task 4 is a fully worked example (`SiteChrome.jsx`) that establishes the exact pattern, and Tasks 5+ give one directory at a time with: the specific files in that directory, the repeatable procedure to apply, and a concrete verification step. Follow the Task 4 pattern exactly when doing Tasks 5+.

**Do not translate the `active` / route-matching logic in `SiteChrome.jsx`'s `navLinks`** — `label` there is also used as a stable comparison key (e.g. `AboutPage.jsx` passes `<SiteNav active="About" />`, compared against `link.label === active`). Only the *displayed* text gets translated; the underlying `label` string stays as the stable English id. Task 4 shows the exact pattern.

---

### Task 1: Install and configure i18next

**Files:**
- Modify: `Frontend/package.json`
- Create: `Frontend/src/i18n/index.js`
- Create: `Frontend/src/i18n/locales/en.json`
- Create: `Frontend/src/i18n/locales/hi.json`
- Create: `Frontend/src/i18n/locales/mr.json`
- Modify: `Frontend/src/main.jsx`

This structure and config deliberately mirror `devanshupatil/MediFind`'s already-working `src/i18n/index.js` — reusing a proven setup rather than inventing a new one.

- [ ] **Step 1: Install dependencies**

Run: `cd "Frontend" && bun install i18next react-i18next i18next-browser-languagedetector`
(This repo enforces `bun`, not `npm` — a shell hook blocks npm commands.)
Expected: all three packages added under `dependencies` in `Frontend/package.json`.

- [ ] **Step 2: Create the initial English resource file**

Create `Frontend/src/i18n/locales/en.json` with flat (non-nested) keys, one per translatable string — nesting isn't needed since i18next namespaces by key name, not JSON structure depth:

```json
{
  "navHome": "Home",
  "navAbout": "About",
  "navResults": "Results",
  "navCourses": "Courses",
  "navContact": "Contact",
  "navEnrollNow": "Enroll Now",
  "navLogin": "Login",
  "footerQuickLinks": "Quick Links",
  "footerContactInfo": "Contact Info",
  "footerTagline": "Excellence in Education since 2011. Building foundations for future leaders.",
  "footerCopyright": "© 2026 EduLearning Platform. Excellence in Education."
}
```

- [ ] **Step 3: Create empty placeholder files for the other two languages**

Create `Frontend/src/i18n/locales/hi.json` and `Frontend/src/i18n/locales/mr.json`, both with just:

```json
{}
```

(Task 3's bootstrap script fills these in — don't hand-translate here.)

- [ ] **Step 4: Create the i18next config**

Create `Frontend/src/i18n/index.js` (this is verbatim MediFind's working config):

```js
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import hi from './locales/hi.json'
import mr from './locales/mr.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      mr: { translation: mr },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'mr'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })

export default i18n
```

`i18next-browser-languagedetector` replaces hand-rolled `localStorage.getItem('lang')` logic: it checks `localStorage` first, falls back to the browser's own language setting, and — via `caches: ['localStorage']` — automatically persists whatever `i18n.changeLanguage(...)` sets, with no manual `localStorage.setItem` call needed anywhere in the app.

- [ ] **Step 5: Load it before the app renders**

In `Frontend/src/main.jsx`, add the import as the first line:

```js
import './i18n'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
```

(Import order matters here only in that `i18n/index.js` must run its `.init()` before any component calls `useTranslation()` — putting it first guarantees that.)

- [ ] **Step 6: Verify the app still builds and runs**

Run: `cd "Frontend" && bun run dev`
Expected: Vite starts with no errors. Open the printed local URL in a browser and confirm the site loads exactly as before (no visible changes yet — nothing consumes `t()` until Task 4). Stop the dev server after confirming (Ctrl+C).

- [ ] **Step 7: Commit**

```bash
git add Frontend/package.json Frontend/package-lock.json Frontend/src/i18n.js Frontend/src/locales Frontend/src/main.jsx
git commit -m "Add i18next configuration and initial English resource file"
```

---

### Task 2: `LanguageSwitcher` component

**Files:**
- Create: `Frontend/src/components/LanguageSwitcher.jsx`

This mirrors MediFind's `src/components/LanguageSwitcher.jsx` (pill-button group, `aria-pressed` state, `i18n.changeLanguage` on click) but rendered with this project's own Tailwind utility classes instead of MediFind's custom `sp-lang-*` CSS classes, since those classes don't exist in this stylesheet — the behavior is what's being reused, not literal class names from a different app's design system.

- [ ] **Step 1: Write the component**

Create `Frontend/src/components/LanguageSwitcher.jsx`:

```jsx
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "हिंदी", short: "हि" },
  { code: "mr", label: "मराठी", short: "मर" },
];

const LanguageSwitcher = ({ className = "" }) => {
  const { i18n } = useTranslation();
  const current = i18n.language?.split("-")[0] ?? "en";

  return (
    <div
      role="group"
      aria-label="Select language"
      className={`inline-flex items-center gap-1 rounded-full border border-outline-variant p-1 ${className}`}
    >
      {LANGUAGES.map(({ code, label, short }) => (
        <button
          key={code}
          type="button"
          onClick={() => i18n.changeLanguage(code)}
          aria-pressed={current === code}
          aria-label={`Switch to ${label}`}
          className={
            current === code
              ? "px-3 py-1 rounded-full text-sm font-semibold bg-primary text-white transition-colors"
              : "px-3 py-1 rounded-full text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
          }
        >
          {short}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
```

Note: persistence is handled entirely by `i18next-browser-languagedetector` (configured in Task 1) — this component only ever calls `i18n.changeLanguage(code)`, no manual `localStorage` calls needed.

- [ ] **Step 2: Commit**

```bash
git add Frontend/src/components/LanguageSwitcher.jsx
git commit -m "Add LanguageSwitcher component"
```

(No test file — this is a thin, purely presentational wrapper around `i18n.changeLanguage`; its behavior is exercised end-to-end when it's wired into the nav in Task 4 and verified manually there.)

---

### Task 3: Free-endpoint bootstrap script for `hi`/`mr` resource files

**Files:**
- Create: `Frontend/scripts/generate-translations.js`

This reuses `devanshupatil/MediFind`'s `scripts/generate-mr.js` approach verbatim — translating via the free, unofficial Google Translate endpoint (`translate.googleapis.com/translate_a/single`), no API key, no account, no backend involvement. Generalized here to (a) handle both `hi` and `mr` in one script, since this project needs both generated from scratch (MediFind only needed `mr`, since its `hi.json` already existed by other means), and (b) only translate keys missing from the target file, so hand-edited corrections survive a re-run.

- [ ] **Step 1: Write the script**

Create `Frontend/scripts/generate-translations.js` (ESM — this project's `package.json` has `"type": "module"`):

```js
#!/usr/bin/env node
/**
 * generate-translations.js
 * One-time (or re-run-when-keys-change) offline script: fills in missing
 * keys in hi.json/mr.json from en.json via the free Google Translate
 * endpoint. Not part of the request path — run manually with
 * `node scripts/generate-translations.js`. Existing keys in hi/mr are left
 * untouched, so hand-edited corrections are never overwritten by a re-run.
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = resolve(__dirname, '../src/i18n/locales');
const LANGUAGES = ['hi', 'mr'];

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf-8'));
}

function writeJson(path, obj) {
  writeFileSync(path, JSON.stringify(obj, null, 2) + '\n', 'utf-8');
}

async function translate(text, targetLang) {
  const url =
    `https://translate.googleapis.com/translate_a/single` +
    `?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  const data = await res.json();
  // Response structure: [[["translatedText","originalText",...],...],...]
  return data[0].map((chunk) => chunk[0]).join('');
}

async function main() {
  const en = readJson(resolve(LOCALES_DIR, 'en.json'));

  for (const lang of LANGUAGES) {
    const targetPath = resolve(LOCALES_DIR, `${lang}.json`);
    const existing = readJson(targetPath);
    const missing = Object.entries(en).filter(([key]) => !(key in existing));

    if (missing.length === 0) {
      console.log(`[${lang}] up to date, nothing to translate`);
      continue;
    }

    console.log(`[${lang}] translating ${missing.length} missing key(s)...`);
    const updated = { ...existing };
    for (const [key, value] of missing) {
      const translated = await translate(value, lang);
      updated[key] = translated;
      console.log(`  ${key}: "${value}" -> "${translated}"`);
      await new Promise((r) => setTimeout(r, 200)); // avoid rate limiting
    }
    writeJson(targetPath, updated);
    console.log(`[${lang}] wrote ${targetPath}`);
  }
}

main().catch((err) => {
  console.error('generate-translations failed:', err);
  process.exit(1);
});
```

- [ ] **Step 2: Run it against the keys added in Task 1**

Run: `cd "Frontend" && node scripts/generate-translations.js`
Expected: console output like `[hi] translating 11 missing key(s)...` / `[mr] translating 11 missing key(s)...`, then both files written. Open `Frontend/src/i18n/locales/hi.json` and `Frontend/src/i18n/locales/mr.json` and confirm they now contain the same keys as `en.json`, with Hindi/Marathi values.

- [ ] **Step 3: Spot-check translation quality**

Manually read a few entries (e.g. `navHome`, `footerTagline`) in each generated file. If anything reads oddly, hand-edit it directly — the script won't touch existing keys on a future run.

- [ ] **Step 4: Commit**

```bash
git add Frontend/scripts/generate-translations.js Frontend/src/i18n/locales/hi.json Frontend/src/i18n/locales/mr.json
git commit -m "Add free-endpoint bootstrap script for UI translations; generate initial hi/mr resources"
```

---

### Task 3b: `useTranslatedName` hook for dynamic content

**Files:**
- Create: `Frontend/src/hooks/useTranslatedName.js`

Unlike the original Gemini+Supabase design (which needed a real backend endpoint with free-text content to attach to before it could be used — see the superseded backend plan), this hook needs **no backend at all**: it translates any given string client-side, on demand, the moment it's rendered. This mirrors `devanshupatil/MediFind`'s `src/hooks/useTranslatedName.js` verbatim. Because it has no backend dependency, it can be used immediately wherever the app renders dynamic/mock data (e.g. course titles, student names) — there's no "wire it into a real endpoint later" deferral needed this time.

- [ ] **Step 1: Write the hook**

Create `Frontend/src/hooks/useTranslatedName.js`:

```js
/**
 * useTranslatedName
 *
 * Translates a single text string to the current i18n language using the
 * free (unofficial) Google Translate endpoint. Results are cached in a
 * module-level Map so identical strings are never fetched twice per session.
 *
 * - Returns the original text immediately (no flicker on first render)
 * - Swaps to the translated string asynchronously
 * - For 'en' locale → always returns the original (no network request)
 * - Cache is keyed by `${lang}:${text}` so switching languages re-fetches
 */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

// Module-level cache: survives re-renders, shared across all component instances
export const translationCache = new Map()

async function googleTranslate(text, targetLang) {
  const cacheKey = `${targetLang}:${text}`
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)
  }

  const url =
    `https://translate.googleapis.com/translate_a/single` +
    `?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`

  const res = await fetch(url)
  const data = await res.json()
  // Response: [[["translatedText","originalText",...], ...], ...]
  const translated = data[0].map(chunk => chunk[0]).join('')

  translationCache.set(cacheKey, translated)
  return translated
}

export function useTranslatedName(originalName) {
  const { i18n } = useTranslation()
  const lang = i18n.language?.split('-')[0] ?? 'en'

  const [translatedName, setTranslatedName] = useState(originalName)

  useEffect(() => {
    // Always reset to original immediately on name or language change
    setTranslatedName(originalName)

    // English — no translation needed
    if (lang === 'en') return

    let cancelled = false

    googleTranslate(originalName, lang)
      .then(result => {
        if (!cancelled) setTranslatedName(result)
      })
      .catch(() => {
        // Silently fall back to original name on any network error
      })

    return () => {
      cancelled = true
    }
  }, [originalName, lang])

  return translatedName
}
```

- [ ] **Step 2: Commit**

```bash
git add Frontend/src/hooks/useTranslatedName.js
git commit -m "Add useTranslatedName hook for client-side dynamic content translation"
```

(No test file — mirrors MediFind's untested hook exactly; it's a thin wrapper with a network call, and its behavior is easiest to verify visually once something in the app actually calls it. Nothing in this plan wires it into a component yet — the whole-site migration in Tasks 5+ is scoped to *static* text. Callers should reach for this hook only for genuinely dynamic strings not covered by `t()`, e.g. a name coming from mock/API data.)

---

### Task 4: Migrate `SiteChrome.jsx` (worked example — establishes the pattern for Tasks 5+)

**Files:**
- Modify: `Frontend/src/components/SiteChrome.jsx`

- [ ] **Step 1: Add the language switcher and translate `SiteNav`**

Replace the full contents of `Frontend/src/components/SiteChrome.jsx` with:

```jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ButtonWithIcon from "./ui/button-witn-icon";
import LanguageSwitcher from "./LanguageSwitcher";

// `label` here is a stable English id used for route-active comparisons
// (e.g. <SiteNav active="About" />) — it is NOT displayed directly.
// Display text comes from navLabelKey via t(), so it can be translated
// without breaking the active-page highlighting logic below.
export const navLinks = [
  { label: "Home", path: "/", navLabelKey: "navHome" },
  { label: "About", path: "/about", navLabelKey: "navAbout" },
  { label: "Results", path: "/results", navLabelKey: "navResults" },
  { label: "Courses", path: "/courses", navLabelKey: "navCourses" },
  { label: "Contact", path: "/contact", navLabelKey: "navContact" },
];

const NavItem = ({ path, className, children, onClick }) => {
  if (path.includes("#")) {
    return (
      <a className={className} href={path} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link className={className} to={path} onClick={onClick}>
      {children}
    </Link>
  );
};

export const SiteNav = ({ active = "Home" }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-white/20 shadow-[0_10px_30px_-5px_rgba(37,99,235,0.08)]">
        <div className="w-full pl-6 pr-6 flex justify-between items-center h-20">
          <Link className="font-display text-2xl font-bold text-primary" to="/">
            EduLearning Platform
          </Link>
          <div className="hidden md:flex items-center space-x-8 text-lg">
            {navLinks.map((link) => (
              <NavItem
                key={link.label}
                path={link.path}
                className={
                  link.label === active
                    ? "font-bold text-primary border-b-2 border-primary pb-1"
                    : "font-bold text-on-surface-variant hover:text-primary transition-colors hover:opacity-90 transition-all duration-300"
                }
              >
                {t(link.navLabelKey)}
              </NavItem>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <a
              className="inline-flex items-center justify-center px-6 py-[6px] rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-all h-9"
              href="/#enroll"
            >
              {t("navEnrollNow")}
            </a>
            <ButtonWithIcon label={t("navLogin")} onClick={() => navigate("/login")} />
          </div>
          <button
            className="md:hidden text-on-surface p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>
      <div
        className={
          menuOpen
            ? "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden opacity-100 pointer-events-auto transition-opacity duration-300 ease-in-out"
            : "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden opacity-0 pointer-events-none transition-opacity duration-300 ease-in-out"
        }
        onClick={() => setMenuOpen(false)}
      />
      <div
        className={
          menuOpen
            ? "fixed top-0 right-0 h-full w-1/2 z-50 bg-surface-container-lowest shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] md:hidden flex flex-col translate-x-0 transition-transform duration-300 ease-in-out"
            : "fixed top-0 right-0 h-full w-1/2 z-50 bg-surface-container-lowest shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] md:hidden flex flex-col translate-x-full transition-transform duration-300 ease-in-out"
        }
      >
        <div className="flex justify-between items-center h-20 px-6 border-b border-outline-variant">
          <LanguageSwitcher />
          <button
            className="text-on-surface p-2"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex flex-col px-6 py-4 gap-2 overflow-y-auto">
          {navLinks.map((link) => (
            <NavItem
              key={link.label}
              path={link.path}
              onClick={() => setMenuOpen(false)}
              className={
                link.label === active
                  ? "font-bold text-primary py-3 border-b-2 border-primary"
                  : "font-bold text-on-surface-variant hover:text-primary transition-colors py-3"
              }
            >
              {t(link.navLabelKey)}
            </NavItem>
          ))}
          <a
            className="mt-2 inline-flex items-center justify-center px-6 py-[6px] rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-all h-9"
            href="/#enroll"
            onClick={() => setMenuOpen(false)}
          >
            {t("navEnrollNow")}
          </a>
          <ButtonWithIcon
            label={t("navLogin")}
            className="w-full"
            onClick={() => {
              setMenuOpen(false);
              navigate("/login");
            }}
          />
        </div>
      </div>
    </>
  );
};

export const SiteFooter = () => {
  const { t } = useTranslation();
  return (
    <footer className="relative w-full bg-surface-container-highest border-t border-outline-variant mt-[120px]">
      <div className="max-w-[1280px] mx-auto px-6 py-[120px] grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1 md:col-span-1">
          <h3 className="font-display text-2xl text-primary mb-4">EduLearning Platform</h3>
          <p className="text-on-surface-variant mb-6">{t("footerTagline")}</p>
        </div>
        <div>
          <h4 className="text-2xl text-on-surface mb-4">{t("footerQuickLinks")}</h4>
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavItem
                  path={link.path}
                  className="text-on-surface-variant hover:text-primary transition-colors hover:translate-x-1 transition-transform duration-200 inline-block"
                >
                  {t(link.navLabelKey)}
                </NavItem>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-2xl text-on-surface mb-4">{t("footerContactInfo")}</h4>
          <ul className="space-y-3 text-on-surface-variant">
            <li className="flex items-start gap-2">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <span>123 Education Hub, Knowledge City, State - 400001</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">call</span>
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">mail</span>
              <span>info@edulearningplatform.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-outline-variant/30 py-6 text-center">
        <p className="text-on-surface-variant">{t("footerCopyright")}</p>
      </div>
    </footer>
  );
};
```

Note: the address/phone/email in the footer are intentionally left untranslated (they're proper nouns/numbers, not prose) — this is the same judgment call to make throughout Tasks 5+: translate prose and labels, not addresses, phone numbers, emails, or proper nouns.

- [ ] **Step 2: Manual verification**

Run: `cd "Frontend" && bun run dev`, open the site, and:
1. Confirm the nav and footer render in English exactly as before.
2. Use the new language dropdown (desktop nav, and open the mobile hamburger menu to check it there too) to switch to हिंदी and मराठी, and confirm nav links, "Enroll Now", "Login", and footer text change language.
3. Click through to `/about`, `/results`, `/courses`, `/contact` and confirm the correct nav link is still highlighted as active in each language (this verifies the `label`/`navLabelKey` split didn't break active-page highlighting).
4. Refresh the page after switching language and confirm the choice persists (reads from `localStorage`).

Stop the dev server after verifying (Ctrl+C).

- [ ] **Step 3: Commit**

```bash
git add Frontend/src/components/SiteChrome.jsx
git commit -m "Translate SiteChrome nav/footer and add language switcher to the nav"
```

---

### Task 5+: Migrate remaining directories (repeat this procedure per directory)

Apply this procedure once per directory below, in order. Each is its own task/commit. Skip files already covered (`SiteChrome.jsx`, `LanguageSwitcher.jsx`).

**The procedure:**

1. Read every `.jsx` file in the directory.
2. For each hardcoded, user-visible English string (JSX text content, `label`/`title`/`placeholder`/`aria-label` props on visible UI — not internal identifiers, CSS classes, route paths, or console messages), pick a flat camelCase key following the pattern already established (`<directoryOrFeature><Element>`, e.g. `coursesHeroTitle`, `adminSidebarDashboard`) — flat, not nested, matching Task 1's `en.json` structure. Reuse the `nav*`/`footer*` keys from Task 1 instead of duplicating them if a file reuses that exact text.
3. Add the new keys (with their current English text as the value) to `Frontend/src/i18n/locales/en.json` as flat top-level keys (no nesting).
4. Add `import { useTranslation } from "react-i18next";` and `const { t } = useTranslation();` to each component, and replace the hardcoded strings with `t('theKey')`.
5. Leave alone: numbers, dates already formatted upstream, proper nouns (person/place/product names), email addresses, phone numbers, and URLs.
6. Run `cd "Frontend" && node scripts/generate-translations.js` to fill in the new keys for `hi`/`mr` (it only translates what's missing, so this is safe to re-run after every directory).
7. Run `cd "Frontend" && bun run build` — must succeed with no errors (catches typos in `t()` keys/imports; it does not catch missing translation keys, since i18next falls back silently to the key string or `fallbackLng`).
8. Manually load the affected page(s) in the browser in all three languages and visually confirm no leftover hardcoded English and no layout breakage from longer Hindi/Marathi strings (these tend to run longer than English — watch for text overflow/wrapping in buttons and nav-like elements especially).
9. Commit with a message naming the directory, e.g. `git commit -m "Translate Courses components to i18next"`.

**Directories to migrate, in this order** (`Frontend/src/components/`):

- [ ] **Task 5:** Root-level pages: `Home.jsx`, `AboutPage.jsx`
- [ ] **Task 6:** `Contact/` (all `.jsx` files, including `Contact/sections/`)
- [ ] **Task 7:** `Courses/` (all `.jsx` files, including `Courses/sections/`)
- [ ] **Task 8:** `Results/` (all `.jsx` files, including `Results/sections/`)
- [ ] **Task 9:** `Auth/` (all `.jsx` files)
- [ ] **Task 10:** `Parents/` (all `.jsx` files)
- [ ] **Task 11:** `Leraners/` (all `.jsx` files, including `Leraners/MaterialViewer/`)
- [ ] **Task 12:** `Teacher/` (all `.jsx` files)
- [ ] **Task 13:** `Admin/` (all `.jsx` files)
- [ ] **Task 14:** `ui/` (all `.jsx` files) and any remaining root-level component not yet covered (e.g. `Navigation.jsx`, `Header.jsx`, `HamburgerIcon.jsx`, `ResponsiveSidebarLayout.jsx`, `SidebarToggle.jsx` — check `Frontend/src/components/*.jsx` at the top level for anything missed by Tasks 4–13)

---

### Task 15: Final full-site verification

- [ ] **Step 1: Build**

Run: `cd "Frontend" && bun run build`
Expected: succeeds with no errors.

- [ ] **Step 2: Full manual pass**

Run: `cd "Frontend" && bun run dev`. In each of the three languages, visit: Home, About, Results, Courses, Contact, and (if reachable without real backend auth) the Admin/Teacher/Parent/Learner dashboard shells. Confirm nav, buttons, and headings are translated and no page is visibly broken.

- [ ] **Step 3: Commit any final fixes found during verification, then confirm clean tree**

Run: `git status` — expect a clean working tree with everything committed task-by-task above.

## What This Plan Does Not Do

- Does not touch any backend code — this whole feature is client-side only now (see the revision note at the top of this file for why the earlier Gemini+Supabase backend plan was reverted).
- Does not wire `useTranslatedName` (Task 3b) into any specific component — it's built and ready, but this plan's scope is the static-text rollout; wiring it into a real dynamic-content display is left for whoever needs it next.
- Does not add per-user account language preference — browser-only per the approved spec (now handled by `i18next-browser-languagedetector` instead of hand-rolled localStorage code).
