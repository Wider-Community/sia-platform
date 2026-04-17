// Corridor section — KSA-Malaysia connection info (globe removed for performance)
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

export function GlobeSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const facts = [
    { label: t("globe.fact1"), detail: t("globe.fact1detail") },
    { label: t("globe.fact2"), detail: t("globe.fact2detail") },
    { label: t("globe.fact3"), detail: t("globe.fact3detail") },
    { label: t("globe.fact4"), detail: t("globe.fact4detail") },
  ];

  return (
    <section
      ref={ref}
      className="relative bg-[#151516] py-20 lg:py-28 overflow-hidden"
    >
      {/* Subtle decorative accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Visual — lightweight SVG illustration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
              {/* KSA → Malaysia connection visual */}
              <svg viewBox="0 0 400 200" className="w-full h-auto" fill="none">
                {/* Grid lines */}
                {Array.from({ length: 9 }).map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 25} x2="400" y2={i * 25} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                ))}
                {Array.from({ length: 17 }).map((_, i) => (
                  <line key={`v${i}`} x1={i * 25} y1="0" x2={i * 25} y2="200" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                ))}

                {/* Connection arc */}
                <motion.path
                  d="M 100 80 Q 200 20 320 100"
                  stroke="#C8A951"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
                />
                <motion.path
                  d="M 100 80 Q 200 20 320 100"
                  stroke="#C8A951"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeOpacity="0.1"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={isInView ? { pathLength: 1 } : {}}
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
                />

                {/* KSA marker */}
                <motion.circle cx="100" cy="80" r="6" fill="#C8A951" opacity="0.2"
                  animate={isInView ? { r: [6, 12, 6], opacity: [0.2, 0, 0.2] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <circle cx="100" cy="80" r="4" fill="#C8A951" />
                <circle cx="100" cy="80" r="2" fill="white" opacity="0.8" />
                <text x="100" y="70" textAnchor="middle" fill="white" fontSize="10" fontFamily="Inter, sans-serif" opacity="0.6">KSA</text>

                {/* Malaysia marker */}
                <motion.circle cx="320" cy="100" r="6" fill="#C8A951" opacity="0.2"
                  animate={isInView ? { r: [6, 12, 6], opacity: [0.2, 0, 0.2] } : {}}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <circle cx="320" cy="100" r="4" fill="#C8A951" />
                <circle cx="320" cy="100" r="2" fill="white" opacity="0.8" />
                <text x="320" y="90" textAnchor="middle" fill="white" fontSize="10" fontFamily="Inter, sans-serif" opacity="0.6">MY</text>

                {/* $18B+ label on arc */}
                <text x="200" y="40" textAnchor="middle" fill="#C8A951" fontSize="14" fontFamily="Playfair Display, serif" fontWeight="600">$18B+</text>
                <text x="200" y="55" textAnchor="middle" fill="white" fontSize="8" fontFamily="Inter, sans-serif" opacity="0.4">bilateral trade corridor</text>
              </svg>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 order-1 lg:order-2"
          >
            <p className="text-gold text-sm font-semibold uppercase tracking-widest font-sans">
              {t("globe.label")}
            </p>
            <h2 className="text-section font-serif text-white">
              {t("globe.heading")}{" "}
              <span className="text-gradient-gold">{t("globe.saudi")}</span>
              {" " + t("globe.and") + " "}
              <span className="text-gradient-gold">{t("globe.malaysia")}</span>
            </h2>
            <div className="space-y-4 text-white/50 text-base leading-relaxed font-sans">
              <p>{t("globe.p1")}</p>
              <p>{t("globe.p2")}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]"
                >
                  <div className="text-sm font-semibold text-white/80 font-sans">
                    {fact.label}
                  </div>
                  <div className="text-xs text-white/35 mt-1 font-sans">
                    {fact.detail}
                  </div>
                </div>
              ))}
            </div>

            <a href="#services" className="inline-flex items-center gap-2 text-gold text-sm font-medium hover:gap-3 transition-all">
              {t("hero.learnMore")}
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
