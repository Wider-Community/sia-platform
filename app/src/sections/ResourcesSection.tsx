import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { ArrowRight } from 'lucide-react';
import { GlowCard } from '@/components/ui/spotlight-card';
import { PlayPauseIcon, CopiedIcon } from '@/components/ui/animated-state-icons';

const tabs = [
  { id: 'insights', label: 'Insights & Intelligence' },
  { id: 'research', label: 'Independent Research' },
];

const resources = [
  {
    id: 1,
    title: 'Tokenized Stocks & ETFs: Ian De Bode on What\'s Next',
    category: 'Podcast',
    source: 'BX Digital',
    date: 'Feb 12, 2026',
    type: 'podcast',
    href: 'https://ondo.finance/insights/tokenized-stocks-etf-ian-de-bode',
    glowColor: 'blue' as const,
    iconDuration: 2400,
  },
  {
    id: 2,
    title: 'Crypto Yield Coins And Three Things You Must Know Now',
    category: 'Article',
    source: 'Forbes',
    date: 'Feb 9, 2026',
    type: 'article',
    href: 'https://www.forbes.com/sites/digital-assets/2026/02/09/crypto-yield-coins-and-three-things-you-must-know-now/',
    glowColor: 'purple' as const,
    iconDuration: 2200,
  },
  {
    id: 3,
    title: 'How To Play The Stock Market Now, Charles Schwab CEO On Crypto Investing And Prediction Markets',
    category: 'Podcast',
    source: 'Yahoo Finance',
    date: 'Feb 4, 2026',
    type: 'podcast',
    href: 'https://youtu.be/mvQPOKLnl9g',
    glowColor: 'blue' as const,
    iconDuration: 2600,
  },
  {
    id: 4,
    title: 'SIA Launches SIA Global Listing To Tokenize IPOs On Public Debut',
    category: 'Article',
    source: 'TheStreet',
    date: 'Feb 4, 2026',
    type: 'article',
    href: '#',
    glowColor: 'green' as const,
    iconDuration: 2000,
  },
];

const iconColor = '#93c5fd';

export function ResourcesSection() {
  const [activeTab, setActiveTab] = useState('insights');

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-4xl sm:text-5xl font-medium text-foreground mb-2">
            Resources
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            See the Latest from SIA
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource) => {
                const IconComp = resource.type === 'podcast' ? PlayPauseIcon : CopiedIcon;
                return (
                  <StaggerItem key={resource.id}>
                    <a href={resource.href} target="_blank" rel="noopener noreferrer" className="block group">
                      <GlowCard customSize glowColor={resource.glowColor} className="w-full min-h-[140px] p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <IconComp size={22} color={iconColor} duration={resource.iconDuration} />
                          </div>
                          <div className="flex flex-col gap-2 min-w-0 flex-grow">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-black/10 text-gray-700">
                                {resource.category}
                              </span>
                              <span className="text-gray-500 text-xs">{resource.source}</span>
                              <span className="text-gray-500 text-xs">•</span>
                              <span className="text-gray-500 text-xs">{resource.date}</span>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors line-clamp-2 leading-snug">
                              {resource.title}
                            </h3>
                          </div>
                        </div>
                      </GlowCard>
                    </a>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </motion.div>
        </AnimatePresence>

        <FadeIn delay={0.3} className="mt-8">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-foreground font-medium hover:text-blue-600 transition-colors group"
          >
            Explore Insights
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </FadeIn>
      </div>
    </section>
  );
}
