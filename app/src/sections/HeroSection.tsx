// Corporate glassmorphism hero — clean serif headline with grid-pattern overlay
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-screen flex flex-col overflow-hidden py-32 lg:py-40"
      style={{ background: "var(--bg)" }}
    >
      {/* Grid pattern overlay */}
      <div className="grid-pattern absolute inset-0 pointer-events-none" />

      {/* Emissive gold glow orb behind heading (dark mode accent) */}
      <div
        className="emissive-pulse absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: 300,
          height: 300,
          borderRadius: "50%",
          opacity: 0.3,
          background: "var(--accent-glow)",
          position: "absolute",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex-grow flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
              style={{
                border: "1px solid var(--border)",
                background: "var(--glass-bg)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "var(--accent)" }}
              />
              <span
                className="text-xs font-medium font-sans"
                style={{ color: "var(--text-secondary)" }}
              >
                {t("hero.badge")}
              </span>
            </div>

            {/* Headline */}
            <h1
              id="hero-heading"
              className="text-hero font-serif font-medium leading-[1.1] mb-6"
              style={{ color: "var(--text)" }}
            >
              {t("hero.heading1")}{" "}
              <span className="text-gradient-gold">{t("hero.heading2")}</span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg sm:text-xl mb-10 max-w-lg mx-auto leading-relaxed font-sans"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("hero.subtitle")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="#about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 font-medium rounded-xl transition-all text-sm"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  background: "transparent",
                }}
              >
                {t("hero.learnMore")}
              </a>
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-xl transition-all text-sm"
                style={{
                  background: "var(--accent)",
                  color: "var(--bg)",
                }}
              >
                {t("hero.cta")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
              </a>
            </div>

            {/* Anchor stats */}
            <div className="flex items-center justify-center gap-6 sm:gap-10">
              {[
                { value: t("hero.stat1value"), label: t("hero.stat1label") },
                { value: t("hero.stat2value"), label: t("hero.stat2label") },
                { value: t("hero.stat3value"), label: t("hero.stat3label") },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-6 sm:gap-10">
                  {i > 0 && (
                    <div
                      className="w-px h-10"
                      style={{ background: "var(--border)" }}
                    />
                  )}
                  <div>
                    <div
                      className="text-2xl sm:text-3xl font-serif font-bold"
                      style={{ color: "var(--text)" }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="text-xs font-sans mt-1"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {stat.label}
                    </div>
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
