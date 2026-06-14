import { LiveDot } from './primitives';

interface StatusHeaderProps {
  stats: React.ReactNode;
  className?: string;
}

export function StatusHeader({ stats, className }: StatusHeaderProps) {
  return (
    <div className={className}>
      <div className="font-mono text-[13px] text-text flex items-center gap-2">
        <LiveDot />
        aryanthakur.dev - LIVE
      </div>
      <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-text-3 mt-1.5">
        {stats}
      </div>
    </div>
  );
}
