import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Quote } from "lucide-react";

const testimonialKeys = [
  { quoteKey: "testimonials.t1quote", nameKey: "testimonials.t1name", roleKey: "testimonials.t1role" },
  { quoteKey: "testimonials.t2quote", nameKey: "testimonials.t2name", roleKey: "testimonials.t2role" },
  { quoteKey: "testimonials.t3quote", nameKey: "testimonials.t3name", roleKey: "testimonials.t3role" },
];

export function TestimonialsSection() {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="py-20 lg:py-24"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <p className="section-label mb-4">{t("testimonials.label")}</p>
          <h2
            id="testimonials-heading"
            className="text-section font-serif"
            style={{ color: "var(--text)" }}
          >
            {t("testimonials.heading")}
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonialKeys.map((tk) => {
            const name = t(tk.nameKey);
            return (
              <div key={tk.nameKey} className="glass-card p-6">
                <Quote
                  className="w-5 h-5 mb-4"
                  style={{ color: "var(--accent)", opacity: 0.4 }}
                />
                <p
                  className="text-sm leading-relaxed mb-6 italic font-sans"
                  style={{ color: "var(--text-secondary)" }}
                >
                  &ldquo;{t(tk.quoteKey)}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-sans"
                    style={{
                      background: "var(--surface-hover)",
                      border: "1px solid var(--border)",
                      color: "var(--accent)",
                    }}
                  >
                    {name.charAt(0)}
                  </div>
                  <div>
                    <div
                      className="text-sm font-medium font-sans"
                      style={{ color: "var(--text)" }}
                    >
                      {name}
                    </div>
                    <div
                      className="text-xs font-sans"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {t(tk.roleKey)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
