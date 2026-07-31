# FAQ

## Is Rocky Wallet self-custodial?

Yes. Wallet transactions are authorized with signing material controlled through the Extension. You are responsible for protecting the recovery phrase and private key.

## Can Rocky Exchange recover my wallet?

No. Rocky Exchange cannot recreate a lost recovery phrase, private key, or signing key. A password is not a recovery backup. Rocky Wallet 1.0.2 also requires the complete Party ID during import, so keep an offline record of it with the matching recovery information.

## Can email recover my wallet?

No. Email can be used for account registration and verification, but it does not recreate wallet signing material. Recovery requires the complete Party ID and its matching recovery phrase or private key.

## What if I forget my password?

Do not reset or remove the Extension until you have verified the complete Party ID and matching offline recovery phrase or private key. Follow the supported account-access process when available, or import the wallet again with that verified recovery information and set the password requested by the import flow.

## Why is my Canton Party ID long?

A complete Party ID combines a party name with a fingerprint, usually in the form `party-name::fingerprint`. The fingerprint distinguishes the exact Canton party and must be preserved when receiving or sending.

## Why does Home shorten the Party ID?

Home shortens only the visible fingerprint to fit the balance card. The copy control returns the complete Party ID. Compare the complete copied value for transfers and confirmations.

## Why does an asset price show `$0.00`?

In some summary or list displays, `$0.00` can mean that no quote is available; it can also represent a configured quote whose value is actually zero. Check the token quantity and exact asset identity independently. For a positive History amount with no usable quote, Rocky Wallet shows **Price unavailable**.

## What is an Offer?

An Offer is an incoming transfer that requires a wallet decision before receipt completes. Review its sender, exact asset, amount, and expiration, then accept or reject it inside the Extension.

## Does signing always spend assets?

No. Message signing and asset transfer are different actions. Read the exact signing message and requesting origin. A transfer uses its own review flow with asset, amount, fee, and estimated total; do not approve either action unless it matches what you initiated.

## Does receive preapproval accept existing Offers?

No. Offers that are already pending remain manual and still require **Accept** before they expire. Preapproval applies only to matching future incoming transfers within covered registrar scope.

## Can a DApp turn on receive preapproval?

No. Enable and disable are Extension-owned permission and signing flows under **Settings > Network Config**. The public DApp SDK cannot perform them.

## Which assets are supported?

Canton Coin and configured, enabled Token Standard assets are supported for the capabilities shown by the wallet. **CC**, **USDCx**, **CBTC**, and **CUSD** are examples; current availability depends on the Wallet Backend configuration and selected network. Unknown holdings may remain visible but are unverified and cannot be sent or accepted.

## Where can I find the Extension version?

Open **Settings** and find the **Version** row. This documentation describes Rocky Wallet version 1.0.2.

## Why are screenshot balances different from mine?

Screenshots use demonstration data and may show a different account, balance, address, asset configuration, or quote snapshot. The complete Party ID, ledger quantities, and confirmation shown by your own installed Extension are authoritative for your wallet.

## What should I do before resetting the wallet?

Record and verify the complete Party ID for every account, then verify each Party ID's matching, readable offline recovery phrase or private-key backup before deleting any local data. During recovery, enter the complete Party ID before selecting **Import with Recovery Phrase** or **Import with Private Key**. Reset removes local encrypted wallet data and remembered state from that browser, but it does not reverse completed Canton transactions or let Rocky Exchange restore missing signing keys.

For problem-specific steps, see [Troubleshooting](troubleshooting.md). For credential and incident guidance, see [Wallet Security](permissions-and-security/wallet-security.md).
