// Inspired by 21st.dev: dillionverma/globe (Magic UI)
// Lightweight auto-rotating globe using cobe — responsive sizing
import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";

interface GlobeProps {
  className?: string;
}

export function Globe({ className = "" }: GlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState(0);

  // Measure container to get responsive size
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const w = container.clientWidth;
      setCanvasSize(Math.min(w, 400));
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Create globe once we have a size
  useEffect(() => {
    if (!canvasRef.current || canvasSize === 0) return;

    // Start facing the Middle East / Southeast Asia region
    // phi = longitude rotation (radians), theta = latitude tilt
    // KSA ~47°E, Malaysia ~102°E → center around ~75°E → phi ≈ 1.3 rad
    let phi = 1.3;
    let frameId: number;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 1,
      width: canvasSize * 2,
      height: canvasSize * 2,
      phi: 1.3,
      theta: 0.15,
      dark: 0,
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 8,
      baseColor: [0.95, 0.95, 0.97],
      markerColor: [0.78, 0.55, 0.15],
      glowColor: [0.85, 0.85, 0.9],
      markers: [
        { location: [24.7136, 46.6753], size: 0.08 },
        { location: [3.139, 101.6869], size: 0.08 },
        { location: [25.2048, 55.2708], size: 0.04 },
        { location: [1.3521, 103.8198], size: 0.04 },
      ],
    });

    const animate = () => {
      phi += 0.05;
      globe.update({ phi });
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      globe.destroy();
    };
  }, [canvasSize]);

  return (
    <div ref={containerRef} className={`relative w-full max-w-[400px] mx-auto ${className}`}>
      {canvasSize > 0 && (
        <canvas
          ref={canvasRef}
          width={canvasSize * 2}
          height={canvasSize * 2}
          style={{
            width: canvasSize,
            height: canvasSize,
          }}
        />
      )}
    </div>
  );
}
