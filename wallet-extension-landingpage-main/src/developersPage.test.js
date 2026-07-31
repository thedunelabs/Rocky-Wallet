import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('developer page publishes SDK and extension security boundaries', async () => {
  const source = await readFile(new URL('./DevelopersPage.jsx', import.meta.url), 'utf8');
  assert.match(source, /SDK_INSTALL_COMMAND/);
  assert.match(source, /SITE_VERSIONS\.sdk/);
  assert.match(source, /window\.rockyWallet/);
  assert.match(source, /The dApp requests\. Rocky Wallet approves\./);
  assert.match(source, /PUBLIC_LINKS\.docs/);
  assert.match(source, /PUBLIC_LINKS\.npm/);
  assert.match(source, /PUBLIC_LINKS\.sdkGitHub/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
  assert.match(source, /DEVELOPER_STEPS/);
  assert.match(source, /DEVELOPER_CAPABILITIES/);
  assert.doesNotMatch(source, /@console-wallet\/dapp-sdk/);
  assert.doesNotMatch(source, /submitInstructionChoice/);
});

test('application renders the dedicated developer route', async () => {
  const source = await readFile(new URL('./App.jsx', import.meta.url), 'utf8');
  assert.match(source, /import DevelopersPage from '\.\/DevelopersPage\.jsx'/);
  assert.match(source, /if \(route === 'developers'\) return <DevelopersPage \/>/);
});
