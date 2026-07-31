# Transaction Confirmation

![Wallet signature confirmation shield](../assets/images/signature-hero.png)

Rocky Wallet 1.0.2 uses different surfaces for connection, message signing, transfers, Offers, and receive-preapproval permissions. They do not all show the same fields. Confirm what the current surface exposes, and cancel or reject if missing context prevents a safe decision.

## Connection

Version 1.0.2 has no per-site connection confirmation screen. When an unlocked wallet handles a DApp connection call, it returns the active account and remembers the requesting site. **Connected Sites** in Settings is a placeholder and does not provide a working disconnect action.

Initiate connection only from a DApp page whose browser origin you have verified. To end the connection, use the DApp's disconnect flow if it provides one, or lock Rocky Wallet. Locking clears the remembered site and unlocked signing session.

## Message-signing confirmation

The message-signing screen shows the browser-verified requesting origin, selected account name with a shortened Party ID, network, signature type, and the exact message with a data preview. This is the only version 1.0.2 confirmation surface where the requesting origin is shown and protected against a page-supplied override.

A DApp-provided app label or purpose is context only. It cannot override the browser-verified origin and may not be displayed as a separate purpose field. Read the exact message and reject it if you cannot identify a human-readable purpose or do not understand what the signature authorizes.

## Transfer review

The transfer review shows the action through its transfer heading, shortened sending and recipient Party IDs, configured asset name and display unit, network, amount, USD estimate, Canton Coin fee, and estimated total. In version 1.0.2, this screen does **not** show the requesting origin, a human-readable purpose, either complete Party ID, or the exact Token Standard instrument identity. Its Party ID copy icons are visual controls with no copy action.

Before reaching review, independently verify the complete recipient Party ID and exact asset identity from the destination and asset-selection steps. On review, check the displayed unit, amount, fee, and total. Cancel if a shortened Party ID or display label is not enough to confirm the intended destination or asset.

## Offer decision

Review the Offer detail inside the Extension before selecting **Accept** or **Reject**. Version 1.0.2 shows the configured token label or unit, amount, sending and receiving parties, network, expiration, and Offer ID. It does **not** render the exact Token Standard `assetId`, `instrumentAdmin`, or `instrumentId`. Verify that exact asset identity independently before opening or accepting the Offer; do not treat the displayed alias, unit, or logo as identity proof. On the detail surface, check the displayed amount and expiration and use its working party copy controls to compare the complete sender and recipient Party IDs. An Offer surface does not establish a browser requesting origin or DApp purpose.

## Permission confirmation

Receive-preapproval enable and disable confirmations are Extension-owned. Review whether the action is enable, update, or disable; the current registrar scope; future-asset and existing-Offer effects; and any historical cleanup. These confirmations do not represent a DApp origin and do not show a transfer asset, amount, or fee.

## Confirmation checklist

Across the relevant surfaces, verify:

- **Browser-identified requesting origin:** on message-signing confirmation only. Verify a DApp's browser origin before initiating connection or transfer because those surfaces do not display it.
- **Action type:** distinguish connection, message signing, transfer, Offer decision, and permission change from the screen and action you initiated.
- **Party ID:** compare complete Party IDs whenever a surface exposes them. If it shows only a shortened value, verify the complete ID before approval through a trusted source outside that review screen.
- **Asset:** verify exact identity independently before the action. Neither transfer review nor Offer detail exposes the exact Token Standard asset ID, instrument administrator, or instrument ID; their configured labels and units are display context only.
- **Amount:** check the displayed token quantity and decimal placement on transfer and Offer surfaces.
- **Fee:** check the Canton Coin fee and total on transfer review; message, Offer, and permission surfaces do not show a transfer fee.
- **Human-readable purpose:** read the exact signed message or understand the action you initiated. DApp labels are only context, and transfer review does not display a purpose.

## If a request is unexpected

Reject or cancel a signing, transfer, Offer, or permission request that you did not initiate or cannot verify from the fields available. Do not approve it merely to make an error disappear. For an unwanted DApp connection, use the DApp's disconnect flow if available or lock Rocky Wallet; the Settings placeholder cannot disconnect a site in version 1.0.2.

Developer reference: [Security Boundaries](../developers/security-boundaries.md)
