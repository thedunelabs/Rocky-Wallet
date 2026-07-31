# Rocky Wallet GitBook Documentation Design

## Goal

Create an original English documentation site for Rocky Wallet that is suitable for GitBook, accurately reflects Wallet Extension, Wallet Backend, and DApp SDK version 1.0.2, and can be maintained from the `Rocky-exchange/rocky-wallet-document` repository.

## Audience

The documentation serves two audiences:

1. Wallet users who need to install, create, recover, fund, and safely operate Rocky Wallet.
2. DApp developers who need to detect the Extension, connect accounts, read assets and balances, request signatures, and submit transfers through the public SDK boundary.

User guidance appears first in the navigation. Developer material is isolated in a dedicated section.

## Information Architecture

The GitBook will use the following public structure:

```text
README.md
SUMMARY.md
.gitbook.yaml

getting-started/
  install-extension.md
  create-wallet.md
  import-wallet.md
  backup-recovery-phrase.md

using-the-wallet/
  home-and-assets.md
  send-assets.md
  receive-assets.md
  offers.md
  transaction-history.md
  accounts-and-address-book.md

permissions-and-security/
  receive-preapproval.md
  transaction-confirmation.md
  wallet-security.md
  recovery-and-reset.md

supported-assets.md
troubleshooting.md
faq.md

developers/
  README.md
  install-sdk.md
  connect-wallet.md
  assets-and-balances.md
  signing-and-transfers.md
  api-reference.md
  security-boundaries.md

assets/images/
```

`SUMMARY.md` is the canonical public navigation. `.gitbook.yaml` points GitBook to the repository root, `README.md`, and `SUMMARY.md`. Internal planning files remain outside `SUMMARY.md`.

## Content Model

Each procedural user page contains, where applicable:

1. A short explanation of the feature.
2. Prerequisites.
3. Numbered steps.
4. A concise explanation of what happens in the wallet or on Canton Network.
5. A security note.
6. Common failure guidance.
7. A link to the next relevant page.

Developer pages include copyable examples with fake application names, party IDs, amounts, and asset IDs. Examples never contain a real bearer token, private key, recovery phrase, password, or production account identifier.

## Source of Truth

- Wallet Extension code and localization text define current user-visible features and terminology.
- Wallet SDK runtime, TypeScript declarations, tests, and README define the public DApp integration contract.
- Wallet Backend public response models define asset descriptors, balance metadata, and receive-preapproval state.
- Cantex documentation informs only the overall documentation depth and navigation style. Rocky Wallet copy is written from scratch.

The first release documents version 1.0.2. Historical compatibility references may appear only where developers need them to understand legacy Extension behavior.

## Security Boundaries

The documentation must clearly state that:

- Recovery phrases, private keys, and wallet passwords stay inside the Extension.
- DApps request signatures but do not receive signing keys.
- Users review and approve sensitive wallet actions in Extension-owned UI.
- Receive-preapproval enable and disable actions are Extension-owned permission flows and are not exposed by the public DApp SDK.
- Existing pending Offers remain manual even after receive preapproval is enabled.
- Users should verify the destination party ID, asset, amount, and fee before confirming a transfer.

## Scope Exclusions

The initial release does not include:

- Unverified Chrome Web Store installation links.
- Team biographies, legal terms, financial promises, or roadmap claims.
- Backend administration, deployment, database, or private API documentation.
- Real wallet credentials or production authentication examples.
- UI screenshots that are likely to become stale. Stable Extension-owned logos and illustrations may be reused.

## Validation

Before publishing:

1. Verify every `SUMMARY.md` target exists.
2. Verify relative Markdown and image links resolve.
3. Check code examples against SDK 1.0.2 method names and types.
4. Scan for placeholders and sensitive credential patterns.
5. Run `git diff --check`.
6. Review the final Git diff before committing and pushing `main`.

GitBook publication itself is handled by the existing repository integration after GitHub receives the commit.

## References

- Cantex documentation: https://docs.cantex.io/
- Rocky Wallet documentation domain: https://extension-doc.rocky.exchange/
- Rocky Wallet Extension: https://github.com/Rocky-exchange/rocky-wallet-extension
- Rocky Wallet SDK: https://github.com/Rocky-exchange/rocky-wallet-sdk
- Rocky Wallet Backend: https://github.com/Rocky-exchange/rocky-wallet-backend
