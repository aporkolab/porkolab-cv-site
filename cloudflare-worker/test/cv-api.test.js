import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, { latestPerLanguage, listCvKeys } from '../cv-api.js';

// Minimal R2 stand-in: honours prefix and pages results like the real binding.
function fakeBucket(keys, pageSize = 1000) {
  const calls = [];
  return {
    calls,
    async list({ prefix = '', cursor } = {}) {
      calls.push({ prefix, cursor });
      const matching = keys.filter((k) => k.startsWith(prefix));
      const start = cursor ? Number(cursor) : 0;
      const objects = matching.slice(start, start + pageSize).map((key) => ({ key }));
      const next = start + pageSize;
      return next < matching.length
        ? { objects, truncated: true, cursor: String(next) }
        : { objects, truncated: false };
    },
  };
}

const KEYS = [
  'cv_public_en_default_20261018_080003.pdf',
  'cv_public_en_default_20261025_080003.pdf',
  'cv_public_hu_default_20261025_080011.pdf',
  'cv_public_de_default_20261011_080019.pdf',
  'cv_private_en_default_20991231_235959.pdf',
  'cv_public_en_short_20991231_235959.pdf',
  'notes.txt',
];

const call = (path, env, method = 'GET') =>
  worker.fetch(new Request(`https://cv-api.example${path}`, { method }), env);

test('latestPerLanguage keeps the newest public default PDF per language', () => {
  assert.deepEqual(latestPerLanguage(KEYS), {
    en: { filename: 'cv_public_en_default_20261025_080003.pdf', timestamp: '20261025080003' },
    hu: { filename: 'cv_public_hu_default_20261025_080011.pdf', timestamp: '20261025080011' },
    de: { filename: 'cv_public_de_default_20261011_080019.pdf', timestamp: '20261011080019' },
  });
});

test('listCvKeys follows the cursor past the first page', async () => {
  const bucket = fakeBucket(KEYS, 2);
  const keys = await listCvKeys(bucket);
  assert.equal(keys.length, 5);
  assert.ok(bucket.calls.length > 1);
  assert.ok(bucket.calls.every((c) => c.prefix === 'cv_public_'));
});

test('/latest/:lang redirects to the newest file', async () => {
  const res = await call('/latest/hu', { CV_BUCKET: fakeBucket(KEYS), PUBLIC_BASE_URL: 'https://pdf.example/' });
  assert.equal(res.status, 302);
  assert.equal(res.headers.get('Location'), 'https://pdf.example/cv_public_hu_default_20261025_080011.pdf');
});

test('/latest/:lang falls back to English for an unknown language', async () => {
  const res = await call('/latest/fr', { CV_BUCKET: fakeBucket(KEYS) });
  assert.equal(res.status, 302);
  assert.match(res.headers.get('Location'), /\.r2\.dev\/cv_public_en_default_20261025_080003\.pdf$/);
});

test('/latest/:lang is 404 when the bucket holds no CV', async () => {
  const res = await call('/latest/en', { CV_BUCKET: fakeBucket([]) });
  assert.equal(res.status, 404);
});

test('/manifest.json lists the latest filename per language with CORS', async () => {
  const res = await call('/manifest.json', { CV_BUCKET: fakeBucket(KEYS) });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), '*');
  assert.equal(res.headers.get('Cache-Control'), 'public, max-age=300');
  assert.deepEqual(await res.json(), {
    en: 'cv_public_en_default_20261025_080003.pdf',
    hu: 'cv_public_hu_default_20261025_080011.pdf',
    de: 'cv_public_de_default_20261011_080019.pdf',
  });
});

test('/ describes the API and the available languages', async () => {
  const body = await (await call('/', { CV_BUCKET: fakeBucket(KEYS) })).json();
  assert.deepEqual(body.available.sort(), ['de', 'en', 'hu']);
});

test('unknown routes are 404 without touching the bucket', async () => {
  const bucket = fakeBucket(KEYS);
  const res = await call('/nope', { CV_BUCKET: bucket });
  assert.equal(res.status, 404);
  assert.equal(bucket.calls.length, 0);
});

test('OPTIONS answers the preflight, other write methods are 405', async () => {
  const pre = await call('/manifest.json', {}, 'OPTIONS');
  assert.equal(pre.status, 200);
  assert.match(pre.headers.get('Access-Control-Allow-Methods'), /GET/);
  const post = await call('/manifest.json', {}, 'POST');
  assert.equal(post.status, 405);
});

test('a failing bucket yields a generic 500 without leaking the error', async (t) => {
  t.mock.method(console, 'error', () => {});
  const bucket = { list: async () => { throw new Error('secret internal detail'); } };
  const res = await call('/manifest.json', { CV_BUCKET: bucket });
  assert.equal(res.status, 500);
  assert.doesNotMatch(await res.text(), /secret/);
});
