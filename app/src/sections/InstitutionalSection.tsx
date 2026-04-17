import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/animations';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GlowCard } from '@/components/ui/spotlight-card';
import {
  LockUnlockIcon,
  SuccessIcon,
  CopiedIcon,
  EyeToggleIcon,
  ToggleIcon,
} from '@/components/ui/animated-state-icons';

const features = [
  {
    Icon: LockUnlockIcon,
    title: 'High-Quality Assets and Managers',
    description: 'We work exclusively with the world\'s preeminent asset managers.',
    glowColor: 'blue' as const,
    iconDuration: 2600,
  },
  {
    Icon: SuccessIcon,
    title: 'Regulated Service Providers',
    description: 'Our products hold all assets at third-party qualified custodians and receive daily independent accounting and annual audits from regulated institutional-grade providers.',
    glowColor: 'green' as const,
    iconDuration: 2200,
  },
  {
    Icon: CopiedIcon,
    title: 'Experienced Leadership',
    description: 'Our executive team has diverse experience across leading institutions like Goldman, McKinsey, Bridgewater, and BlackRock.',
    glowColor: 'purple' as const,
    iconDuration: 2400,
  },
  {
    Icon: EyeToggleIcon,
    title: 'Third-Party Audited Security',
    description: 'We implement best practice security measures, and all key smart contracts are audited and certified.',
    glowColor: 'blue' as const,
    iconDuration: 2200,
  },
  {
    Icon: ToggleIcon,
    title: 'Compliance-First Focus',
    description: 'Legal and regulatory compliance is a top priority, with careful structuring and thorough risk management measures.',
    glowColor: 'orange' as const,
    iconDuration: 1800,
  },
];

const iconColor = '#60a5fa';

export function InstitutionalSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -380 : 380, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-4">
          <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Trust &amp; Transparency</span>
        </FadeIn>

        <FadeIn delay={0.1} className="flex items-end justify-between mb-12">
          <h2 className="text-4xl sm:text-5xl font-medium text-foreground leading-tight">
            Institutional Grade<br />In All We Do
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all ${canScrollLeft ? 'hover:bg-muted hover:border-border' : 'opacity-40 cursor-not-allowed'}`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all ${canScrollRight ? 'hover:bg-muted hover:border-border' : 'opacity-40 cursor-not-allowed'}`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
          >
            {features.map((feature, index) => {
              const { Icon, iconDuration, glowColor } = feature;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex-shrink-0 w-72"
                >
                  <GlowCard customSize glowColor={glowColor} className="w-full min-h-[220px] p-6">
                    <div className="flex flex-col gap-4">
                      <div className="w-12 h-12 rounded-xl bg-black/10 flex items-center justify-center">
                        <Icon size={28} color={iconColor} duration={iconDuration} />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 leading-snug">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </GlowCard>
                </motion.div>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
