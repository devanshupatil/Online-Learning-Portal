const SUPPORTED_LANGS = new Set(['en', 'hi', 'mr']);

function langMiddleware(req, res, next) {
  const requested = (req.headers['x-lang'] || 'en').toLowerCase();
  req.lang = SUPPORTED_LANGS.has(requested) ? requested : 'en';
  next();
}

module.exports = langMiddleware;
