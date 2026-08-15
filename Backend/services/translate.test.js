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

  it('write-time cache warming: a second call for the same text is a cache hit (Gemini called only once)', async () => {
    // A stateful fake, unlike the one-shot mocks above: it actually stores
    // what upsert() writes and returns it from select(), so this test can
    // prove the cache persists a value across two separate translateText
    // calls — this is what the spec's "write-time cache warming" behavior
    // means in practice: translate once, read from cache thereafter.
    const store = new Map(); // key: `${content_hash}:${target_lang}` -> translated_text
    supabase.from = jest.fn(() => ({
      select: jest.fn(() => {
        let hash, lang;
        const builder = {
          eq: jest.fn((col, val) => {
            if (col === 'content_hash') hash = val;
            if (col === 'target_lang') lang = val;
            return builder;
          }),
          maybeSingle: jest.fn(async () => {
            const key = `${hash}:${lang}`;
            return store.has(key)
              ? { data: { translated_text: store.get(key) }, error: null }
              : { data: null, error: null };
          }),
        };
        return builder;
      }),
      upsert: jest.fn(async (row) => {
        store.set(`${row.content_hash}:${row.target_lang}`, row.translated_text);
        return { data: null, error: null };
      }),
    }));

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const generateContent = jest.fn().mockResolvedValue({
      response: { text: () => 'अनुवादित' },
    });
    GoogleGenerativeAI.mockImplementation(() => ({
      getGenerativeModel: () => ({ generateContent }),
    }));

    const first = await translateText('Warm me up', 'hi');
    const second = await translateText('Warm me up', 'hi');

    expect(first).toBe('अनुवादित');
    expect(second).toBe('अनुवादित');
    expect(generateContent).toHaveBeenCalledTimes(1); // second call hit the cache, not Gemini
  });
});
