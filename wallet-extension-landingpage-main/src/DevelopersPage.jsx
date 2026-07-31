import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import CopyCommand from './CopyCommand.jsx';
import { SiteFooter, SiteHeader } from './SiteShell.jsx';
import { PUBLIC_LINKS, SITE_VERSIONS } from './siteConfig.js';
import {
  DEVELOPER_CAPABILITIES,
  DEVELOPER_STEPS,
  SDK_INSTALL_COMMAND,
} from './siteContent.js';
import { applySiteMetadata, SITE_METADATA } from './siteMetadata.js';

const quickStartCode = `import { rocky } from "@rocky-wallet/dapp-sdk";

rocky.init({ appName: "My Canton dApp" });
await rocky.connect({ target: "local" });
const account = await rocky.getPrimaryAccount();`;

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

export default function DevelopersPage() {
  useEffect(() => { applySiteMetadata(window.document, SITE_METADATA.developers); }, []);

  return (
    <main className="rw-site rw-developers-page">
      <SiteHeader />

      <section className="rw-developer-hero">
        <div className="rw-developer-hero__content">
          <p className="rw-eyebrow">Rocky Wallet dApp SDK · {SITE_VERSIONS.sdk}</p>
          <h1>Connect your dApp to Rocky Wallet.</h1>
          <p>
            Rocky Wallet injects <code>window.rockyWallet</code> into compatible browser dApps.
            Your dApp sends requests through the SDK; approval and signing stay inside the
            extension.
          </p>
          <CopyCommand command={SDK_INSTALL_COMMAND} />
          <div className="rw-developer-hero__actions">
            <a className="rw-button rw-button-primary" href={PUBLIC_LINKS.docs} target="_blank" rel="noreferrer">
              Read the docs <ArrowRight aria-hidden="true" />
            </a>
            <a className="rw-button rw-button-secondary" href={PUBLIC_LINKS.sdkGitHub} target="_blank" rel="noreferrer">
              View SDK source <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
        <pre className="rw-code-card" aria-label="Rocky Wallet SDK quick start"><code>{quickStartCode}</code></pre>
      </section>

      <section className="rw-developer-section" id="quick-start">
        <SectionHeading eyebrow="Quick start" title="From install to wallet request." />
        <ol className="rw-developer-steps">
          {DEVELOPER_STEPS.map((step) => <DeveloperStep key={step.number} step={step} />)}
        </ol>
      </section>

      <section className="rw-developer-section" id="api">
        <SectionHeading eyebrow="SDK capabilities" title="Use the supported Rocky Wallet API." />
        <div className="rw-api-grid">
          {DEVELOPER_CAPABILITIES.map((group) => <ApiGroup key={group.title} group={group} />)}
        </div>
        <p className="rw-developer-note">
          Feature-detect optional methods before calling them because older extension releases may
          not expose every capability.
        </p>
      </section>

      <section className="rw-developer-section rw-security-boundary" id="security-boundary">
        <SectionHeading eyebrow="Security boundary" title="The dApp requests. Rocky Wallet approves." />
        <ol className="rw-security-flow">
          <li>
            <span>01</span>
            <h3>dApp</h3>
            <p>Builds an account, asset, transfer, or signing request.</p>
          </li>
          <li>
            <span>02</span>
            <h3>SDK</h3>
            <p>Validates the request and forwards it to the injected Rocky Wallet provider.</p>
          </li>
          <li>
            <span>03</span>
            <h3>Extension</h3>
            <p>Owns permissions, confirmation, wallet access, and signing.</p>
          </li>
        </ol>
        <p>
          Private keys and recovery material stay inside Rocky Wallet and are not exposed to the
          dApp or SDK.
        </p>
      </section>

      <section className="rw-developer-section" id="developer-resources">
        <SectionHeading eyebrow="Resources" title="Build against the current release." />
        <div className="rw-developer-resources">
          <DeveloperResource href={PUBLIC_LINKS.docs} label="Documentation" />
          <DeveloperResource href={PUBLIC_LINKS.npm} label={`SDK ${SITE_VERSIONS.sdk} on npm`} />
          <DeveloperResource href={PUBLIC_LINKS.sdkGitHub} label="SDK source on GitHub" />
          <DeveloperResource href={PUBLIC_LINKS.gitHub} label="Rocky Exchange on GitHub" />
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
