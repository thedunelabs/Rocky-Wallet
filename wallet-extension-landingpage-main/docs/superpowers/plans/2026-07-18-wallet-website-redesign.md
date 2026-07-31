# Rocky Wallet Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Rocky Wallet website around a wallet-first homepage and a dedicated SDK developer page, using only verified product facts and live Rocky resources.

**Architecture:** Keep the existing Vite/React application and pathname dispatcher. Move public URLs, versions, navigation, footer data, content, metadata, Clipboard behavior, and routing into testable modules; extract the reusable shell; then add focused landing and developer pages without changing waitlist or legal behavior.

**Tech Stack:** React 19, Vite 6, Lucide React, CSS, Node.js built-in test runner

---

## Source of Truth and File Map

Implement `docs/superpowers/specs/2026-07-18-wallet-website-redesign-design.md`. Verify developer examples against `../rocky-wallet-sdk/src/index.d.ts`, `../rocky-wallet-sdk/README.md`, and SDK package version `1.0.2`. Do not edit sibling repositories.

Create:

- `src/siteConfig.js`: public URLs, versions, footer groups.
- `src/route.js`: pathname normalization and route selection.
- `src/siteContent.js`: verified homepage/developer content.
- `src/siteMetadata.js`: page metadata data and DOM application.
- `src/copyText.js`: Clipboard adapter.
- `src/SiteShell.jsx`: shared logo, header, mobile navigation, footer.
- `src/LandingPage.jsx`: redesigned homepage.
- `src/CopyCommand.jsx`: copy UI and status feedback.
- `src/DevelopersPage.jsx`: SDK page.
- `src/marketing.css`: Refined Rocky styles.
- Matching `*.test.js` files described below.

Modify `src/navigation.js`, `src/navigation.test.js`, `src/footer.test.js`, `src/App.jsx`, `src/main.jsx`, `src/styles.css`, and `index.html`.

## Task 1: Centralize Links, Versions, Navigation, and Routes

**Files:**

- Create: `src/siteConfig.js`
- Create: `src/siteConfig.test.js`
- Create: `src/route.js`
- Create: `src/route.test.js`
- Modify: `src/navigation.js`
- Modify: `src/navigation.test.js`

- [ ] **Step 1: Write failing configuration and route tests**

Create `src/siteConfig.test.js`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { FOOTER_GROUPS, PUBLIC_LINKS, SITE_VERSIONS } from './siteConfig.js';

test('publishes approved Rocky destinations and versions', () => {
  assert.deepEqual(SITE_VERSIONS, { extension: '1.0.2', sdk: '1.0.2' });
  assert.equal(PUBLIC_LINKS.docs, 'https://extension-doc.rocky.exchange/');
  assert.equal(PUBLIC_LINKS.npm, 'https://www.npmjs.com/package/@rocky-wallet/dapp-sdk');
  assert.equal(PUBLIC_LINKS.sdkGitHub, 'https://github.com/Rocky-exchange/rocky-wallet-sdk');
  assert.equal(PUBLIC_LINKS.supportEmail, 'support@rocky.exchange');
});

test('footer contains live groups and no missing marketing anchors', () => {
  const links = FOOTER_GROUPS.flatMap((group) => group.links);
  const hrefs = links.map((link) => link.href);
  assert.deepEqual(FOOTER_GROUPS.map((group) => group.title), ['Product', 'Developers', 'Company', 'Community']);
  assert.equal(hrefs.some((href) => /^\/#(roadmap|learn|blog|help-center|about-us)$/.test(href)), false);
  assert.ok(links.some((link) => link.label === 'Documentation'));
  assert.ok(links.some((link) => link.label === 'SDK on npm'));
});
```

Create `src/route.test.js`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizePathname, resolveSiteRoute } from './route.js';

test('normalizes empty and trailing-slash paths', () => {
  assert.equal(normalizePathname(''), '/');
  assert.equal(normalizePathname('/developers/'), '/developers');
  assert.equal(normalizePathname('/privacy///'), '/privacy');
});

test('recognizes public routes and preserves the landing fallback', () => {
  assert.equal(resolveSiteRoute('/'), 'landing');
  assert.equal(resolveSiteRoute('/developers'), 'developers');
  assert.equal(resolveSiteRoute('/join'), 'join');
  assert.equal(resolveSiteRoute('/privacy'), 'privacy');
  assert.equal(resolveSiteRoute('/terms'), 'terms');
  assert.equal(resolveSiteRoute('/missing'), 'landing');
});
```

Replace `src/navigation.test.js` with:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { headerNavItems } from './navigation.js';
import { PUBLIC_LINKS } from './siteConfig.js';

test('header exposes product, documentation, developers, and support', () => {
  assert.deepEqual(headerNavItems, [
    { label: 'Features', href: '/#features' },
    { label: 'Security', href: '/#security' },
    { label: 'Documentation', href: PUBLIC_LINKS.docs, external: true },
    { label: 'Developers', href: '/developers' },
    { label: 'Support', href: '/#support' },
  ]);
});
```

- [ ] **Step 2: Run tests and confirm missing modules fail**

Run `npm test`.

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `siteConfig.js` or `route.js`.

- [ ] **Step 3: Implement centralized configuration**

Create `src/siteConfig.js`:

```js
export const SITE_VERSIONS = Object.freeze({ extension: '1.0.2', sdk: '1.0.2' });

export const PUBLIC_LINKS = Object.freeze({
  chromeStore: 'https://chromewebstore.google.com/detail/rocky-wallet/mgafpjfkpppnmpcdfpjghcajhpljomcn?hl=en&authuser=0',
  docs: 'https://extension-doc.rocky.exchange/',
  npm: 'https://www.npmjs.com/package/@rocky-wallet/dapp-sdk',
  sdkGitHub: 'https://github.com/Rocky-exchange/rocky-wallet-sdk',
  gitHub: 'https://github.com/Rocky-exchange',
  x: 'https://x.com/Rocky_exchange',
  telegram: 'https://t.me/Rockyexchangecommunity',
  discord: 'https://discord.gg/Wu5VmFfjSn',
  supportEmail: 'support@rocky.exchange',
});

export const FOOTER_GROUPS = Object.freeze([
  { title: 'Product', links: [
    { label: 'Features', href: '/#features' },
    { label: 'Security', href: '/#security' },
    { label: 'Install Extension', href: PUBLIC_LINKS.chromeStore, external: true },
  ] },
  { title: 'Developers', links: [
    { label: 'Documentation', href: PUBLIC_LINKS.docs, external: true },
    { label: 'SDK on npm', href: PUBLIC_LINKS.npm, external: true },
    { label: 'SDK on GitHub', href: PUBLIC_LINKS.sdkGitHub, external: true },
    { label: 'Developers page', href: '/developers' },
  ] },
  { title: 'Company', links: [
    { label: 'Join us', href: '/join' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ] },
  { title: 'Community', links: [
    { label: 'X (Twitter)', href: PUBLIC_LINKS.x, external: true },
    { label: 'Telegram', href: PUBLIC_LINKS.telegram, external: true },
    { label: 'Discord', href: PUBLIC_LINKS.discord, external: true },
    { label: 'GitHub', href: PUBLIC_LINKS.gitHub, external: true },
  ] },
]);
```

- [ ] **Step 4: Implement route and navigation modules**

Create `src/route.js`:

```js
const ROUTE_BY_PATH = Object.freeze({
  '/': 'landing', '/developers': 'developers', '/join': 'join', '/privacy': 'privacy', '/terms': 'terms',
});

export function normalizePathname(pathname = '/') {
  return String(pathname).replace(/\/+$/, '') || '/';
}

export function resolveSiteRoute(pathname) {
  return ROUTE_BY_PATH[normalizePathname(pathname)] || 'landing';
}
```

Replace `src/navigation.js` with:

```js
import { PUBLIC_LINKS } from './siteConfig.js';

export const headerNavItems = Object.freeze([
  { label: 'Features', href: '/#features' },
  { label: 'Security', href: '/#security' },
  { label: 'Documentation', href: PUBLIC_LINKS.docs, external: true },
  { label: 'Developers', href: '/developers' },
  { label: 'Support', href: '/#support' },
]);
```

- [ ] **Step 5: Verify and commit**

Run:

```bash
node --test src/siteConfig.test.js src/navigation.test.js src/route.test.js
npm test
```

Expected: all tests PASS.

Commit:

```bash
git add src/siteConfig.js src/siteConfig.test.js src/navigation.js src/navigation.test.js src/route.js src/route.test.js
git commit -m "refactor: centralize website links and routes"
```

## Task 2: Extract the Shared Site Shell

**Files:**

- Create: `src/SiteShell.jsx`
- Create: `src/siteShell.test.js`
- Modify: `src/footer.test.js`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write failing shell tests**

Create `src/siteShell.test.js`:

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('shared shell owns accessible navigation', async () => {
  const source = await readFile(new URL('./SiteShell.jsx', import.meta.url), 'utf8');
  assert.match(source, /aria-label="Primary navigation"/);
  assert.match(source, /aria-label="Mobile navigation"/);
  assert.match(source, /aria-expanded=\{menuOpen\}/);
  assert.match(source, /aria-controls="mobile-navigation"/);
  assert.match(source, /target=\{item\.external \? '_blank' : undefined\}/);
  assert.match(source, /rel=\{item\.external \? 'noreferrer' : undefined\}/);
});

test('application uses the shared shell', async () => {
  const source = await readFile(new URL('./App.jsx', import.meta.url), 'utf8');
  assert.match(source, /import \{ SiteFooter, SiteHeader \} from '\.\/SiteShell\.jsx'/);
  assert.match(source, /<SiteHeader \/>/);
  assert.match(source, /<SiteFooter \/>/);
});
```

Replace `src/footer.test.js` with:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { FOOTER_GROUPS, PUBLIC_LINKS } from './siteConfig.js';

test('footer exposes support and configured groups', () => {
  assert.equal(PUBLIC_LINKS.supportEmail, 'support@rocky.exchange');
  assert.deepEqual(FOOTER_GROUPS.map((group) => group.title), ['Product', 'Developers', 'Company', 'Community']);
});
```

- [ ] **Step 2: Run tests and confirm `SiteShell.jsx` is missing**

Run `node --test src/siteShell.test.js src/footer.test.js`.

Expected: FAIL because `SiteShell.jsx` does not exist.

- [ ] **Step 3: Implement the shared shell**

Create `src/SiteShell.jsx` with these complete public interfaces:

```jsx
import { useState } from 'react';
import { Mail, Menu, X } from 'lucide-react';
import logoImage from './assets/rocky-wallet-logo.png';
import { headerNavItems } from './navigation.js';
import { FOOTER_GROUPS, PUBLIC_LINKS } from './siteConfig.js';

function ExternalAwareLink({ item, onClick }) {
  return <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined} onClick={onClick}>{item.label}</a>;
}

export function RockyLogo() {
  return <img className="rw-logo" src={logoImage} alt="" width="128" height="128" decoding="async" />;
}

export function BrowserIcon() {
  return (
    <svg className="rw-browser-icon" viewBox="0 0 24 24" aria-hidden="true">
      <defs><clipPath id="rwChromeClip"><circle cx="12" cy="12" r="10" /></clipPath></defs>
      <g clipPath="url(#rwChromeClip)">
        <path d="M12 12L21.2 12C21.2 8.35 19.03 5.21 15.9 3.8H6.76L12 12Z" fill="#ea4335" />
        <path d="M12 12L6.76 3.8C3.78 5.4 1.8 8.49 1.8 12C1.8 13.83 2.34 15.52 3.28 16.95L7.86 9.04L12 12Z" fill="#fbbc04" />
        <path d="M12 12L7.86 9.04L3.28 16.95C4.94 19.66 7.9 21.5 11.3 21.5C14.86 21.5 17.96 19.49 19.54 16.55L14.94 8.6L12 12Z" fill="#34a853" />
        <path d="M12 12H21.2C21.2 13.63 20.79 15.17 20.06 16.5H12V12Z" fill="#4285f4" />
      </g>
      <circle cx="12" cy="12" r="5.05" fill="#fff" /><circle cx="12" cy="12" r="3.55" fill="#4285f4" />
    </svg>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <>
    <header className="rw-header" aria-label="Rocky Wallet navigation">
      <a className="rw-brand" href="/" aria-label="Rocky Wallet home"><RockyLogo /><span>Rocky Wallet</span></a>
      <nav className="rw-desktop-nav" aria-label="Primary navigation">{headerNavItems.map((item) => <ExternalAwareLink item={item} key={item.label} />)}</nav>
      <a className="rw-button rw-button-primary rw-header-install" href={PUBLIC_LINKS.chromeStore} target="_blank" rel="noreferrer">Install Extension</a>
      <button className="rw-menu-button" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
    </header>
    {menuOpen && <nav className="rw-mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">
      {headerNavItems.map((item) => <ExternalAwareLink item={item} key={item.label} onClick={() => setMenuOpen(false)} />)}
      <a className="rw-button rw-button-primary" href={PUBLIC_LINKS.chromeStore} target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>Install Extension</a>
    </nav>}
  </>;
}

export function SiteFooter() {
  return <footer className="rw-footer" id="support">
    <div className="rw-footer-brand">
      <a className="rw-brand" href="/" aria-label="Rocky Wallet home"><RockyLogo /><span>Rocky Wallet</span></a>
      <p>Your assets. Your approval. Your wallet.</p>
      <a className="rw-support-link" href={`mailto:${PUBLIC_LINKS.supportEmail}`}><Mail size={16} aria-hidden="true" /><span>{PUBLIC_LINKS.supportEmail}</span></a>
    </div>
    <div className="rw-footer-groups">{FOOTER_GROUPS.map((group) => <section className="rw-footer-group" key={group.title}><h2>{group.title}</h2>{group.links.map((item) => <ExternalAwareLink item={item} key={item.label} />)}</section>)}</div>
    <p className="rw-copyright">&copy; 2026 Rocky Wallet. All rights reserved.</p>
  </footer>;
}
```

- [ ] **Step 4: Replace repeated join/legal shell markup**

Import `SiteHeader` and `SiteFooter` in `src/App.jsx`. Replace the existing headers and conditional mobile menus in `JoinPage` and `LegalPage` with `<SiteHeader />`, and replace each `<Footer />` with `<SiteFooter />`. Remove only header-local `menuOpen` state that becomes unused. Do not change form fields, validation, waitlist submission, legal text, or alternate legal links.

- [ ] **Step 5: Remove extracted definitions and verify**

Remove `chromeStoreUrl`, `footerGroups`, `RockyLogo`, `BrowserIcon`, and `Footer` from `App.jsx` once no remaining code references them. Leave the old landing helpers until Task 3.

Run:

```bash
node --test src/siteShell.test.js src/footer.test.js src/joinForm.test.js src/waitlistApi.test.js
npm run build
```

Expected: all tests PASS and Vite exits 0.

- [ ] **Step 6: Commit the shared shell**

```bash
git add src/SiteShell.jsx src/siteShell.test.js src/footer.test.js src/App.jsx
git commit -m "refactor: share website navigation and footer"
```

## Task 3: Build the Wallet-First Homepage

**Files:**

- Create: `src/siteContent.js`
- Create: `src/siteContent.test.js`
- Create: `src/LandingPage.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write failing factual-content tests**

Create `src/siteContent.test.js`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { HOME_FACTS, SECURITY_POINTS, USER_CAPABILITIES, WALLET_STEPS } from './siteContent.js';

test('homepage replaces invented metrics with verified product facts', () => {
  assert.deepEqual(HOME_FACTS.map((fact) => fact.value), [
    'Canton Network', 'Non-custodial', 'Extension 1.0.2', 'Open-source SDK',
  ]);
  assert.doesNotMatch(JSON.stringify(HOME_FACTS), /1000\+|99\.99%|active users|uptime/i);
});

test('homepage lists only current wallet workflows', () => {
  assert.deepEqual(USER_CAPABILITIES.map((item) => item.title), [
    'Canton asset visibility', 'Send and receive', 'Offer management',
    'Clear approvals', 'Preapproved receiving', 'dApp connections',
  ]);
  assert.doesNotMatch(JSON.stringify({ USER_CAPABILITIES, WALLET_STEPS, SECURITY_POINTS }), /NFT|collectibles|more network support|low fees/i);
});
```

- [ ] **Step 2: Run the test and confirm the content module is missing**

Run `node --test src/siteContent.test.js`.

Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Add the complete verified content model**

Create `src/siteContent.js`:

```js
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
```

- [ ] **Step 4: Verify the content model passes**

Run `node --test src/siteContent.test.js`.

Expected: 2 tests PASS.

- [ ] **Step 5: Create `LandingPage.jsx` with the approved section order**

Import the existing hero and preview assets, `SiteHeader`, `SiteFooter`, `BrowserIcon`, `PUBLIC_LINKS`, `SITE_VERSIONS`, and the Task 3 content arrays. Implement these semantic sections in this exact order:

```jsx
export default function LandingPage() {
  return (
    <main className="rw-site rw-marketing-page">
      <SiteHeader />
      <section className="rw-hero" id="install">
        <div className="rw-hero-copy">
          <p className="rw-eyebrow">Built for Canton Network</p>
          <h1>Your assets. Your approval. Your wallet.</h1>
          <p className="rw-hero-lead">Rocky Wallet is a non-custodial Chrome extension for managing Canton assets, reviewing requests, and connecting to compatible dApps.</p>
          <div className="rw-hero-actions">
            <a className="rw-button rw-button-primary" href={PUBLIC_LINKS.chromeStore} target="_blank" rel="noreferrer"><BrowserIcon /> Install Extension</a>
            <a className="rw-button rw-button-secondary" href={PUBLIC_LINKS.docs} target="_blank" rel="noreferrer">Read Docs</a>
            <a className="rw-text-link" href="/developers">Build with SDK <ArrowRight aria-hidden="true" /></a>
          </div>
          <p className="rw-browser-note"><BrowserIcon /> Available for Chrome</p>
        </div>
        <div className="rw-hero-visual" aria-hidden="true"><img src={heroImage} alt="" width="920" height="562" decoding="async" /></div>
      </section>

      <section className="rw-facts" aria-label="Rocky Wallet product facts">
        {HOME_FACTS.map((fact) => <FactCard fact={fact} key={fact.value} />)}
      </section>

      <section className="rw-section" id="features">
        <SectionHeading eyebrow="Two clear paths" title="Use Rocky Wallet. Build with Rocky." description="Start with the extension, or take your dApp directly to the SDK and integration guides." />
        <div className="rw-path-grid">
          <article className="rw-path-card rw-wallet-path">
            <p className="rw-card-kicker">Use Rocky Wallet</p>
            <h3>Keep everyday Canton actions in one focused extension.</h3>
            <ol className="rw-step-list">{WALLET_STEPS.map((step) => <WalletStep step={step} key={step.number} />)}</ol>
            <a className="rw-button rw-button-primary" href={PUBLIC_LINKS.chromeStore} target="_blank" rel="noreferrer">Install Extension</a>
          </article>
          <article className="rw-path-card rw-developer-path">
            <p className="rw-card-kicker">Build with Rocky</p>
            <h3>Connect browser dApps through the Rocky Wallet SDK.</h3>
            <p>dApps request actions while Rocky Wallet owns connection approval, confirmation, wallet access, and signing.</p>
            <div className="rw-code-preview"><span>$</span><code>{SDK_INSTALL_COMMAND}</code></div>
            <p>SDK {SITE_VERSIONS.sdk} · Open source</p>
            <a className="rw-button rw-button-on-dark" href="/developers">Explore the SDK <ArrowRight aria-hidden="true" /></a>
          </article>
        </div>
      </section>

      <section className="rw-section rw-capabilities-section">
        <SectionHeading eyebrow="Wallet capabilities" title="Designed around real Canton workflows." description="No invented metrics or future-network promises—just the actions Rocky Wallet supports." />
        <div className="rw-capability-grid">{USER_CAPABILITIES.map((item) => <CapabilityCard item={item} key={item.title} />)}</div>
      </section>

      <section className="rw-section rw-security-section" id="security">
        <div>
          <SectionHeading eyebrow="Security and control" title="Requests come in. Your approval stays in the wallet." description="Sensitive wallet operations remain inside the extension, with final review before supported actions proceed." />
          <ul className="rw-security-list">{SECURITY_POINTS.map((point) => <SecurityPoint point={point} key={point.title} />)}</ul>
        </div>
        <img src={previewImage} alt="Rocky Wallet screens for balances, transfers, and connection approval" width="940" height="287" loading="lazy" decoding="async" />
      </section>

      <section className="rw-section rw-resources-section">
        <SectionHeading eyebrow="Resources" title="Continue with the right level of detail." />
        <div className="rw-resource-grid">
          <ResourceCard title="Documentation" description="Setup, wallet flows, SDK reference, and support." href={PUBLIC_LINKS.docs} />
          <ResourceCard title="npm package" description={`Install SDK ${SITE_VERSIONS.sdk}.`} href={PUBLIC_LINKS.npm} />
          <ResourceCard title="GitHub" description="Review SDK source and releases." href={PUBLIC_LINKS.sdkGitHub} />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
```

Place these imports, icon map, and complete helpers above `LandingPage`:

```jsx
import { ArrowRight, BadgeCheck, Boxes, Check, Code2, FileCheck2, Globe2, HandCoins, PackageCheck, Send, ShieldCheck, WalletCards } from 'lucide-react';
import heroImage from './assets/rocky-wallet-hero-transparent.png';
import previewImage from './assets/rocky-wallet-preview.png';
import { BrowserIcon, SiteFooter, SiteHeader } from './SiteShell.jsx';
import { PUBLIC_LINKS, SITE_VERSIONS } from './siteConfig.js';
import { HOME_FACTS, SECURITY_POINTS, SDK_INSTALL_COMMAND, USER_CAPABILITIES, WALLET_STEPS } from './siteContent.js';

const iconsByKey = {
  network: Globe2, shield: ShieldCheck, extension: PackageCheck, code: Code2,
  assets: WalletCards, transfer: Send, offers: HandCoins, approval: FileCheck2,
  receive: BadgeCheck, connection: Boxes,
};

function SectionHeading({ eyebrow, title, description }) {
  return <div className="rw-section-heading"><p className="rw-eyebrow">{eyebrow}</p><h2>{title}</h2>{description && <p>{description}</p>}</div>;
}

function FactCard({ fact }) {
  const Icon = iconsByKey[fact.icon];
  return <article className="rw-fact"><Icon aria-hidden="true" /><span><small>{fact.label}</small><strong>{fact.value}</strong></span></article>;
}

function WalletStep({ step }) {
  return <li><span>{step.number}</span><div><strong>{step.title}</strong><p>{step.description}</p></div></li>;
}

function CapabilityCard({ item }) {
  const Icon = iconsByKey[item.icon];
  return <article className="rw-capability-card"><span className="rw-capability-icon"><Icon aria-hidden="true" /></span><h3>{item.title}</h3><p>{item.description}</p></article>;
}

function SecurityPoint({ point }) {
  return <li><Check aria-hidden="true" /><span><strong>{point.title}</strong>{point.description}</span></li>;
}

function ResourceCard({ title, description, href }) {
  return <a className="rw-resource-card" href={href} target="_blank" rel="noreferrer"><span><strong>{title}</strong><span>{description}</span></span><ArrowRight aria-hidden="true" /></a>;
}
```

- [ ] **Step 6: Delegate landing routing from `App.jsx`**

Add:

```jsx
import LandingPage from './LandingPage.jsx';
import { resolveSiteRoute } from './route.js';
```

Replace the dispatcher with:

```jsx
function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const route = resolveSiteRoute(path);
  if (route === 'join') return <JoinPage />;
  if (route === 'privacy' || route === 'terms') return <LegalPage document={legalDocuments[path]} />;
  return <LandingPage />;
}
```

Delete the old `LandingPage`, `stats`, `features`, `StatsStrip`, `FeatureCard`, and `MiniFeatureCard`, then remove unused imports.

- [ ] **Step 7: Verify and commit the homepage**

Run:

```bash
npm test
npm run build
```

Expected: all tests PASS and Vite exits 0.

Commit:

```bash
git add src/siteContent.js src/siteContent.test.js src/LandingPage.jsx src/App.jsx
git commit -m "feat: redesign wallet website homepage"
```

## Task 4: Add the SDK Developer Page and Clipboard Feedback

**Files:**

- Create: `src/copyText.js`
- Create: `src/copyText.test.js`
- Create: `src/CopyCommand.jsx`
- Create: `src/DevelopersPage.jsx`
- Create: `src/developersPage.test.js`
- Modify: `src/App.jsx`

- [ ] **Step 1: Write failing Clipboard and developer-page tests**

Create `src/copyText.test.js`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { copyText } from './copyText.js';

test('copies through the supplied Clipboard API', async () => {
  const writes = [];
  const copied = await copyText('npm install @rocky-wallet/dapp-sdk', { writeText: async (value) => writes.push(value) });
  assert.equal(copied, 'npm install @rocky-wallet/dapp-sdk');
  assert.deepEqual(writes, ['npm install @rocky-wallet/dapp-sdk']);
});

test('rejects when clipboard access is unavailable', async () => {
  await assert.rejects(copyText('command', undefined), /Clipboard access is unavailable/);
});

test('preserves Clipboard API failures', async () => {
  await assert.rejects(copyText('command', { writeText: async () => { throw new Error('permission denied'); } }), /permission denied/);
});
```

Create `src/developersPage.test.js`:

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('developer page publishes SDK and extension security boundaries', async () => {
  const source = await readFile(new URL('./DevelopersPage.jsx', import.meta.url), 'utf8');
  assert.match(source, /SDK_INSTALL_COMMAND/);
  assert.match(source, /SITE_VERSIONS\.sdk/);
  assert.match(source, /window\.rockyWallet/);
  assert.match(source, /The dApp requests\. Rocky Wallet approves\./);
  assert.match(source, /PUBLIC_LINKS\.docs/);
  assert.match(source, /PUBLIC_LINKS\.npm/);
  assert.match(source, /PUBLIC_LINKS\.sdkGitHub/);
  assert.doesNotMatch(source, /@console-wallet\/dapp-sdk/);
});

test('copy UI keeps command selectable and exposes status feedback', async () => {
  const source = await readFile(new URL('./CopyCommand.jsx', import.meta.url), 'utf8');
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /Copy failed — select the command manually/);
  assert.match(source, /<code>\{command\}<\/code>/);
  assert.match(source, /setStatus\('copied'\)/);
  assert.match(source, /setStatus\('error'\)/);
});
```

- [ ] **Step 2: Run tests and confirm missing implementations fail**

Run `node --test src/copyText.test.js src/developersPage.test.js`.

Expected: FAIL with missing-module or missing-file errors.

- [ ] **Step 3: Implement the Clipboard adapter and UI**

Create `src/copyText.js`:

```js
export async function copyText(text, clipboard = globalThis.navigator?.clipboard) {
  if (!clipboard || typeof clipboard.writeText !== 'function') throw new Error('Clipboard access is unavailable');
  await clipboard.writeText(text);
  return text;
}
```

Create `src/CopyCommand.jsx`:

```jsx
import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyText } from './copyText.js';

export default function CopyCommand({ command }) {
  const [status, setStatus] = useState('idle');
  const resetTimer = useRef(undefined);
  useEffect(() => () => globalThis.clearTimeout(resetTimer.current), []);

  async function handleCopy() {
    globalThis.clearTimeout(resetTimer.current);
    try {
      await copyText(command);
      setStatus('copied');
      resetTimer.current = globalThis.setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
    }
  }

  return <div className="rw-copy-command">
    <span aria-hidden="true">$</span><code>{command}</code>
    <button type="button" onClick={handleCopy} aria-label="Copy SDK install command">
      {status === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      <span>{status === 'copied' ? 'Copied' : status === 'error' ? 'Retry' : 'Copy'}</span>
    </button>
    <span className="rw-copy-status" aria-live="polite">
      {status === 'copied' ? 'Install command copied.' : ''}
      {status === 'error' ? 'Copy failed — select the command manually' : ''}
    </span>
  </div>;
}
```

- [ ] **Step 4: Implement `DevelopersPage.jsx` against SDK 1.0.2**

Use the real loop-style public client:

```jsx
const quickStartCode = `import { rocky } from "@rocky-wallet/dapp-sdk";

rocky.init({ appName: "My Canton dApp" });
await rocky.connect({ target: "local" });
const account = await rocky.getPrimaryAccount();`;
```

Render the page with this structure:

```jsx
export default function DevelopersPage() {
  return <main className="rw-site rw-developers-page">
    <SiteHeader />
    <section className="rw-developer-hero">
      <div>
        <p className="rw-eyebrow">Rocky Wallet dApp SDK · {SITE_VERSIONS.sdk}</p>
        <h1>Connect your dApp to Rocky Wallet.</h1>
        <p>Use the SDK to reach the provider injected at <code>window.rockyWallet</code>, request supported actions, and keep approval and signing inside the extension.</p>
        <CopyCommand command={SDK_INSTALL_COMMAND} />
        <a className="rw-button rw-button-primary" href={PUBLIC_LINKS.docs} target="_blank" rel="noreferrer">Read the documentation</a>
        <a className="rw-text-link" href={PUBLIC_LINKS.sdkGitHub} target="_blank" rel="noreferrer">View source</a>
      </div>
      <div className="rw-developer-code-card"><pre><code>{quickStartCode}</code></pre></div>
    </section>
    <section className="rw-section rw-developer-steps">
      <SectionHeading eyebrow="Quick start" title="From install to a connected account." />
      <ol>{DEVELOPER_STEPS.map((step) => <DeveloperStep step={step} key={step.number} />)}</ol>
    </section>
    <section className="rw-section rw-api-section">
      <SectionHeading eyebrow="Supported workflows" title="A focused API for browser dApps." />
      <div className="rw-api-grid">{DEVELOPER_CAPABILITIES.map((group) => <ApiGroup group={group} key={group.title} />)}</div>
    </section>
    <section className="rw-section rw-boundary-section">
      <p className="rw-eyebrow">Security boundary</p><h2>The dApp requests. Rocky Wallet approves.</h2>
      <ol>
        <li><strong>dApp</strong><span>Creates a supported account, asset, transfer, or signing request.</span></li>
        <li><strong>SDK</strong><span>Transports the request to the injected provider.</span></li>
        <li><strong>Extension</strong><span>Owns permissions, confirmation, wallet access, and signing.</span></li>
      </ol>
      <p>Private keys and recovery material are not exposed to the connected dApp.</p>
    </section>
    <section className="rw-section rw-developer-resources">
      <SectionHeading eyebrow="Developer resources" title="Go deeper when you are ready." />
      <DeveloperResource href={PUBLIC_LINKS.docs} label="Documentation" />
      <DeveloperResource href={PUBLIC_LINKS.npm} label={`npm · ${SITE_VERSIONS.sdk}`} />
      <DeveloperResource href={PUBLIC_LINKS.sdkGitHub} label="SDK GitHub" />
      <DeveloperResource href={PUBLIC_LINKS.gitHub} label="Rocky Exchange GitHub" />
    </section>
    <SiteFooter />
  </main>;
}
```

Place these imports and helpers above `DevelopersPage`:

```jsx
import { ArrowRight } from 'lucide-react';
import CopyCommand from './CopyCommand.jsx';
import { SiteFooter, SiteHeader } from './SiteShell.jsx';
import { PUBLIC_LINKS, SITE_VERSIONS } from './siteConfig.js';
import { DEVELOPER_CAPABILITIES, DEVELOPER_STEPS, SDK_INSTALL_COMMAND } from './siteContent.js';

function SectionHeading({ eyebrow, title }) {
  return <div className="rw-section-heading"><p className="rw-eyebrow">{eyebrow}</p><h2>{title}</h2></div>;
}

function DeveloperStep({ step }) {
  return <li><span>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></li>;
}

function ApiGroup({ group }) {
  return <article className="rw-api-card"><h3>{group.title}</h3><ul>{group.methods.map((method) => <li key={method}><code>{method}()</code></li>)}</ul></article>;
}

function DeveloperResource({ href, label }) {
  return <a href={href} target="_blank" rel="noreferrer"><span>{label}</span><ArrowRight aria-hidden="true" /></a>;
}
```

Do not market `submitInstructionChoice`; SDK 1.0.2 keeps page-originated offer actions extension-owned.

- [ ] **Step 5: Render the developer route**

Import `DevelopersPage` in `App.jsx` and add this branch immediately after resolving the route:

```jsx
if (route === 'developers') return <DevelopersPage />;
```

- [ ] **Step 6: Verify and commit the developer page**

Run:

```bash
node --test src/copyText.test.js src/developersPage.test.js src/route.test.js
npm test
npm run build
```

Expected: all tests PASS and Vite exits 0.

Commit:

```bash
git add src/copyText.js src/copyText.test.js src/CopyCommand.jsx src/DevelopersPage.jsx src/developersPage.test.js src/App.jsx
git commit -m "feat: add Rocky Wallet SDK developer page"
```

## Task 5: Apply the Refined Rocky Visual System

**Files:**

- Create: `src/marketing.css`
- Create: `src/marketingStyles.test.js`
- Modify: `src/main.jsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write a failing visual-contract test**

Create `src/marketingStyles.test.js`:

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('marketing CSS implements the approved visual and accessibility contracts', async () => {
  const css = await readFile(new URL('./marketing.css', import.meta.url), 'utf8');
  assert.match(css, /--rw-orange:\s*#ff9f4c/i);
  assert.match(css, /--rw-blue:\s*#8ed7ee/i);
  assert.match(css, /--rw-navy:\s*#152c39/i);
  assert.match(css, /\.rw-developer-path/);
  assert.match(css, /\.rw-copy-command code\s*\{[^}]*user-select:\s*text/s);
  assert.match(css, /overflow-x:\s*auto/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\s*\(max-width:\s*900px\)/);
  assert.match(css, /@media\s*\(max-width:\s*560px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
});
```

- [ ] **Step 2: Run the CSS test and confirm the file is missing**

Run `node --test src/marketingStyles.test.js`.

Expected: FAIL because `marketing.css` does not exist.

- [ ] **Step 3: Create the design tokens, shell, controls, and typography**

Start `src/marketing.css` with:

```css
:root {
  --rw-ink: #172128;
  --rw-muted: #62717b;
  --rw-canvas: #f6f2ec;
  --rw-paper: #fffdfa;
  --rw-line: #e3ddd5;
  --rw-orange: #ff9f4c;
  --rw-orange-soft: #fff0df;
  --rw-blue: #8ed7ee;
  --rw-blue-soft: #e9f8fc;
  --rw-navy: #152c39;
  --rw-navy-deep: #0c202a;
  --rw-shadow: 0 24px 70px rgba(53, 43, 32, 0.11);
}

body {
  background: radial-gradient(circle at 12% 0%, rgba(255,159,76,.14), transparent 28rem), radial-gradient(circle at 92% 5%, rgba(142,215,238,.16), transparent 30rem), var(--rw-canvas);
  color: var(--rw-ink);
}

.rw-site {
  width: min(1440px, calc(100% - 32px));
  margin: 16px auto;
  overflow: clip;
  border: 1px solid rgba(227,221,213,.9);
  border-radius: 26px;
  background: var(--rw-paper);
  box-shadow: var(--rw-shadow);
}

.rw-header {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  min-height: 86px;
  padding: 0 clamp(28px,5vw,74px);
  border-bottom: 1px solid var(--rw-line);
  background: rgba(255,253,250,.92);
  backdrop-filter: blur(18px);
}

.rw-brand { display: inline-flex; align-items: center; gap: 12px; color: var(--rw-ink); font-size: 20px; font-weight: 900; letter-spacing: -.03em; }
.rw-logo { width: 44px; height: 44px; }
.rw-browser-icon { width: 22px; height: 22px; flex: 0 0 auto; }
.rw-desktop-nav { display: flex; justify-content: center; gap: clamp(18px,2.5vw,38px); color: #46545d; font-size: 14px; font-weight: 750; }
.rw-desktop-nav a:hover, .rw-footer a:hover, .rw-text-link:hover { color: #266e90; }
.rw-menu-button, .rw-mobile-nav { display: none; }

.rw-button {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 0 22px;
  border: 1px solid transparent;
  border-radius: 14px;
  font-weight: 850;
  line-height: 1;
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
}
.rw-button:hover { transform: translateY(-2px); }
.rw-button-primary { color: #151b1e; background: linear-gradient(105deg,#ffb66f 0%,#ffd1a1 45%,#a7deef 100%); box-shadow: 0 12px 26px rgba(109,122,120,.18); }
.rw-button-secondary { border-color: #d4d8d8; background: rgba(255,255,255,.78); }
.rw-button-on-dark { color: #12212a; background: #eef9fc; }
.rw-text-link { display: inline-flex; align-items: center; gap: 7px; color: #266e90; font-weight: 850; }
.rw-text-link-on-dark { color: #a8e3f3; }
.rw-site a:focus-visible, .rw-site button:focus-visible { outline: 3px solid rgba(40,132,178,.48); outline-offset: 4px; }

.rw-eyebrow { display: flex; align-items: center; gap: 7px; margin: 0 0 14px; color: #b96820; font-size: 12px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
.rw-section { padding: clamp(72px,8vw,116px) clamp(28px,7vw,104px); }
.rw-section-heading { max-width: 760px; margin-bottom: 38px; }
.rw-section-heading h2, .rw-boundary-section h2 { margin: 0 0 16px; font-size: clamp(38px,4.5vw,64px); line-height: 1.03; letter-spacing: -.05em; }
.rw-section-heading > p:last-child { margin: 0; color: var(--rw-muted); font-size: 18px; line-height: 1.65; }
```

- [ ] **Step 4: Add the homepage and footer layouts**

Append:

```css
.rw-hero { display: grid; grid-template-columns: minmax(0,.9fr) minmax(420px,1.1fr); align-items: center; gap: clamp(36px,6vw,92px); min-height: 640px; padding: clamp(64px,8vw,116px) clamp(28px,7vw,104px); background: radial-gradient(circle at 18% 25%,rgba(255,159,76,.18),transparent 28rem), radial-gradient(circle at 88% 18%,rgba(142,215,238,.24),transparent 31rem), linear-gradient(125deg,#fff9f2 0%,#fffdfa 48%,#f3fbfd 100%); }
.rw-hero h1, .rw-developer-hero h1 { margin: 18px 0; max-width: 720px; font-size: clamp(48px,6vw,84px); line-height: .98; letter-spacing: -.058em; }
.rw-hero-lead { max-width: 650px; color: var(--rw-muted); font-size: clamp(18px,2vw,22px); line-height: 1.6; }
.rw-hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 30px; }
.rw-browser-note { display: flex; align-items: center; gap: 8px; margin-top: 22px; color: var(--rw-muted); font-size: 14px; font-weight: 700; }
.rw-hero-visual { position: relative; }
.rw-hero-visual img { position: relative; z-index: 1; width: 100%; filter: drop-shadow(0 28px 38px rgba(66,72,69,.15)); }

.rw-facts { display: grid; grid-template-columns: repeat(4,1fr); border-top: 1px solid var(--rw-line); border-bottom: 1px solid var(--rw-line); }
.rw-fact { display: flex; min-height: 118px; align-items: center; gap: 14px; padding: 24px clamp(18px,3vw,36px); border-right: 1px solid var(--rw-line); }
.rw-fact:last-child { border-right: 0; }
.rw-fact svg { color: #bc681d; }
.rw-fact span { display: grid; gap: 5px; }
.rw-fact small { color: var(--rw-muted); font-size: 12px; }
.rw-fact strong { font-size: 18px; }

.rw-path-grid { display: grid; grid-template-columns: 1.08fr .92fr; gap: 24px; }
.rw-path-card { min-height: 520px; padding: clamp(28px,4vw,52px); border-radius: 30px; }
.rw-path-card h3 { margin: 18px 0 22px; font-size: clamp(32px,3vw,48px); line-height: 1.07; letter-spacing: -.04em; }
.rw-card-kicker { margin: 0; font-size: 13px; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }
.rw-wallet-path { background: linear-gradient(135deg,#ffc27d 0%,#ffe0bc 52%,#aee1ef 100%); }
.rw-developer-path { color: #eaf5f8; background: linear-gradient(145deg,var(--rw-navy) 0%,var(--rw-navy-deep) 100%); }
.rw-developer-path p { color: #b9cbd2; line-height: 1.6; }
.rw-step-list { display: grid; gap: 18px; margin: 28px 0 34px; padding: 0; list-style: none; }
.rw-step-list li { display: grid; grid-template-columns: 42px 1fr; gap: 12px; }
.rw-step-list li > span { font-weight: 900; }
.rw-step-list strong { display: block; }
.rw-step-list p { margin: 4px 0 0; color: #4f5e63; line-height: 1.5; }
.rw-code-preview { display: flex; gap: 10px; margin: 28px 0 14px; overflow-x: auto; padding: 17px; border: 1px solid #39515c; border-radius: 14px; background: #0b1c24; color: #9bdcf0; }
.rw-code-preview code { white-space: nowrap; }

.rw-capabilities-section { background: #fbf8f4; }
.rw-capability-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
.rw-capability-card { padding: 28px; border: 1px solid var(--rw-line); border-radius: 22px; background: var(--rw-paper); box-shadow: 0 14px 30px rgba(63,51,39,.05); }
.rw-capability-card h3 { margin: 22px 0 10px; font-size: 22px; }
.rw-capability-card p { margin: 0; color: var(--rw-muted); line-height: 1.6; }
.rw-capability-icon { display: grid; width: 48px; height: 48px; place-items: center; border-radius: 15px; background: linear-gradient(135deg,var(--rw-orange-soft),var(--rw-blue-soft)); }

.rw-security-section { display: grid; grid-template-columns: minmax(0,.9fr) minmax(420px,1.1fr); align-items: center; gap: clamp(32px,6vw,80px); }
.rw-security-list { display: grid; gap: 18px; margin: 32px 0 0; padding: 0; list-style: none; }
.rw-security-list li { display: grid; grid-template-columns: 28px 1fr; gap: 12px; color: var(--rw-muted); line-height: 1.55; }
.rw-security-list svg { color: #21825a; }
.rw-security-list strong { display: block; color: var(--rw-ink); }
.rw-security-section > img { width: 100%; border: 1px solid var(--rw-line); border-radius: 26px; box-shadow: var(--rw-shadow); }

.rw-resource-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
.rw-resource-card { display: grid; grid-template-columns: 1fr auto; gap: 14px; min-height: 170px; padding: 28px; border: 1px solid var(--rw-line); border-radius: 22px; background: #fff; }
.rw-resource-card strong { display: block; margin-bottom: 9px; font-size: 23px; }
.rw-resource-card span { color: var(--rw-muted); line-height: 1.5; }

.rw-footer { display: grid; grid-template-columns: minmax(240px,.75fr) 1.5fr; gap: 48px; padding: 64px clamp(28px,7vw,104px) 28px; border-top: 1px solid var(--rw-line); background: #f6f2ec; }
.rw-footer-brand > p { color: var(--rw-muted); }
.rw-support-link { display: inline-flex; align-items: center; gap: 8px; margin-top: 18px; color: #266e90; font-weight: 750; }
.rw-footer-groups { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; }
.rw-footer-group { display: flex; flex-direction: column; gap: 11px; }
.rw-footer-group h2 { margin: 0 0 6px; font-size: 13px; text-transform: uppercase; letter-spacing: .1em; }
.rw-footer-group a { color: var(--rw-muted); font-size: 14px; }
.rw-copyright { grid-column: 1 / -1; margin: 34px 0 0; padding-top: 24px; border-top: 1px solid var(--rw-line); color: var(--rw-muted); font-size: 13px; }
```

- [ ] **Step 5: Add the developer, copy, API, and boundary layouts**

Append:

```css
.rw-developer-hero { display: grid; grid-template-columns: minmax(0,1fr) minmax(420px,.9fr); align-items: center; gap: clamp(40px,7vw,100px); padding: clamp(72px,9vw,128px) clamp(28px,7vw,104px); color: #eff8fa; background: radial-gradient(circle at 82% 10%,rgba(142,215,238,.17),transparent 26rem), linear-gradient(145deg,var(--rw-navy) 0%,var(--rw-navy-deep) 100%); }
.rw-developer-hero .rw-eyebrow { color: #9ddff2; }
.rw-developer-hero > div > p:not(.rw-eyebrow) { color: #b9cbd2; font-size: 18px; line-height: 1.65; }
.rw-developer-code-card { overflow: hidden; border: 1px solid #3b5662; border-radius: 22px; background: #091a22; box-shadow: 0 30px 70px rgba(0,0,0,.28); }
.rw-developer-code-card pre { margin: 0; overflow-x: auto; padding: 32px; color: #a6e5f5; font-size: 14px; line-height: 1.8; }
.rw-copy-command { display: grid; grid-template-columns: auto minmax(0,1fr) auto; align-items: center; gap: 10px; margin: 28px 0 20px; overflow-x: auto; padding: 12px 12px 12px 18px; border: 1px solid #3b5662; border-radius: 16px; background: #0a1c24; color: #a6e5f5; }
.rw-copy-command code { overflow-x: auto; user-select: text; white-space: nowrap; }
.rw-copy-command button { display: inline-flex; align-items: center; gap: 7px; min-height: 40px; padding: 0 12px; border: 1px solid #45616d; border-radius: 11px; background: #152f3b; color: #eff8fa; cursor: pointer; }
.rw-copy-command button svg { width: 17px; }
.rw-copy-status { grid-column: 1 / -1; min-height: 1.2em; color: #c7d7dc; font-size: 13px; }

.rw-developer-steps ol { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; padding: 0; list-style: none; }
.rw-developer-steps li { min-height: 220px; padding: 26px; border: 1px solid var(--rw-line); border-radius: 22px; }
.rw-developer-steps li > span { color: #b96820; font-weight: 900; }
.rw-developer-steps h3 { margin: 38px 0 10px; font-size: 24px; }
.rw-developer-steps p { color: var(--rw-muted); line-height: 1.55; }

.rw-api-section { background: #fbf8f4; }
.rw-api-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; }
.rw-api-card { padding: 28px; border: 1px solid var(--rw-line); border-radius: 22px; background: #fff; }
.rw-api-card h3 { margin: 18px 0; font-size: 22px; }
.rw-api-card ul { display: flex; flex-wrap: wrap; gap: 8px; margin: 0; padding: 0; list-style: none; }
.rw-api-card code { display: inline-block; padding: 7px 9px; border-radius: 8px; background: var(--rw-blue-soft); color: #245b71; font-size: 12px; }

.rw-boundary-section { color: #eaf5f8; background: var(--rw-navy); }
.rw-boundary-section .rw-eyebrow { color: #9ddff2; }
.rw-boundary-section ol { display: grid; grid-template-columns: repeat(3,1fr); gap: 18px; margin: 38px 0; padding: 0; list-style: none; }
.rw-boundary-section li { min-height: 160px; padding: 26px; border: 1px solid #3b5662; border-radius: 20px; background: #0f2530; }
.rw-boundary-section strong, .rw-boundary-section span { display: block; }
.rw-boundary-section span { margin-top: 12px; color: #b9cbd2; line-height: 1.55; }

.rw-developer-resources > a { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 20px 0; border-top: 1px solid var(--rw-line); font-size: 18px; font-weight: 800; }
```

- [ ] **Step 6: Add responsive and reduced-motion rules**

Append:

```css
@media (max-width: 1100px) {
  .rw-desktop-nav { gap: 18px; }
  .rw-capability-grid, .rw-api-grid { grid-template-columns: repeat(2,1fr); }
  .rw-footer { grid-template-columns: 1fr; }
}

@media (max-width: 900px) {
  .rw-site { width: min(100% - 20px,1440px); margin: 10px auto; border-radius: 20px; }
  .rw-header { grid-template-columns: 1fr auto; min-height: 76px; padding: 0 24px; }
  .rw-desktop-nav, .rw-header-install { display: none; }
  .rw-menu-button { display: inline-grid; width: 46px; height: 46px; place-items: center; border: 0; background: transparent; }
  .rw-mobile-nav { display: grid; gap: 4px; padding: 12px 24px 24px; border-bottom: 1px solid var(--rw-line); }
  .rw-mobile-nav > a:not(.rw-button) { padding: 13px 4px; font-weight: 750; }
  .rw-hero, .rw-path-grid, .rw-security-section, .rw-developer-hero { grid-template-columns: 1fr; }
  .rw-facts { grid-template-columns: repeat(2,1fr); }
  .rw-resource-grid { grid-template-columns: 1fr; }
  .rw-developer-steps ol { grid-template-columns: repeat(2,1fr); }
  .rw-footer-groups { grid-template-columns: repeat(2,1fr); }
}

@media (max-width: 560px) {
  .rw-site { width: 100%; margin: 0; border: 0; border-radius: 0; }
  .rw-header { padding: 0 18px; }
  .rw-brand { font-size: 18px; }
  .rw-logo { width: 40px; height: 40px; }
  .rw-hero, .rw-developer-hero, .rw-section { padding-left: 20px; padding-right: 20px; }
  .rw-hero h1, .rw-developer-hero h1 { font-size: clamp(44px,14vw,62px); }
  .rw-hero-actions { align-items: stretch; flex-direction: column; }
  .rw-hero-actions .rw-button { width: 100%; }
  .rw-facts, .rw-capability-grid, .rw-api-grid, .rw-developer-steps ol, .rw-boundary-section ol, .rw-footer-groups { grid-template-columns: 1fr; }
  .rw-fact { border-right: 0; border-bottom: 1px solid var(--rw-line); }
  .rw-copy-command { grid-template-columns: auto minmax(0,1fr) auto; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .rw-site *, .rw-site *::before, .rw-site *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; }
}
```

- [ ] **Step 7: Import the stylesheet and remove only proven dead legacy rules**

Update `src/main.jsx` imports:

```jsx
import App from './App.jsx';
import './styles.css';
import './marketing.css';
```

Run `rg -o 'className="[^"]+' src/*.jsx | sort -u`, then remove from `styles.css` only old landing/header/footer selectors whose class names no longer occur. Preserve all `.join-*`, `.legal-*`, form, and legal dependencies. Do not reformat unrelated CSS.

- [ ] **Step 8: Verify CSS, build, and three viewport widths**

Run:

```bash
node --test src/marketingStyles.test.js
npm test
npm run build
npm run dev -- --host 127.0.0.1
```

Expected automated result: all tests PASS and Vite exits 0. Inspect `/` and `/developers` at approximately 390 px, 768 px, and 1280 px. Confirm CTA hierarchy, menu collapse, code scrolling, no overlap or horizontal page overflow, visible focus, and reduced-motion behavior.

- [ ] **Step 9: Commit the visual system**

```bash
git add src/marketing.css src/marketingStyles.test.js src/main.jsx src/styles.css
git commit -m "style: apply Refined Rocky website design"
```

## Task 6: Add Accurate Metadata and Remove Stale Public Copy

**Files:**

- Create: `src/siteMetadata.js`
- Create: `src/siteMetadata.test.js`
- Create: `src/publicCopy.test.js`
- Modify: `src/LandingPage.jsx`
- Modify: `src/DevelopersPage.jsx`
- Modify: `src/App.jsx`
- Modify: `index.html`

- [ ] **Step 1: Write failing metadata and public-copy tests**

Create `src/siteMetadata.test.js`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { applySiteMetadata, SITE_METADATA } from './siteMetadata.js';

test('defines distinct homepage and developer metadata', () => {
  assert.equal(SITE_METADATA.landing.title, 'Rocky Wallet | Canton Network Browser Wallet');
  assert.equal(SITE_METADATA.developers.title, 'Rocky Wallet SDK | Build Canton dApps');
  assert.match(SITE_METADATA.landing.description, /non-custodial Chrome extension/i);
  assert.match(SITE_METADATA.developers.description, /dApp SDK/i);
});

test('applies title and supported metadata fields', () => {
  const values = new Map();
  const documentRef = { title: '', querySelector: (selector) => ({ setAttribute: (name, value) => values.set(`${selector}:${name}`, value) }) };
  applySiteMetadata(documentRef, SITE_METADATA.developers);
  assert.equal(documentRef.title, SITE_METADATA.developers.title);
  assert.equal(values.get('meta[name="description"]:content'), SITE_METADATA.developers.description);
  assert.equal(values.get('meta[property="og:title"]:content'), SITE_METADATA.developers.title);
});
```

Create `src/publicCopy.test.js`:

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const files = ['./App.jsx', './LandingPage.jsx', './DevelopersPage.jsx', './siteContent.js', '../index.html'];

test('public source has no stale metrics, unsupported claims, or old SDK marker', async () => {
  const source = (await Promise.all(files.map((path) => readFile(new URL(path, import.meta.url), 'utf8')))).join('\n');
  assert.doesNotMatch(source, /1000\+|99\.99%/);
  assert.doesNotMatch(source, /tokens, NFTs, and collectibles/i);
  assert.doesNotMatch(source, /More network support is coming/i);
  assert.doesNotMatch(source, /@console-wallet\/dapp-sdk/);
  assert.doesNotMatch(source, /Chrome, Brave, Microsoft Edge, Firefox/);
});
```

- [ ] **Step 2: Run tests and confirm metadata is missing or stale**

Run `node --test src/siteMetadata.test.js src/publicCopy.test.js`.

Expected: FAIL because `siteMetadata.js` is missing and `index.html` still contains stale metadata.

- [ ] **Step 3: Implement metadata configuration and application**

Create `src/siteMetadata.js`:

```js
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
```

- [ ] **Step 4: Apply route metadata in both new pages**

Import `useEffect`, `applySiteMetadata`, and `SITE_METADATA`. Add to `LandingPage`:

```jsx
useEffect(() => { applySiteMetadata(window.document, SITE_METADATA.landing); }, []);
```

Add to `DevelopersPage`:

```jsx
useEffect(() => { applySiteMetadata(window.document, SITE_METADATA.developers); }, []);
```

Keep existing join/legal metadata effects unchanged.

- [ ] **Step 5: Correct `index.html` metadata and structured data**

Use the homepage title and description above for `<title>`, description, Open Graph, and Twitter tags. Replace the structured-data values with:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Rocky Wallet",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Chrome",
  "softwareVersion": "1.0.2",
  "description": "Rocky Wallet is a non-custodial Chrome extension for managing Canton Network assets, reviewing wallet requests, and connecting to compatible dApps.",
  "image": "https://rocky.exchange/rocky-wallet-og.png",
  "logo": "https://rocky.exchange/rocky-wallet-logo.png",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "brand": { "@type": "Brand", "name": "Rocky Wallet" }
}
```

Keep existing favicon, robots, canonical, image, and card tags. Do not assume a new deployed hostname.

- [ ] **Step 6: Remove obsolete code and verify public copy**

Run:

```bash
rg -n "1000\+|99\.99%|NFT|collectibles|More network support|function (LandingPage|Footer|RockyLogo|BrowserIcon|StatsStrip|FeatureCard|MiniFeatureCard)" src/App.jsx
```

Remove only leftover obsolete definitions and imports. Preserve `JoinPage`, `LegalPage`, `legalDocuments`, form behavior, and waitlist calls.

Run:

```bash
node --test src/siteMetadata.test.js src/publicCopy.test.js
npm test
npm run build
```

Expected: all tests PASS and Vite exits 0.

- [ ] **Step 7: Commit metadata and cleanup**

```bash
git add src/siteMetadata.js src/siteMetadata.test.js src/publicCopy.test.js src/LandingPage.jsx src/DevelopersPage.jsx src/App.jsx index.html
git commit -m "chore: align website metadata and public copy"
```

## Task 7: Final Route, Interaction, and Regression Verification

**Files:**

- Verify: `src/App.jsx`
- Verify: `src/LandingPage.jsx`
- Verify: `src/DevelopersPage.jsx`
- Verify: `src/SiteShell.jsx`
- Verify: `src/styles.css`
- Verify: `src/marketing.css`
- Verify: `dist/`

- [ ] **Step 1: Run the complete automated suite**

Run:

```bash
npm test
```

Expected: every Node test passes with zero failures.

- [ ] **Step 2: Rebuild the production output from scratch**

Run:

```bash
npm run build
```

Expected: Vite exits 0 and refreshes `dist/`. `dist/` remains ignored and is not committed.

- [ ] **Step 3: Scan application source for prohibited copy and broken anchors**

Run:

```bash
rg -n "1000\+|99\.99%|tokens, NFTs|More network support|@console-wallet/dapp-sdk|/#(roadmap|learn|blog|help-center|about-us)" src index.html
```

Expected: no output.

- [ ] **Step 4: Start the local app and verify all public routes resolve**

Run `npm run dev -- --host 127.0.0.1`. In a second terminal run:

```bash
for path in / /developers /join /privacy /terms; do
  curl --silent --output /dev/null --write-out "%{http_code} ${path}\n" "http://127.0.0.1:5173${path}"
done
```

Expected:

```text
200 /
200 /developers
200 /join
200 /privacy
200 /terms
```

- [ ] **Step 5: Verify homepage interaction and responsive behavior**

At approximately 390 px, 768 px, and 1280 px confirm:

- Header/mobile menu contains Features, Security, Documentation, Developers, and Support.
- Install Extension opens the approved Chrome Web Store URL.
- Read Docs opens `https://extension-doc.rocky.exchange/`.
- Build with SDK opens `/developers` in the same tab.
- Four approved facts and six factual capabilities render.
- Documentation, npm, and GitHub cards use live external URLs.
- Mobile menu, product artwork, cards, and footer do not overflow.
- Keyboard focus is visible and reduced-motion emulation suppresses nonessential transitions.

- [ ] **Step 6: Verify developer behavior**

Confirm:

- SDK version is 1.0.2.
- The command stays selectable.
- Copy shows `Copied`, announces success, and resets after about two seconds.
- Denied Clipboard permission leaves the command visible and shows manual-copy guidance.
- The example imports `rocky` and calls methods present in SDK 1.0.2.
- API groups contain only methods in `../rocky-wallet-sdk/src/index.d.ts`.
- The boundary ends with extension-owned permissions, confirmation, wallet access, and signing.
- Documentation, npm, SDK GitHub, and organization GitHub links are correct.

- [ ] **Step 7: Verify preserved routes**

Confirm `/join` still validates email and X handle and retains loading, success, and server-error states. Confirm `/privacy` and `/terms` retain document content and alternate legal links. All three pages must use the new shared header and footer.

- [ ] **Step 8: Confirm repository cleanliness**

Run:

```bash
git status --short --branch
git diff --check
git log --oneline --decorate -8
```

Expected: no unintended files, no whitespace errors, and implementation commits appear in task order. If manual verification finds a defect, first add the smallest regression test that reproduces it, then implement the narrow fix, rerun `npm test` and `npm run build`, and commit with a message naming the observed defect.

## Completion Criteria

- `/` and `/developers` match A — Refined Rocky.
- Homepage action priority is Install Extension, Read Docs, Build with SDK.
- Only approved facts, current workflows, SDK methods, and security boundaries are public.
- No public source references the old SDK package marker or missing marketing anchors.
- Join and legal behavior remain intact.
- Clipboard success/failure, responsive layout, keyboard focus, and reduced motion are verified.
- `npm test` and `npm run build` pass.
