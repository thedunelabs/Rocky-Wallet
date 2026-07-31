# API Reference

These signatures describe `@rocky-wallet/dapp-sdk` 1.0.2. A **public bridge** row reaches one of the content script's allow-listed methods. A **local facade** row is implemented in the SDK or injected provider and may resolve to another public method. Missing providers normally produce `RockyWalletError` code `4900`; a missing required provider method produces `4200`; wallet-secret-shaped request fields produce `-32602` before the provider is called.

## Availability and connection

| Signature | Route | Purpose | Notable failures |
| --- | --- | --- | --- |
| `checkExtensionAvailability(options?: { timeoutMs?: number }): Promise<AvailabilityResponse>` | Local facade | Wait for injection and report installed status, current/minimum version, and capability. | Provider absence/timeout returns `status: "notInstalled"`; forbidden option fields throw `-32602`. |
| `getWalletVersion(options?: { timeoutMs?: number }): Promise<string>` | Local facade | Read `provider.version`, falling back to `MINIMAL_CAPABLE_VERSION`. | Provider absence `4900`; forbidden option fields `-32602`. |
| `connect(request?: ConnectRequest): Promise<ConnectResponse>` | Public bridge: `connect` | Unlock if necessary, record the verified site, and return the current account. | Missing method `4200`; absent/locked failures normalize to `4900` where the message matches; rejection/closed errors can normalize to `4001`. Unlock cancellation text currently normalizes to `-32603`. |
| `disconnect(options?: { timeoutMs?: number }): Promise<unknown>` | Public bridge: `disconnect` when available | Clear provider cache and the Extension connected-site marker; does not lock the wallet. | Provider absence `4900`; forbidden option fields `-32602`. A provider without `disconnect` gets local `{ status: true }`. |
| `isConnected(options?: { timeoutMs?: number }): Promise<ConnectResponse>` | Local facade over `getPrimaryAccount` | Probe for an account; this may invoke unlock. | Returns `{ isConnected: false, reason }` for provider errors except `-32602`, which is thrown. |
| `status(options?: { timeoutMs?: number }): Promise<StatusEvent>` | Local facade | Combine connection probe, provider identity/version, and network. | Provider absence `4900`; forbidden option fields `-32602`; connection-probe errors are carried in `connection`. |

## Accounts and network

| Signature | Route | Purpose | Notable failures |
| --- | --- | --- | --- |
| `getPrimaryAccount(options?: { timeoutMs?: number }): Promise<RockyAccount \| undefined>` | Public bridge: `getPrimaryAccount` | Return the current public account; a locked wallet can open unlock. | Missing method `4200`; provider absent/locked `4900`; forbidden options `-32602`. |
| `getActiveAccount(options?: { timeoutMs?: number }): Promise<RockyAccount \| undefined>` | Local SDK alias | Call `getPrimaryAccount`. | Same as `getPrimaryAccount`. |
| `getAccounts(options?: { timeoutMs?: number }): Promise<RockyAccount[] \| undefined>` | Local facade | Use provider `getAccounts` when available; otherwise wrap the primary account. | Fallback inherits `getPrimaryAccount` failures. |
| `getActiveNetwork(options?: { timeoutMs?: number }): Promise<Network>` | Local provider/facade | Use provider network support or return the Canton Mainnet fallback. | Provider absence `4900`; forbidden options `-32602`. Missing provider method is not an error. |
| `getWalletMetadata(options?: { timeoutMs?: number }): Promise<Record<string, unknown>>` | Local SDK facade | Return Rocky Wallet id, name, local target, empty icon, and provider version. | Provider absence `4900`; forbidden options `-32602`. |

Extension 1.0.2's injected provider does not expose `getAccounts`; its `getActiveNetwork` is local and returns Canton Mainnet.

## Assets

| Signature | Route | Purpose | Notable failures |
| --- | --- | --- | --- |
| `getCoinsBalance(request?: GetBalanceRequest): Promise<GetCoinsResponse>` | Public bridge: `getCoinsBalance` | Read the authenticated wallet balance response through the Extension. | Missing method `4200`; locked/disconnected `4900`; forbidden request fields `-32602`. |
| `getBalance(request?: GetBalanceRequest): Promise<GetCoinsResponse>` | Local SDK alias | Call `getCoinsBalance`. | Same as `getCoinsBalance`. |
| `getCoinsList(request?: GetBalanceRequest): Promise<{ items: Array<Record<string, unknown>> }>` | Local SDK projection | Return `tokens` or `items` from `getCoinsBalance` as `items`. | Same as `getCoinsBalance`. |
| `getAssetCatalog(options?: { timeoutMs?: number }): Promise<RockyAssetDescriptor[]>` | Public bridge: `getAssetCatalog` | Normalize array, `{ items }`, or `{ assets }` provider results. | Missing method/older provider `4200`; forbidden options `-32602`; Backend errors are normalized provider failures. |

## Signing and transfers

| Signature | Route | Purpose | Notable failures |
| --- | --- | --- | --- |
| `signMessage(request: SignMessageRequest): Promise<string \| undefined>` | Public bridge: `signMessage` | Open Extension-owned message review and return its signature after approval. | Rejection/closure `4001`; missing method `4200`; locked/disconnected `4900`; forbidden fields `-32602`. |
| `signLoginChallenge(challenge: string, options?: SignLoginChallengeOptions): Promise<string \| undefined>` | Local facade over `signMessage` | UTF-8 encode a non-empty challenge into a hex message with authentication metadata. | Empty challenge `-32602`; otherwise `signMessage` failures. |
| `submitCommands(request: SignSendRequest \| Record<string, unknown>): Promise<SignSendResponse>` | Public bridge: `submitCommands` | Start the Extension transfer confirmation and sign/submit after approval. | Rejection/closure `4001`; missing method `4200`; locked/disconnected `4900`; forbidden fields `-32602`. |
| `buildTransfer(request: BuildTransferRequest \| Record<string, unknown>): Promise<BuildTransferResponse>` | Public bridge: `buildTransfer` | Build an unsigned Backend transfer payload without signing or submission. | Missing method `4200`; locked/disconnected `4900`; invalid Backend request; forbidden fields `-32602`. |
| `sendTransfer(request: SignSendRequest \| BuildTransferRequest \| Record<string, unknown>): Promise<SignSendResponse>` | Public `sendTransfer`, with public `submitCommands` fallback | Start transfer confirmation and Extension-owned submission. | Rejection/closure `4001`; both methods absent `4200`; locked/disconnected `4900`; forbidden fields `-32602`. |
| `transfer(request: RockyAssetTransferRequest): Promise<SignSendResponse>` | Local SDK facade to public `sendTransfer` | Normalize a dynamic asset request, preferring `asset_id` and dropping registry identity fields. | Provider without `getAssetCatalog` capability `4200`; unsupported no-id legacy symbol `-32602`; downstream transfer failures. |
| `transfer(to: string, amount: string \| number, instrument: RockyAssetInstrument, options?: Record<string, unknown>): Promise<SignSendResponse>` | Local SDK/provider facade to public `sendTransfer` or `submitCommands` | Support the legacy `CC`, `USDCx`, and `CBTC` positional path. | Unknown legacy symbol `-32602`; no usable transfer method `4200`; downstream transfer failures. |

No public SDK type or provider method accepts direct signed-transfer submission.

## Offers

| Signature | Route | Purpose | Notable failures |
| --- | --- | --- | --- |
| `getOffers(request?: OffersRequest): Promise<OffersResponse>` | Local SDK alias | Call `getNodeOffers`. | Same as `getNodeOffers`. |
| `getNodeOffers(request?: OffersRequest): Promise<OffersResponse>` | Public bridge: `getNodeOffers` | Read offers for the current wallet. | Missing method `4200`; locked/disconnected `4900`; forbidden fields `-32602`. Extension 1.0.2 ignores the page's filter object in its Backend call. |
| `submitInstructionChoice(request?: SignInstructionChoiceRequest): Promise<SignInstructionChoiceResponse>` | Console compatibility only | Forward to a provider method when one is supplied. | The injected provider has this method, but the content-script allow-list rejects page-origin acceptance. The current unsupported-method text normally normalizes to `-32603`. Accept offers in Extension-owned UI. |

## Events

| Signature | Route | Purpose | Notable failures |
| --- | --- | --- | --- |
| `onAccountsChanged(callback?: (account: RockyAccount \| undefined) => void): Unsubscribe` | Local window listener | Listen for `rockyWallet#accountsChanged` and return an unsubscribe function. | Invalid callback or missing window returns a no-op unsubscribe. |
| `onConnectionStatusChanged(callback?: (status: ConnectResponse) => void): Unsubscribe` | Local window listener | Listen for `rockyWallet#connectionStatusChanged`. | Invalid callback or missing window returns a no-op unsubscribe. |
| `onTxStatusChanged(callback?: (event: unknown) => void): Unsubscribe` | Local window listener | Listen for `rockyWallet#txStatusChanged`. | Invalid callback or missing window returns a no-op unsubscribe. |

The shipped Extension 1.0.2 dispatches `rockyWallet#initialized` after provider injection but does not dispatch the three subscription events above. The helpers exist for compatibility; do not rely on callbacks without another verified event source.

## Utilities

Utilities are methods of the exported `utils` object, not top-level exports.

| Signature | Availability and purpose | Notable failures |
| --- | --- | --- |
| `utils.equalBytes(a: Uint8Array, b: Uint8Array): boolean` | Exported; compare byte arrays. Non-`Uint8Array` values return `false`. | None thrown by the implementation. |
| `utils.base64ToBytes(base64: string): Uint8Array` | Exported; decode Base64. | Invalid input can throw the platform decoder's error. |
| `utils.base64ToHex(base64: string): string` | Exported; decode Base64 and return `0x`-prefixed hex. | Invalid Base64 can throw the platform decoder's error. |
| `utils.toBase64(bytes: Uint8Array): string` | Exported; encode bytes as Base64. | No SDK-specific validation error. |
| `utf8ToBytes` | Not exported by package 1.0.2. Use `new TextEncoder().encode(value)` in application code. | Calling it from the package is unavailable. |
| `bytesToHex` | Not exported under this name. Package 1.0.2 exports the equivalent `utils.toHex(bytes: Uint8Array): string`. | `utils.toHex` has no SDK-specific validation error. |
| `replaceBigIntsWithStrings` | Not exported by package 1.0.2. | Calling it from the package is unavailable. |

The other actual 1.0.2 utility methods are `utils.hexToBase64(hex)`, `utils.hexToBytes(hex)`, and `utils.toHex(bytes)`. `utils.hexToBytes` throws `-32602` when the hex string has odd length.

## `RockyWalletError` codes

| Code | Meaning in 1.0.2 |
| --- | --- |
| `4001` | Numeric `4001`, `USER_REJECTED`, `REJECTED`, rejection text, `POPUP_CLOSED`, or closed-popup text. Most relevant to signature and transfer review. |
| `4200` | Method/capability not supported, including missing provider functions and explicit unsupported SDK stubs. |
| `4900` | Provider unavailable by default, or an error recognized as not installed, locked, disconnected, or not connected. |
| `-32602` | SDK-detected invalid parameters, including forbidden wallet-secret field names, an empty login challenge, an unsupported legacy asset symbol, or odd-length hex. |

An unrecognized provider failure is normalized to `-32603`. The original message is retained, and a string provider code is preserved as `error.data.causeCode`.
