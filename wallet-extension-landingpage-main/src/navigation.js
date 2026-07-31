import { PUBLIC_LINKS } from './siteConfig.js';

export const headerNavItems = Object.freeze([
  { label: 'Features', href: '/#features' },
  { label: 'Security', href: '/#security' },
  { label: 'Documentation', href: PUBLIC_LINKS.docs, external: true },
  { label: 'Developers', href: '/developers' },
  { label: 'Support', href: '/#support' },
]);
