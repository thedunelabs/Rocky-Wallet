# Security Boundaries

## Public DApp methods

- `connect`
- `disconnect`
- `getPrimaryAccount`
- `getCoinsBalance`
- `getAssetCatalog`
- `signMessage`
- `submitCommands`
- `sendTransfer`
- `buildTransfer`
- `getNodeOffers`

## Local facade behavior

The list above is the exact Extension 1.0.2 content-script allow-list. Other names can exist on the SDK or injected provider without being page-public runtime methods:

- `getActiveAccount`, `getAccounts`, `getBalance`, `getCoinsList`, `getWalletVersion`, `getWalletMetadata`, `isConnected`, `status`, and `getOffers` are SDK-local aliases, projections, or probes over public behavior.
- `getActiveNetwork` is resolved locally by the injected provider as Canton Mainnet.
- The legacy positional `transfer` provider convenience converts the request into public `sendTransfer`; the SDK can also fall back to public `submitCommands`.
- Event helpers attach local window listeners. Extension 1.0.2 itself dispatches only the separate injection-ready event documented in this guide.

Although `submitInstructionChoice` is present for Console compatibility, a page-origin call is rejected by the content-script allow-list. Offer acceptance signs with the user's wallet key and must be initiated through Extension-owned UI.

Receive preapproval is an Extension-owned permission and signing flow. The public DApp SDK does not expose `rocky_get_receive_preapproval` or `rocky_set_receive_preapproval`.

The SDK does not import signing keys, does not accept wallet secrets, and does not submit an arbitrary DApp-supplied signed transfer payload.

## Responsibility boundaries

| Component | Responsibility |
| --- | --- |
| DApp | Identify itself through its real served origin; request only the account, assets, and actions it needs; match assets by exact `asset_id`; explain intent before opening Extension UI; handle rejection without hidden retries. |
| Injected provider | Expose the frozen page facade, normalize selected inputs/results, and bridge allowed requests. Its replaceable global binding is an injection mechanism, not proof that every page script is trustworthy. |
| Content-script allow-list | Enforce the exact ten page-public method names above before any request reaches the Extension runtime. It rejects private methods, direct signed-payload submission, and page-origin offer acceptance. |
| Extension background and local vault | Verify the browser sender origin, manage unlock and session state, own confirmations, keep keys local, sign approved messages/transfers, and attach authenticated Backend access. |
| Wallet Backend | Resolve accounts and addresses, provide catalog/balance data, build canonical transfer payloads, verify/submit signed transfers, and enforce asset and balance rules. DApps do not receive or supply the Extension's Backend credentials. |

The SDK's wallet-secret field check is a developer guard, not the security boundary: page JavaScript can replace its own SDK code. The Extension allow-list, background checks, local vault, and Extension-owned confirmation paths provide the enforceable separation.

## Secure integration checklist

- Serve the DApp from the verified origin users expect and do not claim a metadata value overrides the browser-verified origin.
- Request and retain the minimum account and balance data needed for the current action.
- Treat rejection or a closed confirmation as final; never retry invisibly.
- Join, select, and transfer Token Standard assets by exact `asset_id`, never by display symbol alone.
- Never request, collect, log, or send a wallet password, private key, recovery phrase, signing key, Backend token, or signed wallet payload.
- Make each signing or transfer request a direct consequence of a visible user action and do not hide a retry after rejection.
