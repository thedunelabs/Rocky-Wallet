import assert from 'node:assert/strict';
import test from 'node:test';
import { FOOTER_GROUPS, PUBLIC_LINKS, SITE_VERSIONS } from './siteConfig.js';

test('publishes approved Rocky destinations and versions', () => {
  assert.deepEqual(SITE_VERSIONS, { extension: '1.0.2', sdk: '1.0.2' });
  assert.equal(PUBLIC_LINKS.chromeStore, 'https://chromewebstore.google.com/detail/rocky-wallet/mgafpjfkpppnmpcdfpjghcajhpljomcn?hl=en&authuser=0');
  assert.equal(PUBLIC_LINKS.docs, 'https://extension-doc.rocky.exchange/');
  assert.equal(PUBLIC_LINKS.npm, 'https://www.npmjs.com/package/@rocky-wallet/dapp-sdk');
  assert.equal(PUBLIC_LINKS.sdkGitHub, 'https://github.com/Rocky-exchange/rocky-wallet-sdk');
  assert.equal(PUBLIC_LINKS.gitHub, 'https://github.com/Rocky-exchange');
  assert.equal(PUBLIC_LINKS.x, 'https://x.com/Rocky_exchange');
  assert.equal(PUBLIC_LINKS.telegram, 'https://t.me/Rockyexchangecommunity');
  assert.equal(PUBLIC_LINKS.discord, 'https://discord.gg/Wu5VmFfjSn');
  assert.equal(PUBLIC_LINKS.supportEmail, 'support@rocky.exchange');
});

test('footer contains live groups and no missing marketing anchors', () => {
  const links = FOOTER_GROUPS.flatMap((group) => group.links);
  const hrefs = links.map((link) => link.href);
  assert.deepEqual(FOOTER_GROUPS.map((group) => group.title), ['Product', 'Developers', 'Company', 'Community']);
  assert.deepEqual(links.map(({ label, href }) => ({ label, href })), [
    { label: 'Features', href: '/#features' },
    { label: 'Security', href: '/#security' },
    { label: 'Install Extension', href: PUBLIC_LINKS.chromeStore },
    { label: 'Documentation', href: PUBLIC_LINKS.docs },
    { label: 'SDK on npm', href: PUBLIC_LINKS.npm },
    { label: 'SDK on GitHub', href: PUBLIC_LINKS.sdkGitHub },
    { label: 'Developers page', href: '/developers' },
    { label: 'Join us', href: '/join' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'X (Twitter)', href: PUBLIC_LINKS.x },
    { label: 'Telegram', href: PUBLIC_LINKS.telegram },
    { label: 'Discord', href: PUBLIC_LINKS.discord },
    { label: 'GitHub', href: PUBLIC_LINKS.gitHub },
  ]);
  assert.equal(hrefs.some((href) => /^\/#(roadmap|learn|blog|help-center|about-us)$/.test(href)), false);
  assert.ok(links.some((link) => link.label === 'Documentation'));
  assert.ok(links.some((link) => link.label === 'SDK on npm'));
});
