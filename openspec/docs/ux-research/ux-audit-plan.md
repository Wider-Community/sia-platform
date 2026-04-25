# UX Research & Audit Plan

## Objective
Bridge the gap between the premium SIA landing page experience (Aceternity UI, Magic UI, framer-motion, 3D globe) and the portal's current functional-but-plain interface. Every interaction should feel polished, animated, and cohesive.

## Audit Scope

### 1. Button Lifecycle Audit
Every button in the portal must have a complete lifecycle:
- **Idle** → default appearance
- **Hover** → scale/glow/color shift (framer-motion whileHover)
- **Press** → scale down feedback (framer-motion whileTap)
- **Loading** → spinner or animated state icon
- **Success** → green check animation
- **Error** → red shake animation
- **Disabled** → muted appearance, no pointer

Pages to audit: All 15 portal pages + sidebar + header

### 2. Page Transition Audit
Every page navigation must animate:
- **Enter** → fade in + slide up (PageShell already handles this)
- **Exit** → fade out + slide down
- **Tab switches** → content crossfade
- **Modal open/close** → scale + fade (framer-motion AnimatePresence)

### 3. Data Loading States
Every data-fetching component must show:
- **Skeleton** → shimmer animation matching content shape
- **Empty state** → illustrated empty state with action prompt
- **Error state** → retry button with error message
- **Success** → subtle fade-in of content

### 4. Table Interaction Audit
All tables (organizations, contacts, tasks, files, signing):
- Row hover → subtle background highlight
- Row click → visual feedback before navigation
- Sort click → column header animation
- Filter change → smooth content transition
- Pagination → slide animation between pages
- Empty → illustrated empty state

### 5. Form Interaction Audit
All forms (org create/edit, contact create/edit, task create, signing wizard):
- Field focus → border glow animation
- Validation error → shake + red border
- Submit → button loading state → success/error animation
- Cancel → confirmation if dirty

### 6. Card & Widget Audit
Dashboard KPI cards, pipeline cards, file cards:
- Hover → 3D tilt effect (ThreeDCard) or spotlight glow (SpotlightCard)
- Click → scale feedback
- Data update → animated number transition (AnimatedCounter)
- Loading → skeleton with shimmer

### 7. Sidebar & Navigation Audit
- Active item → animated indicator (sliding highlight)
- Hover → subtle background transition
- Collapse/expand → smooth width animation
- Mobile → vaul Drawer with slide-up animation
- Search (Cmd+K) → smooth open/close with backdrop blur

### 8. Notification & Toast Audit
- Bell icon → badge count animation (bounce on new)
- Popover open → slide down + fade
- Toast → slide in from right with progress bar
- Dismiss → slide out

### 9. Pipeline Kanban Audit
- Card drag → 3D tilt + shadow elevation
- Drop zone → glow highlight on hover
- Stage transition → card fly animation
- Column count → animated counter

### 10. Signing Flow Audit
- PDF viewer → smooth page transitions
- Signature field placement → snap animation
- Signature capture → pen stroke smoothing
- Submit → celebration animation
- Status badges → color pulse on change

## Component Mapping: Landing Page → Portal

| Landing Page Effect | Portal Application |
|---|---|
| Aurora Background | Dashboard hero area / login page background |
| Spotlight Card | KPI cards, pipeline stage cards |
| 3D Card Effect | Organization cards in pipeline |
| Animated Counter | KPI values, stage counts, progress percentages |
| Text Reveal | Section headings on dashboard |
| Border Beam | Primary action buttons, active card borders |
| Marquee | Activity feed ticker on dashboard |
| Lamp Effect | Empty states, onboarding screens |
| Gradient Background | Login page, settings page backgrounds |
| Globe (cobe) | Map page 3D globe option |

## Implementation Priority

### P0 — Critical (Fixes broken/ugly UX)
1. Button hover/press states across all pages
2. Table row interactions (hover, click feedback)
3. Form field focus/error animations
4. Loading skeleton consistency
5. Empty state illustrations

### P1 — High (Makes it feel premium)
1. KPI cards with SpotlightCard + AnimatedCounter
2. Pipeline cards with 3D tilt effect
3. Page section heading animations (TextReveal)
4. Modal/dialog enter/exit animations
5. Sidebar active item sliding indicator

### P2 — Medium (Polish)
1. Dashboard activity ticker (Marquee)
2. Map page 3D globe option
3. Login page with Aurora/Gradient background
4. Toast notification enhancements
5. Tab content crossfade animations

### P3 — Nice to have
1. Celebration animations on signing completion
2. Onboarding flow with Lamp effect
3. Particle backgrounds on key pages
4. Animated beam connections on relationship graph
