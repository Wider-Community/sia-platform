// Inspired by 21st.dev: aceternity/3d-card-effect
// 3D perspective card with mouse tracking
import { useState, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ThreeDCardProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export function ThreeDCard({
  children,
  className,
  containerClassName,
}: ThreeDCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const rY = ((mouseX - width / 2) / width) * 20;
    const rX = -((mouseY - height / 2) / height) * 20;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      className={cn("perspective-[1000px]", containerClassName)}
    >
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "transition-transform duration-200 ease-out",
          className
        )}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function ThreeDCardBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]", className)}>
      {children}
    </div>
  );
}

export function ThreeDCardItem({
  children,
  className,
  translateZ = 0,
}: {
  children: ReactNode;
  className?: string;
  translateZ?: number;
}) {
  return (
    <div
      className={cn("transition-transform duration-200 ease-out", className)}
      style={{ transform: `translateZ(${translateZ}px)` }}
    >
      {children}
    </div>
  );
}
