import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Link } from "react-router-dom";

export function Navbar() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.services"), href: "#services" },
    { label: t("nav.platform"), href: "#platform" },
    { label: t("nav.sectors"), href: "#sectors" },
    { label: t("nav.insights"), href: "#insights" },
  ];

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "backdrop-blur-xl border-b shadow-sm"
            : "bg-transparent"
        )}
        style={scrolled ? {
          backgroundColor: "color-mix(in srgb, var(--surface) 90%, transparent)",
          borderColor: "var(--border)",
        } : undefined}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/images/sia-logo.png"
              alt="SIA — Strategic Integration Agency"
              width="52"
              height="52"
              className="h-[52px] w-auto"
            />
          </Link>

          {/* Desktop Nav — flat links, no dropdowns */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--text)";
                  e.currentTarget.style.backgroundColor = "var(--surface-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--text-secondary)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-xs font-medium transition-colors border rounded-lg"
              style={{
                color: "var(--text-secondary)",
                borderColor: "var(--border)",
              }}
            >
              {t("nav.langToggle")}
            </button>
            <Link
              to="/investor/login"
              className="px-5 py-2 text-sm font-semibold rounded-lg transition-all border-2"
              style={{
                borderColor: "var(--accent)",
                color: "var(--accent)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent)";
                e.currentTarget.style.color = "#1a1a1a";
                e.currentTarget.style.boxShadow = "0 0 16px var(--accent-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--accent)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Investor Login
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 backdrop-blur-xl"
            style={{ backgroundColor: "color-mix(in srgb, var(--surface) 98%, transparent)" }}
          >
            <nav aria-label="Mobile navigation" className="flex flex-col items-center justify-center h-full gap-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl font-serif transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex items-center gap-3"
              >
                <ThemeToggle />
                <button
                  onClick={toggleLanguage}
                  className="text-sm font-medium transition-colors border rounded-lg px-4 py-2"
                  style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}
                >
                  {t("nav.langToggle")}
                </button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  to="/investor/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-8 py-3 rounded-lg font-semibold"
                  style={{ backgroundColor: "var(--accent)", color: "#1a1a1a" }}
                >
                  Investor Login
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
