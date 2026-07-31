import { useId, useState } from 'react';
import { Mail, Menu, X } from 'lucide-react';
import logoImage from './assets/rocky-wallet-logo.png';
import { headerNavItems } from './navigation.js';
import { FOOTER_GROUPS, PUBLIC_LINKS } from './siteConfig.js';

function ExternalAwareLink({ item, onClick }) {
  return <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined} onClick={onClick}>{item.label}</a>;
}

export function RockyLogo() {
  return (
    <img
      className="rocky-logo rw-logo"
      src={logoImage}
      alt=""
      width="128"
      height="128"
      decoding="async"
    />
  );
}

export function BrowserIcon() {
  const chromeClipId = `rwChromeClip-${useId().replace(/:/g, '')}`;

  return (
    <svg className="browser-svg chrome-icon rw-browser-icon" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <clipPath id={chromeClipId}>
          <circle cx="12" cy="12" r="10" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${chromeClipId})`}>
        <path d="M12 12L21.2 12C21.2 8.35 19.03 5.21 15.9 3.8H6.76L12 12Z" fill="#ea4335" />
        <path d="M12 12L6.76 3.8C3.78 5.4 1.8 8.49 1.8 12C1.8 13.83 2.34 15.52 3.28 16.95L7.86 9.04L12 12Z" fill="#fbbc04" />
        <path d="M12 12L7.86 9.04L3.28 16.95C4.94 19.66 7.9 21.5 11.3 21.5C14.86 21.5 17.96 19.49 19.54 16.55L14.94 8.6L12 12Z" fill="#34a853" />
        <path d="M12 12H21.2C21.2 13.63 20.79 15.17 20.06 16.5H12V12Z" fill="#4285f4" />
      </g>
      <circle cx="12" cy="12" r="5.05" fill="#ffffff" />
      <circle cx="12" cy="12" r="3.55" fill="#4285f4" />
    </svg>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="site-header" aria-label="Rocky Wallet navigation">
        <a className="brand" href="/" aria-label="Rocky Wallet home">
          <RockyLogo />
          <span>Rocky Wallet</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {headerNavItems.map((item) => (
            <ExternalAwareLink item={item} key={item.label} />
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="button button-primary button-small"
            href={PUBLIC_LINKS.chromeStore}
            target="_blank"
            rel="noreferrer"
          >
            <BrowserIcon />
            <span>Install Extension</span>
          </a>
        </div>
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={25} strokeWidth={2.4} /> : <Menu size={27} strokeWidth={2.6} />}
        </button>
      </header>

      {menuOpen && (
        <nav id="mobile-navigation" className="mobile-menu" aria-label="Mobile navigation">
          {headerNavItems.map((item) => (
            <ExternalAwareLink item={item} key={item.label} onClick={() => setMenuOpen(false)} />
          ))}
          <a
            href={PUBLIC_LINKS.chromeStore}
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            Install Extension
          </a>
        </nav>
      )}
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer" id="support">
      <div className="footer-brand">
        <a className="brand" href="/" aria-label="Rocky Wallet home">
          <RockyLogo />
          <span>Rocky Wallet</span>
        </a>
        <p>Your assets. Your approval. Your wallet.</p>
      </div>

      <div className="footer-links">
        {FOOTER_GROUPS.map((group) => (
          <div className="footer-group" key={group.title}>
            <h2>{group.title}</h2>
            {group.links.map((item) => (
              <ExternalAwareLink item={item} key={item.label} />
            ))}
          </div>
        ))}
      </div>

      <div className="footer-contact" aria-label="Rocky Wallet support contact">
        <h2>Contact</h2>
        <a className="footer-contact__email" href={`mailto:${PUBLIC_LINKS.supportEmail}`}>
          <Mail size={15} strokeWidth={2} aria-hidden="true" />
          <span>{PUBLIC_LINKS.supportEmail}</span>
        </a>
      </div>

      <p className="copyright">&copy; 2026 Rocky Wallet. All rights reserved.</p>
    </footer>
  );
}
