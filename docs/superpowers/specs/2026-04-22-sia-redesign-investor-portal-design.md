# SIA Website Redesign & Investor Portal — Design Spec

**Date:** 2026-04-22
**Status:** Draft
**Approach:** Full Retheme + Investor Portal (Approach A)

---

## 1. Design System Overhaul

### 1.1 Color Palette

Gold remains as the brand accent. All other colors adopt the SAE financial model's disciplined, corporate palette.

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--bg` | `#f8f9fb` | `#0a0f1a` | Page background |
| `--surface` | `#ffffff` | `#111827` | Cards, panels |
| `--surface-hover` | `#f3f4f6` | `#1e293b` | Hover states |
| `--text` | `#1a1a1a` | `#f1f5f9` | Primary text |
| `--text-secondary` | `#6b7280` | `#94a3b8` | Secondary text |
| `--text-tertiary` | `#9ca3af` | `#64748b` | Muted text |
| `--border` | `#e5e7eb` | `#1e293b` | Borders |
| `--accent` | `#c8a951` | `#c8a951` | Gold primary accent |
| `--accent-glow` | `rgba(200,169,81,0.15)` | `rgba(200,169,81,0.25)` | Emissive gold glow |
| `--success` | `#1D9E75` | `#1D9E75` | Positive metrics |
| `--danger` | `#E24B4A` | `#E24B4A` | Negative/warnings |
| `--info` | `#378ADD` | `#378ADD` | Secondary data |

### 1.2 Typography

- **Headings:** Playfair Display — smaller sizes than current, tighter letter-spacing (`-0.02em`), max hero title 48px
- **Body:** Inter — consistent with SAE project
- **Arabic:** IBM Plex Sans Arabic — unchanged
- **Section labels:** Uppercase, small (12px), `letter-spacing: 0.06em`, with left gold accent bar (SAE pattern)
- **Font weights:** 700 headers, 600 emphasis, 500 UI elements, 400 body

### 1.3 Animation Philosophy

**Remove entirely:**
- Aurora background animation
- FlipWords text rotation
- 3D card rotates (ThreeDCard mouse tracking)
- Spotlight card mouse tracking
- Dual marquee testimonials
- Lamp glow effect
- Border beam animation
- Shimmer effects

**Keep (toned down):**
- Fade-in on scroll — 0.3s duration, `once: true`, no stagger delays
- Hover lifts — `-2px` translateY, 0.15s transition
- Smooth color/opacity transitions — 0.15s ease

**Add (emissive tech feel):**
- Gold glow pulse on key elements in dark mode: `box-shadow: 0 0 20px rgba(200,169,81,0.12)`, subtle animation
- Focus glow on inputs: `box-shadow: 0 0 12px var(--accent-glow)`
- Gold skeleton loading lines (pulsing) instead of gray

### 1.4 Card Pattern — Glassmorphism

```css
.glass-card {
  backdrop-filter: blur(16px);
  background: rgba(255, 255, 255, 0.7);       /* light mode */
  background: rgba(17, 24, 39, 0.7);          /* dark mode */
  border: 1px solid var(--border);
  border-radius: 12px;
  /* Optional gold accent top-bar for featured cards */
  border-top: 3px solid var(--accent);
}
```

### 1.5 Spacing & Layout Discipline

- Strict spacing increments: 8px, 12px, 16px, 24px, 32px, 48px
- Max container width: `max-w-6xl` (1152px) for public pages, `max-w-7xl` (1280px) for investor portal content
- Section vertical padding: `py-20 lg:py-24` (reduced from current `py-24 lg:py-32`)
- Grid gaps: `gap-6` standard, `gap-8` for larger grids

---

## 2. Dark/Light Mode System

### 2.1 Implementation

- All colors defined as CSS custom properties on `:root` and `[data-theme="dark"]`
- `data-theme` attribute on `<html>` element
- Zustand store for theme state, persisted to `localStorage`
- First visit: respect `prefers-color-scheme` media query
- User toggle overrides and persists preference
- Toggle button in navbar (public) and top bar (investor portal)

### 2.2 Theme Transition

```css
body {
  transition: background-color 0.2s ease, color 0.2s ease;
}
```

### 2.3 Dark Mode Specifics

- Glassmorphism cards shift to darker translucent backgrounds
- Emissive gold effects intensify by ~60% (higher opacity on glow values)
- Chart grid lines darken, tooltip backgrounds invert
- Globe section needs minimal changes (dark is natural)

### 2.4 Light Mode Specifics

- Clean white-surface corporate feel matching SAE light mode
- Emissive effects very subtle — soft gold shadows only on focus/hover
- High contrast text, crisp borders

---

## 3. Public Pages Restructure

### 3.1 Navbar

- Sticky with backdrop blur on scroll (kept)
- Simplified — flat horizontal links, no dropdown menus
- Dark/light mode toggle button
- Language toggle EN/AR (kept)
- "Investor Login" button — gold outline style
- Authenticated investor: shows name + avatar, link to `/investor/dashboard`

### 3.2 Hero Section

- Solid `var(--bg)` background with subtle grid pattern overlay (no skyline image)
- Headline: Playfair Display, 48px max, single gold gradient word
- Subtitle: Inter, `var(--text-secondary)`, one line
- Two buttons: "Learn More" (outline) + "Investor Access" (gold solid)
- Dark mode: subtle emissive gold glow orb behind heading
- No FlipWords, no aurora

### 3.3 Globe Section

- COBE globe kept (meaningful for KSA-Malaysia corridor visualization)
- Strip decorative elements, clean framing
- Glassmorphism stat cards beside globe instead of floating flags

### 3.4 Trust Bar

- Static grid of partner logos — no marquee animation
- Subtle opacity change on hover (0.6 → 1.0)
- Clean separator lines above/below

### 3.5 Value Props

- 3-column glassmorphism cards
- Gold accent top-bar on each card
- Icon + title + description
- Fade-in on scroll, hover lift (-2px)
- No 3D rotate, no spotlight mouse tracking

### 3.6 Stats Section

- 4-column glassmorphism KPI cards
- Animated counters kept but spring physics toned down (shorter duration)
- Gold accent on number, muted label below

### 3.7 How It Works

- Vertical timeline with thin gold line, numbered steps
- Clean cards at each step
- No spotlight grid background

### 3.8 Sectors

- 2x4 grid glassmorphism cards
- Icon + title + one-line description
- Hover: lift + subtle gold border glow

### 3.9 Testimonials

- Remove dual marquee entirely
- Replace with 2-3 static featured testimonial glassmorphism cards in a row
- Optional: simple arrow carousel for mobile

### 3.10 CTA Section

- Remove lamp effect entirely
- Centered: heading + subtitle + gold solid button
- Dark mode: emissive gold glow behind button

### 3.11 Footer

- 3-column layout (reduced from 4)
- Newsletter input with gold accent border on focus
- Muted social icons
- Office locations kept

---

## 4. Investor Portal

### 4.1 Layout

- Route group: `/investor/*`
- Protected by auth — redirects to `/investor/login` if unauthenticated
- Fixed left sidebar: 240px expanded, 56px collapsed (icon-only)
- Sidebar: glassmorphism background, gold accent on active items, gold left border on active
- Top bar: breadcrumbs, notifications bell, user avatar + dropdown, dark/light toggle
- Main content area adjusts margin for sidebar state

### 4.2 Sidebar Navigation

```
Overview
  - Dashboard
  - Charts

Revenue
  - Sales Forecast
  - Revenue Breakdown
  - Cohort Analysis

Costs
  - Salaries & Team
  - Operating Expenses
  - Capital Expenditure

Statements
  - Income Statement
  - Balance Sheet
  - Cash Flow Statement

Analysis
  - Breakeven Analysis
  - KPI & Ratios
```

### 4.3 Dashboard Page (`/investor/dashboard`)

- **Top row:** 6 glassmorphism KPI cards
  - Revenue, Net Profit, Margins, ROI, Breakeven Month, Subscription MRR
  - Gold accent top-bar, large metric value, subtitle, trend arrow (green/red)
  - Dark mode: emissive gold glow around card borders, subtle pulse on key metrics
- **Chart grid:** 2-column layout using Recharts
  - Revenue vs Costs (bar chart)
  - Revenue Mix (pie chart)
  - Profit & Cash (composed bar + area)
  - Cost Breakdown (stacked bar)
- **Chart styling:** Thin grid lines, muted palette, gold for primary series, brand-matching tooltips

### 4.4 Financial Statement Pages

- Clean data tables following SAE styling
- Sticky headers with uppercase labels
- Right-aligned numbers with tabular-nums font feature
- Row totals: bold weight + distinct background
- Alternating row hover states
- Export button (Excel/PDF) top-right corner

### 4.5 Interactive Model Elements

- Slider inputs: gradient gold fill, custom thumb, smooth animation
- Toggle switches: gray unchecked, gold checked
- Number inputs: gold focus ring with emissive glow
- All inputs emit `box-shadow: 0 0 12px var(--accent-glow)` on focus in dark mode

### 4.6 Emissive Design Elements (Tech Feel)

- Active sidebar item: gold left border + faint gold glow
- KPI cards in dark mode: `box-shadow: 0 0 20px rgba(200,169,81,0.12)`
- Chart data points: gold dots with subtle glow halo
- Buttons: gold emissive hover state `box-shadow: 0 0 16px var(--accent-glow)`
- Loading states: pulsing gold skeleton lines
- Subtle gold particle/grid overlay on dashboard header area (dark mode only)

---

## 5. Authentication System

### 5.1 Existing: Google OAuth

Google OAuth (Gmail login) is already implemented. The auth system builds on top of this.

### 5.2 User Roles

- `public` — default, sees only public pages
- `investor` — authenticated via Google OAuth, sees public + investor portal
- `admin` — role exists in schema, not implemented now

### 5.3 Auth Flow

1. User clicks "Investor Access" or "Investor Login" → navigates to `/investor/login`
2. `/investor/login` page: glassmorphism card with "Sign in with Google" button (gold accent)
3. On successful Google auth → backend checks if user's email is in approved investor list
4. If approved → role set to `investor`, redirect to `/investor/dashboard`
5. If not approved → "Access pending" message with option to request access
6. Logout clears session, redirects to home

### 5.4 Protected Routes

- `<ProtectedRoute role="investor">` wrapper component
- Checks auth context for user role
- Unauthenticated → redirect to `/investor/login`
- Wrong role → "Access denied" page
- Gold-tinged loading skeleton while checking auth state

### 5.5 Investor Access Management

- Approved investor emails stored in database/config
- Future: admin panel for managing investor access list

---

## 6. Implementation Team Structure

Four parallel agent teams, with Theme System completing first as a dependency:

| Team | Scope | Dependencies |
|------|-------|-------------|
| **1. Theme System** | CSS variables, dark/light mode, glassmorphism utilities, Zustand theme store, global styles rewrite | None — runs first |
| **2. Public Pages** | Retheme all 11 sections + navbar + footer, strip flashy animations, apply new design language | Depends on Team 1 |
| **3. Investor Portal** | Sidebar layout, dashboard, charts, tables, financial statement pages, all `/investor/*` routes | Depends on Team 1 |
| **4. Auth & Routing** | Google OAuth role integration, protected routes, investor login page, access gate | Depends on Team 1 |

Teams 2, 3, and 4 run in parallel after Team 1 completes.

---

## 7. Files Affected

### New Files
- `src/stores/themeStore.ts` — Zustand theme state
- `src/pages/investor/` — All investor portal pages
- `src/components/investor/` — Sidebar, TopBar, KPI cards, chart wrappers, data tables
- `src/components/auth/` — ProtectedRoute, LoginPage
- `src/layouts/InvestorLayout.tsx` — Sidebar + topbar layout wrapper

### Modified Files
- `src/index.css` — Full rewrite of CSS variables, remove old animations, add glassmorphism utilities, add dark mode
- `tailwind.config.js` — Update color tokens, remove old animation definitions, add new utilities
- `src/App.tsx` — Add routing for investor pages, wrap with auth + theme providers
- `src/components/navigation/Navbar.tsx` — Simplify, add theme toggle, add investor login button
- `src/sections/*` — All 11 section files rethemed
- `src/components/effects/*` — Remove or simplify most effect components

### Removed/Deprecated
- `src/components/effects/FlipWords.tsx`
- `src/components/effects/ThreeDCard.tsx` (and Body/Item)
- `src/components/effects/SpotlightCard.tsx`
- `src/components/effects/Lamp.tsx`
- `src/components/effects/BorderBeam.tsx`
- `src/components/effects/AuroraBackground.tsx`
- Marquee usage in testimonials (component kept for potential future use)
