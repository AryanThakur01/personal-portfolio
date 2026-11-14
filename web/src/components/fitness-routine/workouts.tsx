import { useState } from 'react';
import { Eye, EyeOff, RotateCcw } from 'lucide-react';
import {
  CURRENT_RUNGS,
  INTENSITY_BLOCK_EXPLAINER,
  LADDERS,
  PHASES,
  findMovement,
  REST_PERIODS,
  type PhaseId,
  type ProgramState,
  type WorkoutCode,
} from '../../data/fitness';
import { cn } from '../../utils';
import { useChecklist, todayKey, useDayOverride } from './hooks';
import { useShowMovement } from './movement-context';
import { InfoButton } from './movement-modal';
import {
  Badge,
  Card,
  CardTitle,
  Label,
  ProgressBar,
  ROW_ACCENT,
  ROW_LABEL,
  ROW_TONE,
  TickBox,
} from './primitives';

/**
 * Resolves a ladder-driven row to the rung you are actually on, so the row
 * reads as an instruction rather than a schedule to decode.
 */
function LadderRung({ prefix }: { prefix: 'L' | 'H' | 'S' | 'R' }) {
  const code = CURRENT_RUNGS[prefix];
  const ladder = LADDERS.find((l) => l.prefix === prefix);
  const rung = ladder?.rungs.find((r) => r.code === code);

  if (!rung) return null;

  return (
    <div className="flex items-baseline gap-2 flex-wrap mt-1.5">
      <Badge tone="violet">Now: {code}</Badge>
      <span className="text-[12px] text-text-2 leading-[1.45]">
        {rung.exercise}
      </span>
      <span className="font-mono text-[11px] text-violet">{rung.passDose}</span>
    </div>
  );
}

export function Workouts({ state }: { state: ProgramState }) {
  const show = useShowMovement();
  const override = useDayOverride();
  const today = (override.value ?? state.scheduled) as WorkoutCode | 'rest';

  const [phaseId, setPhaseId] = useState<PhaseId>(state.phase.id);
  const [code, setCode] = useState<WorkoutCode>(today === 'rest' ? 'A' : today);
  const [showPrep, setShowPrep] = useState(true);

  const phase = PHASES.find((p) => p.id === phaseId) ?? PHASES[0];
  const workout =
    phase.workouts.find((w) => w.code === code) ?? phase.workouts[0];

  const session = useChecklist(
    `fitness:session:${todayKey()}:${phase.id}${workout.code}`,
  );

  // Small list, recomputed each render: the row indices stay stable so the
  // tick boxes keep their identity when prep rows are hidden.
  const visibleRows = workout.rows
    .map((row, i) => ({ row, index: i }))
    .filter(({ row }) => showPrep || row.kind !== 'prep');

  const total = workout.rows.length;
  const isCurrentPhase = phase.id === state.phase.id;

  return (
    <div className="flex flex-col gap-4">
      {/* Phase picker */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Label className="shrink-0">Phase</Label>
        <div className="flex gap-2 flex-wrap">
          {PHASES.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPhaseId(p.id)}
              className={cn(
                'font-mono text-[11px] px-[10px] py-[6px] rounded-[4px] border transition-colors duration-150 cursor-pointer',
                p.id === phaseId
                  ? 'border-accent text-accent bg-accent-soft'
                  : 'border-border-strong text-text-3 hover:text-text hover:border-border-hover',
              )}>
              P{p.id} {p.name}
              <span className="text-text-4 ml-1.5">
                wk {p.startWeek}-{p.endWeek}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Workout picker */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <Label className="shrink-0">Workout</Label>
        <div className="flex gap-2 flex-wrap">
          {phase.workouts.map((w) => (
            <button
              key={w.code}
              type="button"
              onClick={() => setCode(w.code)}
              title={w.title}
              className={cn(
                'font-mono text-[12px] w-[34px] h-[32px] rounded-[4px] border transition-colors duration-150 cursor-pointer',
                w.code === code
                  ? 'border-accent text-accent bg-accent-soft'
                  : 'border-border-strong text-text-3 hover:text-text hover:border-border-hover',
                w.code === today &&
                  w.code !== code &&
                  isCurrentPhase &&
                  'border-accent-line text-text-2',
              )}>
              {w.code}
            </button>
          ))}
        </div>
      </div>

      {/* The session itself */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="font-mono text-[18px] text-accent leading-none">
                {workout.code}
              </span>
              <h3 className="font-mono text-[16px] font-medium text-text m-0">
                {workout.title}
              </h3>
              {workout.code === today && isCurrentPhase && (
                <Badge tone="accent">Today</Badge>
              )}
            </div>
            <p className="text-[13px] text-text-2 leading-[1.55] m-0">
              {workout.summary}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setShowPrep((v) => !v)}
              className="font-mono text-[10px] tracking-[0.1em] uppercase text-text-3 hover:text-accent transition-colors inline-flex items-center gap-1.5 cursor-pointer">
              {showPrep ? <EyeOff size={11} /> : <Eye size={11} />}
              {showPrep ? 'Hide prep' : 'Show prep'}
            </button>
            <button
              type="button"
              onClick={session.clear}
              className="font-mono text-[10px] tracking-[0.1em] uppercase text-text-3 hover:text-accent transition-colors inline-flex items-center gap-1.5 cursor-pointer">
              <RotateCcw size={11} />
              Reset
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <ProgressBar
            value={total === 0 ? 0 : session.count / total}
            tone={session.count === total ? 'green' : 'accent'}
          />
          <span className="font-mono text-[11px] text-text-3 shrink-0">
            {session.count}/{total}
          </span>
        </div>

        <div className="flex flex-col">
          {visibleRows.map(({ row, index }) => {
            const id = `row-${index}`;
            const checked = session.done.has(id);
            const movement = findMovement(row.exercise);

            return (
              <div
                key={id}
                className={cn(
                  'flex items-start gap-3 px-3 py-[11px] border-b border-border last:border-b-0 border-l-2 transition-opacity duration-150',
                  ROW_TONE[row.kind],
                  ROW_ACCENT[row.kind],
                  checked && 'opacity-55',
                )}>
                <TickBox
                  checked={checked}
                  onChange={() => session.toggle(id)}
                  label={row.exercise}
                />

                <span className="font-mono text-[11px] text-text-4 shrink-0 w-[18px] text-right mt-[2px]">
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span
                      className={cn(
                        'text-[13.5px] leading-[1.45]',
                        row.intensity && 'font-mono text-accent',
                        checked ? 'text-text-4 line-through' : 'text-text',
                      )}>
                      {row.exercise}
                    </span>
                    {movement && (
                      <InfoButton
                        label={movement.name}
                        onClick={() => show({ kind: 'movement', movement })}
                      />
                    )}
                    {row.intensity && <Badge tone="accent">Finisher</Badge>}
                  </div>
                  {row.ladder && <LadderRung prefix={row.ladder} />}

                  {row.notes && (
                    <div className="text-[11.5px] text-text-3 leading-[1.5] mt-[3px]">
                      {row.ladder ? `Schedule: ${row.notes}` : row.notes}
                    </div>
                  )}
                </div>

                <div className="shrink-0 text-right flex flex-col items-end gap-1">
                  <span className="font-mono text-[11.5px] text-text-2 whitespace-nowrap">
                    {row.dose}
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-text-4">
                    {ROW_LABEL[row.kind]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="font-mono text-[11px] text-text-3 mt-5 pt-4 border-t border-dashed border-border-strong leading-[1.6]">
          Tick boxes are per browser and reset each day. Nothing is sent
          anywhere.
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardTitle>What the intensity block is</CardTitle>
          <p className="text-[13px] text-text-2 leading-[1.6] m-0">
            {INTENSITY_BLOCK_EXPLAINER}
          </p>
        </Card>
        <Card>
          <CardTitle>Rest periods</CardTitle>
          <p className="text-[13px] text-text-2 leading-[1.6] m-0">
            {REST_PERIODS}
          </p>
        </Card>
      </div>
    </div>
  );
}
