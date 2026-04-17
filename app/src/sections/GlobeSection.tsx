// Globe section — sits right after the hero as section #2
// Globe auto-rotates showing KSA and Malaysia markers
import { motion, useInView } from "framer-motion";
import { lazy, Suspense, useRef } from "react";
import { useTranslation } from "react-i18next";

const Globe = lazy(() =>
  import("@/components/3d/Globe").then((m) => ({ default: m.Globe }))
);

export function GlobeSection() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "200px" });

  const facts = [
    { label: t("globe.fact1"), detail: t("globe.fact1detail") },
    { label: t("globe.fact2"), detail: t("globe.fact2detail") },
    { label: t("globe.fact3"), detail: t("globe.fact3detail") },
    { label: t("globe.fact4"), detail: t("globe.fact4detail") },
  ];

  return (
    <section
      ref={ref}
      className="relative bg-navy py-20 lg:py-28 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center order-2 lg:order-1"
          >
            {isInView ? (
              <Suspense
                fallback={
                  <div className="w-[400px] h-[400px] rounded-full bg-white/[0.02] animate-pulse" />
                }
              >
                <Globe size={400} />
              </Suspense>
            ) : (
              <div className="w-[400px] h-[400px]" />
            )}
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
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

            {/* Key facts */}
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
