# Rocky Wallet DApp SDK

Rocky Wallet DApp SDK lets browser dApps connect to the Rocky Wallet Chrome extension
through the provider injected at `window.rockyWallet`.

## Install

```bash
npm install @rocky-wallet/dapp-sdk
```

For local development in this repo, install from the folder:

```bash
npm install ../rocky-wallet-sdk
```

## Usage

Loop-style lifecycle API:

```ts
import { rocky } from "@rocky-wallet/dapp-sdk";

rocky.init({
  appName: "Rocky Exchange",
  onAccept: (provider) => {
    console.log("Rocky Wallet connected", provider.version);
  },
  onReject: () => {
    console.warn("Rocky Wallet request rejected");
  },
});

await rocky.connect({
  icon: "https://demo.rocky.exchange/icon.png",
  target: "local",
});

const account = await rocky.getPrimaryAccount();
await rocky.wallet.transfer("Rocky::party", "1", "CC", {
  memo: "hello",
});

await rocky.wallet.transfer("Cantex::party", "0.0001", "CBTC", {
  memo: "cBTC payment",
});

// Generic Canton Token Standard assets are discovered from the wallet catalog
// and transferred by the backend-issued asset_id.
const assets = await rocky.getAssetCatalog();
const cusd = assets.find((asset) => asset.symbol === "CUSD" && asset.can_send);
if (cusd) {
  await rocky.wallet.transfer({
    asset_id: cusd.asset_id,
    symbol: cusd.symbol,
    to: "Cantex::party",
    amount: "0.1",
  });
}

// For explicit transaction flows, the provider may expose backend relay steps.
// Signing still happens inside the Rocky Wallet extension.
const unsigned = await rocky.wallet.buildTransfer({
  fromParty: account?.partyId,
  toAddress: "Rocky::party",
  assetSymbol: "CC",
  amount: "1",
});

await rocky.wallet.sendTransfer({
  to: "Rocky::party",
  token: "CC",
  amount: "1",
});
```

## Assets And Compatibility

`getAssetCatalog()` returns the assets currently enabled in the Rocky Wallet dashboard.
Configured Canton Token Standard assets are identified by `asset_id`; dApps must use that
ID for generic transfers and must not submit `instrument_admin` or `instrument_id` values.

The SDK still exports `ROCKY_ASSET_SYMBOLS` for the legacy extension contract:

- `CC`
- `USDCx`
- `CBTC`

For positional `transfer()` calls, `BTC`, `cBTC`, `CBTC`, and instrument objects whose `id` or
`instrument_id` contains `BTC` are normalized to the canonical `CBTC` symbol before
the request is sent to the Rocky Wallet provider. Unknown positional symbols are rejected;
they are never aliased to `CC`.

Chrome Web Store extension `1.0.0` does not expose `getAssetCatalog()` and supports only
the legacy `CC`, `USDCx`, and `CBTC` positional transfer path. Feature-detect the provider
before enabling generic assets:

```ts
const supportsDynamicAssets =
  typeof window.rockyWallet?.getAssetCatalog === "function";
```

Calling the SDK's `getAssetCatalog()` against an older provider rejects with
`RockyWalletError` code `4200`; legacy positional transfers continue to work.

Console-compatible flat API:

```ts
import { rockyWallet } from "@rocky-wallet/dapp-sdk";

const availability = await rockyWallet.checkExtensionAvailability();
if (availability.status !== "installed") {
  throw new Error("Rocky Wallet extension is not installed");
}

await rockyWallet.connect({
  name: "Rocky Exchange",
  icon: "https://demo.rocky.exchange/icon.png",
  target: "local",
});

const account = await rockyWallet.getPrimaryAccount();
const balance = await rockyWallet.getCoinsBalance({
  party: account?.partyId,
  network: "CANTON_NETWORK",
});

const signature = await rockyWallet.signMessage({
  message: { hex: "0x68656c6c6f" },
  metaData: {
    app: "Rocky Exchange",
    purpose: "authentication",
  },
});
```

## API Surface

The SDK exposes a `rockyWallet` object with Console-style method names:

- `checkExtensionAvailability()`
- `connect({ name, icon, target })`
- `disconnect()`
- `isConnected()`
- `status()`
- `getAccounts()`
- `getPrimaryAccount()`
- `getActiveAccount()`
- `getActiveNetwork()`
- `getWalletVersion()`
- `getWalletMetadata()`
- `getCoinsBalance(data)`
- `getBalance(data)`
- `getCoinsList(data)`
- `getAssetCatalog()`
- `signMessage(data)`
- `submitCommands(data)`
- `buildTransfer(data)`
- `sendTransfer(data)`
- `transfer({ asset_id, symbol, to, amount, memo })`
- `transfer(to, amount, instrument, options)` (legacy)
- `getOffers(data)`
- `getNodeOffers(data)`
- `submitInstructionChoice(data)`
- `onAccountsChanged(callback)`
- `onConnectionStatusChanged(callback)`
- `onTxStatusChanged(callback)`

Unsupported Console SDK methods are present and reject with `RockyWalletError` code `4200`.
This keeps migrations explicit while avoiding silent no-ops.

`submitInstructionChoice` is exposed only for Console API compatibility. The Rocky
Wallet extension rejects page-originated offer accept/reject requests; users must perform
those actions through extension-owned UI or an explicitly enabled extension workflow.

The SDK also exposes a Loop-inspired `rocky` client and `createRockyWalletClient()` factory:

- `rocky.init({ appName, onAccept, onReject })`
- `rocky.connect({ icon, target })`
- `rocky.autoConnect()`
- `rocky.disconnect()`
- `rocky.provider`
- `rocky.getAssetCatalog()`
- `rocky.wallet.transfer({ asset_id, symbol, to, amount, memo })`
- `rocky.wallet.transfer(to, amount, instrument, options)` (legacy)
- `rocky.wallet.signMessage(data)`
- `rocky.wallet.submitCommands(data)`
- `rocky.wallet.buildTransfer(data)`
- `rocky.wallet.sendTransfer(data)`
- `rocky.wallet.getCoinsBalance(data)`

## Extension Contract

The SDK expects the Rocky Wallet extension content script to inject:

```ts
window.rockyWallet = {
  isRockyWallet: true,
  version: "1.0.2",
  connect,
  disconnect,
  getPrimaryAccount,
  getActiveNetwork,
  getCoinsBalance,
  getAssetCatalog,
  signMessage,
  submitCommands,
  buildTransfer,
  sendTransfer,
  transfer,
  getNodeOffers,
  submitInstructionChoice,
};
```

SDK `1.0.2` treats Extension `1.0.2` as the minimum fully capable release.

Receive-preapproval enable/disable remains an Extension-owned permission flow. The dApp
SDK does not expose the private `rocky_get_receive_preapproval` or
`rocky_set_receive_preapproval` runtime methods.

If the SDK loads before the extension provider is injected, it waits for the
`rockyWallet#initialized` browser event before failing availability checks.

The SDK rejects request objects containing common wallet secret field variants such as
`mnemonic`, `seedPhrase`, `privateKeyHex`, `walletPassword`, `recoveryPhrase`, `xprv`,
`wif`, and `keystore`. This is an integration guard, not a security boundary; these values
must stay inside the Rocky Wallet extension vault.

The dApp SDK does not import signing keys or call `crypto.subtle.importKey`; all key use and
transaction signing remain inside the Rocky Wallet extension.

## Utilities

The `utils` export includes parser helpers compatible with Console SDK usage:

- `equalBytes(a, b)`
- `base64ToBytes(base64)`
- `base64ToHex(base64)`
- `toBase64(bytes)`
- `hexToBase64(hex)`
- `hexToBytes(hex)`
- `toHex(bytes)`

## Tests

```bash
npm test
npm run check
```
