# Rocky Wallet DApp SDK

`@rocky-wallet/dapp-sdk` connects browser DApps to the provider injected by the Rocky Wallet Extension.

The normal integration has five steps:

1. [Install the SDK](install-sdk.md).
2. Detect the injected provider and verify its version.
3. [Connect to Rocky Wallet](connect-wallet.md).
4. Read the active account, [asset catalog, and balances](assets-and-balances.md).
5. Request [Extension-owned confirmations and actions](signing-and-transfers.md).

The SDK never imports wallet keys or supplies Wallet Backend credentials. Unlocking, key use, signing, and authenticated Backend calls remain inside the Extension.

Use these reference pages when you integrate:

- [Install the SDK](install-sdk.md)
- [Connect to Rocky Wallet](connect-wallet.md)
- [Assets and balances](assets-and-balances.md)
- [Signing and transfers](signing-and-transfers.md)
- [API reference](api-reference.md)
- [Security boundaries](security-boundaries.md)
