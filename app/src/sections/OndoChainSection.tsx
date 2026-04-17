import { FadeIn } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function SIAChainSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#0a1628] via-[#0d1f35] to-[#0a1628] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Network nodes */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-blue-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `pulse ${2 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
        
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          {[...Array(15)].map((_, i) => (
            <line
              key={i}
              x1={`${Math.random() * 100}%`}
              y1={`${Math.random() * 100}%`}
              x2={`${Math.random() * 100}%`}
              y2={`${Math.random() * 100}%`}
              stroke="url(#lineGradient)"
              strokeWidth="0.5"
            />
          ))}
        </svg>

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn className="text-center">
          <div className="inline-flex items-center gap-2 mb-6 bg-blue-500/10 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-blue-400 text-sm font-medium">SIA Chain</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-white mb-6 leading-tight">
            The Future of<br />Institutional Finance
          </h2>
          
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10">
            A purpose-built Layer 1 blockchain designed to meet the needs of institutional investors and capital markets.
          </p>

          <Button
            asChild
            className="bg-white text-[#0a1628] hover:bg-white/90 rounded-full px-8 py-3 h-auto text-sm font-medium inline-flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <a href="#" className="inline-flex items-center gap-2">
              Learn More
              <span className="text-xs opacity-70">about SIA Chain</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
        </FadeIn>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </section>
  );
}
