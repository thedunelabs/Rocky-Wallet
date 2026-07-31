import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

function readHexVariable(css, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escapedName}:\\s*(#[0-9a-f]{6})`, 'i'));
  assert.ok(match, `${name} must be defined as a six-digit hex color`);
  return match[1];
}

function relativeLuminance(hex) {
  const channels = hex.slice(1).match(/.{2}/g).map((channel) => Number.parseInt(channel, 16) / 255);
  const linearChannels = channels.map((channel) => (
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  ));
  return 0.2126 * linearChannels[0] + 0.7152 * linearChannels[1] + 0.0722 * linearChannels[2];
}

function contrastRatio(first, second) {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

function readMediaBlock(css, query) {
  const startMatch = css.match(query);
  assert.ok(startMatch, `missing media query: ${query}`);
  const start = startMatch.index;
  const openingBrace = css.indexOf('{', start);
  let depth = 0;
  for (let index = openingBrace; index < css.length; index += 1) {
    if (css[index] === '{') depth += 1;
    if (css[index] === '}') depth -= 1;
    if (depth === 0) return css.slice(openingBrace + 1, index);
  }
  assert.fail(`unterminated media query: ${query}`);
}

test('marketing CSS implements the approved visual and accessibility contracts', async () => {
  const css = await readFile(new URL('./marketing.css', import.meta.url), 'utf8');
  assert.match(css, /--rw-orange:\s*#ff9f4c/i);
  assert.match(css, /--rw-blue:\s*#8ed7ee/i);
  assert.match(css, /--rw-navy:\s*#152c39/i);
  assert.match(css, /\.rw-marketing-page/);
  assert.match(css, /\.rw-developers-page/);
  assert.match(css, /\.rw-developer-path/);
  assert.match(css, /\.rw-copy-command code\s*\{[^}]*user-select:\s*text/s);
  assert.match(css, /\.rw-copy-command button\s*\{[^}]*min-height:\s*48px/s);
  assert.match(css, /@media\s*\(max-width:\s*900px\)[\s\S]*?\.rw-menu-button,\s*\.menu-button\s*\{[^}]*width:\s*48px;[^}]*height:\s*48px/s);
  assert.match(css, /\.join-frame \.button,\s*\.legal-frame \.button\s*\{[^}]*min-height:\s*48px/s);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\s*\(max-width:\s*900px\)/);
  assert.match(css, /@media\s*\(max-width:\s*560px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});

test('legacy shared shell switches to mobile navigation through 920px', async () => {
  const css = await readFile(new URL('./marketing.css', import.meta.url), 'utf8');
  const media = readMediaBlock(css, /@media\s*\(max-width:\s*920px\)\s*\{/);

  assert.match(media, /\.site-frame \.rw-header,\s*\.site-frame \.site-header\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\) auto/s);
  assert.match(media, /\.site-frame \.rw-desktop-nav,\s*\.site-frame \.desktop-nav,\s*\.site-frame \.rw-header-install,\s*\.site-frame \.header-actions\s*\{[^}]*display:\s*none/s);
  assert.match(media, /\.site-frame \.rw-menu-button,\s*\.site-frame \.menu-button\s*\{[^}]*display:\s*inline-grid;[^}]*width:\s*48px;[^}]*height:\s*48px/s);
  assert.match(media, /\.site-frame \.rw-mobile-nav,\s*\.site-frame \.mobile-menu\s*\{[^}]*display:\s*grid/s);
  assert.match(media, /\.site-frame \.rw-mobile-nav a,\s*\.site-frame \.mobile-menu a\s*\{[^}]*padding:[^;}]+;[^}]*font-weight:/s);
});

test('focus and footer tokens meet WCAG contrast thresholds', async () => {
  const css = await readFile(new URL('./marketing.css', import.meta.url), 'utf8');
  const lightFocus = readHexVariable(css, '--rw-focus-light');
  const darkFocus = readHexVariable(css, '--rw-focus-dark');
  const footerMuted = readHexVariable(css, '--rw-footer-muted');
  const paper = readHexVariable(css, '--rw-paper');
  const canvas = readHexVariable(css, '--rw-canvas');
  const navy = readHexVariable(css, '--rw-navy');
  const navyDeep = readHexVariable(css, '--rw-navy-deep');

  for (const background of [paper, canvas]) {
    const ratio = contrastRatio(lightFocus, background);
    assert.ok(ratio >= 3, `light focus contrast ${ratio.toFixed(2)} must be at least 3:1 on ${background}`);
  }

  for (const background of [navy, navyDeep]) {
    const ratio = contrastRatio(darkFocus, background);
    assert.ok(ratio >= 3, `dark focus contrast ${ratio.toFixed(2)} must be at least 3:1 on ${background}`);
  }

  const footerRatio = contrastRatio(footerMuted, canvas);
  assert.ok(footerRatio >= 4.5, `footer contrast ${footerRatio.toFixed(2)} must be at least 4.5:1`);

  assert.match(css, /outline:\s*3px solid var\(--rw-focus-light\)/);
  assert.match(css, /\.rw-developer-path :is\(a, button\):focus-visible,/);
  assert.match(css, /\.rw-developer-hero :is\(a, button\):focus-visible,/);
  assert.match(css, /\.rw-boundary-section :is\(a, button\):focus-visible,/);
  assert.match(css, /\.rw-security-boundary :is\(a, button\):focus-visible\s*\{[^}]*outline:\s*3px solid var\(--rw-focus-dark\)/s);
  assert.match(css, /\.rw-copyright,\s*\.copyright\s*\{[^}]*color:\s*var\(--rw-footer-muted\)/s);
});
