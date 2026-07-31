import { useEffect, useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  ChevronDown,
  CircleUserRound,
  Globe2,
  LockKeyhole,
  Mail,
  PenLine,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import heroImage from './assets/rocky-wallet-hero-transparent.png';
import DevelopersPage from './DevelopersPage.jsx';
import { validateJoinForm } from './joinForm.js';
import LandingPage from './LandingPage.jsx';
import { resolveSiteRoute } from './route.js';
import { SiteFooter, SiteHeader } from './SiteShell.jsx';
import { submitWaitlist } from './waitlistApi.js';

const legalDocuments = {
  '/privacy': {
    title: 'Privacy Policy',
    updated: 'Last updated: July 3, 2026',
    description:
      'This Privacy Policy explains how Rocky Wallet handles information when you use the Rocky Wallet browser extension, website, and Canton Network wallet features.',
    sections: [
      {
        heading: '1. Overview',
        body: [
          'Rocky Wallet is a non-custodial browser extension wallet designed for Canton Network users. This policy describes the information processed by the wallet, the information that stays on your device, and the limited situations where information may be shared with services you choose to use.',
          'Canton Network is designed around privacy-preserving transaction flows. Even so, wallet usage can involve local wallet data, network endpoints, browser permissions, dApps, and support communications. This policy applies only to Rocky Wallet-controlled services and does not control third-party dApps, validators, synchronizers, RPC endpoints, analytics tools, or websites.',
        ],
      },
      {
        heading: '2. Information We Do Not Collect',
        body: [
          'Rocky Wallet is non-custodial. We do not intentionally collect, store, or ask for your seed phrase, private keys, recovery phrase, biometric data, decrypted vault contents, or raw signing credentials.',
          'If backend account services are enabled, the backend may receive your account password during registration or login to authenticate you and store a password hash. Rocky Wallet should not store plaintext account passwords.',
          'You are responsible for keeping your recovery phrase and wallet credentials private. Rocky Wallet cannot recover them for you if they are lost.',
        ],
      },
      {
        heading: '3. Information Processed Locally',
        body: [
          'The extension may process and store wallet information locally in your browser storage so the product can work. This may include encrypted wallet vault data, account names, Canton party identifiers, public addresses or account identifiers, connected dApp permissions, transaction requests, settings, and user interface preferences.',
          'Local browser data is controlled through your browser profile. You may delete it by removing the extension, clearing browser extension storage, or resetting the wallet where the product provides that option.',
        ],
      },
      {
        heading: '4. Account and Backend Information',
        body: [
          'If the backend service is enabled, Rocky Wallet may process account and service information needed to operate the wallet service. This may include username, email address, password hash, invitation code status, email verification code status, session token hashes, account status, device metadata, wallet binding records, Rocky aliases, Canton party identifiers, public keys, wallet addresses, wallet challenge messages, nonces, and verification status.',
          'The backend may also store operational wallet records such as balances, transaction records, unsigned payload hashes, signed payload hashes, signatures submitted for transactions, Canton update identifiers, ledger event summaries, offer records, auto-receive permission preferences, idempotency keys, fee fields, rate-limit records, and service logs. These records support authentication, wallet onboarding, balance display, transfer preparation, transaction history, offer acceptance or rejection, auto-receive settings, abuse prevention, and service reliability.',
          'Where account restore, backup, or device continuity features are enabled, Rocky Wallet may store encrypted vault backup data. Rocky Wallet should not receive unencrypted seed phrases, private keys, recovery phrases, local wallet passwords, or decrypted vault contents.',
        ],
      },
      {
        heading: '5. Network, dApp, and Transaction Information',
        body: [
          'When you connect to a dApp or submit a transaction, information needed to complete that action may be shared with the selected dApp, Canton Network participants, validators, synchronizers, or infrastructure providers. This may include account identifiers, party identifiers, signatures, transaction payloads, connection permissions, request metadata, and network routing information.',
          'Rocky Wallet cannot control how third-party dApps or network infrastructure process data. Review the privacy policies and permissions of each dApp before connecting or signing.',
        ],
      },
      {
        heading: '6. Website, Support, and Communications',
        body: [
          'If you contact support, subscribe to updates, report a bug, or otherwise communicate with Rocky Wallet, we may process the information you provide, such as your email address, message content, device or browser information, and diagnostic details you choose to share.',
          'The public website and extension are not designed to use advertising cookies. If analytics, crash reporting, or similar tooling is added later, this policy should be updated to describe that tooling before launch.',
        ],
      },
      {
        heading: '7. Security',
        body: [
          'We use reasonable technical and organizational measures intended to protect information handled by Rocky Wallet. No wallet, browser extension, website, blockchain network, or internet transmission can be guaranteed to be fully secure.',
          'Always verify dApp URLs, transaction details, permissions, and signatures before approving requests.',
        ],
      },
      {
        heading: '8. Data Retention and Deletion',
        body: [
          'Local wallet data remains in your browser until you delete it, reset the wallet, or uninstall the extension. Backend account, session, wallet binding, challenge, transaction, balance, ledger event, offer, permission, invite, email verification, support, and operational records may be retained for as long as needed to provide the service, maintain security, prevent abuse, comply with legal obligations, resolve disputes, and improve reliability.',
        ],
      },
      {
        heading: '9. Children, International Use, and Changes',
        body: [
          'Rocky Wallet is not intended for children. If you use Rocky Wallet from outside the jurisdiction where the operator is based, your information may be processed in other locations as needed to provide the service.',
          'We may update this Privacy Policy from time to time. Continued use of Rocky Wallet after an updated policy is posted means the updated policy applies.',
        ],
      },
      {
        heading: '10. Contact',
        body: [
          'Questions about this Privacy Policy should be sent through the official Rocky Wallet support channel published by the operator.',
        ],
      },
    ],
  },
  '/terms': {
    title: 'Terms of Service',
    updated: 'Last updated: July 3, 2026',
    description:
      'These Terms of Service govern your access to and use of Rocky Wallet, a non-custodial browser extension wallet for Canton Network interactions.',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        body: [
          'By installing, accessing, or using Rocky Wallet, you agree to these Terms of Service. If you do not agree, do not use Rocky Wallet.',
          'These terms are a general template for a Canton Network plugin wallet and should be reviewed and adapted by qualified counsel before production use.',
        ],
      },
      {
        heading: '2. Rocky Wallet Service',
        body: [
          'Rocky Wallet provides browser extension software and related backend services that help users create or import wallets, register or restore accounts, manage local wallet data, bind Canton parties, review transaction requests, connect to compatible dApps, display balances, prepare and submit transfers, view transaction history, manage offers, configure auto-receive permissions, and sign Canton Network-related actions.',
          'Rocky Wallet is non-custodial software. We do not hold your assets, control your private keys, reverse transactions, guarantee network availability, or act as a broker, exchange, bank, custodian, investment adviser, or financial adviser.',
        ],
      },
      {
        heading: '3. Your Responsibilities',
        body: [
          'You are solely responsible for safeguarding your device, browser profile, passwords, recovery phrase, private keys, wallet backups, transaction approvals, and dApp permissions.',
          'You are responsible for confirming that each transaction, signature request, recipient, network, fee, and dApp interaction is accurate before approving it. Blockchain and Canton Network actions may be irreversible.',
        ],
      },
      {
        heading: '4. Accounts, Sessions, and Backend Availability',
        body: [
          'Some Rocky Wallet features require backend availability, account registration, email verification, invitation codes, session tokens, wallet binding, Canton external-party onboarding, or other service-side checks. We may refuse, throttle, suspend, or delay requests to protect the service, comply with law, prevent abuse, or maintain network reliability.',
          'You are responsible for keeping account credentials, browser profiles, sessions, devices, and local vault passwords secure. Rocky Wallet may not be able to restore local wallet access if your device data, password, recovery phrase, or private key is lost.',
        ],
      },
      {
        heading: '5. Canton Network and Third-Party Services',
        body: [
          'Rocky Wallet may connect with Canton Network infrastructure, validators, synchronizers, dApps, browser APIs, token contracts, and third-party services. These are not controlled by Rocky Wallet unless expressly stated.',
          'Third-party services may fail, change, become unavailable, charge fees, enforce their own terms, or handle data under their own policies. Your use of third-party services is at your own risk.',
        ],
      },
      {
        heading: '6. Risks',
        body: [
          'Digital assets, blockchain networks, dApps, smart contracts, browser extensions, and private-key systems involve significant risks. These risks include loss of access, software bugs, malicious dApps, phishing, incorrect signatures, network congestion, validator or synchronizer failures, market volatility, regulatory changes, and irreversible transactions.',
          'You should not use Rocky Wallet for assets or activity you cannot afford to lose.',
        ],
      },
      {
        heading: '7. No Financial, Legal, or Tax Advice',
        body: [
          'Rocky Wallet does not provide financial, investment, legal, tax, accounting, compliance, or regulatory advice. Information shown in the product is for general product functionality only. You should consult qualified professionals before making financial, legal, tax, or compliance decisions.',
        ],
      },
      {
        heading: '8. Eligibility and Compliance',
        body: [
          'You may use Rocky Wallet only if you are legally allowed to do so. You are responsible for complying with all applicable laws, sanctions rules, export controls, tax obligations, and dApp or network requirements in your jurisdiction.',
          'You may not use Rocky Wallet to violate law, infringe rights, distribute malware, bypass security controls, attack networks, facilitate fraud, or engage in unlawful financial activity.',
        ],
      },
      {
        heading: '9. Fees, Offers, and Auto-Receive Permissions',
        body: [
          'Canton Network, dApps, validators, infrastructure providers, Rocky Wallet, or other third parties may charge fees. Rocky Wallet may display estimated information, but estimates may be inaccurate or change before execution. You are responsible for all fees, taxes, and reporting obligations related to your use of Rocky Wallet.',
          'If you enable auto-receive or offer-related permissions, Rocky Wallet may prepare or submit supported offer acceptance or rejection flows according to your settings while the wallet is unlocked. You are responsible for reviewing and managing these permissions.',
        ],
      },
      {
        heading: '10. Disclaimers',
        body: [
          'Rocky Wallet is provided "as is" and "as available" without warranties of any kind, whether express, implied, statutory, or otherwise. We do not warrant that Rocky Wallet will be secure, uninterrupted, error-free, compatible with every dApp, or free from harmful components.',
        ],
      },
      {
        heading: '11. Limitation of Liability',
        body: [
          'To the maximum extent permitted by law, Rocky Wallet and its operators will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, lost data, lost assets, loss of goodwill, business interruption, or unauthorized access, even if advised of the possibility of such damages.',
        ],
      },
      {
        heading: '12. Changes, Suspension, and Termination',
        body: [
          'We may update Rocky Wallet, modify features, suspend access, discontinue services, or update these Terms from time to time. Continued use of Rocky Wallet after updated Terms are posted means you accept the updated Terms.',
        ],
      },
      {
        heading: '13. Contact',
        body: [
          'Questions about these Terms should be sent through the official Rocky Wallet support channel published by the operator.',
        ],
      },
    ],
  },
};

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const route = resolveSiteRoute(path);
  if (route === 'developers') return <DevelopersPage />;
  if (route === 'join') return <JoinPage />;
  if (route === 'privacy' || route === 'terms') return <LegalPage document={legalDocuments[path]} />;
  return <LandingPage />;
}

function JoinPage() {
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const previousTitle = window.document.title;
    const descriptionMeta = window.document.querySelector('meta[name="description"]');
    const previousDescription = descriptionMeta?.getAttribute('content');

    window.document.title = 'Join Rocky Wallet';

    if (descriptionMeta) {
      descriptionMeta.setAttribute(
        'content',
        'Join the Rocky Wallet waitlist for early access, product updates, and Canton Network wallet news.',
      );
    }

    return () => {
      window.document.title = previousTitle;
      if (descriptionMeta && previousDescription) {
        descriptionMeta.setAttribute('content', previousDescription);
      }
    };
  }, []);

  return (
    <main className="site-frame join-frame">
      <SiteHeader />

      <section className="join-page">
        <div className="join-shell">
          <div className="join-intro">
            <div className="trust-pill">
              <Sparkles size={14} fill="currentColor" />
              <span>Secure &bull; Simple &bull; Seamless</span>
            </div>
            <h1>Join Rocky Wallet</h1>
            <p>
              Complete your information to get early access, product updates, and everything you
              need to start using Rocky Wallet with confidence.
            </p>
          </div>

          <div className="join-visual" aria-hidden="true">
            <img src={heroImage} alt="" width="920" height="562" decoding="async" />
          </div>

          <div className="join-card">
            {submitted ? (
              <div className="join-success" role="status">
                <span className="join-success-icon">
                  <CheckCircle2 size={36} strokeWidth={2} />
                </span>
                <h2>You're on the Rocky Wallet waitlist</h2>
                <p>We'll send early access and product updates to the email address you provided.</p>
                <button className="button button-secondary" type="button" onClick={() => setSubmitted(false)}>
                  Update your information
                </button>
              </div>
            ) : (
              <form
                className="join-form"
                noValidate
                onSubmit={async (event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  const nextErrors = validateJoinForm({
                    email: formData.get('email'),
                    twitter: formData.get('twitter'),
                  });

                  setErrors(nextErrors);
                  setSubmitError('');
                  if (Object.keys(nextErrors).length > 0) return;

                  setSubmitting(true);
                  try {
                    await submitWaitlist({
                      email: String(formData.get('email') || '').trim(),
                      twitter: String(formData.get('twitter') || '').trim(),
                      full_name: String(formData.get('fullName') || '').trim(),
                      community_handle: String(formData.get('communityHandle') || '').trim(),
                      country: String(formData.get('country') || ''),
                      experience_level: String(formData.get('experience') || ''),
                      use_case: String(formData.get('useCase') || ''),
                      followed_x: formData.get('followedX') === 'on',
                      joined_community: formData.get('joinedCommunity') === 'on',
                      marketing_consent: formData.get('marketingConsent') === 'on',
                    });
                    setSubmitted(true);
                  } catch (error) {
                    setSubmitError(error instanceof Error ? error.message : 'Unable to join the waitlist. Please try again.');
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                <div className="join-form-heading">
                  <span className="join-form-icon">
                    <UserRound size={31} strokeWidth={1.9} />
                  </span>
                  <div>
                    <h2>Your Information</h2>
                    <p>Please provide the details below so we can get you set up.</p>
                  </div>
                </div>

                <div className="join-fields">
                  <label className="join-field">
                    <span>
                      Full name <small>(optional)</small>
                    </span>
                    <span className="join-control">
                      <UserRound size={18} strokeWidth={1.8} />
                      <input name="fullName" type="text" autoComplete="name" placeholder="Jane Doe" />
                    </span>
                  </label>

                  <label className="join-field">
                    <span>Email *</span>
                    <span className={`join-control ${errors.email ? 'has-error' : ''}`}>
                      <Mail size={18} strokeWidth={1.8} />
                      <input
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@domain.com"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'join-email-error' : undefined}
                        onChange={() => errors.email && setErrors((current) => ({ ...current, email: undefined }))}
                      />
                    </span>
                    {errors.email && (
                      <small className="join-error" id="join-email-error">
                        {errors.email}
                      </small>
                    )}
                  </label>

                  <label className="join-field">
                    <span>Telegram or Discord(optional)</span>
                    <span className="join-control">
                      <Send size={18} strokeWidth={1.8} />
                      <input name="communityHandle" type="text" placeholder="@username or username#1234" />
                    </span>
                  </label>

                  <label className="join-field">
                    <span>X / Twitter <span className="join-consent-x">(will send invite code this x) </span>*</span>
                    <span className={`join-control ${errors.twitter ? 'has-error' : ''}`}>
                      <X size={18} strokeWidth={1.8} />
                      <input
                        name="twitter"
                        type="text"
                        placeholder="@handle"
                        aria-invalid={Boolean(errors.twitter)}
                        aria-describedby={errors.twitter ? 'join-twitter-error' : undefined}
                        onChange={() => errors.twitter && setErrors((current) => ({ ...current, twitter: undefined }))}
                      />
                    </span>
                    {errors.twitter && (
                      <small className="join-error" id="join-twitter-error">
                        {errors.twitter}
                      </small>
                    )}
                  </label>

                  <label className="join-field">
                    <span>Country / Region(optional)</span>
                    <span className="join-control join-select-control">
                      <Globe2 size={18} strokeWidth={1.8} />
                      <select name="country" defaultValue="">
                        <option value="" disabled>Select your country</option>
                        <option value="sg">Singapore</option>
                        <option value="us">United States</option>
                        <option value="gb">United Kingdom</option>
                        <option value="jp">Japan</option>
                        <option value="kr">South Korea</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown size={17} strokeWidth={1.9} />
                    </span>
                  </label>

                  <label className="join-field">
                    <span>Experience level(optional)</span>
                    <span className="join-control join-select-control">
                      <BarChart3 size={18} strokeWidth={1.8} />
                      <select name="experience" defaultValue="">
                        <option value="" disabled>Select your experience level</option>
                        <option value="new">New to Web3</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="builder">Developer or builder</option>
                      </select>
                      <ChevronDown size={17} strokeWidth={1.9} />
                    </span>
                  </label>

                  <label className="join-field join-field-wide">
                    <span>
                      How do you plan to use Rocky Wallet? <small>(optional)</small>
                    </span>
                    <span className="join-control join-select-control">
                      <PenLine size={18} strokeWidth={1.8} />
                      <select name="useCase" defaultValue="">
                        <option value="" disabled>Select how you plan to use Rocky Wallet</option>
                        <option value="assets">Manage assets</option>
                        <option value="payments">Send and receive payments</option>
                        <option value="dapps">Connect to Canton dApps</option>
                        <option value="building">Build on Canton Network</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown size={17} strokeWidth={1.9} />
                    </span>
                  </label>
                </div>

                <label className="join-consent">
                  <input
                    name="followedX"
                    type="checkbox"
                  />
                  <span>
                    Have you followed <a href="https://x.com/Rocky_exchange" target="_blank" rel="noreferrer">Rocky on X (Twitter)</a>?
                  </span>
                </label>

                <label className="join-consent">
                  <input
                    name="joinedCommunity"
                    type="checkbox"
                  />
                  <span>
                    Have you joined <a href="https://discord.gg/Wu5VmFfjSn" target="_blank" rel="noreferrer">Rocky’s Discord</a> or Telegram community?
                  </span>
                </label>

                <label className="join-consent">
                  <input
                    name="marketingConsent"
                    type="checkbox"
                  />
                  <span>
                    I agree to receive product updates, announcements, and occasional community emails from Rocky Wallet.
                    <br />
                    I understand I can unsubscribe at any time.
                    <br />
                    View our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms of Service</a>.
                  </span>
                </label>
                {submitError && <p className="join-error join-submit-error" role="alert">{submitError}</p>}

                <button className="button button-primary join-submit" type="submit" disabled={submitting}>
                  <Sparkles size={19} strokeWidth={2.2} />
                  <span>{submitting ? 'Joining the waitlist...' : 'Join the Rocky Wallet Waitlist'}</span>
                </button>
              </form>
            )}
          </div>

          <div className="join-security" aria-label="Rocky Wallet privacy and security commitments">
            <div className="join-security-item join-security-lead">
              <span><ShieldCheck size={19} strokeWidth={2} /></span>
              <p><strong>Your information is encrypted and secure.</strong>We never share your data with third parties.</p>
            </div>
            <div className="join-security-item">
              <span><ShieldCheck size={19} strokeWidth={2} /></span>
              <p><strong>Privacy First</strong>Your data stays private</p>
            </div>
            <div className="join-security-item">
              <span><LockKeyhole size={18} strokeWidth={2} /></span>
              <p><strong>Secure &amp; Encrypted</strong>Protected by industry standards</p>
            </div>
            <div className="join-security-item">
              <span><CircleUserRound size={19} strokeWidth={2} /></span>
              <p><strong>You're in Control</strong>Update or withdraw anytime</p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

function LegalPage({ document }) {
  const alternatePath = document.title === 'Privacy Policy' ? '/terms' : '/privacy';
  const alternateLabel = document.title === 'Privacy Policy' ? 'Terms of Service' : 'Privacy Policy';

  useEffect(() => {
    const previousTitle = window.document.title;
    const descriptionMeta = window.document.querySelector('meta[name="description"]');
    const previousDescription = descriptionMeta?.getAttribute('content');

    window.document.title = `${document.title} | Rocky Wallet`;

    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', document.description);
    }

    return () => {
      window.document.title = previousTitle;
      if (descriptionMeta && previousDescription) {
        descriptionMeta.setAttribute('content', previousDescription);
      }
    };
  }, [document]);

  return (
    <main className="site-frame legal-frame">
      <SiteHeader />

      <section className="legal-hero">
        <div>
          <p className="legal-kicker">Rocky Wallet for Canton Network</p>
          <h1>{document.title}</h1>
          <p>{document.description}</p>
          <span>{document.updated}</span>
        </div>
      </section>

      <article className="legal-content">
        {document.sections.map((section) => (
          <section className="legal-section" key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}

        <div className="legal-actions">
          <a className="button button-secondary" href="/">
            Back to Home
          </a>
          <a className="button button-primary" href={alternatePath}>
            {alternateLabel}
          </a>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}

export default App;
