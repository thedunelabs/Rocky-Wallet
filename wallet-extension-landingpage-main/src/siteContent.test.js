import assert from 'node:assert/strict';
import test from 'node:test';
import { HOME_FACTS, SECURITY_POINTS, USER_CAPABILITIES, WALLET_STEPS } from './siteContent.js';

test('homepage replaces invented metrics with verified product facts', () => {
  assert.deepEqual(HOME_FACTS.map((fact) => fact.value), [
    'Canton Network', 'Non-custodial', 'Extension 1.0.2', 'Open-source SDK',
  ]);
  assert.doesNotMatch(JSON.stringify(HOME_FACTS), /1000\+|99\.99%|active users|uptime/i);
});

test('homepage lists only current wallet workflows', () => {
  assert.deepEqual(USER_CAPABILITIES.map((item) => item.title), [
    'Canton asset visibility', 'Send and receive', 'Offer management',
    'Clear approvals', 'Preapproved receiving', 'dApp connections',
  ]);
  assert.doesNotMatch(JSON.stringify({ USER_CAPABILITIES, WALLET_STEPS, SECURITY_POINTS }), /NFT|collectibles|more network support|low fees/i);
});
