import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  const { t } = useTranslation();
  const [primaryHovered, setPrimaryHovered] = useState(false);

  return (
    <section
      id="contact"
      aria-labelledby="cta-heading"
      className="py-20 lg:py-24"
      style={{ background: "var(--bg)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center px-6"
      >
        <h2
          id="cta-heading"
          className="text-section font-serif mb-6"
          style={{ color: "var(--text)" }}
        >
          {t("cta.heading")}
        </h2>
        <p
          className="text-lg mb-10 font-sans"
          style={{ color: "var(--text-secondary)" }}
        >
          {t("cta.subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:hello@sia.agency"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 font-semibold rounded-lg transition-all duration-300"
            style={{
              background: "var(--accent)",
              color: "#1a1a1a",
              ...(primaryHovered
                ? { boxShadow: "0 0 24px var(--accent-glow)" }
                : {}),
            }}
            onMouseEnter={() => setPrimaryHovered(true)}
            onMouseLeave={() => setPrimaryHovered(false)}
          >
            {t("cta.primary")}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#insights"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 font-medium rounded-lg transition-all duration-300"
            style={{
              color: "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            {t("cta.secondary")}
          </a>
        </div>

        <p
          className="text-xs mt-8 font-sans"
          style={{ color: "var(--text-tertiary)" }}
        >
          {t("cta.trust")}
        </p>
      </motion.div>
    </section>
  );
}
