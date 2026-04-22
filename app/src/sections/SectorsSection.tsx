import { motion } from "framer-motion";
import { useState } from "react";
import {
  Utensils,
  HeartPulse,
  Building2,
  Cpu,
  Landmark,
  Zap,
  Plane,
  Package,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const sectors = [
  { icon: Utensils, nameKey: "sectors.halal", descKey: "sectors.halalDesc" },
  { icon: HeartPulse, nameKey: "sectors.healthcare", descKey: "sectors.healthcareDesc" },
  { icon: Building2, nameKey: "sectors.realEstate", descKey: "sectors.realEstateDesc" },
  { icon: Cpu, nameKey: "sectors.tech", descKey: "sectors.techDesc" },
  { icon: Landmark, nameKey: "sectors.finance", descKey: "sectors.financeDesc" },
  { icon: Zap, nameKey: "sectors.energy", descKey: "sectors.energyDesc" },
  { icon: Plane, nameKey: "sectors.tourism", descKey: "sectors.tourismDesc" },
  { icon: Package, nameKey: "sectors.logistics", descKey: "sectors.logisticsDesc" },
];

function SectorCard({ sector, index }: { sector: typeof sectors[number]; index: number }) {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);
  const Icon = sector.icon;

  return (
    <motion.div
      key={sector.nameKey}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="glass-card p-5 cursor-pointer transition-all duration-300"
      style={hovered ? { boxShadow: "0 0 12px var(--accent-glow)" } : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon
        className="mb-3"
        style={{ color: "var(--accent)", width: 24, height: 24 }}
      />
      <h3
        className="font-serif font-semibold text-sm mb-1"
        style={{ color: "var(--text)" }}
      >
        {t(sector.nameKey)}
      </h3>
      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
        {t(sector.descKey)}
      </p>
    </motion.div>
  );
}

export function SectorsSection() {
  const { t } = useTranslation();

  return (
    <section
      id="sectors"
      aria-labelledby="sectors-heading"
      className="py-20 lg:py-24"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label mb-4">{t("sectors.label")}</p>
          <h2
            id="sectors-heading"
            className="text-section font-serif mb-4"
            style={{ color: "var(--text)" }}
          >
            {t("sectors.heading")}
          </h2>
          <p
            className="text-lg max-w-xl mx-auto font-sans"
            style={{ color: "var(--text-secondary)" }}
          >
            {t("sectors.subtitle")}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {sectors.map((sector, i) => (
            <SectorCard key={sector.nameKey} sector={sector} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
