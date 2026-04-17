// Inspired by 21st.dev: aceternity/world-map
// Dotted world map showing KSA-Malaysia connection arcs
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { WorldMap } from "@/components/3d/WorldMap";

export function WorldMapSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative bg-[#060a10] py-24 lg:py-32 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Map */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1 }}
          >
            <WorldMap />
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            <p className="text-gold text-sm font-semibold uppercase tracking-widest font-sans">
              The Corridor
            </p>
            <h2 className="text-section font-serif text-white">
              Why{" "}
              <span className="text-gradient-gold">Saudi Arabia</span>
              {" & "}
              <span className="text-gradient-gold">Malaysia</span>
            </h2>
            <div className="space-y-4 text-white/50 text-base leading-relaxed font-sans">
              <p>
                Saudi Vision 2030 is actively pushing capital outward during its peak investment
                period (2025-2030). Malaysia's Madani Economy is courting Gulf investment aggressively.
              </p>
              <p>
                The $18B+ bilateral trade corridor is growing — yet no platform serves the
                mid-market ($2M-$50M deals) where most opportunities exist.
              </p>
              <p>
                Big 4 consultants charge $500K+ retainers. Investment banks only touch $100M+ deals.
                SIA fills this gap with technology-enabled deal facilitation at a fraction of the cost.
              </p>
            </div>

            {/* Key facts */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { label: "Islamic Finance Hub", detail: "Malaysia — #1 in ASEAN" },
                { label: "Peak Investment Window", detail: "Vision 2030 (2025-2030)" },
                { label: "Halal Economy", detail: "$18B+ bilateral trade" },
                { label: "No Competition", detail: "Underserved mid-market" },
              ].map((fact) => (
                <div
                  key={fact.label}
                  className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]"
                >
                  <div className="text-sm font-semibold text-white/80 font-sans">{fact.label}</div>
                  <div className="text-xs text-white/35 mt-1 font-sans">{fact.detail}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
