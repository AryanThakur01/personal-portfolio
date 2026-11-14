import { useState } from 'react';
import { Check, ChevronDown, Minus } from 'lucide-react';
import {
  GATES,
  PHASES,
  formatDate,
  gateStatus,
  parseDate,
  phaseState,
  weekStartDate,
  type AreaStatus,
  type GateArea,
  type Phase,
  type ProgramState,
} from '../../data/fitness';
import { cn } from '../../utils';
import {
  Badge,
  Card,
  Label,
  Td,
  Th,
  TableWrap,
  type BadgeTone,
} from './primitives';

const AREAS: GateArea[] = ['pull', 'push', 'legs'];

const AREA_LABEL: Record<GateArea, string> = {
  pull: 'Pull',
  push: 'Push',
  legs: 'Legs and core',
};

const STATUS_TONE: Record<AreaStatus, BadgeTone> = {
  passed: 'green',
  retesting: 'amber',
  pending: 'muted',
};

const STATUS_LABEL: Record<AreaStatus, string> = {
  passed: 'Passed',
  retesting: 'Retesting',
  pending: 'Not tested',
};

/** Which phase each area is training, given the gates passed so far. */
function AreaPhaseStrip({ state }: { state: ProgramState }) {
  return (
    <Card>
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <h3 className="font-mono text-[14px] font-medium text-text m-0">
          Training right now
        </h3>
        <span className="font-mono text-[11px] text-text-3">
          Gates, not dates
        </span>
      </div>

      <p className="text-[12.5px] text-text-3 leading-[1.55] m-0 mb-4">
        Miss a gate and only that area stays behind. The rest move on, so each
        area can sit in a different phase.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {AREAS.map((area) => {
          const phaseId = state.areaPhase[area];
          const phase = PHASES.find((p) => p.id === phaseId);
          const behind = phaseId < state.phase.id;

          return (
            <div
              key={area}
              className="border border-border bg-bg-elev px-4 py-3">
              <Label className="mb-2">{AREA_LABEL[area]}</Label>
              <div className="font-mono text-[14px] text-text">
                Phase {phaseId}
                <span className="text-text-3 text-[12px] ml-2">
                  {phase?.name}
                </span>
              </div>
              {behind && (
                <div className="font-mono text-[10px] text-amber mt-2 tracking-[0.08em] uppercase">
                  Holding, gate not passed
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function GateBlock({ phase }: { phase: Phase }) {
  return (
    <div className="flex flex-col gap-4 pt-5">
      <p className="text-[12.5px] text-text-3 leading-[1.6] m-0">
        {phase.gate.how}
      </p>

      {phase.gate.groups.map((group) => {
        const progress = GATES[phase.id][group.area];

        return (
          <div key={group.area}>
            <div className="flex items-center gap-3 mb-2.5">
              <Label>{group.label}</Label>
              <Badge tone={STATUS_TONE[progress.status]}>
                {STATUS_LABEL[progress.status]}
              </Badge>
              {progress.testedOn && (
                <span className="font-mono text-[10px] text-text-4">
                  tested {formatDate(parseDate(progress.testedOn))}
                </span>
              )}
            </div>

            {progress.note && (
              <p className="text-[12px] text-text-3 leading-[1.5] m-0 mb-2.5">
                {progress.note}
              </p>
            )}

            <TableWrap>
              <thead>
                <tr>
                  <Th className="w-[22%]">Test</Th>
                  <Th>How to do it</Th>
                  <Th className="w-[15%]">Pass mark</Th>
                  <Th className="w-[14%]">Result</Th>
                  <Th className="w-[60px]">Pass</Th>
                </tr>
              </thead>
              <tbody>
                {group.tests.map((test) => {
                  const result = progress.results?.[test.id];
                  const passed = progress.status === 'passed';

                  return (
                    <tr key={test.id} className="last:[&>td]:border-b-0">
                      <Td className="text-text">{test.test}</Td>
                      <Td>{test.how}</Td>
                      <Td className="font-mono text-[11.5px] text-accent whitespace-nowrap">
                        {test.passMark}
                      </Td>
                      <Td className="font-mono text-[11.5px] text-text">
                        {result ?? <span className="text-text-4">—</span>}
                      </Td>
                      <Td>
                        {passed ? (
                          <Check size={14} className="text-green" />
                        ) : (
                          <Minus size={14} className="text-text-4" />
                        )}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </TableWrap>
          </div>
        );
      })}

      <div>
        <Label className="mb-2.5">Decision</Label>
        <TableWrap>
          <thead>
            <tr>
              <Th className="w-[38%]">If you</Th>
              <Th>Then</Th>
            </tr>
          </thead>
          <tbody>
            {phase.gate.decisions.map((d, i) => (
              <tr key={i} className="last:[&>td]:border-b-0">
                <Td className="text-text">{d.condition}</Td>
                <Td>{d.outcome}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </div>
    </div>
  );
}

export function Gates({ state }: { state: ProgramState }) {
  const [open, setOpen] = useState<number[]>([state.phase.id]);

  const toggle = (id: number) =>
    setOpen((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );

  return (
    <div className="flex flex-col gap-4">
      <AreaPhaseStrip state={state} />

      {PHASES.map((phase) => {
        const st = phaseState(phase, state);
        const gate = gateStatus(phase.id);
        const isOpen = open.includes(phase.id);
        const gateWeekStart = weekStartDate(phase.gate.week);

        return (
          <div
            key={phase.id}
            className={cn(
              'border bg-bg-card',
              st === 'active' ? 'border-accent-line' : 'border-border',
            )}>
            <button
              type="button"
              onClick={() => toggle(phase.id)}
              aria-expanded={isOpen}
              className="w-full text-left p-5 cursor-pointer">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                    <span className="font-mono text-[11px] text-text-3">
                      Phase {phase.id}
                    </span>
                    <h3 className="font-mono text-[16px] font-medium text-text m-0">
                      {phase.name}
                    </h3>
                    <span className="font-mono text-[11px] text-text-4">
                      wk {phase.startWeek}–{phase.endWeek}
                    </span>
                    {st === 'active' && <Badge tone="accent">Current</Badge>}
                    {gate === 'passed' && (
                      <Badge tone="green">Gate passed</Badge>
                    )}
                    {gate === 'partial' && (
                      <Badge tone="amber">Partly passed</Badge>
                    )}
                  </div>
                  <p className="text-[13px] text-text-2 leading-[1.55] m-0">
                    {phase.goal}
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className={cn(
                    'text-text-3 shrink-0 transition-transform duration-200 mt-1',
                    isOpen && 'rotate-180',
                  )}
                />
              </div>

              <div className="flex flex-wrap gap-[6px] mt-3.5">
                {phase.skills.map((s) => (
                  <span
                    key={s}
                    className="font-mono text-[10px] tracking-[0.08em] text-text-3 border border-border-strong px-2 py-[3px] rounded-[3px]">
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 pt-3.5 border-t border-dashed border-border-strong">
                {AREAS.map((area) => {
                  const p = GATES[phase.id][area];
                  return (
                    <div key={area} className="flex items-center gap-2">
                      <span
                        className={cn(
                          'w-[7px] h-[7px] rounded-full shrink-0',
                          p.status === 'passed' && 'bg-green',
                          p.status === 'retesting' && 'bg-amber',
                          p.status === 'pending' && 'bg-text-4',
                        )}
                      />
                      <span className="font-mono text-[11px] text-text-3">
                        {AREA_LABEL[area]}
                      </span>
                    </div>
                  );
                })}
                <span className="font-mono text-[11px] text-text-4 sm:ml-auto">
                  Gate test week {phase.gate.week}, from{' '}
                  {formatDate(gateWeekStart)}
                </span>
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 border-t border-border">
                <GateBlock phase={phase} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
