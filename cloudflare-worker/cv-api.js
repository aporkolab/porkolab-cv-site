/**
 * Cloudflare Worker - Dynamic CV Download API
 *
 * Automatically finds and serves the latest CV PDF per language from R2 bucket.
 *
 * Deploy this worker and bind it to your R2 bucket named 'porkolab-cv'
 *
 * Endpoints:
 *   GET /latest/en  → Redirects to latest English CV
 *   GET /latest/hu  → Redirects to latest Hungarian CV
 *   GET /latest/de  → Redirects to latest German CV
 *   GET /manifest.json → Returns JSON with latest filenames per language
 */

const FILE_PREFIX = 'cv_public_';
const FILE_PATTERN = /^cv_public_(\w+)_default_(\d{8})_(\d{6})\.pdf$/;
const DEFAULT_PUBLIC_BASE_URL = 'https://pub-c677684c572248f4ae32cfb9fc6b6972.r2.dev';

// CORS headers for cross-origin requests
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Lists every key under the CV prefix. R2 returns at most 1000 keys per call,
 * so a single list() silently drops the newest files once the bucket grows.
 */
export async function listCvKeys(bucket) {
  const keys = [];
  let cursor;
  do {
    const page = await bucket.list({ prefix: FILE_PREFIX, cursor });
    for (const obj of page.objects) keys.push(obj.key);
    cursor = page.truncated ? page.cursor : undefined;
  } while (cursor);
  return keys;
}

/** Picks the newest file per language: { en: { filename, timestamp }, ... } */
export function latestPerLanguage(keys) {
  const cvFiles = {};
  for (const key of keys) {
    const match = key.match(FILE_PATTERN);
    if (!match) continue;
    const [, lang, date, time] = match;
    const timestamp = date + time;
    if (!cvFiles[lang] || timestamp > cvFiles[lang].timestamp) {
      cvFiles[lang] = { filename: key, timestamp };
    }
  }
  return cvFiles;
}

function json(body, extraHeaders = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'Content-Type': 'application/json', ...extraHeaders, ...CORS_HEADERS },
  });
}

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { Allow: 'GET, HEAD, OPTIONS', ...CORS_HEADERS },
      });
    }

    const path = new URL(request.url).pathname;
    const latestMatch = path.match(/^\/latest\/(\w+)$/);
    const isManifest = path === '/manifest.json';
    const isIndex = path === '/' || path === '';

    // Unknown routes never need the bucket listing.
    if (!latestMatch && !isManifest && !isIndex) {
      return new Response('Not found', { status: 404, headers: CORS_HEADERS });
    }

    let cvFiles;
    try {
      cvFiles = latestPerLanguage(await listCvKeys(env.CV_BUCKET));
    } catch (error) {
      // Log the detail for `wrangler tail`, do not echo internals to the client.
      console.error('R2 listing failed', error);
      return new Response('Internal error', { status: 500, headers: CORS_HEADERS });
    }

    // Route: /manifest.json - Return latest filenames as JSON
    if (isManifest) {
      const manifest = {};
      for (const [lang, data] of Object.entries(cvFiles)) {
        manifest[lang] = data.filename;
      }
      return json(manifest, { 'Cache-Control': 'public, max-age=300' }); // Cache for 5 minutes
    }

    // Route: /latest/:lang - Redirect to latest CV for language
    if (latestMatch) {
      const cvData = cvFiles[latestMatch[1]] || cvFiles.en; // Fallback to English
      if (!cvData) {
        return new Response('CV not found', { status: 404, headers: CORS_HEADERS });
      }
      const base = (env.PUBLIC_BASE_URL || DEFAULT_PUBLIC_BASE_URL).replace(/\/+$/, '');
      return Response.redirect(`${base}/${encodeURIComponent(cvData.filename)}`, 302);
    }

    // Route: / - API info
    return json({
      api: 'CV Download API',
      endpoints: {
        '/latest/en': 'Redirect to latest English CV',
        '/latest/hu': 'Redirect to latest Hungarian CV',
        '/latest/de': 'Redirect to latest German CV',
        '/manifest.json': 'Get latest filenames per language',
      },
      available: Object.keys(cvFiles),
    });
  },
};
