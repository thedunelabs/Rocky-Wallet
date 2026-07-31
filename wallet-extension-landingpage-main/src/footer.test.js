import assert from 'node:assert/strict';
import test from 'node:test';
import { FOOTER_GROUPS, PUBLIC_LINKS } from './siteConfig.js';

test('footer exposes support and configured groups', () => {
  assert.equal(PUBLIC_LINKS.supportEmail, 'support@rocky.exchange');
  assert.deepEqual(FOOTER_GROUPS.map((group) => group.title), ['Product', 'Developers', 'Company', 'Community']);
});
