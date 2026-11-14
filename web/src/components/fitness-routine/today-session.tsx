import { CalendarSync, RotateCcw } from 'lucide-react';
import {
  WEEKDAY_NAMES,
  WEEKLY_SCHEDULE,
  phaseForWorkout,
  type ProgramState,
  type WorkoutCode,
} from '../../data/fitness';
import { cn } from '../../utils';
import { useDayOverride } from './hooks';
import { Badge, Card, CardTitle, Label } from './primitives';

const CODES: WorkoutCode[] = ['A', 'B', 'C', 'D', 'E', 'F'];

/** Sunday-first, matching WEEKLY_SCHEDULE's indexing. */
const MONDAY_FIRST_INDEX = [1, 2, 3, 4, 5, 6, 0];

/**
 * What to train today.
 *
 * The weekly split decides this from the weekday, so nothing needs editing day
 * to day. The shift control overrides just today, in this browser, and clears
 * itself overnight.
 */
export function TodaySession({ state }: { state: ProgramState }) {
  const override = useDayOverride();
  const shifted = override.value !== null;
  const today = (override.value ?? state.scheduled) as WorkoutCode | 'rest';

  const workout =
    today === 'rest'
      ? null
      : (phaseForWorkout(today, state).workouts.find((w) => w.code === today) ??
        null);

  return (
    <Card>
      <CardTitle
        right={
          <div className="flex items-center gap-2.5">
            {shifted && <Badge tone="amber">Shifted</Badge>}
            <span className="font-mono text-[11px] text-text-3">
              {state.weekdayName}
            </span>
          </div>
        }>
        Today
      </CardTitle>

      {today === 'rest' ? (
        <div className="py-2">
          <div className="font-mono text-[20px] text-text-2 mb-1.5">
            Rest day
          </div>
          <p className="text-[13px] text-text-3 leading-[1.55] m-0">
            No session today. The daily track still runs.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="font-mono text-[22px] text-accent leading-none">
              {today}
            </span>
            <span className="font-mono text-[16px] text-text">
              {workout?.title ?? 'Unknown workout'}
            </span>
          </div>
          <p className="text-[13px] text-text-2 leading-[1.55] m-0">
            {workout?.summary}
          </p>
        </>
      )}

      {/* The week at a glance */}
      <div className="mt-5 pt-4 border-t border-dashed border-border-strong">
        <Label className="mb-2.5">This week</Label>
        <div className="grid grid-cols-7 gap-1.5">
          {MONDAY_FIRST_INDEX.map((dayIdx, i) => {
            const code = WEEKLY_SCHEDULE[dayIdx];
            const isToday = i + 1 === state.dayOfWeek;

            return (
              <div
                key={dayIdx}
                className={cn(
                  'border rounded-[4px] px-1 py-2 text-center',
                  isToday
                    ? 'border-accent bg-accent-soft'
                    : 'border-border-strong bg-bg-elev',
                )}>
                <div
                  className={cn(
                    'font-mono text-[9px] tracking-[0.1em] uppercase mb-1',
                    isToday ? 'text-accent' : 'text-text-4',
                  )}>
                  {WEEKDAY_NAMES[i]}
                </div>
                <div
                  className={cn(
                    'font-mono text-[13px]',
                    code === 'rest'
                      ? 'text-text-4'
                      : isToday
                        ? 'text-accent'
                        : 'text-text-2',
                  )}>
                  {code === 'rest' ? '—' : code}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shift today's session without touching the config */}
      <div className="mt-4 pt-4 border-t border-dashed border-border-strong">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <Label className="flex items-center gap-1.5">
            <CalendarSync size={11} />
            Doing something else today?
          </Label>
          {shifted && (
            <button
              type="button"
              onClick={() => override.set(null)}
              className="font-mono text-[10px] tracking-[0.1em] uppercase text-text-3 hover:text-accent transition-colors inline-flex items-center gap-1.5 cursor-pointer">
              <RotateCcw size={11} />
              Follow split
            </button>
          )}
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {CODES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => override.set(code)}
              className={cn(
                'font-mono text-[12px] w-[32px] h-[30px] rounded-[4px] border transition-colors duration-150 cursor-pointer',
                today === code
                  ? 'border-accent text-accent bg-accent-soft'
                  : 'border-border-strong text-text-3 hover:text-text hover:border-border-hover',
              )}>
              {code}
            </button>
          ))}
          <button
            type="button"
            onClick={() => override.set('rest')}
            className={cn(
              'font-mono text-[11px] px-3 h-[30px] rounded-[4px] border transition-colors duration-150 cursor-pointer',
              today === 'rest'
                ? 'border-accent text-accent bg-accent-soft'
                : 'border-border-strong text-text-3 hover:text-text hover:border-border-hover',
            )}>
            Rest
          </button>
        </div>

        <div className="font-mono text-[10.5px] text-text-4 mt-2.5 leading-[1.5]">
          Applies to today only, in this browser. Tomorrow follows the split
          again.
        </div>
      </div>
    </Card>
  );
}
