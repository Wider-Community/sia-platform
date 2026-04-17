// Inspired by 21st.dev: magicui/border-beam
// Animated light beam along container border — uses clip-path + rotation for broad browser support
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
}

export function BorderBeam({
  className,
  size: _size = 200,
  duration = 15,
  delay = 0,
  colorFrom = "#C8A951",
  colorTo = "#A08838",
}: BorderBeamProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className
      )}
    >
      {/* Rotating conic gradient masked to the border area */}
      <div
        className="absolute inset-[-1px] rounded-[inherit]"
        style={{
          padding: "1px",
          background: `conic-gradient(from 0deg, transparent, transparent 60%, ${colorFrom} 75%, ${colorTo} 85%, transparent 95%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          animation: `border-beam-spin ${duration}s linear infinite`,
          animationDelay: `${-delay}s`,
        }}
      />
    </div>
  );
}
