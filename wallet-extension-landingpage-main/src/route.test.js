import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizePathname, resolveSiteRoute } from './route.js';

test('normalizes empty and trailing-slash paths', () => {
  assert.equal(normalizePathname(''), '/');
  assert.equal(normalizePathname('/developers/'), '/developers');
  assert.equal(normalizePathname('/privacy///'), '/privacy');
});

test('recognizes public routes and preserves the landing fallback', () => {
  assert.equal(resolveSiteRoute('/'), 'landing');
  assert.equal(resolveSiteRoute('/developers'), 'developers');
  assert.equal(resolveSiteRoute('/join'), 'join');
  assert.equal(resolveSiteRoute('/privacy'), 'privacy');
  assert.equal(resolveSiteRoute('/terms'), 'terms');
  assert.equal(resolveSiteRoute('/missing'), 'landing');
});
