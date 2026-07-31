# Accounts and Address Book

Rocky Wallet can remember multiple controlled wallet addresses on the same browser. Each account keeps its own Party ID, vault material, session information, and wallet snapshots.

## Switch accounts

1. Open **Settings** and select the account card. You can also open the selector from the **From** account on the Send screen.
2. Review the account name and shortened Party ID, then choose the intended account.
3. If Rocky Wallet opens the lock screen, enter that account's password to unlock its local vault.
4. Wait for the Home balance, History, Offers, and other wallet views to refresh for the selected account.
5. Before sending or sharing a receiving address, copy and verify the selected account's complete Party ID.

The Extension remembers which account was selected. Switching to another account does not reuse the active account's unlocked key: the newly selected account unlocks separately.

An inactive account card can show its last remembered USD balance or `--`. That value belongs to the inactive account's own stored snapshot; Rocky Wallet does not substitute the active account's balance. Treat a remembered value as potentially stale until you select, unlock, and refresh that account.

## Add another controlled account

From the account selector, choose the import action to add another address you control. Import only with the recovery phrase or private key that belongs to the complete Party ID you intend to restore. Never import a secret supplied by another person merely to watch their address.

Each imported account remains a separate signing identity. Verify its complete Party ID after import and complete any required backup or unlock step before funding it.

## Use the Address Book

1. Open **Settings** > **Address Book**.
2. Use **Recent** to review recipients derived from recent activity, or **Contacts** to review entries added during the current popup session.
3. Select **Add New Contact** and enter a helpful label plus the contact's complete Canton Party ID.
4. Before using the contact for a send, compare its full ID with a trusted source. From the Send screen, the Address Book can fill the recipient field for you.

In v1.0.2, contacts are temporary: the Contacts list starts empty whenever the popup loads, and adding a contact changes only the current popup's in-memory state. Closing or reloading the popup clears the list.

Recent recipients are a convenience, not an endorsement. They can include a mistyped or unwanted past destination.

> **Security note:** Contact names and account labels are local convenience labels, not ledger identity proof. A familiar label does not verify who controls a Party ID. Confirm the complete `party-name::fingerprint` value before every important transfer, especially after a recipient reports a changed address.

If a contact is missing or its label looks wrong, paste a newly verified complete Party ID instead of guessing or editing a shortened fingerprint.

Next: [Wallet Security](../permissions-and-security/wallet-security.md)
