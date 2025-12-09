const fs = require('fs');
const os = require('os');
const path = require('path');
const { promisify } = require('util');
const { execFile } = require('child_process');
const axios = require('axios');
const { OpenAI } = require('openai');

const execFileAsync = promisify(execFile);

// Supported image MIME types
const SUPPORTED_IMAGE_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]);

function isUrl(str) {
  try { const u = new URL(str); return u.protocol === 'http:' || u.protocol === 'https:'; } catch { return false; }
}

function extToMime(ext) {
  const e = ext.toLowerCase();
  if (e === '.png') return 'image/png';
  if (e === '.jpg' || e === '.jpeg') return 'image/jpeg';
  if (e === '.webp') return 'image/webp';
  if (e === '.gif') return 'image/gif';
  if (e === '.pdf') return 'application/pdf';
  return null;
}

function guessMimeFromName(name) {
  const ext = path.extname(name || '').toLowerCase();
  return extToMime(ext);
}

function bufferToDataUrl(mime, buf) {
  const b64 = Buffer.from(buf).toString('base64');
  return `data:${mime};base64,${b64}`;
}

async function pdfToPngBuffers(pdfBuffer, opts = {}) {
  const dpi = opts.dpi || 200;
  const maxPages = opts.maxPages || Number(process.env.PDF_MAX_PAGES || 10);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdfx-'));
  const pdfPath = path.join(tmpDir, 'input.pdf');
  fs.writeFileSync(pdfPath, pdfBuffer);

  const outPrefix = path.join(tmpDir, 'page');

  // Use Poppler's pdftoppm to render pages to PNG
  // Limit pages to avoid excessive tokens/cost
  const args = ['-png', '-r', String(dpi), '-f', '1', '-l', String(maxPages), pdfPath, outPrefix];
  try {
    await execFileAsync('pdftoppm', args, { cwd: tmpDir });
  } catch (e) {
    // Clean up before throwing
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
    throw new Error(`pdftoppm failed: ${e.message}`);
  }

  const files = fs.readdirSync(tmpDir)
    .filter(f => f.startsWith('page-') && f.endsWith('.png'))
    .sort((a, b) => {
      const na = parseInt(a.slice(5, a.length - 4), 10);
      const nb = parseInt(b.slice(5, b.length - 4), 10);
      return na - nb;
    });

  const images = [];
  for (const f of files) {
    const full = path.join(tmpDir, f);
    const buf = fs.readFileSync(full);
    images.push({ mime: 'image/png', buffer: buf });
  }

  // Cleanup temp directory
  try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}

  if (images.length === 0) {
    throw new Error('No PNGs were produced from the PDF.');
  }

  return images;
}

async function readInputToImages(input) {
  // Returns array of { mime, buffer }
  // Accepts: string (URL or local path) OR { url?, path?, buffer?, mime? }
  let source = input;
  if (typeof input === 'string') {
    source = isUrl(input) ? { url: input } : { path: input };
  }

  if (source.url) {
    const res = await axios.get(source.url, { responseType: 'arraybuffer' });
    const mime = res.headers['content-type'] || guessMimeFromName(source.url) || 'application/octet-stream';
    const buf = Buffer.from(res.data);
    if (mime === 'application/pdf') {
      return await pdfToPngBuffers(buf);
    }
    if (!SUPPORTED_IMAGE_MIME.has(mime)) {
      throw new Error(`Unsupported content-type from URL: ${mime}`);
    }
    return [{ mime, buffer: buf }];
  }

  if (source.path) {
    const mime = source.mime || guessMimeFromName(source.path);
    const buf = fs.readFileSync(source.path);
    if (mime === 'application/pdf') {
      return await pdfToPngBuffers(buf);
    }
    if (!SUPPORTED_IMAGE_MIME.has(mime)) {
      throw new Error(`Unsupported file type for path: ${source.path}`);
    }
    return [{ mime, buffer: buf }];
  }

  if (source.buffer) {
    const mime = source.mime || 'image/png';
    if (mime === 'application/pdf') {
      return await pdfToPngBuffers(source.buffer);
    }
    if (!SUPPORTED_IMAGE_MIME.has(mime)) {
      throw new Error(`Unsupported buffer MIME type: ${mime}`);
    }
    return [{ mime, buffer: Buffer.isBuffer(source.buffer) ? source.buffer : Buffer.from(source.buffer) }];
  }

  throw new Error('Invalid input: provide a URL, local path, or buffer.');
}

function buildSchema() {
  return {
    type: 'object',
    properties: {
      questions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            question: { type: 'string' },
            options: { type: 'array', items: { type: 'string' } },
            answer: { anyOf: [ { type: 'string' }, { type: 'null' } ] },
            pageNumber: { anyOf: [ { type: 'integer', minimum: 1 }, { type: 'null' } ] }
          },
          // OpenAI strict JSON schema requires 'required' to include every key in properties
          required: ['question', 'options', 'answer', 'pageNumber'],
          additionalProperties: false
        }
      }
    },
    required: ['questions'],
    additionalProperties: false
  };
}

async function openAI(input) {
  const model = process.env.OPENAI_VISION_MODEL || 'gpt-4o';
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const images = await readInputToImages(input);

  // Build content array: one text instruction + multiple images (pages)
  const content = [
    // { type: 'text', text: 'Convert the document images to JSON. Extract ONLY questions and their options/answers. If the image or PDF shows only a question with options and no marked answer, infer the single best answer from the options and set answer to that option\'s exact text. If no options exist, set options to [], and set answer to null unless an explicit answer is visible. Always include keys for every item: question, options (array), answer (string or null), pageNumber (1-based by page order or null). Return only JSON that validates against the schema. Do not include explanations.' }
    { type: 'text', text: 'Convert the document images to JSON. Extract ONLY questions and their options/answers. If the image or PDF shows a question with options and no marked answer, infer the single best answer from the options and set answer to that option\'s exact text. If the question has no options, infer the correct answer from your general knowledge and set answer to that inferred answer. If neither an explicit nor inferable answer is available, set answer to null. Always include keys for every item: question, options (array), answer (string or null), pageNumber (1-based by page order or null). Return only JSON that validates against the schema. Do not include explanations' }
  ];
  for (const img of images) {
    content.push({ type: 'image_url', image_url: { url: bufferToDataUrl(img.mime, img.buffer) } });
  }

  const schema = buildSchema();

  const resp = await openai.chat.completions.create({
    model,
    temperature: 0,
    messages: [
      { role: 'system', content: 'You are a strict JSON extractor. Return valid JSON only, no prose. If options are provided, answer must be exactly one of the provided options; otherwise set answer to null.' },
      { role: 'user', content }
    ],
    response_format: {
      type: 'json_schema',
      json_schema: { name: 'ExamQASchema', schema, strict: true }
    }
  });

  const text = resp.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('OpenAI returned empty content');
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    // In rare cases, the content may include code fences; try to sanitize
    const cleaned = text.replace(/^```json\n?|\n?```$/g, '');
    return JSON.parse(cleaned);
  }
}

module.exports = {
  openAI,
};
