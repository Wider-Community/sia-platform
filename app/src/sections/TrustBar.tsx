// Inspired by 21st.dev: shadcnblockscom/logos-3 + magicui/marquee
// Auto-scrolling partner/trust logos
import { Marquee } from "@/components/effects/Marquee";
import { useTranslation } from "react-i18next";

const partners = [
  { name: "Vision 2030", subtitle: "Saudi Arabia" },
  { name: "MIDA", subtitle: "Malaysia" },
  { name: "SAGIA", subtitle: "Saudi Arabia" },
  { name: "Madani Economy", subtitle: "Malaysia" },
  { name: "MITI", subtitle: "Malaysia" },
  { name: "Bank Negara", subtitle: "Malaysia" },
  { name: "CMA", subtitle: "Saudi Arabia" },
];

export function TrustBar() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-navy border-y border-white/[0.04] py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-8">
          <span className="text-xs font-sans text-white/30 uppercase tracking-widest whitespace-nowrap">
            {t("trust.alignedWith")}
          </span>
          <Marquee speed={30} className="flex-1">
            {partners.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-3 px-8 py-2"
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                  <span className="text-gold text-xs font-bold">
                    {p.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium text-white/60">{p.name}</div>
                  <div className="text-[10px] text-white/30">{p.subtitle}</div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
