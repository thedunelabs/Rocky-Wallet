# Rocky Wallet Website Redesign

**Status:** Approved for implementation planning

**Date:** 2026-07-18

**Visual direction:** A — Refined Rocky

## 1. Purpose

Redesign the Rocky Wallet website so it serves two audiences without making either one search for the correct entry point:

1. Wallet users who want to understand the product and install the Chrome extension.
2. dApp developers who want documentation, the Rocky Wallet SDK, API guidance, and source links.

The site must describe the product accurately, use only verifiable facts, and replace stale or non-functional links with live Rocky resources.

## 2. Goals

- Make **Install Extension** the primary conversion on the homepage.
- Give documentation and SDK users an obvious secondary path.
- Add a dedicated `/developers` page with enough information to evaluate and start using the SDK.
- Preserve Rocky Wallet's orange–blue brand while strengthening the developer presentation.
- Replace unverified metrics and inaccurate feature claims with factual product information.
- Centralize public links and version strings so pages stay consistent.
- Keep all existing join, privacy, and terms routes working.
- Deliver a responsive and accessible experience across mobile, tablet, and desktop.

## 3. Non-goals

- No changes to the wallet extension, backend, or SDK repository.
- No changes to the waitlist API or join form submission contract.
- No new CMS, analytics system, content API, or frontend router dependency.
- No speculative roadmap, future-network promise, live usage metric, or unsupported product claim.
- No full documentation duplication on the marketing site; detailed technical material remains in the Rocky Wallet documentation.

## 4. Audience and Conversion Order

### Wallet users

Wallet users should first see what Rocky Wallet is, which network it supports, how it protects control of their wallet, and how to install it.

### Developers

Developers should be able to identify the SDK path from the hero, reach `/developers` from the global navigation, copy the install command, and continue to npm, GitHub, or full documentation.

### Homepage action priority

1. **Install Extension** — primary button.
2. **Read Docs** — secondary button.
3. **Build with SDK** — tertiary text link to `/developers`.

## 5. Information Architecture

### Routes

| Route | Purpose | Change |
| --- | --- | --- |
| `/` | Product landing page for users and developers | Full redesign |
| `/developers` | SDK overview and developer quick start | New page |
| `/join` | Existing waitlist form | Preserve behavior; synchronize global navigation and footer |
| `/privacy` | Existing privacy policy | Preserve content and route; synchronize global navigation and footer |
| `/terms` | Existing terms of service | Preserve content and route; synchronize global navigation and footer |

The existing pathname-based route selection remains. Unknown paths retain the current fallback behavior so the hosting configuration does not need to change.

### Global navigation

Desktop navigation:

- Features → `/#features`
- Security → `/#security`
- Documentation → external documentation URL
- Developers → `/developers`
- Support → `/#support`
- Install Extension → Chrome Web Store URL

Mobile navigation contains the same destinations inside an accessible collapsible menu. Opening and closing the menu must preserve keyboard focus visibility and expose the correct `aria-expanded` state.

### Footer

The footer contains only working destinations:

- Product: Features, Security, Install Extension
- Developers: Documentation, SDK on npm, SDK on GitHub, Developers page
- Company: Join us, Privacy Policy, Terms of Service
- Community: X, Telegram, Discord, GitHub organization
- Support: existing support contact from the current site

Remove the current Roadmap, Learn, Blog, Help Center, and About Us links because their targets do not exist.

## 6. Homepage Design

The homepage uses a progressive dual-track structure: it begins with a clear wallet message, then exposes the developer path without competing with the primary installation action.

### 6.1 Hero

Proposed headline:

> Your assets. Your approval. Your wallet.

Supporting copy describes Rocky as a non-custodial Chrome extension wallet for Canton Network and introduces the builder path without referencing another wallet SDK.

The hero contains:

- Primary Install Extension button.
- Secondary Read Docs button.
- Build with SDK text link.
- Existing Rocky wallet product imagery, presented in the refined visual system.

### 6.2 Verifiable fact strip

Replace the current `1000+ Active Users`, `1000+ Secure Signatures`, and `99.99% Uptime` claims with four product facts:

- Canton Network
- Non-custodial
- Extension 1.0.2
- Open-source SDK

These are labels, not simulated live metrics.

### 6.3 Dual entry paths

#### Use Rocky Wallet

Summarize the user journey and link to installation or relevant documentation:

- Install the extension.
- Manage configured Canton assets.
- Send and receive transfers.
- Review offers and signing requests.
- Enable preapproved receiving where supported.
- Protect and recover wallet access.

#### Build with Rocky

Use a dark technical surface inside the otherwise light page. Show:

- `npm install @rocky-wallet/dapp-sdk`
- SDK version 1.0.2
- Link to `/developers`
- Links to documentation, npm, and GitHub
- A concise statement that dApps request actions while the extension owns wallet approval and signing

### 6.4 Product capabilities

Replace the existing feature set with claims grounded in the current product:

- Canton asset visibility
- Send and receive flows
- Offer review and management
- Clear signing confirmation
- Preapproved receiving permissions
- dApp connection through the Rocky provider and SDK

Remove references to NFTs, collectibles, low-fee promises, and future network support.

### 6.5 Security and control

Explain the user-facing boundaries in plain language:

- Wallet material is protected by the extension's local encrypted vault.
- The extension owns connection, transaction, and signing confirmation UI.
- Asset identity is resolved accurately rather than relying on ambiguous display text.
- Users are responsible for keeping recovery material and credentials safe.

Avoid absolute security guarantees such as “fully secure,” “risk-free,” or “we protect you from risks.”

### 6.6 Resource section

Three prominent resource cards:

1. Documentation
2. Rocky Wallet SDK
3. GitHub

Each card must identify its destination and open external resources in a new tab with safe link attributes.

## 7. Developers Page

The `/developers` page is a concise product entry point, not a replacement for full documentation.

### 7.1 Developer hero

- Headline centered on connecting browser dApps to Rocky Wallet.
- SDK install command with a copy button.
- Version badge: 1.0.2.
- Primary link to documentation.
- Secondary links to npm and GitHub.

The copy must use only Rocky Wallet naming and must not mention `@console-wallet/dapp-sdk`.

### 7.2 Four-step quick start

1. Install `@rocky-wallet/dapp-sdk`.
2. Detect or connect to the provider injected at `window.rockyWallet` through the SDK.
3. Request accounts or wallet data.
4. Submit transactions or signing requests for explicit extension approval.

Code samples must stay short, syntactically valid, and consistent with the published SDK API. The implementation phase must verify sample names against the local SDK source before publishing the copy.

### 7.3 Capability groups

Organize the published dApp-facing methods into user-recognizable groups:

- Connection and accounts
- Assets and balances
- Signing and transactions
- Transfers
- Offers

Do not invent APIs. The implementation plan must derive the final method list from the version 1.0.2 SDK source and tests.

### 7.4 Security boundary

Explain that:

- A dApp can request an action.
- The SDK transports that request to Rocky Wallet.
- The extension controls connection permissions, confirmation UI, wallet access, and signing.
- The website and SDK do not expose private keys to the dApp.

### 7.5 Developer resources

End with direct links to:

- Full documentation
- npm package
- SDK GitHub repository
- GitHub organization

## 8. Visual Direction

### A — Refined Rocky

The approved direction preserves the current friendly orange–blue identity while introducing a limited dark navy surface for developer content.

Visual principles:

- Warm off-white page background rather than a sterile full-white canvas.
- Orange-to-blue gradients reserved for brand moments and primary wallet surfaces.
- Deep navy used for code, SDK, and technical boundary sections.
- Strong, compact headings with restrained body typography.
- Large rounded cards and soft shadows consistent with the extension product UI.
- Product screenshots and existing Rocky assets remain the primary illustrations.
- No generic Web3 globe, coin, NFT, or stock imagery.
- No excessive gradients, floating decoration, or animation that distracts from CTAs.

The developer treatment should feel related to the wallet, not like a separate corporate site.

## 9. Interaction Design

### Install command copy

- The code block remains selectable at all times.
- Copy uses the Clipboard API where available.
- Success feedback changes the control label to a short confirmation such as `Copied`.
- The success state returns to `Copy` after a short delay.
- On failure, show an inline `Copy failed — select the command manually` message without hiding the command.
- Feedback must be exposed to assistive technology with an appropriate live region.

### Links

- External documentation, npm, GitHub, social, and Chrome Store links open in a new tab.
- External links use `rel="noreferrer"` or an equivalent safe value.
- Internal navigation remains in the current tab.
- There must be no links to absent homepage anchors.

### Motion

- Use only lightweight entry transitions and hover/press feedback.
- Respect `prefers-reduced-motion`.
- Motion must not delay navigation, copying, or installation actions.

## 10. Responsive Behavior

### Desktop

- Full navigation and Install Extension button are visible.
- Hero supports side-by-side copy and product artwork.
- User and developer paths can sit side by side while retaining the wallet-first hierarchy.

### Tablet

- Reduce hero scale and card density without reducing tap targets.
- Allow dual-path content to wrap when width becomes constrained.

### Mobile

- Use the existing collapsible navigation pattern with synchronized destinations.
- Stack hero copy, CTAs, and imagery.
- Keep Install Extension visually primary.
- Stack user and developer paths.
- Permit code blocks to scroll horizontally without expanding the viewport.
- Maintain minimum practical touch target sizes and visible focus styles.

Target verification widths should include approximately 390 px, 768 px, and a desktop width of 1280 px or greater.

## 11. Accessibility

- Use semantic headings in a logical order.
- Use real links and buttons for interactive controls.
- Provide descriptive alternative text for informative screenshots and empty alternative text for decoration.
- Preserve visible keyboard focus for all navigation and copy controls.
- Ensure mobile menu state is announced correctly.
- Do not communicate state by color alone.
- Maintain readable contrast on orange, blue, gradient, and navy surfaces.
- Announce copy success or failure without moving focus.
- Respect reduced-motion preferences.

## 12. SEO and Metadata

- Homepage title and description should describe Rocky Wallet as a Canton Network browser wallet.
- `/developers` receives its own title and description centered on the Rocky Wallet dApp SDK.
- Existing join and legal route metadata behavior remains.
- Headings and link labels should be meaningful without relying on nearby decoration.

## 13. Technical Design

### Routing

Keep the current lightweight pathname dispatcher and add a `/developers` branch. Do not add React Router solely for this change.

### Shared configuration

Create a single source of truth for public destinations and versions, including:

```text
Chrome Web Store
https://chromewebstore.google.com/detail/rocky-wallet/mgafpjfkpppnmpcdfpjghcajhpljomcn?hl=en&authuser=0

Documentation
https://extension-doc.rocky.exchange/

npm
https://www.npmjs.com/package/@rocky-wallet/dapp-sdk

SDK GitHub
https://github.com/Rocky-exchange/rocky-wallet-sdk

GitHub organization
https://github.com/Rocky-exchange

Extension version
1.0.2

SDK version
1.0.2
```

Existing social and support destinations should also use the same configuration rather than being repeated throughout JSX.

### Component boundaries

Use focused shared components for:

- Site header and mobile navigation
- Site footer
- External resource links or cards
- SDK install command and copy feedback
- Repeated section headings or capability cards where reuse improves consistency

The homepage and developer page should be independently readable page components. Existing join and legal behavior should be preserved while reusing the new global shell where practical. Avoid a broad refactor of the waitlist and legal content unrelated to the redesign.

### Data flow

- Landing content is static local data.
- Developer content is static local data verified against SDK 1.0.2.
- Copy interaction uses local component state only.
- No new runtime request is required for page rendering.
- Existing join submission remains the only current website API flow and is unchanged.

### Failure handling

- Clipboard failure produces inline recoverable feedback.
- Broken optional imagery must not remove headings, copy, or CTAs.
- External service availability must not block initial rendering.
- Existing waitlist submission errors remain handled by the current join flow.

## 14. Testing and Verification

### Automated tests

Update or add tests that verify:

- Header navigation contains Documentation and Developers.
- Footer exposes only intended working destinations.
- Central public URLs point to the approved Chrome Store, documentation, npm, and GitHub destinations.
- `/developers` is recognized by the pathname dispatcher.
- Developer content identifies SDK version 1.0.2.
- Copy-state logic covers success, reset, and failure behavior at the most practical unit boundary for the current test setup.
- Obsolete unverified metrics and inaccurate product phrases are absent.
- `@console-wallet/dapp-sdk` is absent from public site source and rendered copy.
- Existing join form validation and waitlist API tests still pass.

### Build verification

- Run the existing Node test suite.
- Run the Vite production build.
- Confirm the build contains no unresolved asset or import errors.

### Manual route verification

Check:

- `/`
- `/developers`
- `/join`
- `/privacy`
- `/terms`

At mobile, tablet, and desktop sizes verify navigation, CTA order, code overflow, copy feedback, external links, focus states, and page metadata.

## 15. Acceptance Criteria

The redesign is complete when:

1. A wallet user can identify Rocky Wallet and reach the Chrome Web Store from the hero.
2. A developer can reach `/developers`, copy the SDK command, and reach documentation, npm, and GitHub.
3. The homepage uses only approved factual product statements and versions.
4. No public website copy references `@console-wallet/dapp-sdk`.
5. No visible navigation or footer link targets a missing section.
6. `/join`, `/privacy`, and `/terms` remain functional.
7. The approved Refined Rocky visual direction is consistently responsive and accessible.
8. Automated tests and the production build pass.

## 16. Approved Decisions

- Audience model: dual entry for users and developers.
- Developer depth: concise homepage section plus dedicated `/developers` page.
- Conversion order: Install Extension, Read Docs, Build with SDK.
- Claims: replace unverified metrics with verifiable facts.
- Architecture: progressive dual-track homepage.
- Visual direction: A — Refined Rocky.
- Scope: website repository only.

There are no unresolved product decisions required before implementation planning.
