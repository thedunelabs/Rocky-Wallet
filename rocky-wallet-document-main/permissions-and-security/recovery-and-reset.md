# Recovery and Reset

Recovery restores control from signing material you already hold and the complete Canton Party ID for the wallet. Rocky Wallet 1.0.2 requires both: a recovery phrase or private key alone is not enough to complete its import flow. Reset or deletion removes this browser's local wallet state; it does not recover missing information.

## Recover inside the Extension

1. Open Rocky Wallet in the browser profile where you want to restore access.
2. Choose **Import Wallet**.
3. Enter the complete Party ID of the account being restored. Compare the entire `party-name::fingerprint` value with your offline account record.
4. Select **Import with Recovery Phrase** or **Import with Private Key**.
5. Enter the matching secret only inside the Rocky Wallet Extension.
6. Set the password requested by the import flow and confirm the import.
7. Wait for the account and Canton network state to load, then verify the complete Party ID again before using the wallet.

A website, DApp, chat message, or support agent must never ask you to paste a recovery phrase or private key.

## Before reset or deletion

> **Warning:** Before deleting any local wallet data, record and verify the complete Party ID for every remembered account and verify its matching, readable offline recovery phrase or private-key backup. Rocky Wallet 1.0.2 requires the complete Party ID before you choose the phrase or private-key import method.

Resetting or deleting a wallet removes its local encrypted wallet data and remembered wallet state from that browser. You will need the complete Party ID and matching recovery material to restore signing access afterward.

Local deletion does not reverse completed Canton transactions, erase ledger history, or remove assets from their Party ID. Rocky Exchange cannot restore a lost recovery phrase, private key, or signing key.

Next: [Import a Wallet](../getting-started/import-wallet.md)
