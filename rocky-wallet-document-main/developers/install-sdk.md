# Install the SDK

## Requirements

- A browser with Rocky Wallet Extension 1.0.2 or later.
- Node.js 20 or later for package installation and tests.
- A DApp served from an identifiable HTTP or HTTPS origin. The Extension obtains the requesting origin from the browser, not from DApp metadata.

Install the version documented by this guide:

```bash
npm install @rocky-wallet/dapp-sdk@1.0.2
```

Import the flat SDK facade and the factory:

```ts
import {
  MINIMAL_CAPABLE_VERSION,
  RockyWalletError,
  createRockyWalletSdk,
  rockyWallet,
} from "@rocky-wallet/dapp-sdk";

console.log("Installed Rocky Wallet DApp SDK: 1.0.2");
console.log("Minimum capable Extension:", MINIMAL_CAPABLE_VERSION);

try {
  await rockyWallet.checkExtensionAvailability({ timeoutMs: 1500 });
} catch (error) {
  if (error instanceof RockyWalletError) {
    console.error(error.code, error.message);
  }
}
```

`MINIMAL_CAPABLE_VERSION` is `"1.0.2"` in this release.

## Singleton or factory

Use `rockyWallet` for the normal browser integration. It finds `window.rockyWallet` when a method is called and waits briefly for the Extension's initialization event if injection is still in progress.

Use `createRockyWalletSdk({ provider })` when a test harness or host application already has a provider instance:

```ts
const sdk = createRockyWalletSdk({
  provider: window.rockyWallet,
});
```

Passing a provider does not import its keys or credentials; it only selects the object to which SDK calls are delegated. If no provider is passed, the factory uses the injected browser provider just like the singleton.

Next: [connect to Rocky Wallet](connect-wallet.md).
