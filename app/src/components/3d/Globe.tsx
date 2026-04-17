// Inspired by 21st.dev: dillionverma/globe (Magic UI)
// Lightweight auto-rotating globe using cobe
import { useEffect, useRef } from "react";
import createGlobe from "cobe";

interface GlobeProps {
  className?: string;
  size?: number;
}

export function Globe({ className = "", size = 400 }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let phi = 0.4;
    let frameId: number;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 1,
      width: size * 2,
      height: size * 2,
      phi: 0.4,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 4000,
      mapBrightness: 4,
      baseColor: [0.15, 0.15, 0.18],
      markerColor: [0.78, 0.66, 0.32],
      glowColor: [0.08, 0.08, 0.1],
      markers: [
        { location: [24.7136, 46.6753], size: 0.08 },
        { location: [3.139, 101.6869], size: 0.08 },
        { location: [25.2048, 55.2708], size: 0.04 },
        { location: [1.3521, 103.8198], size: 0.04 },
      ],
    });

    const animate = () => {
      phi += 0.005;
      globe.update({ phi });
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      globe.destroy();
    };
  }, [size]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        style={{
          width: size,
          height: size,
          maxWidth: "100%",
          aspectRatio: "1",
        }}
      />
    </div>
  );
}
