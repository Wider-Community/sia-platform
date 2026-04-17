// Inspired by 21st.dev: motion-primitives/text-effect
// Per-word/character animated text reveal
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  by?: "word" | "character";
}

export function TextReveal({
  text,
  className,
  delay = 0,
  by = "word",
}: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const units = by === "word" ? text.split(" ") : text.split("");
  const separator = by === "word" ? "\u00A0" : "";

  return (
    <span ref={ref} className={cn("inline-flex flex-wrap", className)}>
      {units.map((unit, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "100%", opacity: 0 }}
            animate={isInView ? { y: "0%", opacity: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.04,
              ease: [0.25, 0.4, 0.25, 1],
            }}
          >
            {unit}{separator}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
