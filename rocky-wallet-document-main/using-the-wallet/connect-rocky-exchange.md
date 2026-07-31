# Connect Rocky Exchange

Connect Rocky Wallet only from the official [Rocky Exchange application](https://app.rocky.exchange/). Verify the complete browser origin before starting the connection.

## Connect your wallet

1. Open `https://app.rocky.exchange/` in the browser profile where Rocky Wallet is installed.
2. Select **Connect wallet**, then choose **Rocky Wallet**.
3. If Rocky Wallet is locked, complete the unlock flow in the Extension-owned window. Never enter the wallet password directly into the DApp page.
4. After connection, compare the active account and network with the account you intended to use.

Rocky Wallet 1.0.2 does not show a separate per-site connection confirmation when an unlocked wallet responds. Initiate the request only after checking the browser origin. If the DApp needs to be disconnected, use its disconnect control when available or lock Rocky Wallet; the **Connected Sites** row in Settings is not a working disconnect control in version 1.0.2.

## What connection allows

Connection shares the active public account information needed by the DApp. It does not disclose the recovery phrase or private key, and it does not by itself sign a message or transfer assets. Signing and transfers use separate Extension-owned review flows.

> **Security note:** Reject or close any later signing or transfer request that you did not start or cannot verify. Review the limitations of each confirmation surface in [Transaction Confirmation](../permissions-and-security/transaction-confirmation.md).

Next: [Transaction Confirmation](../permissions-and-security/transaction-confirmation.md)
