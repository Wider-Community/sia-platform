import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';

export function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="bg-[#1a1a1a]/95 text-white py-2.5 px-4 relative z-50"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm">
            <span className="text-white/90">Introducing SIA Global Listing</span>
            <a
              href="#"
              className="inline-flex items-center gap-1 text-white hover:text-white/80 transition-colors underline underline-offset-2"
            >
              Learn More
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
            aria-label="Close announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
