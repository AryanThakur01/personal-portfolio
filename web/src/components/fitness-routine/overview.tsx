import { Info, RotateCcw } from 'lucide-react';
import {
  CURRENT_RUNGS,
  DAILY_TRACK,
  DAILY_TRACK_NOTE,
  LADDERS,
  MILESTONES,
  PHASES,
  TOTAL_WEEKS,
  formatDate,
  parseDate,
  phaseState,
  weekEndDate,
  weekStartDate,
  type ProgramState,
  type WeekType,
} from '../../data/fitness';
import { cn } from '../../utils';
import { useChecklist, todayKey } from './hooks';
import { useShowMovement } from './movement-context';
import { TodaySession } from './today-session';
import {
  Badge,
  Card,
  CardTitle,
  Label,
  ProgressBar,
  Stat,
  TickBox,
  type BadgeTone,
} from './primitives';

const WEEK_TYPE_TONE: Record<WeekType, BadgeTone> = {
  Build: 'accent',
  Peak: 'violet',
  Deload: 'amber',
  'Deload + Test': 'amber',
  Taper: 'amber',
  'Final test': 'green',
};

/** 52 cells, one per week, banded by phase with today's week marked. */
function YearStrip({ state }: { state: ProgramState }) {
  return (
    <div className="flex gap-[2px]">
      {Array.from({ length: TOTAL_WEEKS }, (_, i) => {
        const week = i + 1;
        const phase = PHASES.find(
          (p) => week >= p.startWeek && week <= p.endWeek,
        );
        const isPast = week < state.week;
        const isNow = week === state.week;
        const isGate = phase?.gate.week === week;

        return (
          <div
            key={week}
            title={`Week ${week} • Phase ${phase?.id} ${phase?.name}${isGate ? ' • gate test' : ''}`}
            className={cn(
              'flex-1 h-[26px] rounded-[2px] transition-colors duration-150',
              isNow && 'bg-accent',
              !isNow && isGate && 'bg-[rgba(167,139,250,0.55)]',
              !isNow && !isGate && isPast && 'bg-[rgba(6,182,212,0.35)]',
              !isNow && !isGate && !isPast && 'bg-bg-elev-2',
            )}
          />
        );
      })}
    </div>
  );
}

export function Overview({ state }: { state: ProgramState }) {
  const show = useShowMovement();
  const { phase, weekEntry } = state;
  const dayList = todayKey();
  const daily = useChecklist(`fitness:daily:${dayList}`);

  const gateStart = weekStartDate(phase.gate.week);

  return (
    <div className="flex flex-col gap-4">
      {/* Where we are right now */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat
          label="Week"
          value={state.week}
          unit={`/ ${TOTAL_WEEKS}`}
          sub={`${formatDate(weekStartDate(state.week))} — ${formatDate(weekEndDate(state.week))}`}
        />
        <Stat
          label="Day"
          value={state.day}
          unit="of 364"
          sub={`${state.weekdayName}, day ${state.dayOfWeek} of 7`}
        />
        <Stat
          label="Phase"
          value={phase.id}
          unit={phase.name}
          sub={`Weeks ${phase.startWeek} to ${phase.endWeek}`}
        />
        <Stat
          label="To gate test"
          value={state.weeksToGate}
          unit={state.weeksToGate === 1 ? 'week' : 'weeks'}
          sub={`Week ${phase.gate.week}, from ${formatDate(gateStart)}`}
        />
      </div>

      {/* Progress through the phase and the year */}
      <Card>
        <CardTitle
          right={
            <Badge tone={WEEK_TYPE_TONE[weekEntry.type]}>
              {weekEntry.type}
            </Badge>
          }>
          Targets for the week
        </CardTitle>

        <p className="text-[13px] text-text-2 leading-[1.6] m-0 mb-2">
          {weekEntry.focus}
        </p>
        <p className="font-mono text-[11px] text-text-4 leading-[1.5] m-0 mb-4">
          One target per pattern, spread across this week's sessions. Today's
          session is below.
        </p>

        {weekEntry.note && (
          <div className="flex items-start gap-2.5 mb-5 border border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.07)] rounded-[4px] px-3 py-2.5">
            <Info size={13} className="text-amber shrink-0 mt-[2px]" />
            <span className="text-[12.5px] text-text-2 leading-[1.55]">
              {weekEntry.note}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <Label>
                Phase {phase.id}: {phase.name}
              </Label>
              <span className="font-mono text-[11px] text-text-3">
                {Math.round(state.phaseProgress * 100)}% —{' '}
                {state.weeksToGate === 0
                  ? 'gate test week'
                  : `${state.weeksToGate} to go`}
              </span>
            </div>
            <ProgressBar
              value={state.phaseProgress}
              tone={state.weeksToGate <= 2 ? 'amber' : 'accent'}
            />
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-2">
              <Label>Year</Label>
              <span className="font-mono text-[11px] text-text-3">
                {Math.round(state.yearProgress * 100)}%
              </span>
            </div>
            <YearStrip state={state} />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-dashed border-border-strong">
          {PHASES.map((p) => {
            const st = phaseState(p, state);
            return (
              <div key={p.id} className="flex items-center gap-2">
                <span
                  className={cn(
                    'w-[7px] h-[7px] rounded-full shrink-0',
                    st === 'done' && 'bg-green',
                    st === 'active' && 'bg-accent',
                    st === 'upcoming' && 'bg-text-4',
                  )}
                />
                <span
                  className={cn(
                    'font-mono text-[11px]',
                    st === 'active' ? 'text-text' : 'text-text-3',
                  )}>
                  P{p.id} {p.name}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TodaySession state={state} />

        {/* Ladder rungs */}
        <Card>
          <CardTitle
            right={
              <span className="font-mono text-[10px] text-text-4">
                tap to learn
              </span>
            }>
            Current ladder rungs
          </CardTitle>
          <p className="text-[12px] text-text-3 leading-[1.5] m-0 mb-4">
            Four movements are earned back one step at a time. This is the step
            you are on for each.
          </p>
          <div className="flex flex-col gap-3">
            {LADDERS.map((ladder) => {
              const code =
                CURRENT_RUNGS[ladder.prefix as keyof typeof CURRENT_RUNGS];
              const rung = ladder.rungs.find((r) => r.code === code);
              const idx = ladder.rungs.findIndex((r) => r.code === code);

              return (
                <button
                  key={ladder.prefix}
                  type="button"
                  onClick={() => show({ kind: 'ladder', ladder })}
                  className="flex items-start gap-3 text-left cursor-pointer group">
                  <Badge
                    tone="violet"
                    className="mt-[1px] group-hover:border-violet transition-colors">
                    {code}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-[11px] text-text-3 mb-[2px]">
                      {ladder.name}
                    </div>
                    <div className="text-[12.5px] text-text-2 leading-[1.45] group-hover:text-text transition-colors">
                      {rung?.exercise ?? 'Unknown rung'}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-text-4 shrink-0 mt-[3px]">
                    {idx + 1}/{ladder.rungs.length}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Daily 10-minute track, ticked off per day */}
      <Card>
        <CardTitle
          right={
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-text-3">
                {daily.count}/{DAILY_TRACK.length}
              </span>
              <button
                type="button"
                onClick={daily.clear}
                className="font-mono text-[10px] tracking-[0.1em] uppercase text-text-3 hover:text-accent transition-colors inline-flex items-center gap-1.5 cursor-pointer">
                <RotateCcw size={11} />
                Reset
              </button>
            </div>
          }>
          Daily track, 10 min
        </CardTitle>

        <p className="text-[12.5px] text-text-3 leading-[1.55] m-0 mb-4">
          {DAILY_TRACK_NOTE}
        </p>

        <ProgressBar
          value={daily.count / DAILY_TRACK.length}
          tone={daily.count === DAILY_TRACK.length ? 'green' : 'accent'}
          className="mb-4"
        />

        <div className="flex flex-col">
          {DAILY_TRACK.map((item) => {
            const id = `step-${item.step}`;
            const checked = daily.done.has(id);

            return (
              <div
                key={item.step}
                className="flex items-start gap-3 py-[9px] border-b border-border last:border-b-0">
                <TickBox
                  checked={checked}
                  onChange={() => daily.toggle(id)}
                  label={item.movement}
                />
                <div className="min-w-0 flex-1">
                  <div
                    className={cn(
                      'text-[13px] leading-[1.45]',
                      checked ? 'text-text-4 line-through' : 'text-text',
                    )}>
                    {item.movement}
                  </div>
                  {item.notes && (
                    <div className="text-[11.5px] text-text-3 mt-[2px]">
                      {item.notes}
                    </div>
                  )}
                </div>
                <span className="font-mono text-[11px] text-text-2 shrink-0 text-right">
                  {item.dose}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Log */}
      <Card>
        <CardTitle>Log</CardTitle>
        <div className="flex flex-col gap-3">
          {[...MILESTONES]
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((m, i) => (
              <div key={i} className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] text-text-3 shrink-0 w-[92px]">
                  {formatDate(parseDate(m.date))}
                </span>
                <span className="text-[13px] text-text-2 leading-[1.5]">
                  {m.label}
                </span>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
