import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { GlowCard } from '@/components/ui/spotlight-card';
import { NotificationIcon, SendIcon } from '@/components/ui/animated-state-icons';

const announcements = [
  {
    title: 'Introducing SIA Perps: The First Capital-Efficient Platform for Equity Perpetual Futures',
    category: 'Announcement',
    date: 'Feb 3, 2026',
    href: '#',
    glowColor: 'blue' as const,
    IconComp: NotificationIcon,
    iconDuration: 2800,
  },
  {
    title: 'Introducing SIA Global Listing: A New Service to Tokenize Stock IPOs on Listing Day Across Multiple Blockchains',
    category: 'Global Markets',
    date: 'Feb 3, 2026',
    href: '#',
    glowColor: 'green' as const,
    IconComp: SendIcon,
    iconDuration: 2600,
  },
  {
    title: 'MetaMask Integrates Hundreds of SIA Tokenized U.S. Stocks and ETFs',
    category: 'Global Markets',
    date: 'Feb 3, 2026',
    href: '#',
    glowColor: 'green' as const,
    IconComp: SendIcon,
    iconDuration: 3000,
  },
  {
    title: 'SIA Global Markets Files Registration Statement with SEC, Setting a New Standard for Tokenized Securities Markets Globally',
    category: 'Announcement',
    date: 'Feb 3, 2026',
    href: '#',
    glowColor: 'blue' as const,
    IconComp: NotificationIcon,
    iconDuration: 3200,
  },
];

const iconColor = '#93c5fd';

export function AnnouncementsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-4xl sm:text-5xl font-medium text-foreground mb-12">
            Announcements
          </h2>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {announcements.map((item) => {
            const { IconComp, iconDuration, glowColor } = item;
            return (
              <StaggerItem key={item.title}>
                <a href={item.href} className="block group h-full">
                  <GlowCard customSize glowColor={glowColor} className="w-full min-h-[160px] p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <IconComp size={22} color={iconColor} duration={iconDuration} />
                      </div>
                      <div className="flex flex-col gap-2 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-black/10 text-gray-700">
                            {item.category}
                          </span>
                          <span className="text-gray-500 text-xs">{item.date}</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors line-clamp-3 leading-snug">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  </GlowCard>
                </a>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
