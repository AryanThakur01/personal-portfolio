import {
  SKILL_LADDERS,
  SKILL_TREE,
  YEAR_END_TARGETS,
  type ProgramState,
} from '../../data/fitness';
import { cn } from '../../utils';
import { Badge, Card, CardTitle, Label } from './primitives';

/** Parses 'Wk 12 to 20' into its bounds so the window can be read off. */
function parseWindow(window: string): { from: number; to: number } | null {
  const match = window.match(/Wk (\d+) to (\d+)/);
  if (!match) return null;
  return { from: Number(match[1]), to: Number(match[2]) };
}

export function Skills({ state }: { state: ProgramState }) {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardTitle>Year-end targets</CardTitle>
        <p className="text-[12.5px] text-text-3 leading-[1.55] m-0 mb-4">
          Hitting about 70% of these in the first year is a very good result.
          Dragon flag, human flag and full levers are Year 2.
        </p>
        <div className="flex flex-wrap gap-2">
          {YEAR_END_TARGETS.map((t) => (
            <span
              key={t}
              className="font-mono text-[11px] text-text-2 border border-border-strong px-2.5 py-[5px] rounded-[3px]">
              {t}
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>Skill tree</CardTitle>
        <div className="flex flex-col">
          {SKILL_TREE.map((skill) => {
            const win = parseWindow(skill.window);
            const inWindow =
              win && state.week >= win.from && state.week <= win.to;
            const past = win && state.week > win.to;

            return (
              <div
                key={skill.skill}
                className={cn(
                  'flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-3 border-b border-border last:border-b-0 border-l-2 pl-3',
                  inWindow
                    ? 'border-l-accent bg-accent-soft'
                    : 'border-l-transparent',
                )}>
                <div className="min-w-0 flex-1">
                  <div
                    className={cn(
                      'text-[13.5px] leading-[1.4]',
                      inWindow ? 'text-text' : 'text-text-2',
                    )}>
                    {skill.skill}
                  </div>
                  <div className="font-mono text-[10.5px] text-text-4 mt-1">
                    needs {skill.prerequisites}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="font-mono text-[11px] text-text-3 whitespace-nowrap">
                    {skill.typicalTime}
                  </span>
                  <Badge tone={inWindow ? 'accent' : past ? 'muted' : 'violet'}>
                    {skill.window}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardTitle>Progression ladders</CardTitle>
        <p className="text-[12.5px] text-text-3 leading-[1.55] m-0 mb-5">
          Move to the next step only when you own the current one, meaning the
          top of its target on all sets.
        </p>

        <div className="flex flex-col gap-5">
          {SKILL_LADDERS.map((ladder) => (
            <div key={ladder.skill}>
              <div className="flex items-baseline justify-between gap-3 mb-2.5">
                <Label>{ladder.skill}</Label>
                <span className="font-mono text-[11px] text-accent whitespace-nowrap">
                  {ladder.target}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                {ladder.steps.map((step, i) => (
                  <span key={step} className="flex items-center gap-1.5">
                    <span className="text-[12px] text-text-2 border border-border-strong bg-bg-elev px-2 py-[3px] rounded-[3px]">
                      {step}
                    </span>
                    {i < ladder.steps.length - 1 && (
                      <span className="font-mono text-[10px] text-text-4">
                        →
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
