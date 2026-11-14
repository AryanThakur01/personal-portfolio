import { useState } from 'react';
import {
  PHASES,
  WEEKS,
  formatDate,
  weekEndDate,
  weekStartDate,
  type PhaseId,
  type ProgramState,
  type WeekType,
} from '../../data/fitness';
import { cn } from '../../utils';
import { Badge, Card, Label, type BadgeTone } from './primitives';

const TYPE_TONE: Record<WeekType, BadgeTone> = {
  Build: 'muted',
  Peak: 'violet',
  Deload: 'amber',
  'Deload + Test': 'amber',
  Taper: 'amber',
  'Final test': 'green',
};

type Filter = 'all' | PhaseId;

export function Plan({ state }: { state: ProgramState }) {
  const [filter, setFilter] = useState<Filter>('all');

  const rows = WEEKS.filter((w) => filter === 'all' || w.phase === filter);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Label className="shrink-0">Show</Label>
        <div className="flex gap-2 flex-wrap">
          {(['all', 1, 2, 3, 4] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'font-mono text-[11px] px-[10px] py-[6px] rounded-[4px] border transition-colors duration-150 cursor-pointer',
                f === filter
                  ? 'border-accent text-accent bg-accent-soft'
                  : 'border-border-strong text-text-3 hover:text-text hover:border-border-hover',
              )}>
              {f === 'all'
                ? 'All 52 weeks'
                : `P${f} ${PHASES.find((p) => p.id === f)?.name}`}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="flex flex-col">
          {rows.map((entry) => {
            const isNow = entry.week === state.week;
            const isPast = entry.week < state.week;
            const phase = PHASES.find((p) => p.id === entry.phase);
            const isGate = phase?.gate.week === entry.week;

            return (
              <div
                key={entry.week}
                className={cn(
                  'flex items-start gap-3 px-4 py-3 border-b border-border last:border-b-0 border-l-2',
                  isNow && 'bg-accent-soft border-l-accent',
                  !isNow && isGate && 'border-l-violet',
                  !isNow && !isGate && 'border-l-transparent',
                  isPast && !isNow && 'opacity-55',
                )}>
                <div className="shrink-0 w-[46px]">
                  <div
                    className={cn(
                      'font-mono text-[13px] leading-none',
                      isNow ? 'text-accent' : 'text-text-2',
                    )}>
                    {String(entry.week).padStart(2, '0')}
                  </div>
                  <div className="font-mono text-[9px] text-text-4 mt-1.5">
                    P{entry.phase}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge tone={isNow ? 'accent' : TYPE_TONE[entry.type]}>
                      {entry.type}
                    </Badge>
                    {isGate && <Badge tone="violet">Gate test</Badge>}
                    {isNow && <Badge tone="accent">This week</Badge>}
                  </div>
                  <div
                    className={cn(
                      'text-[13px] leading-[1.5]',
                      isNow ? 'text-text' : 'text-text-2',
                    )}>
                    {entry.focus}
                  </div>
                </div>

                <div className="shrink-0 font-mono text-[10.5px] text-text-4 text-right leading-[1.5] hidden sm:block">
                  {formatDate(weekStartDate(entry.week))}
                  <br />
                  {formatDate(weekEndDate(entry.week))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
