// Static partner trust bar with grid layout
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
    <section
      className="relative py-12"
      style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <p
          className="text-xs font-sans uppercase tracking-widest text-center mb-8"
          style={{ color: "var(--text-tertiary)" }}
        >
          {t("trust.alignedWith")}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center justify-items-center">
          {partners.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-default"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <span
                  className="text-xs font-bold"
                  style={{ color: "var(--accent)" }}
                >
                  {p.name.charAt(0)}
                </span>
              </div>
              <div>
                <div
                  className="text-sm font-medium"
                  style={{ color: "var(--text)" }}
                >
                  {p.name}
                </div>
                <div
                  className="text-[10px]"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {p.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
