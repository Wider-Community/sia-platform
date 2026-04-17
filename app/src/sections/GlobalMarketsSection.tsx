import { FadeIn } from '@/components/animations';
import { Marquee } from '@/components/animations/Marquee';
import { Button } from '@/components/ui/button';

const tokensRow1 = [
  { symbol: 'AAPL', name: 'Apple', price: '$198.42', change: '+1.2%' },
  { symbol: 'NKE', name: 'Nike', price: '$78.15', change: '+0.8%' },
  { symbol: 'MSFT', name: 'Microsoft', price: '$442.68', change: '+2.1%' },
  { symbol: 'MA', name: 'Mastercard', price: '$528.45', change: '-0.5%' },
  { symbol: 'UBER', name: 'Uber', price: '$68.92', change: '+0.3%' },
  { symbol: 'PYPL', name: 'PayPal', price: '$68.15', change: '+1.5%' },
  { symbol: 'IBM', name: 'IBM', price: '$228.42', change: '+3.2%' },
  { symbol: 'V', name: 'Visa', price: '$315.23', change: '-0.8%' },
  { symbol: 'COIN', name: 'Coinbase', price: '$285.67', change: '+0.6%' },
  { symbol: 'META', name: 'Meta', price: '$585.92', change: '+1.1%' },
];

const tokensRow2 = [
  { symbol: 'INTC', name: 'Intel', price: '$22.45', change: '+5.2%' },
  { symbol: 'GOOGL', name: 'Alphabet', price: '$185.92', change: '+1.8%' },
  { symbol: 'GE', name: 'GE', price: '$198.42', change: '+2.5%' },
  { symbol: 'ARM', name: 'ARM', price: '$142.67', change: '+0.9%' },
  { symbol: 'CRCL', name: 'Circle', price: '$28.38', change: '-0.3%' },
  { symbol: 'ACN', name: 'Accenture', price: '$358.42', change: '+3.8%' },
  { symbol: 'EQIX', name: 'Equinix', price: '$885.23', change: '+1.2%' },
  { symbol: 'DASH', name: 'DoorDash', price: '$198.92', change: '+2.1%' },
  { symbol: 'ADBE', name: 'Adobe', price: '$485.15', change: '+4.5%' },
  { symbol: 'TM', name: 'Toyota', price: '$185.67', change: '+0.7%' },
];

function TokenCard({ symbol, name, price, change }: {
  symbol: string;
  name: string;
  price: string;
  change: string;
}) {
  const isPositive = change.startsWith('+');

  return (
    <a
      href={`#`}
      className="flex-shrink-0 w-36 bg-background rounded-xl border border-border p-4 mx-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-blue-300"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center text-white text-xs font-bold">
          {symbol.slice(0, 2)}
        </div>
        <span className="font-semibold text-sm text-foreground">{symbol}</span>
      </div>
      <p className="text-xs text-muted-foreground mb-2 truncate">{name}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{price}</span>
        <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
      </div>
    </a>
  );
}

export function GlobalMarketsSection() {
  return (
    <section className="py-20 bg-muted overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Global Markets Header */}
        <FadeIn className="mb-12">
          <div className="max-w-xl">
            <h3 className="text-xl font-medium text-foreground mb-2">
              Global Markets
            </h3>
            <h4 className="text-3xl sm:text-4xl font-medium text-foreground mb-4">
              Thousands of RWAs.<br />One Platform.
            </h4>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Buy, sell, and trade thousands of tokens backed 1:1 by traditional stocks, bonds, and ETFs.*
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Button
                asChild
                className="bg-foreground text-background hover:bg-foreground/80 rounded-full"
              >
                <a href="#" className="inline-flex items-center gap-2">
                  Learn More
                  <span className="text-xs opacity-70">about Global Markets</span>
                </a>
              </Button>
              <span className="text-xs text-muted-foreground bg-muted-foreground/10 px-3 py-1.5 rounded-full">
                Not Available in US
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Token Marquee */}
        <FadeIn delay={0.2}>
          <div className="space-y-4">
            <Marquee direction="left" speed="normal">
              <div className="flex py-2">
                {tokensRow1.map((token) => (
                  <TokenCard key={token.symbol} {...token} />
                ))}
              </div>
            </Marquee>
            <Marquee direction="right" speed="normal">
              <div className="flex py-2">
                {tokensRow2.map((token) => (
                  <TokenCard key={token.symbol} {...token} />
                ))}
              </div>
            </Marquee>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
