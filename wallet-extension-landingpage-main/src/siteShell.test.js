import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

test('shared shell renders compatible classes and unique browser icon definitions', async () => {
  const server = await createServer({
    appType: 'custom',
    logLevel: 'silent',
    server: { middlewareMode: true },
  });

  try {
    const { BrowserIcon, RockyLogo } = await server.ssrLoadModule('/src/SiteShell.jsx');
    const markup = renderToStaticMarkup(
      React.createElement(
        React.Fragment,
        null,
        React.createElement(RockyLogo),
        React.createElement(BrowserIcon),
        React.createElement(BrowserIcon),
      ),
    );
    const logoClass = markup.match(/<img class="([^"]+)"/)?.[1];
    const iconClasses = [...markup.matchAll(/<svg class="([^"]+)"/g)].map((match) => match[1]);
    const clipIds = [...markup.matchAll(/<clipPath id="([^"]+)"/g)].map((match) => match[1]);
    const clipReferences = [...markup.matchAll(/clip-path="url\(#([^\)]+)\)"/g)].map((match) => match[1]);

    assert.equal(logoClass, 'rocky-logo rw-logo');
    assert.deepEqual(iconClasses, [
      'browser-svg chrome-icon rw-browser-icon',
      'browser-svg chrome-icon rw-browser-icon',
    ]);
    assert.equal(new Set(clipIds).size, 2);
    assert.deepEqual(clipReferences, clipIds);
  } finally {
    await server.close();
  }
});

test('shared shell owns accessible navigation', async () => {
  const source = await readFile(new URL('./SiteShell.jsx', import.meta.url), 'utf8');
  assert.match(source, /aria-label="Primary navigation"/);
  assert.match(source, /aria-label="Mobile navigation"/);
  assert.match(source, /aria-expanded=\{menuOpen\}/);
  assert.match(source, /aria-controls="mobile-navigation"/);
  assert.match(source, /target=\{item\.external \? '_blank' : undefined\}/);
  assert.match(source, /rel=\{item\.external \? 'noreferrer' : undefined\}/);
});

test('application uses the shared shell', async () => {
  const source = await readFile(new URL('./App.jsx', import.meta.url), 'utf8');
  assert.match(source, /import \{ SiteFooter, SiteHeader \} from '\.\/SiteShell\.jsx'/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
});
