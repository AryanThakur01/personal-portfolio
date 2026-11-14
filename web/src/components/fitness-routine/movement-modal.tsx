import { useEffect } from 'react';
import { ArrowLeft, Info, X } from 'lucide-react';
import {
  CURRENT_RUNGS,
  LADDERS,
  LADDER_PASS_RULE,
  findMovement,
  type Ladder,
  type Movement,
} from '../../data/fitness';
import { cn } from '../../utils';
import { Figure } from './figure';
import { Badge, Label } from './primitives';

/**
 * What the modal is showing: a single movement, or a whole ladder with the
 * movement for the rung you are on.
 */
export type Showing =
  | { kind: 'movement'; movement: Movement }
  | { kind: 'ladder'; ladder: Ladder };

/** Small info button rendered next to an exercise name. */
export function InfoButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`How to do ${label}`}
      title={`How to do ${label}`}
      className="text-text-4 hover:text-accent transition-colors cursor-pointer shrink-0 align-middle inline-flex">
      <Info size={13} />
    </button>
  );
}

function MovementBody({ movement }: { movement: Movement }) {
  return (
    <>
      <div className="border border-border bg-bg rounded-[4px] mb-5">
        <Figure sequence={movement.sequence} className="w-full h-[220px]" />
      </div>

      <p className="text-[13px] text-text-2 leading-[1.6] m-0 mb-5">
        {movement.what}
      </p>

      <Label className="mb-2.5">Form</Label>
      <ul className="list-none p-0 m-0 flex flex-col gap-2">
        {movement.cues.map((cue, i) => (
          <li
            key={i}
            className="text-[13px] text-text-2 leading-[1.5] pl-5 relative">
            <span className="absolute left-0 top-0 font-mono text-[11px] text-accent">
              {i + 1}
            </span>
            {cue}
          </li>
        ))}
      </ul>
    </>
  );
}

function LadderBody({
  ladder,
  onPickMovement,
}: {
  ladder: Ladder;
  onPickMovement: (movement: Movement) => void;
}) {
  const current = CURRENT_RUNGS[ladder.prefix as keyof typeof CURRENT_RUNGS];
  const currentIndex = ladder.rungs.findIndex((r) => r.code === current);
  const currentRung = ladder.rungs[currentIndex];
  const top = ladder.rungs[ladder.rungs.length - 1];
  const movement = currentRung ? findMovement(currentRung.exercise) : null;

  return (
    <>
      {movement && (
        <div className="border border-border bg-bg rounded-[4px] mb-5">
          <Figure sequence={movement.sequence} className="w-full h-[220px]" />
        </div>
      )}

      <p className="text-[13px] text-text-2 leading-[1.6] m-0 mb-5">
        A ladder is one movement broken into steps, easiest first. You train at
        the hardest step you can do cleanly, and climb when it is earned. The
        top of this ladder is <b className="text-text">{top.exercise}</b>.
      </p>

      <div className="border border-accent-line bg-accent-soft rounded-[4px] p-4 mb-5">
        <Label className="mb-2">You are on</Label>
        <div className="flex items-baseline gap-2.5 flex-wrap">
          <span className="font-mono text-[16px] text-accent">{current}</span>
          <span className="text-[13.5px] text-text">
            {currentRung?.exercise}
          </span>
        </div>
        <div className="font-mono text-[11.5px] text-text-3 mt-2">
          Do {currentRung?.passDose} · step {currentIndex + 1} of{' '}
          {ladder.rungs.length}
        </div>
      </div>

      <Label className="mb-2.5">Every step</Label>
      <div className="flex flex-col mb-5">
        {ladder.rungs.map((rung, i) => {
          const owned = i < currentIndex;
          const isCurrent = i === currentIndex;
          const rungMovement = findMovement(rung.exercise);

          return (
            <div
              key={rung.code}
              className={cn(
                'flex items-start gap-3 py-2.5 border-b border-border last:border-b-0 border-l-2 pl-3',
                isCurrent && 'bg-[rgba(6,182,212,0.07)] border-l-accent',
                owned && 'border-l-[rgba(34,197,94,0.5)]',
                !isCurrent && !owned && 'border-l-transparent',
              )}>
              <span
                className={cn(
                  'font-mono text-[11px] shrink-0 w-[26px] mt-[2px]',
                  isCurrent
                    ? 'text-accent'
                    : owned
                      ? 'text-green'
                      : 'text-text-4',
                )}>
                {rung.code}
              </span>
              <div className="min-w-0 flex-1">
                <div
                  className={cn(
                    'text-[12.5px] leading-[1.45] flex items-center gap-1.5 flex-wrap',
                    isCurrent
                      ? 'text-text'
                      : owned
                        ? 'text-text-3'
                        : 'text-text-2',
                  )}>
                  {rung.exercise}
                  {rungMovement && (
                    <InfoButton
                      label={rung.exercise}
                      onClick={() => onPickMovement(rungMovement)}
                    />
                  )}
                </div>
                <div className="font-mono text-[10.5px] text-text-4 mt-[3px]">
                  {rung.passDose}
                  {owned && ' · owned'}
                  {!owned && !isCurrent && ' · not yet'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Label className="mb-2.5">How you climb</Label>
      <p className="text-[13px] text-text-2 leading-[1.6] m-0">
        {LADDER_PASS_RULE}
      </p>
    </>
  );
}

/** Short label for what the back arrow returns to. */
function titleOf(showing: Showing): string {
  return showing.kind === 'movement'
    ? showing.movement.name
    : `Ladder ${showing.ladder.prefix}`;
}

export function MovementModal({
  showing,
  previous,
  onBack,
  onClose,
  onShow,
}: {
  showing: Showing | null;
  /** The view underneath, when one was opened from another. */
  previous: Showing | null;
  onBack: () => void;
  onClose: () => void;
  onShow: (next: Showing) => void;
}) {
  // Escape steps back if there is somewhere to step back to, else closes.
  // The page behind should not scroll while the modal is open.
  useEffect(() => {
    if (!showing) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (previous) onBack();
      else onClose();
    };
    document.addEventListener('keydown', onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [showing, previous, onBack, onClose]);

  if (!showing) return null;

  const title =
    showing.kind === 'movement'
      ? showing.movement.name
      : `Ladder ${showing.ladder.prefix}: ${showing.ladder.name}`;

  const eyebrow = showing.kind === 'movement' ? 'Movement' : 'Progression';

  return (
    <div
      className="fixed inset-0 z-[9999999] flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
      />

      <div className="no-scrollbar relative w-full sm:max-w-[560px] max-h-[88vh] overflow-y-auto border border-border-hover bg-bg-card rounded-t-[8px] sm:rounded-[8px]">
        <div className="sticky top-0 bg-bg-card border-b border-border px-5 py-4">
          {previous && (
            <button
              type="button"
              onClick={onBack}
              className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors inline-flex items-center gap-1.5 cursor-pointer mb-3">
              <ArrowLeft size={12} />
              Back to {titleOf(previous)}
            </button>
          )}

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Label className="mb-1.5">{eyebrow}</Label>
              <h3 className="font-mono text-[15px] font-medium text-text m-0 leading-[1.3]">
                {title}
              </h3>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {showing.kind === 'movement' && (
                <LadderLink movement={showing.movement} onShow={onShow} />
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="text-text-3 hover:text-text transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 py-5">
          {showing.kind === 'movement' ? (
            <MovementBody movement={showing.movement} />
          ) : (
            <LadderBody
              ladder={showing.ladder}
              onPickMovement={(m) => onShow({ kind: 'movement', movement: m })}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/** Shown when a movement is a rung, linking across to the whole ladder. */
function LadderLink({
  movement,
  onShow,
}: {
  movement: Movement;
  onShow: (next: Showing) => void;
}) {
  const ladder = LADDERS.find((l) =>
    l.rungs.some((r) => findMovement(r.exercise)?.id === movement.id),
  );

  if (!ladder) return null;

  return (
    <button
      type="button"
      onClick={() => onShow({ kind: 'ladder', ladder })}
      className="cursor-pointer">
      <Badge tone="violet">Ladder {ladder.prefix}</Badge>
    </button>
  );
}
