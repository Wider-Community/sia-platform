// Corridor section — KSA-Malaysia connection with map visual and glassmorphism stat cards
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

// Simplified Middle East + Southeast Asia coastline path (lightweight)
const mapPath =
  "M 30,85 L 45,78 55,80 62,72 70,70 75,65 80,68 88,62 95,65 100,60 108,58 112,62 118,58 125,60 130,55 138,52 142,56 148,50 155,48 160,52 168,55 172,50 178,48 185,52 190,48 195,52 200,55 208,52 215,58 220,62 228,60 235,65 240,62 248,68 255,65 260,70 268,72 275,68 280,75 288,72 295,78 300,75 308,80 315,78 320,82 328,85 335,82 340,88 348,85 355,90 360,88 365,92 370,95";

export function GlobeSection() {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const mapInView = useInView(mapRef, { once: true, margin: "-50px" });
  const facts = [
    { label: t("globe.fact1"), detail: t("globe.fact1detail") },
    { label: t("globe.fact2"), detail: t("globe.fact2detail") },
    { label: t("globe.fact3"), detail: t("globe.fact3detail") },
    { label: t("globe.fact4"), detail: t("globe.fact4detail") },
  ];

  return (
    <section
      id="about"
      aria-labelledby="corridor-heading"
      className="relative py-20 lg:py-28 overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Map Visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-1"
          >
            <div className="glass-card relative p-6 sm:p-8 rounded-2xl">
              <svg ref={mapRef} viewBox="0 0 400 240" className="w-full h-auto" fill="none">
                {/* Grid lines */}
                {Array.from({ length: 11 }).map((_, i) => (
                  <line
                    key={`h${i}`}
                    x1="0"
                    y1={i * 24}
                    x2="400"
                    y2={i * 24}
                    stroke="var(--border)"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                ))}
                {Array.from({ length: 17 }).map((_, i) => (
                  <line
                    key={`v${i}`}
                    x1={i * 25}
                    y1="0"
                    x2={i * 25}
                    y2="240"
                    stroke="var(--border)"
                    strokeWidth="0.5"
                    opacity="0.3"
                  />
                ))}

                {/* Simplified coastline */}
                <path
                  d={mapPath}
                  stroke="var(--text-tertiary)"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.3"
                />

                {/* $18B+ label */}
                <text x="200" y="22" textAnchor="middle" fill="var(--accent)" fontSize="16" fontFamily="Playfair Display, serif" fontWeight="600">
                  $18B+
                </text>
                <text x="200" y="38" textAnchor="middle" fill="var(--text-tertiary)" fontSize="9" fontFamily="Inter, sans-serif">
                  bilateral trade corridor
                </text>

                {/* Connection arc */}
                <motion.path
                  d="M 90 120 Q 200 60 320 140"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={mapInView ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
                />

                {/* KSA marker */}
                <circle cx="90" cy="120" r="4" fill="var(--accent)" />
                <circle cx="90" cy="120" r="1.5" fill="var(--bg)" opacity="0.9" />
                <text x="90" y="140" textAnchor="middle" fill="var(--text-secondary)" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600">
                  Saudi Arabia
                </text>
                <text x="90" y="152" textAnchor="middle" fill="var(--text-tertiary)" fontSize="7" fontFamily="Inter, sans-serif">
                  Riyadh
                </text>

                {/* Malaysia marker */}
                <circle cx="320" cy="140" r="4" fill="var(--accent)" />
                <circle cx="320" cy="140" r="1.5" fill="var(--bg)" opacity="0.9" />
                <text x="320" y="160" textAnchor="middle" fill="var(--text-secondary)" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600">
                  Malaysia
                </text>
                <text x="320" y="172" textAnchor="middle" fill="var(--text-tertiary)" fontSize="7" fontFamily="Inter, sans-serif">
                  Kuala Lumpur
                </text>

                {/* Midpoint */}
                <circle cx="200" cy="78" r="2" fill="var(--accent)" opacity="0.4" />
              </svg>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6 order-1 lg:order-2"
          >
            <p
              className="section-label text-sm font-semibold uppercase tracking-widest font-sans"
            >
              {t("globe.label")}
            </p>
            <h2
              id="corridor-heading"
              className="text-section font-serif"
              style={{ color: "var(--text)" }}
            >
              {t("globe.heading")}{" "}
              <span className="text-gradient-gold">{t("globe.saudi")}</span>
              {" " + t("globe.and") + " "}
              <span className="text-gradient-gold">{t("globe.malaysia")}</span>
            </h2>
            <div
              className="space-y-4 text-base leading-relaxed font-sans"
              style={{ color: "var(--text-secondary)" }}
            >
              <p>{t("globe.p1")}</p>
              <p>{t("globe.p2")}</p>
            </div>

            {/* Glassmorphism stat cards */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="glass-card p-3 rounded-lg"
                >
                  <div
                    className="text-sm font-semibold font-sans"
                    style={{ color: "var(--text)" }}
                  >
                    {fact.label}
                  </div>
                  <div
                    className="text-xs mt-1 font-sans"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {fact.detail}
                  </div>
                </div>
              ))}
            </div>

            <a
              href="#services"
              className="inline-flex items-center gap-2 text-sm font-medium hover:gap-3 transition-all"
              style={{ color: "var(--accent)" }}
            >
              {t("hero.learnMore")}
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
