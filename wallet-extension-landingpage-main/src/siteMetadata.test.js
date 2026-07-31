import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { applySiteMetadata, SITE_METADATA } from './siteMetadata.js';

test('defines distinct homepage and developer metadata', () => {
  assert.equal(SITE_METADATA.landing.title, 'Rocky Wallet | Canton Network Browser Wallet');
  assert.equal(SITE_METADATA.developers.title, 'Rocky Wallet SDK | Build Canton dApps');
  assert.match(SITE_METADATA.landing.description, /non-custodial Chrome extension/i);
  assert.match(SITE_METADATA.developers.description, /dApp SDK/i);
});

test('applies title and supported metadata fields', () => {
  const values = new Map();
  const documentRef = { title: '', querySelector: (selector) => ({ setAttribute: (name, value) => values.set(`${selector}:${name}`, value) }) };
  applySiteMetadata(documentRef, SITE_METADATA.developers);
  assert.equal(documentRef.title, SITE_METADATA.developers.title);
  assert.equal(values.get('meta[name="description"]:content'), SITE_METADATA.developers.description);
  assert.equal(values.get('meta[property="og:title"]:content'), SITE_METADATA.developers.title);
  assert.equal(values.get('meta[property="og:description"]:content'), SITE_METADATA.developers.description);
  assert.equal(values.get('meta[name="twitter:title"]:content'), SITE_METADATA.developers.title);
  assert.equal(values.get('meta[name="twitter:description"]:content'), SITE_METADATA.developers.description);
});

test('static metadata identifies Chrome and release 1.0.2', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /Rocky Wallet \| Canton Network Browser Wallet/);
  assert.match(html, /"operatingSystem": "Chrome"/);
  assert.match(html, /"softwareVersion": "1\.0\.2"/);
  assert.doesNotMatch(html, /Chrome, Brave, Microsoft Edge, Firefox/);
});
