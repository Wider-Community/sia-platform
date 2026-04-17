import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const ecosystemPartners = [
  'BlackRock', 'Franklin Templeton', 'Aon', 'Morgan Stanley',
  'Goldman Sachs', 'Apollo', 'KKR', 'Carlyle',
  'Sequoia', 'a16z', 'Polychain', 'Pantera',
];

export function EcosystemSection() {
  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div>
              <h2 className="text-3xl sm:text-4xl font-medium text-foreground mb-4">
                SIA Ecosystem
              </h2>
              <h3 className="text-xl text-muted-foreground mb-6">
                Building the Bridge Between TradFi &amp; DeFi
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We&apos;re grateful to be working with organizations aligned with the mission of making institutional-grade financial products and services available to everyone.
              </p>
              <Button
                asChild
                className="bg-foreground text-background hover:bg-foreground/80 rounded-full inline-flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <a href="#" className="inline-flex items-center gap-2">
                  Explore Our Partners
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} direction="left">
            <StaggerContainer className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {ecosystemPartners.map((partner) => (
                <StaggerItem key={partner}>
                  <div className="bg-background rounded-xl p-4 h-16 flex items-center justify-center border border-border transition-all duration-300 hover:shadow-md hover:border-blue-300 hover:scale-105">
                    <span className="text-xs font-medium text-muted-foreground text-center">
                      {partner}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
