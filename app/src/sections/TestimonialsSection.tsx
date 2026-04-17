// Inspired by 21st.dev: sean0205/3d-testimonials + Efferd/testimonials-columns
// 3D animated testimonial cards with marquee scrolling
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Marquee } from "@/components/effects/Marquee";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "The Saudi-Malaysia corridor represents one of the most underserved yet high-potential bilateral investment channels in the emerging market landscape.",
    name: "Industry Analysis",
    role: "McKinsey Global Institute",
  },
  {
    quote:
      "Tokenization and digital platforms are transforming how cross-border investment facilitation works. The middle market is where the real transformation happens.",
    name: "Matt Higginson",
    role: "McKinsey & Company",
  },
  {
    quote:
      "Saudi Vision 2030 is creating unprecedented outbound investment flows. Southeast Asia, particularly Malaysia, is a natural destination for Islamic finance capital.",
    name: "Market Commentary",
    role: "Bloomberg Intelligence",
  },
  {
    quote:
      "The halal economy alone represents a $2.3 trillion global opportunity. Malaysia's position as the Islamic finance hub of ASEAN makes it the gateway for Gulf capital.",
    name: "State of the Global Islamic Economy",
    role: "DinarStandard Report",
  },
  {
    quote:
      "Risk management for institutions entering new bilateral corridors requires specialized knowledge of both regulatory environments. One-size-fits-all approaches fail.",
    name: "Glenn Morgan",
    role: "Aon Risk Solutions",
  },
  {
    quote:
      "The future of cross-border deal facilitation is technology-enabled, compliance-first, and corridor-specific. Generic platforms cannot serve specialized bilateral needs.",
    name: "Industry Outlook",
    role: "Deloitte Financial Advisory",
  },
];

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="w-[350px] shrink-0 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-gold/15 transition-all duration-300 group">
      <Quote className="w-5 h-5 text-gold/30 mb-4" />
      <p className="text-white/50 text-sm leading-relaxed mb-6 font-sans">
        "{testimonial.quote}"
      </p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
          <span className="text-gold text-xs font-bold font-sans">
            {testimonial.name.charAt(0)}
          </span>
        </div>
        <div>
          <div className="text-sm font-medium text-white/80 font-sans">{testimonial.name}</div>
          <div className="text-xs text-white/30 font-sans">{testimonial.role}</div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation();

  return (
    <section className="relative bg-navy py-24 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="text-center"
        >
          <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-4 font-sans">
            {t("testimonials.label")}
          </p>
          <h2 className="text-section font-serif text-white">
            {t("testimonials.heading")}
          </h2>
        </motion.div>
      </div>

      {/* Marquee Row 1 */}
      <div className="mb-4">
        <Marquee speed={50}>
          {testimonials.slice(0, 3).map((t, i) => (
            <TestimonialCard key={i} testimonial={t} />
          ))}
        </Marquee>
      </div>

      {/* Marquee Row 2 (reverse) */}
      <Marquee speed={45} reverse>
        {testimonials.slice(3).map((t, i) => (
          <TestimonialCard key={i} testimonial={t} />
        ))}
      </Marquee>

      {/* Side fades */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-navy to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-navy to-transparent pointer-events-none z-10" />
    </section>
  );
}
