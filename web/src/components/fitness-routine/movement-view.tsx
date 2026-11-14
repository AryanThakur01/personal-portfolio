import { Suspense, lazy, useState } from 'react';
import type { Movement } from '../../data/fitness';
import { exerciseFor } from './anim/exercises';
import { Figure } from './figure';

// three.js is ~560 kB, so the animated figure is only fetched when a movement
// that has one is actually opened.
const Figure3D = lazy(() =>
  import('./figure-3d').then((m) => ({ default: m.Figure3D })),
);

const VIEWS = [
  ['Side', 0],
  ['Angle', 0.6],
  ['Front', 1.45],
] as const;

/**
 * The animation panel for a movement.
 *
 * Movements with an exercise definition get the IK-driven figure; the rest
 * fall back to the flat drawing until one is written for them.
 */
export function MovementView({ movement }: { movement: Movement }) {
  const exercise = exerciseFor(movement.id);
  const [phase, setPhase] = useState('');
  const [view, setView] = useState(1);

  if (!exercise) {
    return (
      <div className="border border-border bg-bg rounded-[4px]">
        <Figure sequence={movement.sequence} className="w-full h-[230px]" />
      </div>
    );
  }

  return (
    <div className="border border-border bg-bg rounded-[4px] overflow-hidden">
      <Suspense
        fallback={
          <div className="w-full h-[260px] flex items-center justify-center font-mono text-[11px] text-text-3">
            loading…
          </div>
        }>
        <Figure3D
          key={`${movement.id}-${view}`}
          exercise={exercise}
          azimuth={VIEWS[view][1]}
          className="w-full h-[260px]"
          onPhase={setPhase}
        />
      </Suspense>

      <div className="flex items-center justify-between gap-3 px-3 py-2 border-t border-border">
        <span className="font-mono text-[11px] text-accent truncate">
          {phase}
        </span>
        <div className="flex gap-1 shrink-0">
          {VIEWS.map(([label], i) => (
            <button
              key={label}
              type="button"
              onClick={() => setView(i)}
              className={
                'font-mono text-[10px] tracking-[0.08em] uppercase px-2 py-1 rounded-[3px] transition-colors cursor-pointer ' +
                (view === i
                  ? 'bg-accent-soft text-accent'
                  : 'text-text-3 hover:text-text')
              }>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
