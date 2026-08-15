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
