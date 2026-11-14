import {
  CURRENT_RUNGS,
  LADDERS,
  LADDER_PASS_RULE,
  findMovement,
  type ProgramState,
} from '../../data/fitness';
import { cn } from '../../utils';
import { Badge, Card, CardTitle, Label } from './primitives';
import { useShowMovement } from './movement-context';
import { InfoButton } from './movement-modal';

export function Ladders({ state }: { state: ProgramState }) {
  const show = useShowMovement();

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle>What a ladder is</CardTitle>
        <p className="text-[13px] text-text-2 leading-[1.6] m-0 mb-4">
          One movement, broken into steps from easiest to the real thing. You
          train at the hardest step you can do cleanly, and climb when it is
          earned rather than jumping to the end. The four below cover lying leg
          raises, hanging leg raises, the L-sit and hinging. Tap any step to see
          how it is performed.
        </p>

        <Label className="mb-2.5">The pass rule</Label>
        <p className="text-[13px] text-text-2 leading-[1.6] m-0">
          {LADDER_PASS_RULE}
        </p>
        <p className="font-mono text-[11px] text-text-3 leading-[1.6] m-0 mt-3 pt-3 border-t border-dashed border-border-strong">
          Earliest weeks are the soonest a rung can start, not a deadline. Move
          the rung in progress.ts once its pass rule is met.
        </p>
      </Card>

      {LADDERS.map((ladder) => {
        const currentCode =
          CURRENT_RUNGS[ladder.prefix as keyof typeof CURRENT_RUNGS];
        const currentIndex = ladder.rungs.findIndex(
          (r) => r.code === currentCode,
        );

        return (
          <Card key={ladder.prefix}>
            <CardTitle
              right={
                <div className="flex items-center gap-2.5">
                  <Badge tone="violet">{currentCode}</Badge>
                  <span className="font-mono text-[11px] text-text-3">
                    {currentIndex + 1}/{ladder.rungs.length}
                  </span>
                </div>
              }>
              Ladder {ladder.prefix}: {ladder.name}
            </CardTitle>

            <Label className="mb-4">{ladder.usedIn}</Label>

            <div className="flex flex-col">
              {ladder.rungs.map((rung, i) => {
                const isCurrent = i === currentIndex;
                const isOwned = i < currentIndex;
                const unlockable =
                  typeof rung.earliestWeek === 'number' &&
                  state.week >= rung.earliestWeek;

                return (
                  <div
                    key={rung.code}
                    className={cn(
                      'flex items-start gap-3 py-3 border-b border-border last:border-b-0 border-l-2 pl-3',
                      isCurrent &&
                        'bg-[rgba(167,139,250,0.07)] border-l-violet',
                      isOwned && 'border-l-[rgba(34,197,94,0.5)]',
                      !isCurrent && !isOwned && 'border-l-transparent',
                    )}>
                    <span
                      className={cn(
                        'font-mono text-[11px] shrink-0 w-[26px] mt-[2px]',
                        isCurrent
                          ? 'text-violet'
                          : isOwned
                            ? 'text-green'
                            : 'text-text-4',
                      )}>
                      {rung.code}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div
                        className={cn(
                          'text-[13px] leading-[1.45] flex items-center gap-1.5 flex-wrap',
                          isCurrent
                            ? 'text-text'
                            : isOwned
                              ? 'text-text-3'
                              : 'text-text-2',
                        )}>
                        {rung.exercise}
                        {findMovement(rung.exercise) && (
                          <InfoButton
                            label={rung.exercise}
                            onClick={() =>
                              show({
                                kind: 'movement',
                                movement: findMovement(rung.exercise)!,
                              })
                            }
                          />
                        )}
                      </div>
                      <div className="font-mono text-[10.5px] text-text-4 mt-1">
                        needs {rung.needs} · earliest wk {rung.earliestWeek}
                        {typeof rung.earliestWeek === 'number' &&
                          !unlockable &&
                          ' · not yet in range'}
                      </div>
                    </div>

                    <div className="shrink-0 text-right flex flex-col items-end gap-1">
                      <span className="font-mono text-[11.5px] text-text-2 whitespace-nowrap">
                        {rung.passDose}
                      </span>
                      {isCurrent && <Badge tone="violet">Current</Badge>}
                      {isOwned && (
                        <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-green">
                          Owned
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
