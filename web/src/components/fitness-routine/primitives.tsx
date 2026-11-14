import { Check } from 'lucide-react';
import { cn } from '../../utils';
import type { RowKind } from '../../data/fitness';

/** Small uppercase mono label, matching the rest of the site. */
export function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'font-mono text-[10px] tracking-[0.12em] uppercase text-text-3',
        className,
      )}>
      {children}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('border border-border bg-bg-card p-5', className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 mb-4">
      <h3 className="font-mono text-[14px] font-medium text-text m-0">
        {children}
      </h3>
      {right}
    </div>
  );
}

/** Horizontal progress bar, 0 to 1. */
export function ProgressBar({
  value,
  tone = 'accent',
  className,
}: {
  value: number;
  tone?: 'accent' | 'green' | 'amber';
  className?: string;
}) {
  const pct = Math.round(Math.min(Math.max(value, 0), 1) * 100);
  const fill =
    tone === 'green' ? 'bg-green' : tone === 'amber' ? 'bg-amber' : 'bg-accent';

  return (
    <div
      className={cn(
        'h-[6px] w-full bg-bg-elev rounded-full overflow-hidden',
        className,
      )}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}>
      <div
        className={cn(
          'h-full rounded-full transition-[width] duration-500',
          fill,
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export type BadgeTone = 'accent' | 'green' | 'amber' | 'muted' | 'violet';

const BADGE_TONES: Record<BadgeTone, string> = {
  accent: 'text-accent border-accent-line bg-accent-soft',
  green: 'text-green border-[rgba(34,197,94,0.35)] bg-green-soft',
  amber: 'text-amber border-[rgba(245,158,11,0.35)] bg-[rgba(245,158,11,0.12)]',
  violet:
    'text-violet border-[rgba(167,139,250,0.35)] bg-[rgba(167,139,250,0.12)]',
  muted: 'text-text-3 border-border-strong bg-bg-elev',
};

export function Badge({
  children,
  tone = 'muted',
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'font-mono text-[10px] tracking-[0.12em] uppercase border px-2 py-[3px] rounded-[3px] whitespace-nowrap',
        BADGE_TONES[tone],
        className,
      )}>
      {children}
    </span>
  );
}

/** Big number with a caption, for the overview strip. */
export function Stat({
  label,
  value,
  unit,
  sub,
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  sub?: React.ReactNode;
}) {
  return (
    <div className="border border-border bg-bg-card px-4 py-[14px]">
      <Label className="mb-[6px]">{label}</Label>
      <div className="font-mono text-[22px] text-text tracking-[-0.02em] flex items-baseline gap-1.5 leading-none">
        {value}
        {unit && (
          <span className="text-[11px] text-text-3 tracking-normal">
            {unit}
          </span>
        )}
      </div>
      {sub && (
        <div className="font-mono text-[11px] text-text-3 mt-2">{sub}</div>
      )}
    </div>
  );
}

/** Scroll wrapper so wide tables stay usable on a phone. */
export function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="no-scrollbar border border-border bg-bg-card overflow-x-auto">
      <table className="w-full border-collapse min-w-[520px]">{children}</table>
    </div>
  );
}

export function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        'text-left font-mono text-[10px] tracking-[0.12em] uppercase text-text-3 font-normal px-3 py-[10px] border-b border-border bg-bg-elev whitespace-nowrap',
        className,
      )}>
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={cn(
        'px-3 py-[10px] text-[12.5px] text-text-2 border-b border-border align-top leading-[1.5]',
        className,
      )}>
      {children}
    </td>
  );
}

/**
 * Tone per row kind, preserving the printed program's banding: warm-up and
 * cool-down lightest, core in the middle, the proper workout darkest.
 */
export const ROW_TONE: Record<RowKind, string> = {
  prep: 'bg-transparent',
  core: 'bg-[rgba(167,139,250,0.05)]',
  work: 'bg-[rgba(6,182,212,0.05)]',
};

export const ROW_ACCENT: Record<RowKind, string> = {
  prep: 'border-l-border-strong',
  core: 'border-l-violet',
  work: 'border-l-accent',
};

export const ROW_LABEL: Record<RowKind, string> = {
  prep: 'Prep',
  core: 'Core',
  work: 'Work',
};

/** Square tick box used by the session and daily checklists. */
export function TickBox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        'w-[18px] h-[18px] shrink-0 rounded-[3px] border flex items-center justify-center transition-colors duration-150 cursor-pointer mt-[1px]',
        checked
          ? 'bg-accent border-accent text-[#001a1f]'
          : 'border-border-hover text-transparent hover:border-accent-line',
      )}>
      <Check size={12} strokeWidth={3} />
    </button>
  );
}

/** Pill-style tab bar. Scrolls sideways rather than wrapping on a phone. */
export function TabBar<T extends string>({
  tabs,
  active,
  onChange,
  idPrefix,
}: {
  tabs: readonly { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
  idPrefix: string;
}) {
  return (
    <div
      role="tablist"
      className="no-scrollbar flex gap-1 overflow-x-auto border-b border-border -mx-[22px] px-[22px] sm:mx-0 sm:px-0">
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          role="tab"
          id={`${idPrefix}-tab-${id}`}
          aria-selected={active === id}
          aria-controls={`${idPrefix}-panel-${id}`}
          onClick={() => onChange(id)}
          className={cn(
            'font-mono text-[12px] px-3 py-[9px] whitespace-nowrap border-b-2 -mb-[1px] transition-colors duration-150 cursor-pointer',
            active === id
              ? 'text-accent border-accent'
              : 'text-text-3 border-transparent hover:text-text',
          )}>
          {label}
        </button>
      ))}
    </div>
  );
}

/** Bulleted list with the site's dash marker. */
export function RuleList({ items }: { items: string[] }) {
  return (
    <ul className="list-none p-0 m-0 flex flex-col gap-[10px]">
      {items.map((item, i) => (
        <li
          key={i}
          className="text-[13px] text-text-2 leading-[1.55] pl-4 relative">
          <span className="absolute left-0 top-0 text-text-4 font-mono">—</span>
          {item}
        </li>
      ))}
    </ul>
  );
}
