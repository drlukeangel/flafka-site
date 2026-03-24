# Flafka Marketing Website Specification

**Created:** 2026-03-21
**Status:** Draft v1

---

## Overview

The Flafka marketing website is a static, fast-loading site that positions Flafka as the premier management platform for Confluent Cloud. The site targets three primary personas: Confluent Cloud power users, startup CTOs, and teams switching from Conduktor.

---

## Tech Stack

### Recommended: Astro + Vanilla CSS

- **Framework:** [Astro](https://astro.build) -- static-first, zero JS by default, islands architecture for interactive components
- **Styling:** Vanilla CSS with custom properties (design tokens matching the app)
- **Hosting:** Cloudflare Pages or Netlify (edge CDN, fast global delivery)
- **No React** -- keep it simple, fast, and SEO-friendly
- **Build output:** Static HTML/CSS/JS, no server-side rendering needed
- **Target:** < 100KB total page weight, < 1s LCP on 3G

### Alternatives Considered
- **11ty (Eleventy):** Good static site generator but less component-friendly than Astro
- **Plain HTML/CSS/JS:** Maximum simplicity but harder to maintain across 6+ pages
- **Next.js/Gatsby:** Overkill, adds React runtime, slower than needed

### Why Astro
- Zero-JS by default (ships no JavaScript unless you opt in)
- Component-based architecture without framework lock-in
- Built-in image optimization
- Markdown/MDX support for content pages
- Partial hydration for interactive elements (pricing toggle, comparison filters)
- Excellent Lighthouse scores out of the box

---

## Design Direction

### Visual Identity
- **Primary theme:** Dark mode (matches the app aesthetic)
- **Accent color:** Purple/violet (`#7C3AED` primary, `#A78BFA` light, `#4C1D95` dark)
- **Background:** Near-black (`#0F0D13`) with subtle purple gradient accents
- **Text:** White (`#F5F3FF`) primary, muted violet (`#A89EC4`) secondary
- **Cards/surfaces:** Dark elevated (`#1A1625`) with subtle borders (`#2D2640`)
- **Code blocks:** Slightly lighter dark (`#1E1B2E`) with syntax highlighting

### Typography
- **Headings:** Inter or Space Grotesk (geometric, modern, developer-friendly)
- **Body:** Inter (clean, highly legible at all sizes)
- **Code:** JetBrains Mono or Fira Code (ligatures for code samples)
- **Scale:** Fluid typography using CSS clamp() for responsive sizing

### Design Principles
1. **Developer-focused:** Technical credibility, no marketing fluff
2. **Dark-first:** Light mode available but dark is the default
3. **Screenshot-heavy:** Show the product, don't just describe it
4. **Fast:** No animations that delay content visibility
5. **Accessible:** WCAG 2.1 AA compliance, proper contrast ratios on dark backgrounds

### Responsive Breakpoints
- **Desktop:** 1280px+ (full layouts, side-by-side comparisons)
- **Tablet:** 768px-1279px (stacked layouts, reduced columns)
- **Mobile:** < 768px (single column, hamburger nav, touch-friendly CTAs)

---

## Page Specifications

### 1. Landing Page (`/`)

**Purpose:** Convert visitors into trial signups or demo requests.

#### Sections (top to bottom):

**A. Hero Section**
- Headline: "Everything the Confluent Console should be"
- Subheadline: "Schema impact analysis, Flink SQL cost estimation, spend dashboards, and resource-level RBAC -- in one powerful interface."
- Two CTAs: "Start Free Trial" (primary, purple) | "Watch Demo" (secondary, outline)
- Hero image: Full-width dark-mode screenshot of Flafka dashboard with real data
- Trust signals below hero: "8,400+ tests passing" | "Rust-powered backend" | "Sub-second WebSocket updates"

**B. Problem Statement**
- Headline: "Confluent Cloud deserves a better console"
- Three pain-point cards:
  1. "No cost visibility" -- "Your Confluent bill is a monthly surprise. Flafka gives you real-time spend tracking with projections."
  2. "Schema changes break things" -- "No way to see what depends on a schema before you change it. Flafka shows the blast radius."
  3. "ACLs require the CLI" -- "Creating access controls shouldn't require a terminal. Flafka gives you a full ACL management UI."

**C. Feature Highlights (3-column grid)**
- Schema Impact Analysis (with screenshot)
- Flink SQL IDE + Cost Estimation (with screenshot)
- Spend Dashboard (with screenshot)
- Resource-Level RBAC (with screenshot)
- Connector Monitoring (with screenshot)
- SLO Tracking (with screenshot)

**D. Comparison Strip**
- "4 features Conduktor doesn't have"
- Horizontal scrolling feature cards: Schema Impact | Spend Dashboard | RBAC Patterns | Connector Monitoring
- CTA: "See full comparison" -> /compare

**E. Pricing Preview**
- Three-tier cards (Starter/Team/Enterprise) with key features
- CTA: "See full pricing" -> /pricing

**F. Social Proof / Trust**
- "Built with" logos: Rust, React, Tauri, Axum, rskafka
- Open-source technologies, enterprise-grade quality
- Test count badge: "8,400+ automated tests"

**G. Footer CTA**
- "Ready to upgrade your Confluent Cloud experience?"
- "Start Free Trial" button
- Links to docs, GitHub, pricing, contact

---

### 2. Features Page (`/features`)

**Purpose:** Detailed feature breakdown for evaluators doing due diligence.

#### Feature Sections (each with screenshot + description):

**A. Kafka Management**
- Topic CRUD with partition details, configuration editing
- Message browser with search, filtering, pagination, partition filter
- Consumer group monitoring with lag tracking
- Real-time streaming with Stream Cards
- Screenshot: Topic detail page (dark mode)

**B. Schema Registry**
- Schema CRUD (Avro, JSON Schema, Protobuf)
- Schema diff viewer
- **Schema Impact Analysis** (UNIQUE) -- blast radius visualization
- Compatibility checking
- Screenshot: Schema impact analysis view

**C. Flink SQL IDE**
- Monaco-powered SQL editor with syntax highlighting
- Multi-cell notebook-style workflow
- Statement lifecycle management (create, monitor, delete)
- **Cost estimation** (UNIQUE) -- CFU/hour estimates before submission
- Budget warnings when estimates exceed limits
- Screenshot: Flink SQL editor with cost estimate badge

**D. Connector Management**
- Full lifecycle: create, pause, resume, delete
- **Throughput charts** (UNIQUE) -- messages/sec and bytes/sec time series
- **Structured log viewer** (UNIQUE) -- searchable, filterable connector logs
- Health status with color-coded indicators
- Screenshot: Connector detail with throughput chart

**E. Access Control & Security**
- **Resource-level RBAC with glob patterns** (UNIQUE)
- ACL management with template presets
- Bootstrap admin and lockout prevention
- PCI-DSS Requirement 7 alignment
- Full auth system (local, OIDC, password reset)
- User management (create, delete, temporary passwords)
- Audit trail
- Screenshot: RBAC resource patterns view

**F. Cost Management & FinOps**
- **Spend Dashboard** (UNIQUE) -- month-to-date, projected, budget status
- Daily cost trend with product breakdown
- CFU cost forecasting with 7-day projection
- Budget alerts and notifications
- Analytics data export (JSON/CSV)
- Screenshot: Spend dashboard

**G. Observability & SLOs**
- **SLO tracking** (UNIQUE) -- lag, throughput, availability objectives
- Error budget burn-down visualization
- 7-day sparkline trends
- Executive KPI dashboard
- Health monitoring
- Telemetry integration
- Screenshot: SLO dashboard

**H. Collaboration**
- Connection profiles (multi-cluster switching)
- Shareable analytics reports (time-limited links)
- Shareable dashboard snapshots
- Team spaces (shared workspaces)
- SQL template library
- Screenshot: Share dialog

**I. Developer Experience**
- Dark mode (polished, purpose-built)
- Desktop app via Tauri (Windows, macOS, Linux)
- Docker deployment (single container)
- OpenAPI/Swagger UI at /api
- WebSocket real-time updates
- Custom demo data themes
- Learning center with tracks and badges

---

### 3. Pricing Page (`/pricing`)

**Purpose:** Clear pricing that drives self-serve conversion.

#### Layout:

**Three-tier comparison table:**

| | Starter | Team | Enterprise |
|---|---------|------|------------|
| **Price** | Free | $19/seat/month | Custom |
| **Users** | Up to 3 | Unlimited | Unlimited |
| **Clusters** | 1 | Unlimited | Unlimited |
| **Topics/Schemas** | Core features | All features | All features |
| **Flink SQL IDE** | Yes | Yes | Yes |
| **Schema Impact** | Yes | Yes | Yes |
| **Spend Dashboard** | -- | Yes | Yes |
| **RBAC Patterns** | -- | Yes | Yes |
| **Connector Monitoring** | -- | Yes | Yes |
| **SLO Tracking** | -- | Yes | Yes |
| **ACL Management** | -- | Yes | Yes |
| **Analytics Export** | -- | Yes | Yes |
| **SSO/OIDC** | -- | -- | Yes |
| **SAML** | -- | -- | Yes (coming) |
| **PCI-DSS Docs** | -- | -- | Yes |
| **SLA** | Community | Email | Dedicated |
| **Audit Compliance** | -- | -- | Yes |

**Pricing notes:**
- Annual billing: 20% discount
- 14-day free trial for Team tier (no credit card required)
- Volume discounts for 50+ seats

**FAQ section:**
- "Do I need a Confluent Cloud account?" -- Yes, Flafka connects to your existing Confluent Cloud clusters.
- "Can I self-host?" -- Yes, Flafka runs as a single Docker container or Tauri desktop app.
- "What about data privacy?" -- Flafka connects directly to your clusters. No data passes through our servers.
- "Can I switch from Conduktor?" -- Yes, setup takes 5 minutes. Connect your Confluent Cloud credentials and go.

---

### 4. Comparison Page (`/compare`)

**Purpose:** Win competitive evaluations with transparent feature comparisons.

#### Layout:

**A. Header**
- "How Flafka compares"
- Tab/filter bar: All | vs Confluent Console | vs Conduktor | vs AKHQ | vs Kafdrop | vs Redpanda Console | vs Lenses.io | vs Kafka UI

**B. Feature Matrix Table**
- Full comparison matrix from competitive-analysis.md
- Flafka column highlighted/pinned
- Green checkmarks for Flafka advantages, neutral for parity, gap indicators for missing features
- Hover tooltips explaining each feature

**C. Head-to-Head Sections (one per competitor)**

Each section includes:
- Competitor logo and brief description
- "What Flafka does better" (3-5 bullet points with screenshots)
- "What [competitor] offers that Flafka doesn't" (honest, builds trust)
- Verdict summary

**D. vs Conduktor (featured comparison)**
- Dedicated prominent section since Conduktor is the closest competitor
- "4 features Conduktor doesn't have" with screenshots
- Price comparison: $19/seat vs ~$25/seat
- Migration guide CTA

---

### 5. Demo Page (`/demo`)

**Purpose:** Let prospects see the product in action without signing up.

#### Layout:

**A. Interactive Demo Videos**
- Embedded video player (self-hosted .webm files, not YouTube)
- Categorized by feature area:
  - "Getting Started" -- Connection profiles setup
  - "Schema Impact Analysis" -- Blast radius visualization
  - "Flink SQL IDE" -- Cost estimation workflow
  - "Connector Monitoring" -- Throughput charts and logs
  - "Spend Dashboard" -- Cost tracking overview
  - "RBAC Setup" -- Resource-level access control
  - "SLO Tracking" -- Error budget dashboard

**B. Screenshot Gallery**
- Filterable grid of product screenshots (dark mode)
- Categories: Dashboard, Topics, Schemas, Flink SQL, Connectors, Settings, Analytics
- Lightbox for full-size viewing

**C. Source Videos (from sprint screen-shots/)**
- Sprint 70: Connection profiles demo, Connector CRUD demo, Share analytics demo
- Sprint 71: Connector monitoring demo, ACL CRUD demo, Schema impact demo
- Sprint 72: RBAC operability demo, Spend dashboard demo
- Sprint 69: Login flow demo, User management demo, SLO dashboard demo

**D. CTA**
- "Ready to try it yourself?"
- "Start Free Trial" button

---

### 6. About / Contact Page (`/about`)

**Purpose:** Build trust and provide contact channels.

#### Sections:

**A. Mission**
- "We believe Confluent Cloud users deserve a world-class management experience."
- Brief story of why Flafka exists

**B. Technology**
- Built with Rust (Axum + rskafka) for performance
- React frontend with real-time WebSocket updates
- Tauri for desktop app (no Electron bloat)
- 8,400+ automated tests across Rust, React, and E2E layers

**C. Contact**
- Contact form (name, email, company, message)
- Email: hello@flafka.dev (or similar)
- GitHub: Link to repository
- Community: Discord/Slack link

**D. Newsletter Signup**
- "Get product updates and Kafka tips"
- Email input + subscribe button

---

## Global Components

### Navigation Bar
- Logo (left)
- Links: Features | Pricing | Compare | Demo | About
- CTA button: "Start Free Trial" (right, always visible)
- Mobile: Hamburger menu

### Footer
- Four columns:
  - Product: Features, Pricing, Demo, Changelog
  - Resources: Documentation, API Docs, Blog, Status
  - Company: About, Contact, Careers, Press
  - Legal: Privacy, Terms, Security
- Social links: GitHub, Twitter/X, Discord
- Copyright

### Cookie Banner
- Minimal, GDPR-compliant
- "We use cookies for analytics" with Accept/Decline

---

## SEO Strategy

### Target Keywords (from marketing-plan.md)
1. "Kafka GUI" / "best Kafka GUI 2026"
2. "Confluent Cloud management tool"
3. "Conduktor alternatives"
4. "Kafka monitoring dashboard"
5. "Kafka ACL management tool"
6. "schema impact analysis Kafka"
7. "Confluent Cloud cost dashboard"
8. "Kafka spending tracker"
9. "Kafka RBAC PCI-DSS compliance"
10. "Kafka resource access control GUI"

### Meta Tags
- Unique title and description for each page
- Open Graph tags for social sharing (with product screenshots)
- Twitter Card tags
- JSON-LD structured data (SoftwareApplication schema)

### Technical SEO
- Static HTML (crawlable without JavaScript)
- Sitemap.xml
- robots.txt
- Canonical URLs
- Fast load times (< 1s LCP target)

---

## Analytics & Conversion Tracking

### Tools
- **Plausible Analytics** (privacy-friendly, no cookies needed for basic tracking)
- **PostHog** or **Mixpanel** for conversion funnel tracking (with cookie consent)

### Events to Track
- Page views (all pages)
- CTA clicks ("Start Free Trial", "Watch Demo", "Contact Sales")
- Pricing tier hover/click
- Comparison tab switches
- Demo video play/completion
- Contact form submission
- Newsletter signup

### Conversion Goals
- Free trial signup
- Demo request
- Contact form submission
- Pricing page visit (intent signal)

---

## Content Pipeline

### Launch Content
1. Landing page copy
2. Feature descriptions (from release notes)
3. Comparison content (from competitive analysis)
4. 10-15 product screenshots (dark mode, real data)
5. 5-7 demo videos (from sprint recordings)

### Post-Launch Content
1. Blog: "Flafka vs Conduktor: 4 features you can't get anywhere else"
2. Blog: "Track Confluent Cloud costs without spreadsheets"
3. Blog: "Schema Impact Analysis: See the blast radius before you break things"
4. SEO landing pages for each target keyword
5. Customer case studies (when available)

---

## Development Timeline (Estimated)

| Phase | Scope | Duration |
|-------|-------|----------|
| 1. Setup | Astro project, design tokens, global components | 1 week |
| 2. Landing | Hero, features, pricing preview, CTAs | 1 week |
| 3. Features + Pricing | Detailed feature page, pricing comparison | 1 week |
| 4. Compare + Demo | Competitor comparisons, video embeds | 1 week |
| 5. About + Polish | Contact page, SEO, analytics, testing | 1 week |
| 6. Launch | DNS, CDN, monitoring, launch checklist | 2-3 days |

**Total estimated: 5-6 weeks**

---

## File Structure

```
flafka-site/
  src/
    pages/
      index.astro          # Landing page
      features.astro       # Features page
      pricing.astro        # Pricing page
      compare.astro        # Comparison page
      demo.astro           # Demo page
      about.astro          # About/Contact page
    components/
      Nav.astro            # Navigation bar
      Footer.astro         # Footer
      FeatureCard.astro    # Reusable feature card
      PricingTable.astro   # Pricing comparison table
      CompareMatrix.astro  # Feature comparison matrix
      VideoPlayer.astro    # Demo video player
      ContactForm.astro    # Contact form (island)
      CookieBanner.astro   # GDPR cookie banner (island)
    layouts/
      Base.astro           # Base HTML layout
    styles/
      global.css           # Design tokens, reset, typography
      components.css       # Component styles
    assets/
      screenshots/         # Product screenshots (dark mode)
      videos/              # Demo videos (.webm -> .mp4 for compatibility)
      logo/                # Flafka logo variations
  public/
    favicon.ico
    robots.txt
    sitemap.xml
  astro.config.mjs
  package.json
```
