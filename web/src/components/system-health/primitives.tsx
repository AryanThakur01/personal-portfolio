export function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-3 mb-2 flex items-center gap-2">
      {children}
    </div>
  );
}

export function Value({ children, unit }: { children: React.ReactNode; unit?: string }) {
  return (
    <div className="font-mono text-[18px] text-text tracking-[-0.01em] flex items-baseline gap-1.5">
      {children}
      {unit && <span className="text-[11px] text-text-3 font-normal">{unit}</span>}
    </div>
  );
}

export function Sub({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div className={`font-mono text-[11px] ${accent ? 'text-accent' : 'text-text-3'}`}>
      {children}
    </div>
  );
}

export function Skeleton({ w, h = 'h-[14px]', inline }: { w: string; h?: string; inline?: boolean }) {
  return <div className={`${h} ${w} rounded bg-bg-elev animate-pulse${inline ? ' inline-block align-middle' : ''}`} />;
}

export function LiveDot() {
  return (
    <span
      className="w-2 h-2 rounded-full bg-green shrink-0"
      style={{
        boxShadow: '0 0 0 4px rgba(34,197,94,0.15)',
        animation: 'pulse-dot 2.4s infinite',
      }}
    />
  );
}
