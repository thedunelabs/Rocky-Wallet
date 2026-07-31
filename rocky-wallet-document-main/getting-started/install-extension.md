# Install the Extension

Rocky Wallet is a self-custodial browser Extension for accessing your wallet on Canton Mainnet.

## Before you install

Install Rocky Wallet only from the [official Rocky Wallet Chrome Web Store listing](https://chromewebstore.google.com/detail/rocky-wallet/mgafpjfkpppnmpcdfpjghcajhpljomcn). Before approving the installation, confirm that the product name is **Rocky Wallet**, the listing URL contains Extension ID `mgafpjfkpppnmpcdfpjghcajhpljomcn`, and the browser permissions match the purposes below.

Rocky Wallet Extension 1.0.2 uses browser permissions for these purposes:

- **Local encrypted data storage:** stores the encrypted wallet vault and Extension settings in browser storage.
- **Clipboard access:** reads the clipboard when you choose an explicit **Paste** action for recovery data or a transfer recipient.
- **DApp bridge injection:** injects a content script and bridge on all HTTP and HTTPS pages so supported DApps can discover Rocky Wallet. The bridge forwards only allow-listed public wallet methods; sensitive approvals remain Extension-owned.
- **Background alarm cleanup:** removes a retired background alarm that may remain after an update from an earlier version.

## Open Rocky Wallet

1. Install and enable Rocky Wallet in a Chromium-compatible browser using an approved distribution channel.
2. Open the browser's Extensions menu and pin Rocky Wallet for easier access.
3. Select the Rocky Wallet icon to open the Extension.
4. Select **Create Wallet** for a new wallet or **Import Wallet** to restore an existing wallet.

## Verify the installed version

In Rocky Wallet, open **Settings** and find **Version**. The official Chrome Web Store release and these docs describe version **1.0.2**.

## If the Extension does not open

1. Open the browser's extension manager and reload Rocky Wallet.
2. Close and reopen the Rocky Wallet popup.
3. If Rocky Wallet was recently updated, refresh any DApp page that was already open so it can load the current DApp bridge.

Next: [Create a Wallet](create-wallet.md)
