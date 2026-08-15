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
