import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('landing page exposes the approved wallet-first conversion hierarchy', async () => {
  const source = await readFile(new URL('./LandingPage.jsx', import.meta.url), 'utf8');
  assert.match(source, /Your assets<br \/>Your approval<br \/>Your wallet/);
  assert.ok(source.indexOf('Install Extension') < source.indexOf('Read Docs'));
  assert.ok(source.indexOf('Read Docs') < source.indexOf('Build with SDK'));
  assert.match(source, /href="\/developers"/);
  assert.match(source, /id="features"/);
  assert.match(source, /id="security"/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
});

test('landing page uses centralized external destinations and no stale claims', async () => {
  const source = await readFile(new URL('./LandingPage.jsx', import.meta.url), 'utf8');
  assert.match(source, /PUBLIC_LINKS\.chromeStore/);
  assert.match(source, /PUBLIC_LINKS\.docs/);
  assert.match(source, /PUBLIC_LINKS\.npm/);
  assert.match(source, /PUBLIC_LINKS\.sdkGitHub/);
  assert.doesNotMatch(source, /1000\+|99\.99%|NFT|collectibles|More network support/i);
});
