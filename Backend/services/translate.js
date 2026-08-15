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

async function translateFields(obj, fields, targetLang) {
  await Promise.all(
    fields.map(async (field) => {
      if (obj[field]) obj[field] = await module.exports.translateText(obj[field], targetLang);
    })
  );
  return obj;
}

module.exports = { translateText, translateFields, hashText, geminiTranslate };
