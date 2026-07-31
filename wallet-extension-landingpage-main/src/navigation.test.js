import assert from 'node:assert/strict';
import test from 'node:test';
import { headerNavItems } from './navigation.js';
import { PUBLIC_LINKS } from './siteConfig.js';

test('header exposes product, documentation, developers, and support', () => {
  assert.deepEqual(headerNavItems, [
    { label: 'Features', href: '/#features' },
    { label: 'Security', href: '/#security' },
    { label: 'Documentation', href: PUBLIC_LINKS.docs, external: true },
    { label: 'Developers', href: '/developers' },
    { label: 'Support', href: '/#support' },
  ]);
});
