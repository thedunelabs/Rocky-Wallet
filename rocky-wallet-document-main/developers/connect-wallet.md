# Connect to Rocky Wallet

Check both provider availability and the minimum-capability result before enabling wallet actions:

```ts
import {
  MINIMAL_CAPABLE_VERSION,
  RockyWalletError,
  rockyWallet,
} from "@rocky-wallet/dapp-sdk";

async function connectRockyWallet() {
  try {
    const availability = await rockyWallet.checkExtensionAvailability({
      timeoutMs: 1500,
    });

    if (availability.status !== "installed") {
      throw new Error("Rocky Wallet Extension is not installed");
    }

    if (!availability.isExtensionCapableByVersion) {
      throw new Error(
        `Rocky Wallet ${MINIMAL_CAPABLE_VERSION} or later is required; ` +
          `found ${availability.currentVersion ?? "an unknown version"}`,
      );
    }

    const currentVersion = await rockyWallet.getWalletVersion({
      timeoutMs: 1500,
    });
    console.log("Rocky Wallet Extension:", currentVersion);

    const connection = await rockyWallet.connect({
      name: "Rocky Docs Example",
      icon: new URL("/wallet-icon.png", window.location.origin).href,
      target: "local",
    });

    if (!connection.isConnected || !connection.account) {
      throw new Error(connection.reason || "Rocky Wallet did not return an account");
    }

    console.log("Connected account:", connection.account.partyId);
    return connection;
  } catch (error) {
    if (error instanceof RockyWalletError) {
      if (error.code === 4001) {
        console.warn("The wallet request was rejected or its confirmation was closed");
        return undefined;
      }
      console.error("Rocky Wallet request failed", error.code, error.message);
      return undefined;
    }
    throw error;
  }
}
```

## What connect does in 1.0.2

There is no separate per-site connection confirmation in Extension 1.0.2. If the wallet is already unlocked, `connect()` reads the current account immediately and records the browser-verified site origin. The DApp-supplied `name` and `icon` do not replace that verified origin.

If the wallet is locked, a public connection request opens the Extension-owned unlock window, waits for the user to unlock, and then retries the connection. Closing that unlock window produces the message `Rocky Wallet unlock was cancelled`; the SDK's 1.0.2 normalization maps that particular wording to `-32603`, not `4001`.

Code `4001` is used when the underlying provider supplies numeric `4001`, `USER_REJECTED`, `REJECTED`, `POPUP_CLOSED`, rejection text, or closed-popup text. In the shipped Extension, that most directly describes rejecting or closing a signature or transfer confirmation. Treat any rejected request as final unless the user explicitly starts it again.

## Account and connection helpers

- `getPrimaryAccount()` calls the injected public account method and returns the current account or `undefined`.
- `getActiveAccount()` is an SDK alias for `getPrimaryAccount()`.
- `getAccounts()` uses a provider's `getAccounts()` when present; Extension 1.0.2 does not provide it, so the SDK returns the primary account as a one-item array or `undefined`.
- `getActiveNetwork()` is a local provider convenience in Extension 1.0.2 and returns `{ id: "CANTON_NETWORK", name: "Canton Mainnet" }` without crossing the content-script bridge.
- `isConnected()` probes `getPrimaryAccount()` and returns a `ConnectResponse`. It is not a durable per-site permission query and can open the unlock flow when the wallet is locked.
- `disconnect()` clears the provider's cached account and the Extension's connected-site marker. It does not lock the wallet or end its Backend session; a later account probe can return the still-unlocked account.

The injected script installs `window.rockyWallet` and then dispatches `rockyWallet#initialized`. The SDK waits for that event only when the provider was not present at the start of a lookup. It is an injection-ready signal, not a connection or account-change event.
