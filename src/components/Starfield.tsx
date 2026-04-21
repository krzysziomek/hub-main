import { useEffect, useMemo, useState } from "react";

type Star = { x: number; y: number; size: number; delay: number; duration: number };
type Sparkle = { x: number; y: number; delay: number; duration: number; size: number };
type Shooter = {
  id: number;
  top: number;
  left: number;
  travelX: number;
  travelY: number;
  angle: number;
  duration: number;
};

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

type Props = {
  /** Mouse offset in range -1..1 for both axes */
  mouse?: { x: number; y: number };
};

export function Starfield({ mouse = { x: 0, y: 0 } }: Props) {
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

  const [shooters, setShooters] = useState<Shooter[]>([]);

  useEffect(() => {
    let nextId = 0;
    let timeoutId: number | undefined;

    const spawn = () => {
      const angleDeg = -25 + Math.random() * 20; // streak slightly downward
      const distance = 500 + Math.random() * 400;
      const rad = (angleDeg * Math.PI) / 180;
      const travelX = Math.cos(rad) * distance;
      const travelY = Math.sin(rad) * distance + 200;
      const shooter: Shooter = {
        id: nextId++,
        top: Math.random() * 50, // upper half
        left: -10 + Math.random() * 30,
        travelX,
        travelY,
        angle: angleDeg,
        duration: 1.2 + Math.random() * 0.8,
      };
      setShooters((prev) => [...prev, shooter]);
      window.setTimeout(
        () => setShooters((prev) => prev.filter((s) => s.id !== shooter.id)),
        (shooter.duration + 0.2) * 1000,
      );
      // Next shooter in 4-12s
      timeoutId = window.setTimeout(spawn, 4000 + Math.random() * 8000);
    };

    timeoutId = window.setTimeout(spawn, 2500);
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  const tx = mouse.x * 12;
  const ty = mouse.y * 12;
  const tx2 = mouse.x * 22;
  const ty2 = mouse.y * 22;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 hidden overflow-hidden dark:block"
    >
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `translate3d(${tx}px, ${ty}px, 0)` }}
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
      </div>
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `translate3d(${tx2}px, ${ty2}px, 0)` }}
      >
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
      {shooters.map((sh) => (
        <span
          key={`shooter-${sh.id}`}
          className="absolute block"
          style={{
            top: `${sh.top}%`,
            left: `${sh.left}%`,
            width: "120px",
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, oklch(0.95 0.05 320 / 0.9) 60%, white)",
            borderRadius: "9999px",
            filter: "drop-shadow(0 0 6px oklch(0.85 0.18 340 / 0.8))",
            animation: `shooting-star ${sh.duration}s ease-out forwards`,
            ["--travel-x" as string]: `${sh.travelX}px`,
            ["--travel-y" as string]: `${sh.travelY}px`,
            ["--angle" as string]: `${sh.angle}deg`,
            transform: `rotate(${sh.angle}deg)`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
