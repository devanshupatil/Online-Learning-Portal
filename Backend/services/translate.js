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
