import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import hamster from "@/assets/hamster.png";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/ProjectCard";
import { Starfield } from "@/components/Starfield";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Moon, Sun, Languages } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [isDark, setIsDark] = useState(false);
  const [squeaking, setSqueaking] = useState(false);
  const [petCount, setPetCount] = useState(0);
  const [counterPop, setCounterPop] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);

    const storedPets = parseInt(localStorage.getItem("petCount") ?? "0", 10);
    if (!Number.isNaN(storedPets)) setPetCount(storedPets);
  }, []);

  useEffect(() => {
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setMouse({ x, y }));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const milestones: { count: number; label: string; emoji: string }[] = [
    { count: 1, label: "Pierwszy głask!", emoji: "🐾" },
    { count: 10, label: "Przyjaciel chomika", emoji: "🌟" },
    { count: 25, label: "Mistrz głaskania", emoji: "🏆" },
    { count: 50, label: "Chomikowy guru", emoji: "🧀" },
    { count: 100, label: "Legenda!", emoji: "👑" },
    { count: 500, label: "Czy ty w ogóle śpisz?", emoji: "🚀" },
  ];
  const currentMilestone = [...milestones].reverse().find((m) => petCount >= m.count);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const playSqueak = () => {
    try {
      const AC =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) audioCtxRef.current = new AC();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") void ctx.resume();
      const now = ctx.currentTime;

      // Two quick chirps for a cute "squee-eek"
      const chirp = (start: number, freqStart: number, freqEnd: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freqStart, start);
        osc.frequency.exponentialRampToValueAtTime(freqEnd, start + dur);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur + 0.05);
      };
      chirp(now, 1400, 2200, 0.12);
      chirp(now + 0.13, 1800, 2600, 0.18);
    } catch {
      // audio unavailable — silent fail
    }
  };

  const handleHamsterClick = () => {
    if (squeaking) return;
    playSqueak();
    setSqueaking(true);
    window.setTimeout(() => setSqueaking(false), 800);
    setPetCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem("petCount", String(next));
      } catch {
        // storage unavailable — silent fail
      }
      return next;
    });
    setCounterPop(true);
    window.setTimeout(() => setCounterPop(false), 400);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Starfield mouse={mouse} />
      {/* Top-right controls */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-6">
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label="English info"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 backdrop-blur px-3 py-2 text-xs font-semibold text-foreground/80 shadow-sm transition-all hover:scale-105 hover:shadow-pop"
            >
              <Languages className="h-4 w-4" aria-hidden />
              EN
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                <span className="text-rainbow animate-gradient">Hi! 👋</span>
              </DialogTitle>
              <DialogDescription className="pt-2 text-sm leading-relaxed text-foreground/80">
                Welcome to <strong className="text-foreground">scooby.boo</strong> — my personal hub of small, vibecoded
                webapps. I'm <strong className="text-foreground">Krzyś</strong>, based in Poland.
                <br />
                <br />
                Heads up: I mainly speak Polish, and most of my projects are built{" "}
                <strong className="text-foreground">in Polish</strong> for a Polish audience — so things here might not
                make much sense if you don't speak the language. Sorry about that!
                <br />
                <br />
                Feel free to poke around anyway. 🐹
                <br />
                <br />
                <span className="text-xs text-foreground/50">Not affiliated with the Scooby-Doo brand in any way.</span>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/80 backdrop-blur text-foreground/80 shadow-sm transition-all hover:scale-105 hover:shadow-pop"
        >
          {isDark ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
        </button>
      </div>

      {/* Floating decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 dark:hidden">
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `translate3d(${mouse.x * 30}px, ${mouse.y * 30}px, 0)` }}
        >
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[oklch(0.85_0.2_340/0.35)] blur-3xl animate-float" />
        </div>
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `translate3d(${mouse.x * -45}px, ${mouse.y * -45}px, 0)` }}
        >
          <div
            className="absolute top-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[oklch(0.85_0.18_220/0.35)] blur-3xl animate-float"
            style={{ animationDelay: "1.5s" }}
          />
        </div>
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `translate3d(${mouse.x * 20}px, ${mouse.y * -25}px, 0)` }}
        >
          <div
            className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-[oklch(0.88_0.18_90/0.35)] blur-3xl animate-float"
            style={{ animationDelay: "3s" }}
          />
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-12 sm:py-20">
        {/* Hero */}
        <header className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0, rotate: -30, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.1 }}
            className="relative"
          >
            <div
              aria-hidden
              className="absolute inset-0 -z-10 m-auto h-48 w-48 rounded-full bg-rainbow blur-2xl opacity-60 animate-gradient"
            />
            <button
              type="button"
              onClick={handleHamsterClick}
              aria-label="Pet the hamster"
              className="block cursor-pointer rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50"
            >
              <img
                src={hamster}
                alt="scooby.boo mascot — a fluffy white hamster waving hello"
                width={1024}
                height={1024}
                draggable={false}
                className={`h-48 w-48 sm:h-56 sm:w-56 object-contain drop-shadow-[0_15px_30px_oklch(0.7_0.22_340/0.4)] select-none ${
                  squeaking ? "animate-squeak" : "animate-float"
                }`}
              />
            </button>
          </motion.div>

          {petCount > 0 && currentMilestone && (
            <motion.div
              key={currentMilestone.count}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur px-3 py-1.5 text-xs font-semibold text-foreground/80 shadow-sm"
            >
              <span aria-hidden>{currentMilestone.emoji}</span>
              <span className={`tabular-nums ${counterPop ? "animate-counter-pop inline-block" : ""}`}>{petCount}</span>
              <span className="text-foreground/50">·</span>
              <span className="text-rainbow animate-gradient">{currentMilestone.label}</span>
            </motion.div>
          )}

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 text-5xl sm:text-7xl font-bold tracking-tight"
          >
            <span className="text-rainbow animate-gradient">scooby.boo</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="mt-4 max-w-xl text-base sm:text-lg text-foreground/70"
          >
            Cześć! Jestem <span className="font-bold text-foreground">Krzyś</span> i tu mieszkają moje vibecodowane
            webappki.
          </motion.p>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
          >
            {["webapps", "🐹 hamster powered"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-card/80 backdrop-blur px-3 py-1 text-xs font-semibold text-foreground/70 shadow-sm"
              >
                {t}
              </span>
            ))}
          </motion.div>
        </header>

        {/* Projects */}
        <section className="mt-16 sm:mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-end justify-between gap-4"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">
                Projekty <span className="inline-block animate-wiggle">✨</span>
              </h2>
              <p className="mt-1 text-sm text-foreground/60">Klik w kafelek = nowa karta z projektem.</p>
            </div>
            <span className="rounded-full bg-rainbow px-3 py-1 text-xs font-bold text-white shadow-pop animate-gradient">
              {projects.length} live
            </span>
          </motion.div>

          <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
            {projects.map((p, i) => (
              <ProjectCard key={p.url} project={p} index={i} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 sm:mt-28 flex flex-col items-center gap-2 text-center">
          <div className="text-2xl animate-wiggle" aria-hidden>
            🐹
          </div>
          <p className="text-xs text-foreground/50">© {new Date().getFullYear()} scooby.boo · zrobione z miłością</p>
          <p className="text-[10px] text-foreground/40">niezwiązane z marką Scooby-Doo w żaden sposób</p>
        </footer>
      </div>
    </main>
  );
}
