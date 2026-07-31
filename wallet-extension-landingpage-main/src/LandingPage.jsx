import { useEffect } from 'react';
import { ArrowRight, BadgeCheck, Boxes, Check, Code2, FileCheck2, Globe2, HandCoins, PackageCheck, Send, ShieldCheck, WalletCards } from 'lucide-react';
import heroImage from './assets/rocky-wallet-hero-transparent.png';
import previewImage from './assets/rocky-wallet-preview.png';
import { BrowserIcon, SiteFooter, SiteHeader } from './SiteShell.jsx';
import { PUBLIC_LINKS, SITE_VERSIONS } from './siteConfig.js';
import { HOME_FACTS, SECURITY_POINTS, SDK_INSTALL_COMMAND, USER_CAPABILITIES, WALLET_STEPS } from './siteContent.js';
import { applySiteMetadata, SITE_METADATA } from './siteMetadata.js';

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

export default function LandingPage() {
  useEffect(() => { applySiteMetadata(window.document, SITE_METADATA.landing); }, []);

  return (
    <main className="rw-site rw-marketing-page">
      <SiteHeader />
      <section className="rw-hero" id="install">
        <div className="rw-hero-copy">
          <p className="rw-eyebrow">Built for Canton Network</p>
          <h1>Your assets<br />Your approval<br />Your wallet</h1>
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
