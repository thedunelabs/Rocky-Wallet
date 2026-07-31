# Wallet Security

Rocky Wallet is self-custodial: transactions are authorized with signing material controlled through your Extension. Understanding the different credentials prevents a password from being mistaken for a recovery backup.

## Security terms

- **Local encrypted vault:** encrypted wallet material stored by the Extension in the current browser profile. When unlocked, it supplies the signing key needed for wallet-authorized operations.
- **Wallet/account password:** in the new-account flow, the password both encrypts and unlocks local vault material and is used for Rocky account registration and authentication. In an imported or restored wallet, the password protects and unlocks the new local vault, while Backend restoration uses a signing-key challenge proof instead of password authentication. In every flow, the password is not a signing key and never substitutes for the recovery phrase or private key.
- **Recovery phrase:** the ordered words from which the wallet's signing material can be restored. Anyone who has the phrase can control the wallet.
- **Private key:** the secret signing value for the wallet. It provides the same direct control risk as the recovery phrase and must never be shared.
- **Automatic lock:** a protective Extension state that clears the unlocked signing session after its lock condition is reached. The password is required again before signing can continue.

The Wallet Backend stores public account and wallet state. For a newly registered Rocky account, it receives and processes the account password for registration and authentication. For an imported or restored wallet, the Extension decrypts the local vault with the password, signs a Backend challenge locally, and sends the signature as proof; it does not send that local password as the restoration credential. The Backend never receives the recovery phrase, private key, or wallet signing key. A password unlocks encrypted material but does not itself sign Canton transactions.

## Safe operating practices

- Use a dedicated browser profile that other people cannot open.
- Keep the browser and Rocky Wallet Extension current.
- Keep an offline, readable backup of the recovery phrase before funding the wallet.
- Verify a DApp's browser origin before connecting or starting an action, and compare the browser-verified origin shown for message signing.
- Lock Rocky Wallet manually before leaving a shared or unattended device.
- Send a small test transfer before sending a significant amount to a new recipient.
- Compare complete Party IDs and exact asset identities, not shortened labels, logos, or symbols alone.

## If a secret may be exposed

### Exposed password

Lock Rocky Wallet, stop using the affected browser profile, and secure the device. For a newly registered account, the exposed password can threaten Backend account authentication and a copied local vault. For an imported or restored wallet, that password protects the local vault but is not the Backend's signing-challenge credential. In either case, the password does not reveal the recovery phrase or private key by itself. Follow the supported account-access process, and do not assume that changing account credentials replaces wallet signing keys or re-encrypts every copied vault. If local encrypted data may also have been copied, move assets to a new wallet created on a trusted device.

### Exposed recovery phrase or private key

Treat the wallet signing material as compromised. Locking the Extension or changing an account password cannot revoke a copied phrase or key. On a trusted device, create a new wallet with new signing material, back it up offline, test the destination, and move assets as soon as safely possible.

Next: [Recovery and Reset](recovery-and-reset.md)
