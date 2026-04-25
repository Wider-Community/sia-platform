# Component Inventory & Source Map

## Landing Page Components (Already Built)
These exist in `app/src/components/effects/` and were used to build the SIA landing page:

| Component | Source | File | Used In |
|---|---|---|---|
| Aurora Background | aceternity/aurora-background | `effects/AuroraBackground.tsx` | Hero section |
| Flip Words | aceternity/flip-words | `effects/FlipWords.tsx` | Hero rotating text |
| 3D Card Effect | aceternity/3d-card-effect | `effects/ThreeDCard.tsx` | Sectors, Value Props |
| Lamp Effect | aceternity/lamp | `effects/Lamp.tsx` | CTA section |
| Gradient Background | aceternity/background-gradient-animation | `effects/GradientBackground.tsx` | Backgrounds |
| Border Beam | magicui/border-beam | `effects/BorderBeam.tsx` | CTA buttons |
| Marquee | magicui/marquee | `effects/Marquee.tsx` | Trust Bar, Testimonials |
| Spotlight Card | easemize/spotlight-card | `effects/SpotlightCard.tsx` | Value Props |
| Text Reveal | motion-primitives/text-effect | `effects/TextReveal.tsx` | Section headings |
| Animated Counter | reuno-ui/animated-number | `effects/AnimatedCounter.tsx` | Stats section |

## Component Source Registries
- **21st.dev** — main component registry (browsing hub)
- **ui.aceternity.com** — Aceternity UI (aurora, lamp, flip words, 3D card, world map)
- **magicui.design** — Magic UI (border beam, marquee, animated beam, shimmer button)
- **motion-primitives.com** — Motion Primitives (text effects, transitions)

## shadcn/ui Components (57 files in `app/src/components/ui/`)
Full set installed including: accordion, alert-dialog, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, illuminated-hero, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, spotlight-card, switch, table, tabs, textarea, toggle, toggle-group, tooltip, animated-state-icons, button-group, empty, field, input-group, item, kbd, spinner, testimonials-columns-1, ThemeToggle

## Installed But Underutilized in Portal
| Package | Version | Should Be Used For |
|---|---|---|
| framer-motion | ^12.34.0 | Page transitions, card animations, list staggers, modal enter/exit |
| @react-three/fiber + drei + three | ^9.6.0 | 3D elements, enhanced map globe |
| cobe | ^2.0.1 | Interactive globe (already on landing page) |
| embla-carousel-react | ^8.6.0 | Carousel/slider components |
| react-resizable-panels | ^4.2.2 | Resizable split panes |
| date-fns | ^4.1.0 | Consistent date formatting |
| vaul | ^1.1.2 | Drawer (mobile bottom sheets) |
| @radix-ui/react-tooltip | installed | Tooltips (map uses custom hover instead) |
| @radix-ui/react-progress | installed | Progress bars |
| @radix-ui/react-scroll-area | installed | Scrollable areas |
| @radix-ui/react-hover-card | installed | Rich hover previews |
| @refinedev/react-table + @tanstack/react-table | installed | Proper data tables |
| exceljs | ^4.4.0 | Excel export |
| tw-animate-css | ^1.4.0 | CSS animations |
| dotted-map | ^3.1.0 | Dotted map visualization |

## Components to Source for Portal Upgrade
From the same registries used for the landing page:

### Dashboard Enhancement
- **Animated Number** (already have) → KPI card values with count-up animation
- **Spotlight Card** (already have) → KPI cards with hover glow effect
- **Border Beam** (already have) → Priority queue card border animation
- **Shimmer Button** (magicui) → Primary action buttons
- **Animated Beam** (magicui) → Connection visualization between entities

### Tables & Data
- **@tanstack/react-table** (installed) → Replace hand-built tables
- **Animated List** (magicui) → Staggered row entry animations
- **Blur Fade** (magicui) → Content reveal on scroll

### Pipeline / Kanban
- **3D Card Effect** (already have) → Pipeline org cards
- **Spotlight Card** (already have) → Stage column headers
- **Animated Counter** (already have) → Stage count badges

### Map
- **Globe** (cobe, already installed) → Replace flat map with 3D globe option
- **World Map** (aceternity) → Enhanced animated connections between countries
- **Particles** (magicui) → Background ambiance

### Forms & Interactions
- **Animated State Icons** (already have in ui/) → Button loading/success/error states
- **Input OTP** (already have) → Verification flows
- **Calendar** (already have) → Date picker for tasks/due dates

### Navigation & Layout
- **Dock** (magicui) → Mobile bottom nav
- **Blur Fade** (magicui) → Page section reveals
- **Text Reveal** (already have) → Section heading animations in portal
