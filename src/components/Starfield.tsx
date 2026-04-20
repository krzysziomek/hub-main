import { useMemo } from "react";

type Star = { x: number; y: number; size: number; delay: number; duration: number };
type Sparkle = { x: number; y: number; delay: number; duration: number; size: number };

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function Starfield() {
  const { stars, sparkles } = useMemo(() => {
    const rand = seeded(42);
    const stars: Star[] = Array.from({ length: 80 }, () => ({
      x: rand() * 100,
      y: rand() * 100,
      size: rand() * 2 + 0.5,
      delay: rand() * 4,
      duration: 2 + rand() * 3,
    }));
    const sparkles: Sparkle[] = Array.from({ length: 12 }, () => ({
      x: rand() * 100,
      y: rand() * 100,
      delay: rand() * 6,
      duration: 3 + rand() * 2,
      size: 8 + rand() * 8,
    }));
    return { stars, sparkles };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden dark:block"
    >
      {stars.map((s, i) => (
        <span
          key={`star-${i}`}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            boxShadow: "0 0 4px rgba(255,255,255,0.8)",
          }}
        />
      ))}
      {sparkles.map((s, i) => (
        <span
          key={`sparkle-${i}`}
          className="absolute animate-sparkle text-[oklch(0.85_0.18_340)]"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}
