# Receive Preapproval

![Shield representing receive-preapproval coverage](../assets/images/permission-hero.png)

Receive preapproval lets qualifying future Token Standard transfers arrive without a manual Offer decision. It is one wallet-level control: Rocky Wallet manages registrar-wide coverage for all currently configured eligible Token Standard assets. There are no separate per-asset toggles.

Coverage follows registrar identity, not just a token's displayed name or symbol. Review the registrar count and scope whenever the Backend asset configuration changes.

## Enable receive preapproval

1. Unlock Rocky Wallet.
2. Open **Settings > Network Config**.
3. Find receive preapproval and review the currently configured registrar coverage. Confirm that the scope matches the assets you expect to receive.
4. Choose **Enable** or **Update preapproved receiving**.
5. Review the scope in the Extension-owned confirmation and confirm the operation.
6. Keep the Extension open while it signs, submits, and refreshes the required on-chain authorization steps.

One approval can require multiple on-chain transactions and local signatures. A newly configured registrar may require another confirmation later.

## Disable receive preapproval

1. Return to **Settings > Network Config**.
2. Choose **Disable**.
3. Review the current and historically managed registrar scope that will be removed.
4. Confirm the Extension-owned operation and keep the Extension open until processing and status refresh finish.

After disable completes, qualifying future transfers return to Offers and require a manual **Accept**.

## Understand the coverage state

The Backend reports exactly four top-level coverage states:

- **Off:** none of the currently required registrar authorizations is active. If no eligible registrars are configured, there is no scope to enable.
- **Partial:** current coverage needs an update. Only some required registrars may be covered, newly configured registrars may need authorization, or stale managed coverage may require cleanup.
- **Processing:** an approved enable, update, or disable operation is still moving through its signing and on-chain steps. Do not start another operation; keep the Extension open and wait for a refreshed state.
- **On:** every registrar currently required by the configured eligible Token Standard assets is covered. Matching future incoming transfers can arrive directly.

**Stale managed coverage** is not another top-level state. It means an authorization previously managed by Rocky remains for a registrar outside the current configured scope. It is one reason the top-level state can be **Partial**, allowing an update or disable operation to clean up historical coverage.

## Understand unavailable UI conditions

Rocky Wallet can replace the coverage control with a condition that explains why it is unavailable:

- **Unsupported:** the configured Backend does not support receive preapproval. The control is disabled and offers no action.
- **Wallet locked:** the Extension cannot sign an enable or disable operation until you unlock this wallet.
- **Failed:** status loading, connectivity, or an operation failed. Use the displayed **Retry** or status-refresh action. A temporary service failure does not mean the normalized coverage state changed.

If processing is interrupted, already confirmed on-chain steps remain valid. When retrying the interrupted action, Rocky Wallet reads fresh chain state and continues from there instead of blindly repeating confirmed work. If signing completed but the status refresh failed, the Retry action refreshes status before you approve another operation.

## What preapproval does not do

Existing pending Offers remain manual and still require **Accept** before they expire. Only matching future incoming transfers can arrive directly while their registrar coverage is on.

Receive preapproval is an Extension-owned permission and signing flow. The public DApp SDK cannot enable or disable it.

Next: [Offers](../using-the-wallet/offers.md)
