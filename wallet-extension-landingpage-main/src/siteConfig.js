export const SITE_VERSIONS = Object.freeze({ extension: '1.0.2', sdk: '1.0.2' });

export const PUBLIC_LINKS = Object.freeze({
  chromeStore: 'https://chromewebstore.google.com/detail/rocky-wallet/mgafpjfkpppnmpcdfpjghcajhpljomcn?hl=en&authuser=0',
  docs: 'https://extension-doc.rocky.exchange/',
  npm: 'https://www.npmjs.com/package/@rocky-wallet/dapp-sdk',
  sdkGitHub: 'https://github.com/Rocky-exchange/rocky-wallet-sdk',
  gitHub: 'https://github.com/Rocky-exchange',
  x: 'https://x.com/Rocky_exchange',
  telegram: 'https://t.me/Rockyexchangecommunity',
  discord: 'https://discord.gg/Wu5VmFfjSn',
  supportEmail: 'support@rocky.exchange',
});

export const FOOTER_GROUPS = Object.freeze([
  { title: 'Product', links: [
    { label: 'Features', href: '/#features' },
    { label: 'Security', href: '/#security' },
    { label: 'Install Extension', href: PUBLIC_LINKS.chromeStore, external: true },
  ] },
  { title: 'Developers', links: [
    { label: 'Documentation', href: PUBLIC_LINKS.docs, external: true },
    { label: 'SDK on npm', href: PUBLIC_LINKS.npm, external: true },
    { label: 'SDK on GitHub', href: PUBLIC_LINKS.sdkGitHub, external: true },
    { label: 'Developers page', href: '/developers' },
  ] },
  { title: 'Company', links: [
    { label: 'Join us', href: '/join' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ] },
  { title: 'Community', links: [
    { label: 'X (Twitter)', href: PUBLIC_LINKS.x, external: true },
    { label: 'Telegram', href: PUBLIC_LINKS.telegram, external: true },
    { label: 'Discord', href: PUBLIC_LINKS.discord, external: true },
    { label: 'GitHub', href: PUBLIC_LINKS.gitHub, external: true },
  ] },
]);
