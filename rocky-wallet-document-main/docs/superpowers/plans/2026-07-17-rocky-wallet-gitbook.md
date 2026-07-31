# Rocky Wallet GitBook Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish an original English GitBook documentation set for Rocky Wallet users and DApp developers, aligned with Wallet Extension, Wallet Backend, and SDK version 1.0.2.

**Architecture:** The repository root is the GitBook content root, with `README.md` as the landing page and `SUMMARY.md` as the canonical navigation. Focused Markdown pages separate end-user workflows, security guidance, asset behavior, troubleshooting, and developer integration. A dependency-free Node test verifies the full page inventory, navigation, relative links, sensitive-string exclusions, and the SDK 1.0.2 contract before the documentation is pushed to `main`.

**Tech Stack:** GitBook Markdown, GitBook `.gitbook.yaml`, Node.js built-in test runner, Rocky Wallet Extension 1.0.2, `@rocky-wallet/dapp-sdk` 1.0.2, Git, GitHub.

---

### Task 1: Lock the GitBook structure with a failing documentation test

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `test/documentation.test.mjs`

- [ ] **Step 1: Create package metadata and the validation command**

Create `package.json`:

```json
{
  "name": "rocky-wallet-document",
  "version": "1.0.2",
  "private": true,
  "description": "Rocky Wallet user and DApp developer documentation.",
  "scripts": {
    "test": "node --test"
  },
  "engines": {
    "node": ">=20"
  }
}
```

Create `.gitignore`:

```gitignore
.DS_Store
node_modules/
*.log
```

- [ ] **Step 2: Add a failing test for the complete public page inventory**

Create `test/documentation.test.mjs` with this complete test:

```js
import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const publicPages = [
  "README.md",
  "getting-started/install-extension.md",
  "getting-started/create-wallet.md",
  "getting-started/import-wallet.md",
  "getting-started/backup-recovery-phrase.md",
  "using-the-wallet/home-and-assets.md",
  "using-the-wallet/send-assets.md",
  "using-the-wallet/receive-assets.md",
  "using-the-wallet/offers.md",
  "using-the-wallet/transaction-history.md",
  "using-the-wallet/accounts-and-address-book.md",
  "permissions-and-security/receive-preapproval.md",
  "permissions-and-security/transaction-confirmation.md",
  "permissions-and-security/wallet-security.md",
  "permissions-and-security/recovery-and-reset.md",
  "supported-assets.md",
  "troubleshooting.md",
  "faq.md",
  "developers/README.md",
  "developers/install-sdk.md",
  "developers/connect-wallet.md",
  "developers/assets-and-balances.md",
  "developers/signing-and-transfers.md",
  "developers/api-reference.md",
  "developers/security-boundaries.md",
];

test("GitBook contains every approved public page", async () => {
  for (const page of publicPages) {
    await access(resolve(root, page));
  }
});

test("SUMMARY lists every public page exactly once", async () => {
  const summary = await read("SUMMARY.md");
  const targets = [...summary.matchAll(/\]\(([^)]+\.md)\)/g)].map((match) => match[1]);
  assert.deepEqual(targets.sort(), [...publicPages].sort());
});

test("all relative Markdown and image links resolve", async () => {
  const files = await markdownFiles(root);
  for (const file of files) {
    const source = await readFile(file, "utf8");
    for (const match of source.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = match[1].split("#", 1)[0].trim();
      if (!target || /^(https?:|mailto:)/.test(target)) continue;
      await access(resolve(dirname(file), decodeURIComponent(target)));
    }
  }
});

test("documentation contains no unfinished copy or credential-shaped examples", async () => {
  const files = await markdownFiles(root);
  const source = (await Promise.all(files.map((file) => readFile(file, "utf8")))).join("\n");
  assert.doesNotMatch(source, /\b(?:TBD|TODO)\b|coming soon/i);
  assert.doesNotMatch(source, /\bghp_[A-Za-z0-9]{20,}\b/);
  assert.doesNotMatch(source, /Authorization:\s*Bearer\s+[A-Za-z0-9._~-]{20,}/i);
  assert.doesNotMatch(source, /(?:private[_ -]?key|recovery[_ -]?phrase)\s*[:=]\s*["'][^"']{16,}["']/i);
});

test("developer documentation states the SDK 1.0.2 public security boundary", async () => {
  const install = await read("developers/install-sdk.md");
  const boundary = await read("developers/security-boundaries.md");
  assert.match(install, /@rocky-wallet\/dapp-sdk@1\.0\.2/);
  for (const method of [
    "connect",
    "disconnect",
    "getPrimaryAccount",
    "getCoinsBalance",
    "getAssetCatalog",
    "signMessage",
    "submitCommands",
    "sendTransfer",
    "buildTransfer",
    "getNodeOffers",
  ]) {
    assert.match(boundary, new RegExp(`\\b${method}\\b`));
  }
  assert.match(boundary, /receive preapproval.+Extension-owned/is);
  assert.match(boundary, /does not expose.+rocky_get_receive_preapproval/is);
  assert.match(boundary, /does not expose.+rocky_set_receive_preapproval/is);
});

async function read(relativePath) {
  return readFile(resolve(root, relativePath), "utf8");
}

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.flatMap(async (entry) => {
    if ([".git", "node_modules", "docs"].includes(entry.name)) return [];
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return extname(entry.name) === ".md" ? [path] : [];
  }));
  return nested.flat();
}
```

- [ ] **Step 3: Run the structural test and verify RED**

Run:

```bash
npm test
```

Expected: FAIL because `README.md`, `SUMMARY.md`, and every approved public page do not yet exist.

- [ ] **Step 4: Commit the validation harness**

```bash
git add package.json .gitignore test/documentation.test.mjs
git commit -m "test: define GitBook documentation contract"
```

### Task 2: Create the GitBook shell and stable visual assets

**Files:**
- Create: `.gitbook.yaml`
- Create: `SUMMARY.md`
- Create: `README.md`
- Create: `assets/images/rocky-wallet-icon.png`
- Create: `assets/images/welcome-wallet.png`
- Create: `assets/images/permission-hero.png`
- Create: `assets/images/signature-hero.png`
- Create: `assets/images/backup-private-key.png`

- [ ] **Step 1: Configure the GitBook root**

Create `.gitbook.yaml`:

```yaml
root: ./

structure:
  readme: README.md
  summary: SUMMARY.md
```

- [ ] **Step 2: Create the complete public navigation**

Create `SUMMARY.md` exactly as follows:

```md
# Table of contents

* [Welcome to Rocky Wallet](README.md)

## Getting started

* [Install the Extension](getting-started/install-extension.md)
* [Create a Wallet](getting-started/create-wallet.md)
* [Import a Wallet](getting-started/import-wallet.md)
* [Back Up Your Recovery Phrase](getting-started/backup-recovery-phrase.md)

## Using the wallet

* [Home and Assets](using-the-wallet/home-and-assets.md)
* [Send Assets](using-the-wallet/send-assets.md)
* [Receive Assets](using-the-wallet/receive-assets.md)
* [Offers](using-the-wallet/offers.md)
* [Transaction History](using-the-wallet/transaction-history.md)
* [Accounts and Address Book](using-the-wallet/accounts-and-address-book.md)

## Permissions and security

* [Receive Preapproval](permissions-and-security/receive-preapproval.md)
* [Transaction Confirmation](permissions-and-security/transaction-confirmation.md)
* [Wallet Security](permissions-and-security/wallet-security.md)
* [Recovery and Reset](permissions-and-security/recovery-and-reset.md)

## Reference

* [Supported Assets](supported-assets.md)
* [Troubleshooting](troubleshooting.md)
* [FAQ](faq.md)

## Developers

* [DApp SDK Overview](developers/README.md)
* [Install the SDK](developers/install-sdk.md)
* [Connect to Rocky Wallet](developers/connect-wallet.md)
* [Assets and Balances](developers/assets-and-balances.md)
* [Signing and Transfers](developers/signing-and-transfers.md)
* [API Reference](developers/api-reference.md)
* [Security Boundaries](developers/security-boundaries.md)
```

- [ ] **Step 3: Copy stable Extension-owned images**

Run from the documentation repository:

```bash
mkdir -p assets/images
cp ../rocky-wallet-extension/src/assets/header-wallet-icon.png assets/images/rocky-wallet-icon.png
cp ../rocky-wallet-extension/src/assets/welcome-wallet.png assets/images/welcome-wallet.png
cp ../rocky-wallet-extension/src/assets/permission-hero.png assets/images/permission-hero.png
cp ../rocky-wallet-extension/src/assets/signature-hero.png assets/images/signature-hero.png
cp ../rocky-wallet-extension/src/assets/backup-private-key.png assets/images/backup-private-key.png
```

- [ ] **Step 4: Create the landing page**

Create `README.md` with these exact sections and facts:

```md
# Welcome to Rocky Wallet

Rocky Wallet is a self-custodial browser wallet for Canton Mainnet. It keeps wallet signing material inside the Extension while giving users a focused way to view assets, send and receive tokens, review Offers, and connect to Canton DApps.

![Rocky Wallet](assets/images/welcome-wallet.png)

## What you can do

- Create or import a Canton wallet.
- View configured Canton Coin and Token Standard assets.
- Send assets after reviewing the destination, amount, and network fee.
- Receive assets manually through Offers or enable registrar-wide receive preapproval.
- Review transaction history and manage remembered accounts and contacts.
- Connect supported DApps without sharing your private key or recovery phrase.

## Start here

1. [Install the Extension](getting-started/install-extension.md).
2. [Create a new wallet](getting-started/create-wallet.md) or [import an existing wallet](getting-started/import-wallet.md).
3. [Back up your recovery phrase](getting-started/backup-recovery-phrase.md).
4. Learn how to [receive](using-the-wallet/receive-assets.md) and [send](using-the-wallet/send-assets.md) assets.
5. Review [wallet security](permissions-and-security/wallet-security.md) before connecting a DApp.

## Documentation version

This documentation describes Rocky Wallet Extension, Wallet Backend, and DApp SDK version 1.0.2. Product behavior may change in later releases; always review the confirmation shown by your installed Extension.

> Rocky Wallet is self-custodial. Rocky Exchange cannot recover a lost recovery phrase or private key.
```

- [ ] **Step 5: Run the test and confirm only content pages remain missing**

Run:

```bash
npm test
```

Expected: the page-inventory and link tests still fail because the section pages do not exist; `.gitbook.yaml`, `SUMMARY.md`, `README.md`, and all five image paths resolve.

- [ ] **Step 6: Commit the GitBook shell**

```bash
git add .gitbook.yaml SUMMARY.md README.md assets/images
git commit -m "docs: add GitBook navigation and branding"
```

### Task 3: Write the Getting Started guide

**Files:**
- Create: `getting-started/install-extension.md`
- Create: `getting-started/create-wallet.md`
- Create: `getting-started/import-wallet.md`
- Create: `getting-started/backup-recovery-phrase.md`

- [ ] **Step 1: Write installation guidance without an unverified store URL**

Create `getting-started/install-extension.md` with these headings and instructions:

```md
# Install the Extension

## Before you install

Install Rocky Wallet only from a distribution channel published by Rocky Exchange. Confirm that the Extension is named **Rocky Wallet** and review the requested browser permissions before enabling it.

Rocky Wallet 1.0.2 requires permission to store encrypted wallet data locally, read a recovery phrase when you explicitly paste it, inject the DApp connection bridge into pages, and remove a retired background alarm after an update.

## Open Rocky Wallet

1. Install and enable the Extension in a Chromium-compatible browser.
2. Pin Rocky Wallet to the browser toolbar.
3. Select the Rocky Wallet icon.
4. Choose **Create Wallet** for a new wallet or **Import Wallet** to restore one you already control.

## Verify the installed version

Open **Settings** and find the **Version** row. This documentation describes version **1.0.2**.

## If the Extension does not open

- Reload the Extension from the browser extension manager.
- Close and reopen the popup.
- If a DApp tab was already open during an update, refresh that page before connecting again.

Next: [Create a Wallet](create-wallet.md)
```

- [ ] **Step 2: Write the new-wallet flow**

Create `getting-started/create-wallet.md` covering exactly:

- `# Create a Wallet`
- A prerequisite that the user can securely store a 12-word recovery phrase and choose a unique local password.
- Numbered steps: open Rocky Wallet, choose **Create Wallet**, complete any account-access fields shown, set and confirm the local password, record the generated recovery phrase, complete phrase verification, and enter Home only after backup succeeds.
- An explanation that the password encrypts the local vault but does not replace the recovery phrase.
- A warning that screenshots, cloud notes, chat messages, and email are unsafe recovery-phrase storage.
- A final link to `[Back Up Your Recovery Phrase](backup-recovery-phrase.md)`.

- [ ] **Step 3: Write both supported import paths**

Create `getting-started/import-wallet.md` covering exactly:

- `# Import a Wallet`
- The two choices **Import with Recovery Phrase** and **Import with Private Key**.
- A prerequisite that the imported key must control the Canton party being restored.
- Steps to enter the phrase or private key only inside the Extension, create a new local password, confirm the import, and wait for the wallet account and network state to load.
- A statement that a website, support agent, or DApp must never ask the user to paste either secret.
- Troubleshooting for invalid word count, invalid private-key format, wrong password confirmation, and a party/key mismatch.
- A final link to `[Home and Assets](../using-the-wallet/home-and-assets.md)`.

- [ ] **Step 4: Write recovery-phrase backup guidance**

Create `getting-started/backup-recovery-phrase.md` covering exactly:

- `# Back Up Your Recovery Phrase`
- The `assets/images/backup-private-key.png` illustration.
- Steps to write the 12 words in order, verify the requested words, store the backup offline, and confirm that it can be read before funding the wallet.
- A note that Rocky Wallet keeps an unfinished wallet out of Home until backup verification completes.
- A warning that Rocky Exchange cannot recreate the phrase.
- A final link to `[Receive Assets](../using-the-wallet/receive-assets.md)`.

- [ ] **Step 5: Run link validation for the new section**

Run:

```bash
npm test
```

Expected: the four Getting Started pages pass inventory and link validation; tests still fail only for later missing pages.

- [ ] **Step 6: Commit the Getting Started guide**

```bash
git add getting-started
git commit -m "docs: add Rocky Wallet getting started guide"
```

### Task 4: Document daily wallet workflows

**Files:**
- Create: `using-the-wallet/home-and-assets.md`
- Create: `using-the-wallet/send-assets.md`
- Create: `using-the-wallet/receive-assets.md`
- Create: `using-the-wallet/offers.md`
- Create: `using-the-wallet/transaction-history.md`
- Create: `using-the-wallet/accounts-and-address-book.md`

- [ ] **Step 1: Document Home and dynamic assets**

Create `using-the-wallet/home-and-assets.md` with:

- `# Home and Assets`
- Descriptions of Total Balance, the shortened party ID with copy action, Send, Receive, Assets, History, Offers, and Settings.
- A pull-to-refresh instruction for refreshing balances, prices, history, and Offers.
- An explanation that the quantity label uses the configured display alias when the ledger symbol is an instrument ID, but keeps a normal symbol such as `CC`, `CBTC`, or `USDCx` when available.
- A warning that `$0.00` can mean no current market quote is available and does not prove the token quantity is worthless.
- A final link to `[Supported Assets](../supported-assets.md)`.

- [ ] **Step 2: Document the send review and fee flow**

Create `using-the-wallet/send-assets.md` with:

- `# Send Assets`
- Prerequisites: unlocked wallet, enabled configured asset, exact destination party ID, sufficient asset amount, and sufficient Canton Coin for any displayed network fee.
- Steps: choose **Send**, select the asset, paste or select the recipient, enter the amount, review destination/asset/amount/fee/total debit, confirm, authenticate locally if requested, and wait for the success state.
- A note that one user confirmation can authorize the prepared transfer and its displayed fee legs while the Extension keeps signing keys local.
- Troubleshooting for insufficient balance, insufficient CC fee balance, unsupported asset, invalid party ID, expired preparation, and rejected confirmation.
- A final link to `[Transaction History](transaction-history.md)`.

- [ ] **Step 3: Document receiving and QR use**

Create `using-the-wallet/receive-assets.md` with:

- `# Receive Assets`
- Steps: choose **Receive**, select a supported asset, copy the full Canton party ID or show its QR code, send the exact party ID to the sender, and refresh Home or Offers after submission.
- A note that the short Home label is only a display form; the copy action returns the complete party ID.
- A warning to confirm that the asset is supported before another wallet sends it.
- A comparison: manual incoming transfers appear in Offers and require acceptance; matching future transfers can arrive directly after receive preapproval is enabled.
- Final links to `[Offers](offers.md)` and `[Receive Preapproval](../permissions-and-security/receive-preapproval.md)`.

- [ ] **Step 4: Document Offers without exposing DApp acceptance**

Create `using-the-wallet/offers.md` with:

- `# Offers`
- Definitions for pending, expired, accepted, rejected, and failed incoming Offers.
- Steps to open Offers, inspect sender/asset/amount/expiry, accept or reject only from Extension-owned UI, and authenticate the action when requested.
- A statement that expired Offers remain visible for context but do not show actionable controls and do not count toward the pending badge.
- A statement that unknown or unconfigured assets remain visible but cannot be accepted until exact asset identity is trusted and enabled.
- A warning that enabling receive preapproval does not retroactively accept existing pending Offers.
- A final link to `[Receive Preapproval](../permissions-and-security/receive-preapproval.md)`.

- [ ] **Step 5: Document transaction history semantics**

Create `using-the-wallet/transaction-history.md` with:

- `# Transaction History`
- Descriptions for **Received**, **Transfer**, **Transfer Fee**, and **Received failed** rows.
- An explanation that quantities display a known regular symbol or the configured alias when a raw ledger instrument ID is not user-friendly.
- A note that USD values use the latest available price and may show `$0.00` when pricing is unavailable.
- Steps to open a row and review full sender/recipient, asset identity, amount, fee, update ID, and status when supplied.
- A warning that History is informational and the ledger result is authoritative.
- A final link to `[Troubleshooting](../troubleshooting.md)`.

- [ ] **Step 6: Document remembered accounts and contacts**

Create `using-the-wallet/accounts-and-address-book.md` with:

- `# Accounts and Address Book`
- Steps to open the account selector, switch among remembered accounts, import another controlled address, and unlock the selected account separately.
- A note that an inactive account does not reuse the active account balance snapshot.
- Address Book guidance to save a label with the full party ID, inspect recent recipients, and verify the entire copied ID before sending.
- A warning that contact labels are local convenience data and do not prove counterparty identity.
- A final link to `[Wallet Security](../permissions-and-security/wallet-security.md)`.

- [ ] **Step 7: Run the documentation tests**

Run:

```bash
npm test
```

Expected: all six daily-workflow pages pass inventory and link checks; missing later sections remain the only failures.

- [ ] **Step 8: Commit the daily wallet guide**

```bash
git add using-the-wallet
git commit -m "docs: document Rocky Wallet user workflows"
```

### Task 5: Document permissions, recovery, asset behavior, and support

**Files:**
- Create: `permissions-and-security/receive-preapproval.md`
- Create: `permissions-and-security/transaction-confirmation.md`
- Create: `permissions-and-security/wallet-security.md`
- Create: `permissions-and-security/recovery-and-reset.md`
- Create: `supported-assets.md`
- Create: `troubleshooting.md`
- Create: `faq.md`

- [ ] **Step 1: Explain registrar-wide receive preapproval precisely**

Create `permissions-and-security/receive-preapproval.md` with:

- `# Receive Preapproval`
- The `assets/images/permission-hero.png` illustration.
- A definition: one wallet-level control manages registrar-wide preapproval coverage for every currently configured eligible Token Standard asset, rather than separate per-asset toggles.
- Enable steps: open **Settings > Network Config**, review current registrar coverage, choose **Enable**, confirm the Extension-owned operation, and keep the wallet open while the Extension completes and refreshes required on-chain authorization steps.
- Disable steps: return to Network Config, choose **Disable**, review scope, and confirm.
- State definitions: unavailable, off, partial, processing, on, and stale managed coverage.
- A statement that completed steps remain valid after an interruption and Retry resumes from fresh chain state rather than repeating confirmed work.
- A statement that existing pending Offers stay manual, while matching future incoming transfers can be received directly when coverage is on.
- A statement that the SDK cannot enable or disable this permission.
- A final link to `[Offers](../using-the-wallet/offers.md)`.

- [ ] **Step 2: Document Extension-owned confirmation screens**

Create `permissions-and-security/transaction-confirmation.md` with:

- `# Transaction Confirmation`
- The `assets/images/signature-hero.png` illustration.
- A description of connection, message-signing, transfer, Offer, and permission confirmations.
- A checklist to verify the browser-identified requesting origin, action type, party ID, asset, amount, fee, and human-readable purpose.
- A statement that DApp-provided labels are context only and cannot override the browser-verified origin.
- Guidance to reject unexpected or unclear requests and then disconnect the site if necessary.
- A final link to `[Security Boundaries](../developers/security-boundaries.md)`.

- [ ] **Step 3: Document the local vault security model**

Create `permissions-and-security/wallet-security.md` with:

- `# Wallet Security`
- Definitions of local encrypted vault, wallet password, recovery phrase, private key, and automatic lock.
- A statement that the password unlocks local encrypted material and is never a substitute for the recovery phrase.
- A statement that the Backend stores public account and wallet state but does not receive recovery phrases, private keys, or wallet passwords.
- Safe practices: dedicated browser profile, current browser/Extension, offline backup, origin verification, manual lock on shared devices, and test transfers for new recipients.
- Incident guidance for an exposed password versus an exposed recovery phrase/private key.
- A final link to `[Recovery and Reset](recovery-and-reset.md)`.

- [ ] **Step 4: Document recovery and destructive reset behavior**

Create `permissions-and-security/recovery-and-reset.md` with:

- `# Recovery and Reset`
- Recovery steps using either the recovery phrase or private key inside the Extension.
- An explanation that resetting or deleting the local wallet removes local encrypted wallet data and remembered state from that browser.
- A warning to verify an offline recovery backup before deleting local data.
- A statement that deleting local data does not reverse completed Canton transactions and does not make Rocky Exchange capable of restoring lost keys.
- A final link to `[Import a Wallet](../getting-started/import-wallet.md)`.

- [ ] **Step 5: Document configured and unknown asset behavior**

Create `supported-assets.md` with:

- `# Supported Assets`
- Sections for Canton Coin and configured Token Standard assets.
- Examples `CC`, `USDCx`, `CBTC`, and `CUSD`, clearly labeled as examples whose availability depends on current Backend configuration.
- An explanation of canonical asset ID, raw ledger symbol/instrument ID, configured display alias, decimals, enabled state, send/receive capability, logo, and price mode.
- A statement that a normal symbol remains visible, while an instrument-ID-shaped symbol is replaced with the exact configured display alias.
- A statement that unknown Token Standard holdings remain visible as unverified and cannot be sent or accepted until exact identity is configured.
- A statement that `$0.00` can represent an unavailable quote; quantities and exact asset identity remain independent of price display.
- Final links to `[Home and Assets](using-the-wallet/home-and-assets.md)` and `[Assets and Balances](developers/assets-and-balances.md)`.

- [ ] **Step 6: Write actionable troubleshooting**

Create `troubleshooting.md` with separate symptom/cause/action subsections for:

- Extension popup does not respond after reload.
- A DApp cannot detect Rocky Wallet after an Extension update.
- A bottom navigation tab does not update.
- Balance or price appears stale.
- An asset shows `$0.00`.
- An asset is unverified or unavailable to send.
- Receive preapproval is unavailable, partial, or interrupted.
- An Offer expired.
- A transfer cannot cover the Canton Coin fee.
- A wallet cannot unlock or import.

For reload issues, require Extension reload followed by refreshing the DApp page. Never advise deleting local wallet data before verifying the recovery backup.

- [ ] **Step 7: Write a concise FAQ**

Create `faq.md` with questions and direct answers for:

- Is Rocky Wallet self-custodial?
- Can Rocky Exchange recover my wallet?
- Why is my Canton party ID long?
- Why does Home shorten the party ID?
- Why does an asset price show `$0.00`?
- What is an Offer?
- Does receive preapproval accept existing Offers?
- Can a DApp turn on receive preapproval?
- Which assets are supported?
- Where can I find the Extension version?
- What should I do before resetting the wallet?

End with links to `[Troubleshooting](troubleshooting.md)` and `[Wallet Security](permissions-and-security/wallet-security.md)`.

- [ ] **Step 8: Run the documentation tests**

Run:

```bash
npm test
```

Expected: user, security, reference, and support pages pass; developer pages remain the only missing inventory failures.

- [ ] **Step 9: Commit security and reference documentation**

```bash
git add permissions-and-security supported-assets.md troubleshooting.md faq.md
git commit -m "docs: add wallet security and support reference"
```

### Task 6: Write the DApp SDK developer guide

**Files:**
- Create: `developers/README.md`
- Create: `developers/install-sdk.md`
- Create: `developers/connect-wallet.md`
- Create: `developers/assets-and-balances.md`
- Create: `developers/signing-and-transfers.md`
- Create: `developers/api-reference.md`
- Create: `developers/security-boundaries.md`

- [ ] **Step 1: Create the developer overview**

Create `developers/README.md` with:

- `# Rocky Wallet DApp SDK`
- A statement that `@rocky-wallet/dapp-sdk` connects browser DApps to the injected Rocky Wallet Extension provider.
- A five-step integration flow: install SDK, detect provider, connect, read account/assets, request Extension-owned confirmations.
- A note that the SDK never imports wallet keys and does not provide Backend credentials.
- Links to every page in the Developers section.

- [ ] **Step 2: Document deterministic SDK installation**

Create `developers/install-sdk.md` with this command and facts:

````md
# Install the SDK

## Requirements

- A browser environment with Rocky Wallet Extension 1.0.2 or later.
- Node.js 20 or later for the SDK package and its tests.
- A DApp served from an origin the user can identify in the wallet confirmation.

## Install version 1.0.2

```bash
npm install @rocky-wallet/dapp-sdk@1.0.2
```

## Import the SDK

```js
import {
  MINIMAL_CAPABLE_VERSION,
  RockyWalletError,
  createRockyWalletSdk,
  rockyWallet,
} from "@rocky-wallet/dapp-sdk";

console.log(MINIMAL_CAPABLE_VERSION); // 1.0.2
```

Use the `rockyWallet` singleton for a standard browser integration. Use `createRockyWalletSdk({ provider })` when tests or an application shell provide the provider explicitly.

Next: [Connect to Rocky Wallet](connect-wallet.md)
````

- [ ] **Step 3: Document provider detection and connection**

Create `developers/connect-wallet.md` with this complete example:

```js
import { RockyWalletError, rockyWallet } from "@rocky-wallet/dapp-sdk";

export async function connectRockyWallet() {
  const availability = await rockyWallet.checkExtensionAvailability({ timeoutMs: 1500 });
  if (availability.status !== "installed") {
    throw new Error("Rocky Wallet Extension is not installed");
  }
  if (!availability.isExtensionCapableByVersion) {
    throw new Error(`Rocky Wallet ${availability.minimalCapableVersion} or later is required`);
  }

  try {
    const connection = await rockyWallet.connect({
      name: "Example Canton DApp",
      icon: "https://example.invalid/icon.png",
      target: "local",
    });
    if (!connection.isConnected || !connection.account) {
      throw new Error(connection.reason || "Rocky Wallet connection was not approved");
    }
    return connection.account;
  } catch (error) {
    if (error instanceof RockyWalletError && error.code === 4001) {
      throw new Error("The user rejected the Rocky Wallet request");
    }
    throw error;
  }
}
```

Also document `disconnect()`, `getPrimaryAccount()`, `getActiveAccount()`, `getAccounts()`, `getActiveNetwork()`, `isConnected()`, and the `rockyWallet#initialized` injection event behavior.

- [ ] **Step 4: Document exact asset identity and balance metadata**

Create `developers/assets-and-balances.md` with this example:

```js
import { rockyWallet } from "@rocky-wallet/dapp-sdk";

const account = await rockyWallet.getPrimaryAccount();
if (!account) throw new Error("Rocky Wallet is not connected");

const [catalog, balances] = await Promise.all([
  rockyWallet.getAssetCatalog(),
  rockyWallet.getCoinsBalance({ party: account.partyId }),
]);

for (const balance of balances.tokens || []) {
  const descriptor = catalog.find((asset) => asset.asset_id === balance.asset_id);
  console.log({
    assetId: balance.asset_id,
    amount: balance.amount,
    symbol: balance.symbol,
    displayAlias: descriptor?.display_alias ?? balance.display_alias,
    usdPrice: balance.usd_price ?? balance.price_usd ?? balance.priceUsd,
    usdValue: balance.usd_value,
  });
}
```

Explain that exact `asset_id` is preferred, Token Standard identity may include `instrument_admin` and `instrument_id`, `display_alias` is nullable, `decimals` is nullable for unknown assets, and an open response index allows additive Backend fields. State that applications must not identify a Token Standard asset by display symbol alone.

- [ ] **Step 5: Document signing and transfers without secrets**

Create `developers/signing-and-transfers.md` with these examples:

```js
import { rockyWallet } from "@rocky-wallet/dapp-sdk";

const signature = await rockyWallet.signMessage({
  message: { hex: "0x5369676e20696e20746f204578616d706c652044417070" },
  metaData: {
    app: "Example Canton DApp",
    purpose: "authentication",
  },
});
```

```js
const result = await rockyWallet.transfer({
  asset_id: "example-cusd-mainnet",
  symbol: "CUSD",
  to: "recipient-party::example-fingerprint",
  amount: "1.25",
  memo: "Invoice 1042",
});
```

Explain that `buildTransfer()` prepares reviewable data, `sendTransfer()` requests an Extension-owned transfer flow, `submitCommands()` is retained for compatible command requests, legacy positional `transfer(to, amount, instrument, options)` supports `CC`, `USDCx`, and `CBTC`, and applications must never add wallet password, private key, recovery phrase, or signed-payload fields to requests.

- [ ] **Step 6: Create a compact API reference**

Create `developers/api-reference.md` with tables covering:

- Availability and connection: `checkExtensionAvailability`, `getWalletVersion`, `connect`, `disconnect`, `isConnected`, `status`.
- Accounts and network: `getPrimaryAccount`, `getActiveAccount`, `getAccounts`, `getActiveNetwork`, `getWalletMetadata`.
- Assets: `getCoinsBalance`, `getBalance`, `getCoinsList`, `getAssetCatalog`.
- Signing and transfers: `signMessage`, `signLoginChallenge`, `submitCommands`, `buildTransfer`, `sendTransfer`, and both `transfer` overloads.
- Offers: `getOffers` and `getNodeOffers`; document `submitInstructionChoice` as a Console-compatibility method that page-originated acceptance is expected to have rejected by the Extension.
- Events: `onAccountsChanged`, `onConnectionStatusChanged`, and `onTxStatusChanged`.
- Utilities: `equalBytes`, `base64ToBytes`, `base64ToHex`, `toBase64`, `utf8ToBytes`, `bytesToHex`, and `replaceBigIntsWithStrings`.
- `RockyWalletError` codes `4001`, `4200`, `4900`, and `-32602` with their user-rejection, unsupported-method, disconnected, and invalid-parameter meanings.

Each row must include signature, purpose, and notable failure behavior.

- [ ] **Step 7: Document the exact page-to-Extension security boundary**

Create `developers/security-boundaries.md` with:

- `# Security Boundaries`
- The exact content-script public allow-list: `connect`, `disconnect`, `getPrimaryAccount`, `getCoinsBalance`, `getAssetCatalog`, `signMessage`, `submitCommands`, `sendTransfer`, `buildTransfer`, and `getNodeOffers`.
- An explanation that provider helpers such as `getActiveNetwork` and legacy `transfer` are local provider conveniences that resolve to public behavior.
- A statement that page-originated Offer acceptance is rejected and users act through Extension-owned UI.
- These exact sentences:

```md
Receive preapproval is an Extension-owned permission and signing flow. The public DApp SDK does not expose `rocky_get_receive_preapproval` or `rocky_set_receive_preapproval`.

The SDK does not import signing keys, does not accept wallet secrets, and does not submit an arbitrary DApp-supplied signed transfer payload.
```

- A table assigning responsibility to DApp, injected provider, content-script allow-list, Extension background/local vault, and Wallet Backend.
- A secure-integration checklist covering verified origin, minimal request data, user rejection, exact asset ID, no secrets, and no hidden retries after rejection.

- [ ] **Step 8: Run the complete documentation test and verify GREEN**

Run:

```bash
npm test
```

Expected: all five tests pass with zero failures.

- [ ] **Step 9: Commit the developer guide**

```bash
git add developers
git commit -m "docs: add Rocky Wallet DApp SDK guide"
```

### Task 7: Perform final editorial, link, and publication checks

**Files:**
- Verify: every Markdown file listed in `SUMMARY.md`
- Verify: `.gitbook.yaml`
- Verify: `assets/images/`
- Verify: `package.json`

- [ ] **Step 1: Compare developer names with SDK 1.0.2 source**

Run from the parent `rocky` directory:

```bash
rg -n "MINIMAL_CAPABLE_VERSION|async (checkExtensionAvailability|getWalletVersion|connect|disconnect|getPrimaryAccount|getAssetCatalog|getCoinsBalance|signMessage|submitCommands|buildTransfer|sendTransfer|transfer|getNodeOffers)" rocky-wallet-sdk/src/index.js
rg -n "PUBLIC_DAPP_METHODS|rocky_get_receive_preapproval|rocky_set_receive_preapproval" rocky-wallet-extension/src
```

Expected: documented public names match SDK methods; receive-preapproval runtime methods appear only inside the Extension and not in the SDK.

- [ ] **Step 2: Run all lightweight documentation validation**

Run:

```bash
npm test
git diff --check
git status --short
```

Expected: five tests pass, no whitespace errors are reported, and only intended documentation files are visible before the final commit.

- [ ] **Step 3: Inspect navigation and headings**

Run:

```bash
rg -n '^# ' README.md getting-started using-the-wallet permissions-and-security developers supported-assets.md troubleshooting.md faq.md
sed -n '1,240p' SUMMARY.md
```

Expected: every public page has exactly one level-one heading and every approved page appears once in navigation.

- [ ] **Step 4: Review the complete diff for original wording and safe examples**

Run:

```bash
git diff --stat HEAD~5..HEAD
git log --oneline --decorate -8
rg -n "Cantex|ghp_|Authorization: Bearer|BEGIN PRIVATE KEY|recoveryPhrase\s*[:=]" . --glob '!docs/superpowers/**'
```

Expected: public copy contains no Cantex wording, GitHub tokens, bearer tokens, PEM private keys, or assigned recovery-phrase examples.

- [ ] **Step 5: Commit any editorial corrections explicitly**

If Step 4 finds a factual, grammar, or link correction, edit only the affected page with `apply_patch`, rerun `npm test`, then commit:

```bash
git add README.md SUMMARY.md .gitbook.yaml getting-started using-the-wallet permissions-and-security developers supported-assets.md troubleshooting.md faq.md assets/images package.json .gitignore test
git commit -m "docs: polish Rocky Wallet GitBook content"
```

If no correction is needed, do not create an empty commit.

- [ ] **Step 6: Push the approved documentation to GitHub main**

Verify GitHub authentication and the exact remote:

```bash
gh auth status
git remote get-url origin
git status --short --branch
```

Expected: authentication succeeds, origin is `https://github.com/Rocky-exchange/rocky-wallet-document.git`, and the worktree is clean.

Push:

```bash
git push -u origin main
```

Expected: GitHub accepts the new `main` history and the GitBook repository integration can publish it to `https://extension-doc.rocky.exchange/`.
