# Signing and Transfers

## Sign a message

Pass a hex-encoded UTF-8 message and optional string metadata:

```ts
import { RockyWalletError, rockyWallet } from "@rocky-wallet/dapp-sdk";

try {
  const signature = await rockyWallet.signMessage({
    message: { hex: "0x526f636b7920444170702064656d6f" },
    metaData: {
      app: "Rocky Docs Example",
      purpose: "confirm demo action",
    },
  });

  console.log("Signature returned:", Boolean(signature));
} catch (error) {
  if (error instanceof RockyWalletError && error.code === 4001) {
    console.warn("Signature request rejected");
  } else {
    throw error;
  }
}
```

The injected provider decodes the hex value to UTF-8 before asking the Extension to sign. The Extension-owned signature screen shows the browser-verified origin, account label with a shortened address, network, signature type, the exact decoded message, and a hex data preview. Although metadata can include `app` and `purpose`, Extension 1.0.2 does not display those two metadata fields on that screen.

## Build and send a transfer

Select a sendable asset by exact catalog identity. The recipient below is constructed as an obviously synthetic, structurally valid Canton Party ID; replace it only with a recipient obtained through your application flow.

```ts
import { rockyWallet } from "@rocky-wallet/dapp-sdk";

const account = await rockyWallet.getPrimaryAccount();
if (!account) throw new Error("Connect Rocky Wallet before transferring");

const catalog = await rockyWallet.getAssetCatalog();
const asset = catalog.find((item) => item.asset_id && item.can_send);
if (!asset?.asset_id) throw new Error("No sendable asset is available");

const syntheticRecipient = `docs-recipient::1220${"0".repeat(64)}`;
const request = {
  asset_id: asset.asset_id,
  symbol: asset.symbol,
  to: syntheticRecipient,
  amount: "0.01",
  memo: "docs-example",
};

const built = await rockyWallet.buildTransfer(request);
console.log("Built payload hash:", built.payload_hash);

const submitted = await rockyWallet.sendTransfer(request);
console.log("Transfer submitted:", submitted?.status === true);
```

`buildTransfer(request)` asks the Extension and Backend to resolve and build an unsigned transfer. It does not sign or submit it, and its result can include the normalized recipient, fee fields, and additive Backend fields.

`sendTransfer(request)` starts the Extension-owned review flow for a page-originated request. After approval, the Extension signs its own built payload and submits it. If the provider lacks `sendTransfer`, the SDK falls back to `submitCommands`.

`submitCommands(request)` is the Console-compatible transfer entry point. In Extension 1.0.2 it reaches the same page-origin transfer confirmation and Extension-owned sign-and-submit path as `sendTransfer`.

The object overload `transfer({ asset_id, symbol, to, amount, memo })` is a local SDK convenience. It requires a provider with dynamic-asset support, strips registry identity fields, and routes the normalized request to public `sendTransfer`.

The legacy positional overload remains available:

```ts
await rockyWallet.transfer(
  `docs-recipient::1220${"0".repeat(64)}`,
  "0.01",
  "CC",
  { memo: "legacy-docs-example" },
);
```

Its canonical instrument shortcuts are only `CC`, `USDCx`, and `CBTC`. The resolver maps identifiers containing `USDC` to `USDCx`, identifiers containing `BTC` to `CBTC`, and exact `CC` or `CANTON COIN` to `CC`; other positional symbols reject with `-32602`. Use the object overload and canonical `asset_id` for other Token Standard assets.

## What the transfer review displays

Extension 1.0.2 shows the account label and shortened sender address, catalog-derived token name and display unit, Canton Mainnet, a shortened recipient, amount and available USD estimate, plus fees and estimated total. It does not display the requesting origin, DApp purpose, memo, full Party IDs, canonical `asset_id`, or exact `instrument_admin`/`instrument_id`. A DApp must therefore explain the action before making the request and must not claim that the current wallet screen independently verifies those omitted fields.

Never request or include a wallet password, private key, recovery phrase, arbitrary signature, or DApp-supplied signed transfer payload. The SDK rejects common wallet-secret field names as an integration guard, and the Extension does not expose page-origin signed-payload submission.
