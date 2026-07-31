# Supported Assets

Rocky Wallet separates an asset's exact identity and ledger quantity from its display name and price estimate. Availability is controlled by the current Wallet Backend configuration for the selected network.

## Canton Coin

Canton Coin is the native fee asset and is commonly displayed as **CC**. A transfer can require CC even when the asset being sent is a Token Standard asset. Keep enough available CC to cover the fee shown by the Extension confirmation.

## Configured Token Standard assets

**USDCx**, **CBTC**, and **CUSD** are examples of Token Standard labels that Rocky Wallet may show. **CC**, **USDCx**, **CBTC**, and **CUSD** are examples only; which assets are available depends on the current Backend configuration and network state.

For each configured asset, Rocky Wallet can use:

- **Canonical asset ID:** the stable Wallet Backend catalog identifier used to join balances, prices, logos, and actions to the same configured asset.
- **Raw ledger symbol or instrument ID:** the value reported by Canton or the Token Standard instrument.
- **Configured display alias:** the exact readable alias selected for a configured Token Standard identity. It can be used as the configured asset name and, under the exact substitution rule below, as the quantity unit.
- **Decimals:** the precision used to present ledger units as a token quantity.
- **Enabled state:** whether the configured asset is available for wallet use.
- **Send and receive capability:** whether the exact asset can be selected for sending, accepted from an Offer, or included in managed receiving behavior.
- **Logo:** presentation metadata for recognizing the configured catalog entry; a logo is not identity proof.
- **Price mode:** the configured source behavior for a quote, such as a fixed price, ticker-based price, or no quote.

Rocky Wallet determines the unit beside a quantity with an exact comparison. If the raw ledger symbol exactly equals `instrument_id`, it replaces that unit with the exact configured `display_alias`. Otherwise, it preserves the raw symbol as the quantity unit. A symbol that merely looks like an instrument ID is not enough to trigger substitution.

The configured asset name and quantity unit are separate presentation fields. Rocky Wallet can show the configured display alias as the asset name while preserving a different normal raw symbol beside the quantity. Neither field replaces the underlying canonical identity.

## Unknown or unverified holdings

An unknown Token Standard holding remains visible so its quantity is not hidden. Rocky Wallet marks it unverified and does not allow it to be sent or accepted until the exact instrument identity is configured, verified, and enabled. Do not identify an unknown asset by symbol, name, or logo alone.

## Price and quantity are separate

In relevant summary or list displays, `$0.00` can represent an unavailable quote. It does not prove that the asset quantity is zero, and it does not change the canonical asset identity.

History is more explicit for positive quantities: when no usable quote is available, it shows **Price unavailable**. A configured quote whose value is actually zero can show `$0.00`. Always read the token quantity and exact asset identity independently from the USD estimate.

Continue with [Home and Assets](using-the-wallet/home-and-assets.md) or see the developer model in [Assets and Balances](developers/assets-and-balances.md).
