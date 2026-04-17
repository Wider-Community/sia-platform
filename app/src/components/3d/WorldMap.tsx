// Inspired by 21st.dev: aceternity/world-map
// Lightweight dotted world map with animated connection arcs between KSA and Malaysia
import { useRef, useMemo, useEffect } from "react";
import { motion } from "framer-motion";

interface MapPoint {
  lat: number;
  lng: number;
  label?: string;
}

interface Connection {
  start: MapPoint;
  end: MapPoint;
}

interface WorldMapProps {
  connections?: Connection[];
  dotColor?: string;
  lineColor?: string;
  className?: string;
}

const defaultConnections: Connection[] = [
  {
    start: { lat: 24.7136, lng: 46.6753, label: "Riyadh" },
    end: { lat: 3.139, lng: 101.6869, label: "Kuala Lumpur" },
  },
  {
    start: { lat: 24.7136, lng: 46.6753, label: "Riyadh" },
    end: { lat: 1.3521, lng: 103.8198, label: "Singapore" },
  },
  {
    start: { lat: 25.2048, lng: 55.2708, label: "Dubai" },
    end: { lat: 3.139, lng: 101.6869, label: "Kuala Lumpur" },
  },
];

const WIDTH = 800;
const HEIGHT = 400;

function projectPoint(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * WIDTH;
  const y = ((90 - lat) / 180) * HEIGHT;
  return { x, y };
}

function createCurvedPath(start: { x: number; y: number }, end: { x: number; y: number }) {
  const midX = (start.x + end.x) / 2;
  const midY = Math.min(start.y, end.y) - Math.abs(end.x - start.x) * 0.15;
  return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
}

// Simple seeded pseudo-random number generator for deterministic dots
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Approximate land check — returns true if lat/lng is likely over land
// Uses coarse bounding boxes for continents/major landmasses
function isLikelyLand(lat: number, lng: number): boolean {
  // North America
  if (lat > 15 && lat < 72 && lng > -170 && lng < -50) return true;
  // South America
  if (lat > -56 && lat < 13 && lng > -82 && lng < -34) return true;
  // Europe
  if (lat > 36 && lat < 71 && lng > -10 && lng < 40) return true;
  // Africa
  if (lat > -35 && lat < 37 && lng > -18 && lng < 52) return true;
  // Middle East
  if (lat > 12 && lat < 42 && lng > 25 && lng < 63) return true;
  // South/Southeast Asia
  if (lat > -10 && lat < 45 && lng > 65 && lng < 145) return true;
  // East Asia
  if (lat > 18 && lat < 55 && lng > 100 && lng < 145) return true;
  // Australia
  if (lat > -45 && lat < -10 && lng > 112 && lng < 155) return true;
  // Japan/Korea
  if (lat > 30 && lat < 46 && lng > 125 && lng < 146) return true;
  // Indonesia/Philippines archipelago
  if (lat > -8 && lat < 20 && lng > 95 && lng < 140) return true;
  // UK/Ireland
  if (lat > 50 && lat < 60 && lng > -11 && lng < 2) return true;
  // Scandinavia
  if (lat > 55 && lat < 72 && lng > 4 && lng < 32) return true;

  return false;
}

// Generate a deterministic set of decorative dots that approximate land masses
function generateMapDots(): { x: number; y: number }[] {
  const dots: { x: number; y: number }[] = [];
  const rand = seededRandom(42);

  // Generate candidate points and keep those on "land"
  for (let i = 0; i < 1500; i++) {
    const lat = rand() * 150 - 60; // -60 to 90 (skip deep Antarctica)
    const lng = rand() * 360 - 180;

    if (isLikelyLand(lat, lng)) {
      const { x, y } = projectPoint(lat, lng);
      dots.push({ x, y });
    }
  }

  return dots;
}

// Compute a point along a quadratic Bezier curve at parameter t
function getPointOnQuadBezier(
  start: { x: number; y: number },
  control: { x: number; y: number },
  end: { x: number; y: number },
  t: number
) {
  const u = 1 - t;
  return {
    x: u * u * start.x + 2 * u * t * control.x + t * t * end.x,
    y: u * u * start.y + 2 * u * t * control.y + t * t * end.y,
  };
}

// Animated traveling dot that moves along a quadratic Bezier arc via rAF
function TravelingDotPair({
  start,
  end,
  color,
  delay,
}: {
  start: { x: number; y: number };
  end: { x: number; y: number };
  color: string;
  delay: number;
}) {
  const mainRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);

  const control = useMemo(() => {
    const midX = (start.x + end.x) / 2;
    const midY = Math.min(start.y, end.y) - Math.abs(end.x - start.x) * 0.15;
    return { x: midX, y: midY };
  }, [start, end]);

  useEffect(() => {
    let animationId: number;
    let startTime: number | null = null;
    const duration = 3000;
    const delayMs = delay * 1000;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;

      if (elapsed < delayMs) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      const t = ((elapsed - delayMs) % duration) / duration;
      const point = getPointOnQuadBezier(start, control, end, t);
      const opacity = t < 0.05 || t > 0.95 ? "0" : "1";

      if (mainRef.current) {
        mainRef.current.setAttribute("cx", String(point.x));
        mainRef.current.setAttribute("cy", String(point.y));
        mainRef.current.setAttribute("opacity", opacity);
      }
      if (glowRef.current) {
        glowRef.current.setAttribute("cx", String(point.x));
        glowRef.current.setAttribute("cy", String(point.y));
        glowRef.current.setAttribute("opacity", opacity === "1" ? "0.4" : "0");
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [start, end, control, delay]);

  return (
    <>
      <circle ref={glowRef} r="5" fill={color} opacity="0" filter="url(#glow)" />
      <circle ref={mainRef} r="2" fill={color} opacity="0" />
    </>
  );
}

export function WorldMap({
  connections = defaultConnections,
  dotColor = "#C8A951",
  lineColor = "#C8A951",
  className = "",
}: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const mapDots = useMemo(() => generateMapDots(), []);

  // Deduplicate endpoint markers
  const uniqueEndpoints = useMemo(() => {
    const all = connections.flatMap((c) => [c.start, c.end]);
    const seen = new Set<string>();
    return all.filter((p) => {
      const key = `${p.lat},${p.lng}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [connections]);

  return (
    <div className={`relative w-full ${className}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        style={{ background: "transparent" }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Decorative land dots */}
        {mapDots.map((dot, i) => (
          <circle key={i} cx={dot.x} cy={dot.y} r={0.6} fill="#2a2a2f" />
        ))}

        {/* Connection arcs */}
        {connections.map((connection, i) => {
          const start = projectPoint(connection.start.lat, connection.start.lng);
          const end = projectPoint(connection.end.lat, connection.end.lng);
          const path = createCurvedPath(start, end);

          return (
            <g key={`connection-${i}`}>
              {/* Glow path */}
              <motion.path
                d={path}
                fill="none"
                stroke={lineColor}
                strokeWidth="1.5"
                strokeOpacity="0.15"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              />
              {/* Main path */}
              <motion.path
                d={path}
                fill="none"
                stroke={lineColor}
                strokeWidth="1"
                strokeOpacity="0.6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              />
              {/* Traveling dot along the arc */}
              <TravelingDotPair
                start={start}
                end={end}
                color={dotColor}
                delay={i * 0.5}
              />
            </g>
          );
        })}

        {/* Endpoint markers */}
        {uniqueEndpoints.map((point, i) => {
          const { x, y } = projectPoint(point.lat, point.lng);
          return (
            <g key={`marker-${i}`}>
              {/* Pulse ring */}
              <motion.circle
                cx={x}
                cy={y}
                r="6"
                fill="none"
                stroke={dotColor}
                strokeWidth="0.5"
                strokeOpacity="0.4"
                animate={{
                  r: [4, 10, 4],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Center dot */}
              <circle cx={x} cy={y} r="3" fill={dotColor} opacity="0.9" />
              <circle cx={x} cy={y} r="1.5" fill="white" opacity="0.8" />
              {/* Label */}
              {point.label && (
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  fill="white"
                  fontSize="8"
                  fontFamily="Inter, sans-serif"
                  opacity="0.7"
                >
                  {point.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
