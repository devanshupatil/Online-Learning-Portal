# Static Site Translation (i18next) Rollout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every static UI string on the site (nav, buttons, labels, headings — across public pages and Admin/Teacher/Parent dashboards) render in English, Hindi, or Marathi via `react-i18next`, switchable from a language selector in the nav, persisted in `localStorage`.

**Architecture:** `react-i18next` with three flat-ish JSON resource files (`en`, `hi`, `mr`) under `Frontend/src/locales/`. A one-time Gemini-powered script (in `Backend/`, where `GEMINI_API_KEY` already lives) bootstraps `hi`/`mr` from whatever keys exist in `en/translation.json`, so no string is translated by hand. A `<LanguageSwitcher>` component changes the active language and persists the choice. Component migration (replacing hardcoded JSX text with `t('key')`) happens directory-by-directory using one repeatable procedure, since ~100 component files need the same mechanical treatment.

**Tech Stack:** React 19 + Vite, `i18next` + `react-i18next` (new dependencies), `@google/generative-ai` (already a Backend dependency, reused for the bootstrap script only).

**Reference spec:** `docs/superpowers/specs/2026-08-15-multi-language-support-design.md`

---

## Before You Start — scope of Tasks 5+

Tasks 1–4 below are fully specified with exact code, same as the rest of this repo's plans. Tasks 5 onward (per-directory string migration across ~100 files in `Frontend/src/components/`) are **not** written as 100 individual literal diffs — that would require reading every file up front, produces an unmanageably long plan, and the work itself is mechanical and repetitive once the pattern is established in Task 4. Instead, Task 4 is a fully worked example (`SiteChrome.jsx`) that establishes the exact pattern, and Tasks 5+ give one directory at a time with: the specific files in that directory, the repeatable procedure to apply, and a concrete verification step. Follow the Task 4 pattern exactly when doing Tasks 5+.

**Do not translate the `active` / route-matching logic in `SiteChrome.jsx`'s `navLinks`** — `label` there is also used as a stable comparison key (e.g. `AboutPage.jsx` passes `<SiteNav active="About" />`, compared against `link.label === active`). Only the *displayed* text gets translated; the underlying `label` string stays as the stable English id. Task 4 shows the exact pattern.

---

### Task 1: Install and configure i18next

**Files:**
- Modify: `Frontend/package.json`
- Create: `Frontend/src/i18n.js`
- Create: `Frontend/src/locales/en/translation.json`
- Create: `Frontend/src/locales/hi/translation.json`
- Create: `Frontend/src/locales/mr/translation.json`
- Modify: `Frontend/src/main.jsx`

- [ ] **Step 1: Install dependencies**

Run: `cd "Frontend" && npm install i18next react-i18next`
Expected: both packages added under `dependencies` in `Frontend/package.json`.

- [ ] **Step 2: Create the initial English resource file**

Create `Frontend/src/locales/en/translation.json`:

```json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "results": "Results",
    "courses": "Courses",
    "contact": "Contact",
    "enrollNow": "Enroll Now",
    "login": "Login"
  },
  "footer": {
    "quickLinks": "Quick Links",
    "contactInfo": "Contact Info",
    "tagline": "Excellence in Education since 2011. Building foundations for future leaders.",
    "copyright": "© 2026 EduLearning Platform. Excellence in Education."
  }
}
```

- [ ] **Step 3: Create empty placeholder files for the other two languages**

Create `Frontend/src/locales/hi/translation.json` and `Frontend/src/locales/mr/translation.json`, both with just:

```json
{}
```

(Task 3's bootstrap script fills these in — don't hand-translate here.)

- [ ] **Step 4: Create the i18next config**

Create `Frontend/src/i18n.js`:

```js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import hi from './locales/hi/translation.json';
import mr from './locales/mr/translation.json';

const storedLang = localStorage.getItem('lang');

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr },
  },
  lng: storedLang || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
```

- [ ] **Step 5: Load it before the app renders**

In `Frontend/src/main.jsx`, add the import as the first line:

```js
import './i18n'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
```

(Import order matters here only in that `i18n.js` must run its `.init()` before any component calls `useTranslation()` — putting it first guarantees that.)

- [ ] **Step 6: Verify the app still builds and runs**

Run: `cd "Frontend" && npm run dev`
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

- [ ] **Step 1: Write the component**

Create `Frontend/src/components/LanguageSwitcher.jsx`:

```jsx
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "mr", label: "मराठी" },
];

const LanguageSwitcher = ({ className = "" }) => {
  const { i18n } = useTranslation();

  const handleChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  };

  return (
    <select
      aria-label="Select language"
      value={i18n.language}
      onChange={handleChange}
      className={`bg-transparent border border-outline-variant rounded-lg px-2 py-1 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer ${className}`}
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher;
```

Note: a plain `<select>` is used deliberately — no new UI dependency, matches the earlier decision to keep language persistence to a simple browser-only toggle rather than build custom dropdown open/close state.

- [ ] **Step 2: Commit**

```bash
git add Frontend/src/components/LanguageSwitcher.jsx
git commit -m "Add LanguageSwitcher component"
```

(No test file — this is a thin, purely presentational wrapper around `i18n.changeLanguage`; its behavior is exercised end-to-end when it's wired into the nav in Task 4 and verified manually there.)

---

### Task 3: Gemini bootstrap script for `hi`/`mr` resource files

**Files:**
- Create: `Backend/scripts/generate-ui-translations.js`

- [ ] **Step 1: Write the script**

Create `Backend/scripts/generate-ui-translations.js`:

```js
// One-time (or re-run-when-keys-change) offline script. Not part of the
// request path — run manually with `node Backend/scripts/generate-ui-translations.js`.
// Reads Frontend/src/locales/en/translation.json, fills in any missing keys
// in hi/translation.json and mr/translation.json via Gemini, and writes them
// back. Existing keys in hi/mr are left untouched, so hand-edited
// corrections are never overwritten by a re-run.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const LOCALES_DIR = path.join(__dirname, '..', '..', 'Frontend', 'src', 'locales');
const LANGUAGES = { hi: 'Hindi', mr: 'Marathi' };

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, obj) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

// Flattens {a: {b: "text"}} to {"a.b": "text"} and back, so we can diff
// missing keys regardless of nesting depth.
function flatten(obj, prefix = '', out = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object') {
      flatten(value, fullKey, out);
    } else {
      out[fullKey] = value;
    }
  }
  return out;
}

function unflatten(flat) {
  const result = {};
  for (const [flatKey, value] of Object.entries(flat)) {
    const parts = flatKey.split('.');
    let node = result;
    for (let i = 0; i < parts.length - 1; i++) {
      node[parts[i]] = node[parts[i]] || {};
      node = node[parts[i]];
    }
    node[parts[parts.length - 1]] = value;
  }
  return result;
}

async function translateBatch(entries, targetLangName) {
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-1.5-pro' });
  const keys = Object.keys(entries);
  const prompt =
    `Translate each value in this JSON object to ${targetLangName}. ` +
    `Keep the same keys. Return ONLY a valid JSON object, no explanation, no code fences.\n\n` +
    JSON.stringify(entries, null, 2);
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/^```json\n?|```$/g, '');
  const translated = JSON.parse(cleaned);
  for (const key of keys) {
    if (!(key in translated)) throw new Error(`Gemini response missing key: ${key}`);
  }
  return translated;
}

async function main() {
  const enPath = path.join(LOCALES_DIR, 'en', 'translation.json');
  const enFlat = flatten(readJson(enPath));

  for (const [langCode, langName] of Object.entries(LANGUAGES)) {
    const targetPath = path.join(LOCALES_DIR, langCode, 'translation.json');
    const targetFlat = flatten(readJson(targetPath));

    const missing = {};
    for (const [key, value] of Object.entries(enFlat)) {
      if (!(key in targetFlat)) missing[key] = value;
    }

    if (Object.keys(missing).length === 0) {
      console.log(`[${langCode}] up to date, nothing to translate`);
      continue;
    }

    console.log(`[${langCode}] translating ${Object.keys(missing).length} missing key(s)...`);
    const translated = await translateBatch(missing, langName);
    const merged = { ...targetFlat, ...translated };
    writeJson(targetPath, unflatten(merged));
    console.log(`[${langCode}] wrote ${targetPath}`);
  }
}

main().catch((err) => {
  console.error('generate-ui-translations failed:', err);
  process.exit(1);
});
```

- [ ] **Step 2: Run it against the keys added in Task 1**

Run: `cd "Backend" && node scripts/generate-ui-translations.js`
Expected: console output like `[hi] translating 11 missing key(s)...` / `[mr] translating 11 missing key(s)...`, then both files written. Open `Frontend/src/locales/hi/translation.json` and `Frontend/src/locales/mr/translation.json` and confirm they now contain the same keys as `en/translation.json`, with Hindi/Marathi values.

- [ ] **Step 3: Spot-check translation quality**

Manually read a few entries (e.g. `nav.home`, `footer.tagline`) in each generated file. If anything reads oddly, hand-edit it directly — the script won't touch existing keys on a future run.

- [ ] **Step 4: Commit**

```bash
git add Backend/scripts/generate-ui-translations.js Frontend/src/locales/hi/translation.json Frontend/src/locales/mr/translation.json
git commit -m "Add Gemini bootstrap script for UI translations; generate initial hi/mr resources"
```

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
  { label: "Home", path: "/", navLabelKey: "nav.home" },
  { label: "About", path: "/about", navLabelKey: "nav.about" },
  { label: "Results", path: "/results", navLabelKey: "nav.results" },
  { label: "Courses", path: "/courses", navLabelKey: "nav.courses" },
  { label: "Contact", path: "/contact", navLabelKey: "nav.contact" },
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
              {t("nav.enrollNow")}
            </a>
            <ButtonWithIcon label={t("nav.login")} onClick={() => navigate("/login")} />
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
            {t("nav.enrollNow")}
          </a>
          <ButtonWithIcon
            label={t("nav.login")}
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
          <p className="text-on-surface-variant mb-6">{t("footer.tagline")}</p>
        </div>
        <div>
          <h4 className="text-2xl text-on-surface mb-4">{t("footer.quickLinks")}</h4>
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
          <h4 className="text-2xl text-on-surface mb-4">{t("footer.contactInfo")}</h4>
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
        <p className="text-on-surface-variant">{t("footer.copyright")}</p>
      </div>
    </footer>
  );
};
```

Note: the address/phone/email in the footer are intentionally left untranslated (they're proper nouns/numbers, not prose) — this is the same judgment call to make throughout Tasks 5+: translate prose and labels, not addresses, phone numbers, emails, or proper nouns.

- [ ] **Step 2: Manual verification**

Run: `cd "Frontend" && npm run dev`, open the site, and:
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
2. For each hardcoded, user-visible English string (JSX text content, `label`/`title`/`placeholder`/`aria-label` props on visible UI — not internal identifiers, CSS classes, route paths, or console messages), pick a namespaced key following the pattern already established (`<directoryOrFeature>.<element>`, e.g. `courses.heroTitle`, `admin.sidebar.dashboard`). Reuse the `nav.*`/`footer.*` keys from Task 1 instead of duplicating them if a file reuses that exact text.
3. Add the new keys (with their current English text as the value) to `Frontend/src/locales/en/translation.json`, nested under a sensible namespace.
4. Add `import { useTranslation } from "react-i18next";` and `const { t } = useTranslation();` to each component, and replace the hardcoded strings with `t('the.key')`.
5. Leave alone: numbers, dates already formatted upstream, proper nouns (person/place/product names), email addresses, phone numbers, and URLs.
6. Run `cd "Backend" && node scripts/generate-ui-translations.js` to fill in the new keys for `hi`/`mr` (it only translates what's missing, so this is safe to re-run after every directory).
7. Run `cd "Frontend" && npm run build` — must succeed with no errors (catches typos in `t()` keys/imports; it does not catch missing translation keys, since i18next falls back silently to the key string or `fallbackLng`).
8. Manually load the affected page(s) in the browser in all three languages and visually confirm no leftover hardcoded English and no layout breakage from longer Hindi/Marathi strings (these tend to run longer than English — watch for text overflow/wrapping in buttons and nav-like elements especially).
9. Commit with a message naming the directory, e.g. `git commit -m "Translate Courses components to i18next"`.

**Directories to migrate, in this order** (`Frontend/src/components/`):

- [ ] **Task 5:** Root-level pages: `Home.jsx`, `AboutPage.jsx`
- [ ] **Task 6:** `Contact/` (all `.jsx` files)
- [ ] **Task 7:** `Courses/` (all `.jsx` files)
- [ ] **Task 8:** `Results/` (all `.jsx` files, including `Results/sections/`)
- [ ] **Task 9:** `Auth/` (all `.jsx` files)
- [ ] **Task 10:** `Parents/` (all `.jsx` files)
- [ ] **Task 11:** `Leraners/` (all `.jsx` files)
- [ ] **Task 12:** `Teacher/` (all `.jsx` files)
- [ ] **Task 13:** `Admin/` (all `.jsx` files)
- [ ] **Task 14:** `ui/` (all `.jsx` files) and any remaining root-level component not yet covered (e.g. `Navigation.jsx`, `Header.jsx`, `HamburgerIcon.jsx`, `ResponsiveSidebarLayout.jsx`, `SidebarToggle.jsx` — check `Frontend/src/components/*.jsx` at the top level for anything missed by Tasks 4–13)

---

### Task 15: Final full-site verification

- [ ] **Step 1: Build**

Run: `cd "Frontend" && npm run build`
Expected: succeeds with no errors.

- [ ] **Step 2: Full manual pass**

Run: `cd "Frontend" && npm run dev`. In each of the three languages, visit: Home, About, Results, Courses, Contact, and (if reachable without real backend auth) the Admin/Teacher/Parent/Learner dashboard shells. Confirm nav, buttons, and headings are translated and no page is visibly broken.

- [ ] **Step 3: Commit any final fixes found during verification, then confirm clean tree**

Run: `git status` — expect a clean working tree with everything committed task-by-task above.

## What This Plan Does Not Do

- Does not touch any backend code or the dynamic-content translation cache — that's `docs/superpowers/plans/2026-08-15-dynamic-translation-infrastructure.md`.
- Does not attach an `X-Lang` header to any API call — there's no shared API client yet and no live endpoint reads it (see that plan's scope notes).
- Does not add per-user account language preference — browser-only per the approved spec.
