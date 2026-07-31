export const SITE_METADATA = Object.freeze({
  landing: {
    title: 'Rocky Wallet | Canton Network Browser Wallet',
    description: 'Rocky Wallet is a non-custodial Chrome extension for managing Canton Network assets, reviewing wallet requests, and connecting to compatible dApps.',
  },
  developers: {
    title: 'Rocky Wallet SDK | Build Canton dApps',
    description: 'Connect browser dApps to Rocky Wallet with the Rocky Wallet dApp SDK, typed APIs, extension-owned approvals, and Canton asset workflows.',
  },
});

const META_SELECTORS = Object.freeze([
  ['meta[name="description"]', 'description'],
  ['meta[property="og:title"]', 'title'],
  ['meta[property="og:description"]', 'description'],
  ['meta[name="twitter:title"]', 'title'],
  ['meta[name="twitter:description"]', 'description'],
]);

export function applySiteMetadata(documentRef, metadata) {
  documentRef.title = metadata.title;
  for (const [selector, key] of META_SELECTORS) documentRef.querySelector(selector)?.setAttribute('content', metadata[key]);
}
