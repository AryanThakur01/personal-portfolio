import {
  CHECKPOINT_TESTS,
  EQUIPMENT,
  INTENSITY_TOOLS,
  NUTRITION_FORMULA,
  NUTRITION_GOALS,
  NUTRITION_TABLE,
  PLATE_RULES,
  PROGRESSION_RULES,
  QUEUE,
  SPLIT_RULES,
  RECOVERY_RULES,
  RETEST_NOTE,
  SESSION_STRUCTURE,
  TEST_WEEKS,
  WEEKLY_SPLIT,
} from '../../data/fitness';
import {
  Card,
  CardTitle,
  Label,
  RuleList,
  TableWrap,
  Td,
  Th,
} from './primitives';

export function Reference() {
  return (
    <div className="flex flex-col gap-4">
      {/* Scheduling */}
      <Card>
        <CardTitle>Your weekly split</CardTitle>
        <p className="text-[13px] text-text-2 leading-[1.6] m-0 mb-4">
          Legs, pull, push from Monday, twice over, with Sunday off. Each
          phase's six workouts map onto the six training days, so the page knows
          what today is without you telling it.
        </p>

        <TableWrap>
          <thead>
            <tr>
              <Th className="w-[16%]">Day</Th>
              <Th className="w-[12%]">Focus</Th>
              <Th className="w-[60px]">Code</Th>
              <Th>Workout</Th>
            </tr>
          </thead>
          <tbody>
            {WEEKLY_SPLIT.map((d) => (
              <tr key={d.day} className="last:[&>td]:border-b-0">
                <Td className="text-text">{d.day}</Td>
                <Td className="font-mono text-[11.5px]">{d.focus}</Td>
                <Td className="font-mono text-accent">{d.code}</Td>
                <Td>{d.workout}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>

        <Label className="mt-6 mb-2.5">The six workouts</Label>

        <TableWrap>
          <thead>
            <tr>
              <Th className="w-[50px]">Code</Th>
              <Th className="w-[28%]">Workout</Th>
              <Th>Type</Th>
            </tr>
          </thead>
          <tbody>
            {QUEUE.map((q) => (
              <tr key={q.code} className="last:[&>td]:border-b-0">
                <Td className="font-mono text-accent">{q.code}</Td>
                <Td className="text-text">{q.workout}</Td>
                <Td>{q.type}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>

        <Label className="mt-6 mb-3">How the split works</Label>
        <RuleList items={SPLIT_RULES} />
      </Card>

      {/* Progression and intensity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardTitle>Rules of progression</CardTitle>
          <RuleList items={PROGRESSION_RULES} />
        </Card>
        <Card>
          <CardTitle>Recovery</CardTitle>
          <RuleList items={RECOVERY_RULES} />
        </Card>
      </div>

      <Card>
        <CardTitle>Where the intensity comes from</CardTitle>
        <p className="text-[13px] text-text-2 leading-[1.6] m-0 mb-4">
          Intensity comes from tension, tempo and short timed density blocks
          rather than from range or load.
        </p>
        <TableWrap>
          <thead>
            <tr>
              <Th className="w-[24%]">Tool</Th>
              <Th>How it is used</Th>
              <Th className="w-[16%]">Where</Th>
            </tr>
          </thead>
          <tbody>
            {INTENSITY_TOOLS.map((t) => (
              <tr key={t.tool} className="last:[&>td]:border-b-0">
                <Td className="text-text">{t.tool}</Td>
                <Td>{t.how}</Td>
                <Td className="font-mono text-[11.5px] text-accent">
                  {t.where}
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>

      <Card>
        <CardTitle>Session structure</CardTitle>
        <p className="text-[12.5px] text-text-3 leading-[1.55] m-0 mb-4">
          Already written into every workout table, so you just follow it top to
          bottom.
        </p>
        <TableWrap>
          <thead>
            <tr>
              <Th className="w-[26%]">Block</Th>
              <Th className="w-[15%]">Time</Th>
              <Th>What to do</Th>
            </tr>
          </thead>
          <tbody>
            {SESSION_STRUCTURE.map((s) => (
              <tr key={s.block} className="last:[&>td]:border-b-0">
                <Td className="text-text">{s.block}</Td>
                <Td className="font-mono text-[11.5px]">{s.time}</Td>
                <Td>{s.what}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>

      {/* Equipment */}
      <Card>
        <CardTitle>Equipment</CardTitle>
        <TableWrap>
          <thead>
            <tr>
              <Th className="w-[38%]">Item</Th>
              <Th className="w-[22%]">Need it?</Th>
              <Th>Why</Th>
            </tr>
          </thead>
          <tbody>
            {EQUIPMENT.map((e) => (
              <tr key={e.item} className="last:[&>td]:border-b-0">
                <Td className="text-text">{e.item}</Td>
                <Td className="font-mono text-[11.5px]">{e.need}</Td>
                <Td>{e.why}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>

      {/* Nutrition */}
      <Card>
        <CardTitle>Nutrition</CardTitle>
        <p className="text-[13px] text-text-2 leading-[1.6] m-0 mb-4">
          Your body is the weight, so being reasonably lean makes every skill
          easier. Under-eating kills strength gains and recovery, so aim for
          steady, slow changes.
        </p>

        <Label className="mb-2.5">Step 1: choose your goal</Label>
        <TableWrap>
          <thead>
            <tr>
              <Th className="w-[34%]">Your situation</Th>
              <Th className="w-[30%]">Goal</Th>
              <Th>Daily calories</Th>
            </tr>
          </thead>
          <tbody>
            {NUTRITION_GOALS.map((g) => (
              <tr key={g.situation} className="last:[&>td]:border-b-0">
                <Td className="text-text">{g.situation}</Td>
                <Td>{g.goal}</Td>
                <Td className="font-mono text-[11.5px]">{g.calories}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>

        <Label className="mt-6 mb-2.5">Step 2: find your numbers</Label>
        <p className="text-[13px] text-text-2 leading-[1.6] m-0 mb-4">
          {NUTRITION_FORMULA}
        </p>
        <TableWrap>
          <thead>
            <tr>
              <Th>Bodyweight</Th>
              <Th>Maintenance</Th>
              <Th>Protein</Th>
              <Th>Fat</Th>
              <Th>Carbs</Th>
              <Th>Water</Th>
            </tr>
          </thead>
          <tbody>
            {NUTRITION_TABLE.map((n) => (
              <tr key={n.weight} className="last:[&>td]:border-b-0">
                <Td className="font-mono text-text">{n.weight}</Td>
                <Td className="font-mono text-[11.5px]">{n.kcal}</Td>
                <Td className="font-mono text-[11.5px]">{n.protein}</Td>
                <Td className="font-mono text-[11.5px]">{n.fat}</Td>
                <Td className="font-mono text-[11.5px]">{n.carbs}</Td>
                <Td className="font-mono text-[11.5px]">{n.water}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>

        <Label className="mt-6 mb-3">Step 3: build your plate</Label>
        <RuleList items={PLATE_RULES} />
      </Card>

      {/* Tracking */}
      <Card>
        <CardTitle>Retesting</CardTitle>
        <p className="text-[13px] text-text-2 leading-[1.6] m-0 mb-4">
          {RETEST_NOTE}
        </p>
        <Label className="mb-2.5">Test weeks: {TEST_WEEKS.join(', ')}</Label>
        <div className="flex flex-wrap gap-2">
          {CHECKPOINT_TESTS.map((t) => (
            <span
              key={t}
              className="font-mono text-[11px] text-text-2 border border-border-strong px-2.5 py-[5px] rounded-[3px]">
              {t}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
