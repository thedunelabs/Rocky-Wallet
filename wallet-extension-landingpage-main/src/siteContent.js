import { SITE_VERSIONS } from './siteConfig.js';

export const HOME_FACTS = Object.freeze([
  { label: 'Network', value: 'Canton Network', icon: 'network' },
  { label: 'Wallet model', value: 'Non-custodial', icon: 'shield' },
  { label: 'Current release', value: `Extension ${SITE_VERSIONS.extension}`, icon: 'extension' },
  { label: 'Builder access', value: 'Open-source SDK', icon: 'code' },
]);
export const WALLET_STEPS = Object.freeze([
  { number: '01', title: 'Install and secure', description: 'Add Rocky Wallet to Chrome, then create or restore your protected wallet.' },
  { number: '02', title: 'Review every action', description: 'See the account, asset, amount, and request details before you approve.' },
  { number: '03', title: 'Use Canton with confidence', description: 'Manage assets, transfers, offers, and compatible dApp connections in one extension.' },
]);
export const USER_CAPABILITIES = Object.freeze([
  { title: 'Canton asset visibility', description: 'View configured Canton assets with clear names, balances, and asset identity.', icon: 'assets' },
  { title: 'Send and receive', description: 'Verify the recipient, asset, amount, and fee before approving a transfer.', icon: 'transfer' },
  { title: 'Offer management', description: 'Review incoming offers and handle supported actions from extension-owned screens.', icon: 'offers' },
  { title: 'Clear approvals', description: 'Keep connection, signing, and transaction confirmations inside Rocky Wallet.', icon: 'approval' },
  { title: 'Preapproved receiving', description: 'Enable registrar-level receiving permissions from the wallet when supported.', icon: 'receive' },
  { title: 'dApp connections', description: 'Connect compatible browser dApps through the Rocky Wallet provider and SDK.', icon: 'connection' },
]);
export const SECURITY_POINTS = Object.freeze([
  { title: 'Local encrypted vault', description: 'Wallet secrets remain protected by the extension vault and are not exposed to connected dApps.' },
  { title: 'Extension-owned confirmation', description: 'Rocky Wallet controls connection, transaction, and signing confirmation screens.' },
  { title: 'Exact asset identity', description: 'Requests use explicit asset information so display names do not replace underlying identity.' },
  { title: 'Recovery is your responsibility', description: 'Keep recovery material and wallet credentials private, accurate, and available.' },
]);
export const SDK_INSTALL_COMMAND = 'npm install @rocky-wallet/dapp-sdk';
export const DEVELOPER_STEPS = Object.freeze([
  { number: '01', title: 'Install', description: 'Add the Rocky Wallet dApp SDK to your browser application.' },
  { number: '02', title: 'Initialize', description: 'Import the Rocky client and identify your dApp.' },
  { number: '03', title: 'Connect', description: 'Request a connection to the provider injected by Rocky Wallet.' },
  { number: '04', title: 'Request', description: 'Ask for accounts, assets, transfers, or signatures for wallet approval.' },
]);
export const DEVELOPER_CAPABILITIES = Object.freeze([
  { title: 'Connection and accounts', methods: ['connect', 'disconnect', 'getPrimaryAccount', 'getAccounts', 'getActiveNetwork'] },
  { title: 'Assets and balances', methods: ['getCoinsBalance', 'getAssetCatalog'] },
  { title: 'Signing and transactions', methods: ['signMessage', 'signLoginChallenge', 'submitCommands'] },
  { title: 'Transfers', methods: ['buildTransfer', 'sendTransfer', 'transfer'] },
  { title: 'Offers', methods: ['getOffers', 'getNodeOffers'] },
]);
