# Ondo Finance Website - Technical Specification

## 1. Tech Stack Overview

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS 3.4 |
| UI Components | shadcn/ui |
| Animation | Framer Motion |
| Icons | Lucide React |
| State | React hooks |

## 2. Tailwind Configuration

```javascript
// tailwind.config.ts extensions
{
  theme: {
    extend: {
      colors: {
        primary: '#1a1a1a',
        secondary: '#4a4a4a',
        muted: '#6b7280',
        accent: '#3b82f6',
        'card-border': '#e5e7eb',
        'bg-alt': '#f8f9fa',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['64px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'section': ['48px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'count-up': 'countUp 2s ease-out forwards',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
}
```

## 3. Component Inventory

### Shadcn/UI Components (Pre-installed)
- Button
- Card
- Input
- Badge
- Separator
- Sheet (mobile menu)
- DropdownMenu

### Custom Components

#### Layout Components
| Component | Props | Description |
|-----------|-------|-------------|
| `Container` | `className?: string` | Max-width container wrapper |
| `Section` | `className?: string, id?: string` | Section wrapper with padding |

#### Navigation Components
| Component | Props | Description |
|-----------|-------|-------------|
| `AnnouncementBanner` | `onClose?: () => void` | Top announcement bar |
| `Navbar` | - | Main navigation with scroll behavior |
| `NavLink` | `href: string, children: ReactNode` | Navigation link item |
| `MobileMenu` | `isOpen: boolean, onClose: () => void` | Mobile navigation drawer |

#### Section Components
| Component | Props | Description |
|-----------|-------|-------------|
| `HeroSection` | - | Hero with background image |
| `PartnerLogos` | - | Scrolling partner logo marquee |
| `AnnouncementsSection` | - | Announcement cards grid |
| `StatsSection` | - | Animated statistics |
| `TechnologySection` | - | Technology description |
| `GlobalMarketsSection` | - | Flux + token scrolling |
| `PerspectivesSection` | - | Testimonials carousel |
| `OndoChainSection` | - | Network visualization CTA |
| `InstitutionalSection` | - | Feature cards carousel |
| `EcosystemSection` | - | Partner ecosystem |
| `ResourcesSection` | - | Resource cards with tabs |
| `NewsletterSection` | - | Email subscription |
| `Footer` | - | Site footer |

#### Animation Components
| Component | Props | Description |
|-----------|-------|-------------|
| `FadeIn` | `delay?: number, duration?: number, children` | Fade in wrapper |
| `SlideUp` | `delay?: number, children` | Slide up animation |
| `StaggerContainer` | `staggerDelay?: number, children` | Stagger children animations |
| `CountUp` | `end: number, duration?: number, suffix?: string` | Animated counter |
| `Marquee` | `speed?: number, direction?: 'left' \| 'right', children` | Infinite scroll |

#### Card Components
| Component | Props | Description |
|-----------|-------|-------------|
| `AnnouncementCard` | `title, category, date, href` | Announcement card |
| `TokenCard` | `symbol, name, price, change` | Token price card |
| `TestimonialCard` | `quote, author, title, company` | Testimonial card |
| `FeatureCard` | `icon, title, description` | Feature highlight card |
| `ResourceCard` | `image, category, source, date, title, href` | Resource article card |

## 4. Animation Implementation Plan

### Global Animations

| Animation | Tech | Implementation |
|-----------|------|----------------|
| Page Load | Framer Motion | `AnimatePresence` + staggered children |
| Scroll Reveal | Framer Motion | `whileInView` with `viewport={{ once: true }}` |
| Smooth Scroll | CSS | `scroll-behavior: smooth` on html |

### Section-Specific Animations

| Section | Animation | Tech | Details |
|---------|-----------|------|---------|
| Hero | Text Stagger | Framer Motion | `staggerChildren: 0.1`, fade + translateY |
| Hero | Background | CSS | Subtle parallax on scroll (optional) |
| Partner Logos | Marquee | CSS Animation | `animation: marquee 30s linear infinite` |
| Announcements | Card Reveal | Framer Motion | `whileInView`, stagger 0.1s |
| Announcements | Card Hover | Tailwind | `hover:-translate-y-1 hover:shadow-lg` |
| Stats | Count Up | Custom Hook | `useCountUp` with requestAnimationFrame |
| Stats | Number Reveal | Framer Motion | Fade in + scale |
| Global Markets | Token Scroll | CSS Animation | Two rows, opposite directions |
| Global Markets | Token Hover | Tailwind | `hover:scale-105` |
| Perspectives | Carousel | Framer Motion | Drag gestures + snap |
| Institutional | Card Scroll | CSS/Framer | Horizontal scroll container |
| Resources | Tab Switch | Framer Motion | `AnimatePresence` for content |
| Newsletter | Input Focus | Tailwind | `focus:ring-2 focus:ring-blue-500` |

### Hover States

| Element | Effect | Implementation |
|---------|--------|----------------|
| Buttons | Scale + Shadow | `hover:scale-[1.02] hover:shadow-md transition-all` |
| Cards | Lift + Shadow | `hover:-translate-y-1 hover:shadow-lg transition-all` |
| Links | Underline | `hover:underline` or animated underline |
| Nav Items | Opacity | `hover:opacity-100 opacity-70 transition-opacity` |

### Easing Functions

| Name | Value | Usage |
|------|-------|-------|
| ease-out | `[0.4, 0, 0.2, 1]` | Default transitions |
| spring | `[0.34, 1.56, 0.64, 1]` | Bouncy effects |
| linear | `[0, 0, 1, 1]` | Marquee animations |

## 5. Project File Structure

```
/mnt/okcomputer/output/app/
├── public/
│   └── images/
│       ├── hero_nyc_skyline.jpg
│       └── (other assets)
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── layout/          # Container, Section
│   │   ├── navigation/      # Navbar, MobileMenu, AnnouncementBanner
│   │   ├── animations/      # FadeIn, SlideUp, StaggerContainer, CountUp, Marquee
│   │   └── cards/           # All card components
│   ├── sections/            # All page sections
│   │   ├── HeroSection.tsx
│   │   ├── PartnerLogos.tsx
│   │   ├── AnnouncementsSection.tsx
│   │   ├── StatsSection.tsx
│   │   ├── TechnologySection.tsx
│   │   ├── GlobalMarketsSection.tsx
│   │   ├── PerspectivesSection.tsx
│   │   ├── OndoChainSection.tsx
│   │   ├── InstitutionalSection.tsx
│   │   ├── EcosystemSection.tsx
│   │   ├── ResourcesSection.tsx
│   │   ├── NewsletterSection.tsx
│   │   └── Footer.tsx
│   ├── hooks/
│   │   ├── useCountUp.ts
│   │   ├── useScrollPosition.ts
│   │   └── useInView.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

## 6. Package Installation List

```bash
# Animation library
npm install framer-motion

# Icons
npm install lucide-react

# Utilities
npm install clsx tailwind-merge
```

## 7. Key Implementation Notes

### Navbar Scroll Behavior
```typescript
// Use scroll position to toggle background
const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### Count Up Animation Hook
```typescript
// hooks/useCountUp.ts
export function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);
  
  return { count, setIsInView };
}
```

### Marquee Implementation
```tsx
// Duplicate content for seamless loop
<div className="flex animate-marquee">
  {logos.map(...)}
  {logos.map(...)} {/* Duplicate */}
</div>
```

### Framer Motion Scroll Reveal
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
>
  {children}
</motion.div>
```

## 8. Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet |
| lg | 1024px | Desktop |
| xl | 1280px | Large desktop |
| 2xl | 1536px | Extra large |

### Responsive Patterns

- **Hero**: Text right-aligned on desktop, centered on mobile
- **Grid Cards**: 4 cols (desktop) → 2 cols (tablet) → 1 col (mobile)
- **Navigation**: Full nav (desktop) → Hamburger menu (mobile)
- **Stats**: 4 cols (desktop) → 2 cols (tablet) → 1 col (mobile)
- **Marquee**: Continuous scroll on all sizes
