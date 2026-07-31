# Troubleshooting

Use the least destructive action first. Never reset, delete, or clear local wallet data until you have recorded every complete Party ID and verified its matching offline recovery backup.

## Extension popup does not respond after reload

### Symptom

The popup stays blank, ignores controls, or reports that the Extension context is unavailable.

### Cause

An older popup or page still references the Extension context that existed before the reload.

### Action

1. Reload Rocky Wallet from the browser's extension manager.
2. Close the old popup.
3. Refresh every open DApp page that uses Rocky Wallet.
4. Open a new Rocky Wallet popup and try again.

## DApp cannot detect Rocky Wallet after an Extension update

### Symptom

The DApp says Rocky Wallet is missing or never receives the wallet initialization event.

### Cause

The page loaded an older injected provider before the updated Extension started.

### Action

1. Reload the Extension from the browser's extension manager.
2. Refresh the DApp page after the Extension reload completes.
3. Reopen the DApp's connection flow. Rocky Wallet 1.0.2 does not show a per-site connection approval; if the DApp still holds stale connection state, use its disconnect flow and connect again.

## Bottom navigation tab does not update

### Symptom

Selecting **Home**, **History**, **Offers**, or **Settings** leaves old content visible or a refresh never settles.

### Cause

A request from the previous view is still finishing, or the current view retained its previous snapshot after a network failure.

### Action

Return to the top of the tab and pull down to refresh. Wait for the indicator to finish, then switch tabs again. If the view remains stuck, close and reopen the popup; do not clear wallet storage.

## Balance or price appears stale

### Symptom

A recent transfer is missing, or the quantity or USD estimate has not changed.

### Cause

Wallet, ledger, and quote data refresh independently. A failed request can leave the previous snapshot visible.

### Action

Confirm the selected account, then refresh **Home** and **History**. For an incoming transfer, also refresh **Offers**. Compare the complete Party IDs, asset identity, and ledger update identifier. Treat the ledger result as authoritative and allow quote data to refresh separately.

## Asset shows `$0.00`

### Symptom

An asset has a positive quantity but a `$0.00` estimate in a summary or list.

### Cause

That display may use `$0.00` when no quote is available, or the configured quote may genuinely be zero.

### Action

Read the token quantity first and verify the exact asset identity. Refresh the view and check History: a positive History amount without a usable quote shows **Price unavailable**, while a configured zero-dollar quote can show `$0.00`. Do not infer token quantity or value from the summary estimate alone.

## Asset is unverified or unavailable to send

### Symptom

A holding appears, but Rocky Wallet labels it unverified or does not enable the send or Offer-accept action.

### Cause

The Wallet Backend does not have an enabled catalog entry matching the exact Token Standard instrument administrator and instrument ID, or the configured asset is disabled.

### Action

Record the complete instrument identity and selected network. Do not rely on the displayed symbol or logo. Wait for the exact identity to be configured, verified, and enabled before sending or accepting it.

## Receive preapproval is unavailable, partial, or interrupted

### Symptom

The control is unavailable, shows partial coverage, remains processing, or reports a failed operation.

### Cause

An **Unsupported** condition means the configured Backend does not provide the feature. **Wallet locked** means the Extension cannot sign. A **Failed** condition can come from a temporary service, connectivity, status-refresh, or operation error. **Partial** is a real coverage state caused by missing current registrar authorizations or stale managed coverage that needs cleanup. **Processing** means a multi-step operation remains active or was interrupted before the UI obtained its final result.

### Action

Open **Settings > Network Config** and review the condition, registrar counts, and current scope.

- For **Unsupported**, there is no enable or disable action; use a Backend that supports the feature.
- For **Wallet locked**, unlock the selected wallet and return to the control.
- For **Failed** after a temporary service or connectivity problem, restore connectivity and use the displayed **Retry** or status-refresh action.
- For **Partial**, choose **Update preapproved receiving** and review the current and stale managed scope.
- For an interrupted operation, use **Retry** and reconfirm the intended action if asked. Completed steps remain valid, and Rocky Wallet continues from fresh chain state rather than repeating confirmed work.

Do not start another operation while the state is **Processing**.

## Offer expired

### Symptom

An Offer has no actions, is marked expired, or disappears after refresh.

### Cause

Its decision window ended before acceptance completed. An expired Offer cannot be revived by retrying the old action.

### Action

Refresh **Offers** and **History** to confirm the current result. If you still expect the transfer, ask the sender to create a new Offer. Verify the new sender, asset, amount, and expiration before accepting.

## Transfer cannot cover the Canton Coin fee

### Symptom

The transfer review reports insufficient CC or cannot proceed even though the sent asset quantity is available.

### Cause

The selected account lacks enough available Canton Coin for the separate network fee.

### Action

Review the CC fee and total deduction shown by the Extension. Receive enough CC into the same Party ID, wait for it to become available, refresh Home, and rebuild the transfer. Do not reduce the token amount unless the confirmation shows that doing so changes the required total.

## Wallet cannot unlock or import

### Symptom

The account password is rejected, the recovery phrase or private key is invalid, or the imported wallet loads a different Party ID.

### Cause

For a newly registered account, unlock can fail at Backend account authentication or local-vault decryption. For an imported or restored wallet, the password unlocks the local vault and the signing key must satisfy the Backend challenge for the supplied Party ID. Import can also fail because the complete Party ID is missing or wrong, the phrase has the wrong word count or order, the private-key format is invalid, or the key controls a different Canton party.

### Action

Check the exact account identifier, keyboard layout, and password without sharing them. For import, enter the complete Party ID first, compare it with your offline record, then select the intended method and recheck the matching phrase word count and order or private-key format inside the Extension. After import, compare the complete Party ID again. Do not keep guessing a secret on an untrusted device, and do not delete local data unless you have recorded every complete Party ID and verified its matching offline recovery backup.
