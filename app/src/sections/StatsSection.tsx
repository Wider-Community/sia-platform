import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations';
import { CountUp } from '@/components/animations/CountUp';

const stats = [
  { value: 10, label: 'Supported Chains', suffix: '' },
  { value: 150, label: 'Integrated Projects', suffix: '' },
  { value: 80, label: 'Yieldcoin Market Share', suffix: '%' },
  { value: 2.63, label: 'TVL', prefix: '$', suffix: 'B', decimals: 2 },
];

export function StatsSection() {
  return (
    <section className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-medium text-foreground max-w-2xl mx-auto">
            SIA is building the foundation for the future of finance.
          </h2>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-semibold text-foreground mb-2">
                  <CountUp
                    end={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals || 0}
                    duration={2000}
                  />
                </div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.4} className="mt-16">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 max-w-4xl mx-auto">
            <p className="text-xs text-muted-foreground leading-relaxed">
              The assets referenced on sia.finance (SIA Global Markets tokenized stocks, ETFs, and ADRs, USDY tokens and OUSG tokens) (the &quot;Tokens&quot;) have not been registered under the US Securities Act of 1933, as amended (the &quot;Act&quot;) or the securities or financial instrument laws of any other jurisdiction, and may not be offered or sold in the US or to US persons unless registered under the Act or an exemption from the registration requirements thereof is available. In certain jurisdictions, including the United Kingdom, Switzerland and (for certain Tokens) the European Economic Area, SIA GM Tokens and USDY tokens are offered and sold only to qualified investors or professional clients. OUSG tokens are available solely to persons who are accredited investors under the Act and qualified purchasers under the US Investment Company Act of 1940, as amended. Other prohibitions and restrictions apply. See important additional information below.*
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
