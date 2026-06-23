import { useEffect, useState } from 'react';
import { useTick } from '../hooks/use-tick';

const START_DATE = new Date('2017-01-01T00:00:00Z').getTime();
const TAGS = ['SYSTEMS', 'INFRA', 'DISTRIBUTED', 'DX'];

function useUtcClock() {
  useTick(1000);
  const now = new Date();
  const h = String(now.getUTCHours()).padStart(2, '0');
  const m = String(now.getUTCMinutes()).padStart(2, '0');
  const s = String(now.getUTCSeconds()).padStart(2, '0');
  return `${h}:${m}:${s} UTC`;
}

function useUptime() {
  useTick(60000);
  const years = (Date.now() - START_DATE) / (1000 * 60 * 60 * 24 * 365.25);
  return years.toFixed(2) + ' yrs';
}

function Lightbox({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
      aria-modal="true"
      role="dialog">
      <img
        src="/profile-picture.webp"
        alt="Portrait — Aryan Thakur"
        className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
        style={{ borderRadius: 2 }}
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        className="absolute top-5 right-5 font-mono text-[11px] tracking-widest uppercase text-text-3 hover:text-text transition-colors"
        aria-label="Close">
        ✕ ESC
      </button>
    </div>
  );
}

function Portrait({ onOpen }: { onOpen: () => void }) {
  return (
    <div
      className="relative w-full overflow-hidden cursor-zoom-in"
      style={{ aspectRatio: '3 / 4', background: '#0d0d0d' }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      aria-label="View portrait fullscreen">
      <img
        src="/profile-picture.webp"
        alt="Portrait — Aryan Thakur"
        className="absolute inset-0 w-full h-full object-cover object-center"
        draggable={false}
      />
      <div className="absolute bottom-0 left-0 px-3 py-2 bg-bg/80 backdrop-blur-sm">
        <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-3">
          PORTRAIT.WEBP
        </span>
      </div>
    </div>
  );
}

function StatGrid() {
  const clock = useUtcClock();
  const uptime = useUptime();

  const stats = [
    { label: 'UPTIME', value: uptime, accent: true },
    { label: 'LOCATION', value: 'Bengaluru, IN' },
    { label: 'LOCAL TIME', value: clock },
    { label: 'TIMEZONE', value: 'IST · UTC+5:30' },
    { label: 'PREF', value: 'remote-first' },
  ];

  const total = stats.length;

  return (
    <div className="border border-border">
      {/* Desktop 3-col grid */}
      <div className="hidden sm:grid grid-cols-3">
        {stats.map((s, i) => {
          const col = i % 3;
          const isLastRow = i >= total - (total % 3 || 3);
          // last item alone in its row → span remaining columns
          const loneInRow = total % 3 !== 0 && i === total - 1;
          const colSpan = loneInRow ? `col-span-${3 - (total % 3) + 1}` : '';
          return (
            <div
              key={s.label}
              className={[
                'px-5 py-4',
                colSpan,
                col !== 2 && !loneInRow ? 'border-r border-border' : '',
                !isLastRow ? 'border-b border-border' : '',
              ].join(' ')}>
              <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-3 mb-[6px]">
                {s.label}
              </div>
              <div
                className={`font-mono text-[15px] tracking-[-0.01em] ${s.accent ? 'text-accent' : 'text-text'}`}>
                {s.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile 2-col grid */}
      <div className="sm:hidden grid grid-cols-2">
        {stats.map((s, i) => {
          const col = i % 2;
          const isLastRow = i >= total - (total % 2 || 2);
          const loneInRow = total % 2 !== 0 && i === total - 1;
          return (
            <div
              key={s.label}
              className={[
                'px-4 py-4',
                loneInRow ? 'col-span-2' : '',
                col === 0 && !loneInRow ? 'border-r border-border' : '',
                !isLastRow ? 'border-b border-border' : '',
              ].join(' ')}>
              <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-3 mb-[6px]">
                {s.label}
              </div>
              <div
                className={`font-mono text-[14px] tracking-[-0.01em] ${s.accent ? 'text-accent' : 'text-text'}`}>
                {s.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Whoami() {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <section id="whoami" className="border-t border-border py-16 sm:py-24">
      {lightboxOpen && <Lightbox onClose={() => setLightboxOpen(false)} />}
      <div className="max-w-[1240px] mx-auto px-[22px] sm:px-8">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-10">
          <div>
            <div className="eyebrow mb-4">02 / WHOAMI</div>
            <h2
              className="font-mono font-medium text-text m-0"
              style={{
                fontSize: 'clamp(26px, 3.5vw, 40px)',
                letterSpacing: '-0.02em',
              }}>
              The human behind the system.
            </h2>
          </div>
        </div>

        {/* Main card */}
        <div
          className="border border-border overflow-hidden"
          style={{ background: '#0d0d0d' }}>
          <div className="grid grid-cols-1 md:grid-cols-[minmax(260px,_380px)_1fr]">
            {/* Left: portrait */}
            <div className="border-b border-border md:border-b-0 md:border-r">
              <Portrait onOpen={() => setLightboxOpen(true)} />
            </div>

            {/* Right: bio + stats */}
            <div className="p-6 sm:p-8 flex flex-col gap-6">
              {/* Terminal command */}
              <div className="font-mono text-[13px] text-text-3">
                <span className="text-accent mr-2">$</span>
                whoami --verbose
              </div>

              {/* Name */}
              <div>
                <h3
                  className="font-mono font-medium text-text m-0 mb-4"
                  style={{
                    fontSize: 'clamp(22px, 2.8vw, 30px)',
                    letterSpacing: '-0.02em',
                  }}>
                  Aryan Thakur
                </h3>
                <p className="font-mono text-[13px] text-text-2 leading-relaxed m-0 max-w-[560px]">
                  Full stack engineer who thinks in systems before screens. I
                  like the part of the job where a clean abstraction makes an
                  entire class of bugs impossible.
                </p>
              </div>

              {/* Stats */}
              <StatGrid />

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-3 px-[10px] py-[6px] border border-border-hover">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
