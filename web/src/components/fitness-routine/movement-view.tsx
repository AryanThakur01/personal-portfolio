import { Suspense, lazy, useState } from 'react';
import { Box, Square } from 'lucide-react';
import type { PoseSequence } from '../../data/fitness';
import { cn } from '../../utils';
import { Figure } from './figure';

// three.js is ~500 kB, so the 3D view is only fetched if someone asks for it.
const Figure3D = lazy(() =>
  import('./figure-3d').then((m) => ({ default: m.Figure3D })),
);

/**
 * The animation panel: flat drawing by default, with a 3D view you can orbit.
 *
 * Both are driven by the same pose data, so they never disagree.
 */
export function MovementView({ sequence }: { sequence: PoseSequence }) {
  const [mode, setMode] = useState<'2d' | '3d'>('2d');

  return (
    <div className="relative border border-border bg-bg rounded-[4px] overflow-hidden">
      {mode === '2d' ? (
        <Figure sequence={sequence} className="w-full h-[240px]" />
      ) : (
        <Suspense
          fallback={
            <div className="w-full h-[240px] flex items-center justify-center font-mono text-[11px] text-text-3">
              loading 3D…
            </div>
          }>
          <Figure3D sequence={sequence} className="w-full h-[240px]" />
        </Suspense>
      )}

      <div className="absolute top-2 right-2 flex gap-1 bg-bg-card/80 backdrop-blur-sm border border-border rounded-[4px] p-[2px]">
        {(
          [
            ['2d', Square, 'Flat view'],
            ['3d', Box, '3D view'],
          ] as const
        ).map(([id, Icon, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            aria-label={label}
            title={label}
            className={cn(
              'px-2 py-1 rounded-[3px] transition-colors cursor-pointer',
              mode === id
                ? 'bg-accent-soft text-accent'
                : 'text-text-3 hover:text-text',
            )}>
            <Icon size={13} />
          </button>
        ))}
      </div>

      {mode === '3d' && (
        <div className="absolute bottom-2 left-2 font-mono text-[10px] text-text-4">
          drag to orbit · scroll to zoom
        </div>
      )}
    </div>
  );
}
