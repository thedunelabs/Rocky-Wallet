import assert from 'node:assert/strict';
import test from 'node:test';
import { copyText } from './copyText.js';

test('copies through the supplied Clipboard API', async () => {
  const writes = [];
  const copied = await copyText('npm install @rocky-wallet/dapp-sdk', { writeText: async (value) => writes.push(value) });
  assert.equal(copied, 'npm install @rocky-wallet/dapp-sdk');
  assert.deepEqual(writes, ['npm install @rocky-wallet/dapp-sdk']);
});

test('rejects when clipboard access is unavailable', async () => {
  await assert.rejects(copyText('command', null), /Clipboard access is unavailable/);
});

test('uses the global Clipboard API by default', async () => {
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const writes = [];

  try {
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { clipboard: { writeText: async (value) => writes.push(value) } },
    });
    const copied = await copyText('command');
    assert.equal(copied, 'command');
    assert.deepEqual(writes, ['command']);
  } finally {
    if (originalNavigator) Object.defineProperty(globalThis, 'navigator', originalNavigator);
    else delete globalThis.navigator;
  }
});

test('preserves Clipboard API failures', async () => {
  await assert.rejects(copyText('command', { writeText: async () => { throw new Error('permission denied'); } }), /permission denied/);
});
