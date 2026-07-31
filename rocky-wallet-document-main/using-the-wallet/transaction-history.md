# Transaction History

History is Rocky Wallet's activity view for the selected account. It can show separate rows for the asset movement and a fee movement from the same send workflow.

## Read the row types

- **Received:** an incoming asset movement reported as completed for the selected account.
- **Transfer:** an outgoing asset movement to another party.
- **Transfer Fee:** a separate outgoing fee leg recognized from the configured fee asset, amount, and recipient.
- **Received failed:** an incoming transfer or offer-related receipt reported as failed; the asset should not be assumed received from this row.

An outgoing transfer and its fee can therefore appear as two ledger-backed rows. Do not add a **Transfer Fee** row to the recipient's amount; it is a separate debit.

## Understand asset and USD labels

For a known asset with a regular ledger symbol, History keeps that symbol. If the raw symbol is the instrument ID and the exact asset identity is configured, the Extension uses the configured display alias in amounts and details.

USD amounts use an available current or reported price. For a positive token amount without a usable quote, History displays **Price unavailable**. A configured zero-dollar price displays `$0.00`. Read the token quantity independently.

## Review a transaction

1. Open **History** from the bottom navigation.
2. Select a row to open its details.
3. Review the direction, exact asset label and quantity, and the sender and recipient. Visible Party IDs may be shortened; use the copy controls to compare the complete values.
4. Review the fee and total deducted when supplied. A fee may be zero, unavailable, or represented by its own **Transfer Fee** row.
5. Check the transaction or Canton update identifier. The detail screen always shows the generic **Confirmed** heading, even for a **Received failed** row, so do not use that heading to determine the outcome. Use the History row type and the ledger result instead. Depending on the ledger record, the detail can also include a timestamp, confirmation count, nonce, or explorer action; these optional fields are not present for every row.

> **Verification note:** History is a wallet view and can lag behind the ledger or retain a previous snapshot after a refresh failure. The ledger result for the exact update and parties is authoritative. A USD estimate, row label, or missing optional field does not override that result.

## If a row looks wrong

- Refresh **History** from the top of the page.
- Confirm that the correct account is selected.
- Compare the complete sender, recipient, asset identity, amount, fee, and update identifier rather than shortened labels.
- Keep both the **Transfer** and **Transfer Fee** rows when reconciling a send.
- For a failed or missing record, note the time and exact identifiers before following the troubleshooting steps.

Next: [Troubleshooting](../troubleshooting.md)
