// Inspired by 21st.dev: aceternity/aurora-background (28,934 downloads)
// Subtle aurora/northern lights background effect
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AuroraBackgroundProps {
  children?: ReactNode;
  className?: string;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  children,
  className,
  showRadialGradient = true,
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center transition-bg overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "pointer-events-none absolute -inset-[10px] opacity-50",
            "[--aurora:repeating-linear-gradient(100deg,#C8A951_10%,#1C1C1E_15%,#C8A951_20%,#A08838_25%,#1C1C1E_30%)]",
            "[background-image:var(--aurora)]",
            "[background-size:300%_200%]",
            "[background-position:50%_50%]",
            "filter blur-[10px]",
            "after:content-[''] after:absolute after:inset-0",
            "after:[background-image:var(--aurora)]",
            "after:[background-size:200%_100%]",
            "after:animate-aurora after:mix-blend-difference",
            "after:[background-attachment:fixed]",
            showRadialGradient &&
              "[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]"
          )}
          style={{
            animation: "aurora 60s linear infinite",
          }}
        />
      </div>
      {children}
    </div>
  );
}
