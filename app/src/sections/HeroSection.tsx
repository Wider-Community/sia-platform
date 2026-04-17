import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/hero_nyc_skyline.jpg)' }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-blue-800/40" />

      {/* Content */}
      <div className="relative z-10 flex-grow flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-xl ml-auto text-right"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-medium text-white leading-tight mb-6"
            >
              Welcome to the Open Economy
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-white/90 mb-8 max-w-md ml-auto"
            >
              At SIA, we design institutional-grade platforms, assets, and infrastructure to bring financial markets onchain.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-end"
            >
              <Button
                asChild
                className="bg-white text-[#1a1a1a] hover:bg-white/90 rounded-full px-6 py-3 h-auto text-sm font-medium inline-flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                <a href="#">
                  <span>Learn More</span>
                  <span className="text-xs text-gray-500 block">about the Open Economy</span>
                </a>
              </Button>

              <Button
                asChild
                variant="ghost"
                className="text-white hover:text-white/80 hover:bg-white/10 rounded-full px-6 py-3 h-auto text-sm font-medium"
              >
                <a href="#">
                  Read our Manifesto
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
