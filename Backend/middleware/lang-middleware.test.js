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
