import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const files = ['./App.jsx', './LandingPage.jsx', './DevelopersPage.jsx', './siteContent.js', '../index.html'];

test('public source has no stale metrics, unsupported claims, or old SDK marker', async () => {
  const source = (await Promise.all(files.map((path) => readFile(new URL(path, import.meta.url), 'utf8')))).join('\n');
  assert.doesNotMatch(source, /1000\+|99\.99%/);
  assert.doesNotMatch(source, /tokens, NFTs, and collectibles/i);
  assert.doesNotMatch(source, /More network support is coming/i);
  assert.doesNotMatch(source, /@console-wallet\/dapp-sdk/);
  assert.doesNotMatch(source, /Chrome, Brave, Microsoft Edge, Firefox/);
});
