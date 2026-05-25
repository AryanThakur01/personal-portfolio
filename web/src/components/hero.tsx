import { useEffect, useState } from "react";

function useUTCClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, "0");
      const m = String(now.getUTCMinutes()).padStart(2, "0");
      const s = String(now.getUTCSeconds()).padStart(2, "0");
      setTime(`${h}:${m}:${s} UTC`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return time;
}

function GridBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          "linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)",
        backgroundSize: "64px 64px",
        opacity: 0.35,
        maskImage:
          "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 72%)",
      }}
    />
  );
}

function CircuitTraces() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="fade-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
          <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="fade-r" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
          <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Static dim traces */}
      <g stroke="#222" strokeWidth="1" fill="none">
        <path d="M 0 720 L 240 720 L 280 680 L 520 680 L 560 640 L 760 640" />
        <path d="M 1440 200 L 1200 200 L 1160 240 L 980 240 L 940 280 L 760 280" />
        <path d="M 0 120 L 120 120 L 140 140 L 360 140" />
        <path d="M 1440 820 L 1280 820 L 1240 780 L 1080 780" />
      </g>
      {/* Glowing accent traces */}
      <g fill="none" strokeWidth="1.2">
        <path d="M 0 720 L 240 720 L 280 680 L 520 680" stroke="url(#fade-l)" />
        <path d="M 1440 200 L 1200 200 L 1160 240 L 980 240" stroke="url(#fade-r)" />
      </g>
      {/* Terminal dots */}
      <g fill="#06b6d4">
        <circle cx="760" cy="640" r="2.5" />
        <circle cx="760" cy="280" r="2.5" />
        <circle cx="360" cy="140" r="2" opacity="0.6" />
        <circle cx="1080" cy="780" r="2" opacity="0.6" />
      </g>
    </svg>
  );
}

export function Hero() {
  const time = useUTCClock();

  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-bg pt-12"
    >
      <GridBackground />
      <CircuitTraces />

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-8 py-12 sm:py-20">
        {/* Meta row */}
        <div className="flex flex-wrap gap-x-7 gap-y-2 mb-8 font-mono text-[11px] tracking-widest uppercase text-text-3">
          <span>
            <b className="text-text-2 font-medium">01</b> / IDENTITY
          </span>
          <span>
            LOC <b className="text-text-2 font-medium">BENGALURU · IST</b>
          </span>
          <span>
            LOCAL <b className="text-text-2 font-medium">{time}</b>
          </span>
          <span className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full bg-green"
              style={{ animation: "pulse-dot 2.4s ease-in-out infinite" }}
            />
            <b className="text-green font-medium">AVAILABLE FOR REMOTE</b>
          </span>
        </div>

        {/* Name */}
        <h1 className="font-mono font-medium leading-[1.02] tracking-[-0.035em] mb-6 text-text"
          style={{ fontSize: "clamp(48px, 7.5vw, 96px)" }}
        >
          Aryan
          <br />
          Thakur
          <span
            className="inline-block w-[0.45ch] h-[0.85em] bg-accent align-middle ml-1 translate-y-[-0.05em]"
            style={{ animation: "blink 1.1s step-end infinite" }}
          />
        </h1>

        {/* Tagline */}
        <p className="font-mono text-[16px] text-text-2 tracking-[-0.005em] mb-10 max-w-[720px]">
          Full Stack Engineer.
          <br />
          <span className="text-text-3">// </span>
          Systems over features. Infrastructure-aware. Remote-first.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <a
            href="#work"
            className="no-underline inline-flex items-center gap-[10px] font-mono text-[12px] tracking-[0.02em] px-[18px] py-[11px] rounded-[4px] bg-accent text-[#001a1f] font-semibold transition-all duration-150 hover:bg-[#22cce7] hover:-translate-y-px"
          >
            View Work <span>→</span>
          </a>
          <a
            href="#infra"
            className="no-underline inline-flex items-center gap-[10px] font-mono text-[12px] tracking-[0.02em] px-[18px] py-[11px] rounded-[4px] border border-border-hover text-text transition-all duration-150 hover:border-accent-line hover:text-accent"
          >
            View Infrastructure <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
