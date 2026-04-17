import { FadeIn } from '@/components/animations';
import { ArrowRight } from 'lucide-react';

export function TechnologySection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div>
              <h2 className="text-3xl sm:text-4xl font-medium text-foreground mb-6">
                Our Technology, Your Tokens
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our Nexus technology enables issuers of tokenized US Treasuries and stablecoins to offer instant minting and redemption to their clients.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-foreground font-medium hover:text-blue-600 transition-colors group"
              >
                Learn More
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} direction="left">
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-blue-950/30 rounded-3xl p-8 h-80 flex items-center justify-center relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-blue-200/30 rounded-full blur-xl" />
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-purple-200/30 rounded-full blur-xl" />

              <div className="text-center relative z-10">
                <div className="w-24 h-24 mx-auto mb-4 bg-background rounded-2xl shadow-lg flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-12 h-12 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="19" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                    <circle cx="5" cy="12" r="2" />
                    <line x1="12" y1="7" x2="12" y2="9" />
                    <line x1="17" y1="12" x2="15" y2="12" />
                    <line x1="12" y1="15" x2="12" y2="17" />
                    <line x1="9" y1="12" x2="7" y2="12" />
                  </svg>
                </div>
                <p className="text-muted-foreground font-medium">Nexus Technology</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
