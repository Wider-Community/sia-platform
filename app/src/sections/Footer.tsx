import { useTranslation } from "react-i18next";
import { MapPin, ArrowUpRight } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { label: t("nav.dealFacilitation"), href: "#services" },
    { label: t("nav.marketEntry"), href: "#services" },
    { label: t("nav.regulatoryNav"), href: "#services" },
    { label: t("nav.insights"), href: "#insights" },
    { label: t("footer.about"), href: "#about" },
    { label: t("footer.contact"), href: "#contact" },
  ];

  return (
    <footer style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
      {/* Newsletter strip */}
      <div style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-serif font-semibold" style={{ color: "var(--text)" }}>
              {t("footer.newsletter")}
            </h3>
            <p className="text-sm font-sans" style={{ color: "var(--text-secondary)" }}>
              {t("footer.newsletterDesc")}
            </p>
          </div>
          <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="emissive-focus flex-1 md:w-64 px-4 py-2.5 rounded-lg text-sm font-sans"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            />
            <button
              className="px-6 py-2.5 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
              style={{ background: "var(--accent)", color: "#1a1a1a" }}
            >
              {t("footer.subscribe")}
            </button>
          </form>
        </div>
      </div>

      {/* Main footer — 3 columns */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Column 1: Logo + description */}
          <div>
            <img
              src="/images/sia-logo.png"
              alt="SIA — Strategic Integration Agency"
              width="40"
              height="40"
              loading="lazy"
              className="h-10 w-auto mb-4"
            />
            <p className="text-sm leading-relaxed mb-4 max-w-xs font-sans" style={{ color: "var(--text-secondary)" }}>
              {t("footer.tagline")}
            </p>
            <div className="text-xs font-serif italic" style={{ color: "var(--accent)", opacity: 0.6 }}>
              {t("footer.motto")}
            </div>
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-widest mb-4 font-sans"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("footer.services")}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm font-sans transition-colors hover:opacity-80"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact / Offices */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-widest mb-4 font-sans"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("footer.company")}
            </h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--accent)", opacity: 0.5 }} />
                <div>
                  <div className="text-sm font-medium font-sans" style={{ color: "var(--text-secondary)" }}>
                    {t("footer.riyadh")}
                  </div>
                  <div className="text-xs font-sans" style={{ color: "var(--text-tertiary)" }}>
                    {t("footer.riyadhDistrict")}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--accent)", opacity: 0.5 }} />
                <div>
                  <div className="text-sm font-medium font-sans" style={{ color: "var(--text-secondary)" }}>
                    {t("footer.kl")}
                  </div>
                  <div className="text-xs font-sans" style={{ color: "var(--text-tertiary)" }}>
                    {t("footer.klDistrict")}
                  </div>
                </div>
              </div>
            </div>

            {/* Legal links */}
            <div className="mt-6 space-y-2">
              {[
                { label: t("footer.privacyPolicy"), href: "#" },
                { label: t("footer.terms"), href: "#" },
                { label: t("footer.compliance"), href: "#" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-xs font-sans transition-colors hover:opacity-80"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-xs font-sans" style={{ color: "var(--text-tertiary)" }}>
            &copy; {new Date().getFullYear()} {t("footer.copyright")}
          </div>
          <div className="flex items-center gap-4">
            {["LinkedIn", "X"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-xs flex items-center gap-1 font-sans transition-colors"
                style={{ color: "var(--text-tertiary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
              >
                {s} <ArrowUpRight className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
