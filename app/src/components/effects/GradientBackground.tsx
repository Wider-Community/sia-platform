// Inspired by 21st.dev: aceternity/background-gradient-animation
// Smooth animated gradient mesh background
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GradientBackgroundProps {
  children?: ReactNode;
  className?: string;
  interactive?: boolean;
}

export function GradientBackground({
  children,
  className,
}: GradientBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="gradient-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="60" />
          </filter>
        </defs>
        <g filter="url(#gradient-blur)">
          <circle cx="30%" cy="30%" r="25%" fill="#C8A951" opacity="0.4">
            <animate attributeName="cx" values="30%;70%;30%" dur="20s" repeatCount="indefinite" />
            <animate attributeName="cy" values="30%;60%;30%" dur="15s" repeatCount="indefinite" />
          </circle>
          <circle cx="70%" cy="60%" r="20%" fill="#1C1C1E" opacity="0.6">
            <animate attributeName="cx" values="70%;30%;70%" dur="18s" repeatCount="indefinite" />
            <animate attributeName="cy" values="60%;30%;60%" dur="22s" repeatCount="indefinite" />
          </circle>
          <circle cx="50%" cy="80%" r="22%" fill="#A08838" opacity="0.3">
            <animate attributeName="cx" values="50%;20%;80%;50%" dur="25s" repeatCount="indefinite" />
            <animate attributeName="cy" values="80%;40%;60%;80%" dur="20s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
