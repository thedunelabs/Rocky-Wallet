# Assets and Balances

Fetch the account, catalog, and balances, then join rows only by the exact `asset_id`:

```ts
import { rockyWallet } from "@rocky-wallet/dapp-sdk";

const account = await rockyWallet.getPrimaryAccount();
if (!account) throw new Error("Connect Rocky Wallet before reading balances");

const [catalog, balanceResponse] = await Promise.all([
  rockyWallet.getAssetCatalog(),
  rockyWallet.getCoinsBalance({ party: account.partyId }),
]);

const catalogByAssetId = new Map(
  catalog
    .filter((asset) => asset.asset_id !== null)
    .map((asset) => [asset.asset_id, asset]),
);

for (const balance of balanceResponse.tokens ?? balanceResponse.items ?? []) {
  const asset = balance.asset_id
    ? catalogByAssetId.get(balance.asset_id)
    : undefined;

  console.log({
    asset_id: balance.asset_id ?? null,
    amount: balance.amount ?? "0",
    symbol: asset?.symbol ?? balance.symbol,
    display_alias: asset?.display_alias ?? balance.display_alias ?? null,
    usd_price:
      balance.usd_price ?? balance.price_usd ?? balance.priceUsd ?? null,
    usd_value: balance.usd_value ?? null,
  });
}
```

`getCoinsBalance()` returns the Backend response with normalized `tokens`; the response can also expose additive Backend collections and fields. `getAssetCatalog()` normalizes an array response or the Backend's `{ items }`/`{ assets }` shape into an array. The TypeScript response, balance, and descriptor types have open index signatures, so a minor Backend addition does not require unsafe casting. Code should still branch explicitly before relying on an additive field.

## Asset identity

Prefer the exact Backend-issued `asset_id` for joins, selection, and transfer requests. A configured Token Standard descriptor can also include `instrument_admin` and `instrument_id`, but those registry identity fields are descriptive and are not a substitute for `asset_id` in a DApp transfer.

Never identify a Token Standard asset by display symbol alone. Multiple assets can share a symbol, while unknown holdings use `asset_id: null`, `symbol: "UNVERIFIED"`, `display_alias: null`, and `decimals: null`. A configured descriptor normally has a non-null alias and decimal count, but consumers must retain the declared null handling for unknown assets.

Balance rows may contain all of these price spellings in 1.0.2:

- `priceUsd`
- `price_usd`
- `usd_price`
- `usd_value`

The example reads them without treating a missing price as zero.

Catalog descriptors instead describe the pricing policy with fields such as `price_mode`, `fixed_price_usd`, and `ticker_pair`.

## Extension display unit

The Extension's display-unit rule is separate from asset identity. It preserves the raw `symbol` unless the strict comparison `symbol === instrument_id` succeeds; in that case it may display the exact `display_alias`. If no symbol exists, the alias is a final display fallback. This rule affects labels only and must never be used to match assets.
