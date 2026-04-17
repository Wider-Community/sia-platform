import { Marquee } from '@/components/animations/Marquee';

// Partner logos as simple wordmarks like the original
const partners = [
  { name: 'BlackRock', style: 'font-bold' },
  { name: 'sei', style: 'font-semibold' },
  { name: 'ethereum', style: 'font-normal' },
  { name: 'Goldman Sachs', style: 'font-semibold' },
  { name: 'SOLANA', style: 'font-bold tracking-wider' },
  { name: 'AON', style: 'font-bold' },
  { name: 'Jupiter', style: 'font-semibold' },
  { name: 'APTOS', style: 'font-bold tracking-wider' },
  { name: 'WELLINGTON MANAGEMENT', style: 'font-normal text-xs' },
  { name: 'Sui', style: 'font-semibold' },
];

export function PartnerLogos() {
  return (
    <section className="relative z-20 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <Marquee speed="slow" pauseOnHover>
            <div className="flex items-center gap-16 px-8">
              {partners.map((partner) => (
                <div
                  key={partner.name}
                  className="flex items-center justify-center"
                >
                  <span className={`text-white/90 text-sm ${partner.style} whitespace-nowrap`}>
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </Marquee>
        </div>
      </div>
    </section>
  );
}
