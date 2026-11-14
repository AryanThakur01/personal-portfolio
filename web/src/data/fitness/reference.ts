/**
 * Reference material: the daily track, scheduling queue, progression and
 * intensity rules, equipment, nutrition and recovery.
 */

/** The 10-minute daily routine, done every day including rest days. */
export const DAILY_TRACK = [
  {
    step: 1,
    movement: 'Lie face down, relax',
    dose: '1 min',
    notes: 'Let the hips sink.',
  },
  {
    step: 2,
    movement: 'Prone on elbows',
    dose: '1 min',
    notes: 'Skip to step 3 if it does not feel easing.',
  },
  {
    step: 3,
    movement: 'Prone press-ups',
    dose: '10 reps, 2 s hold at top',
    notes: 'Hips stay on the floor.',
  },
  {
    step: 4,
    movement: 'Side bends, or side-lying stretch over a pillow',
    dose: '5 each side, 5 s',
    notes: 'Start toward the side that feels better.',
  },
  {
    step: 5,
    movement: 'Glute bridge',
    dose: '10 reps, 2 s hold',
    notes: 'Ribs down, squeeze glutes.',
  },
  {
    step: 6,
    movement: 'Bird dog',
    dose: '6 each side, 5 s hold',
    notes: 'Back flat like a table.',
  },
  {
    step: 7,
    movement: 'Dead bug with heel taps, knees bent',
    dose: '6 each side',
    notes: 'Slow, back stays neutral.',
  },
  { step: 8, movement: 'Short walk', dose: '2 min', notes: 'Easy pace.' },
];

export const DAILY_TRACK_NOTE =
  'On training days do steps 1 to 3 before the warm-up and again after the ' +
  'session. The full track runs every day, including rest days.';

/** The six workouts, worked through in order rather than tied to weekdays. */
export const QUEUE = [
  {
    code: 'A',
    workout: 'Pull: Strength',
    type: 'Heavy pulling, hardest progressions, longer rest',
  },
  {
    code: 'B',
    workout: 'Push: Strength',
    type: 'Heavy pushing and handstand or planche skills',
  },
  {
    code: 'C',
    workout: 'Legs and Core',
    type: 'Full leg session plus trunk work, every phase from Week 1',
  },
  {
    code: 'D',
    workout: 'Pull: Volume and Skill',
    type: 'Easier progressions, more total reps, skill practice',
  },
  {
    code: 'E',
    workout: 'Push: Volume and Skill',
    type: 'Easier progressions, more total reps, skill practice',
  },
  {
    code: 'F',
    workout: 'Legs 2 and Mobility',
    type: '6th day only: lower-stress legs and an extended mobility block',
  },
];

/** The split actually being run: legs, pull, push twice over, Sunday off. */
export const WEEKLY_SPLIT = [
  { day: 'Monday', code: 'C', workout: 'Legs and Core', focus: 'Legs' },
  { day: 'Tuesday', code: 'A', workout: 'Pull: Strength', focus: 'Pull' },
  { day: 'Wednesday', code: 'B', workout: 'Push: Strength', focus: 'Push' },
  { day: 'Thursday', code: 'F', workout: 'Legs 2 and Mobility', focus: 'Legs' },
  {
    day: 'Friday',
    code: 'D',
    workout: 'Pull: Volume and Skill',
    focus: 'Pull',
  },
  {
    day: 'Saturday',
    code: 'E',
    workout: 'Push: Volume and Skill',
    focus: 'Push',
  },
  { day: 'Sunday', code: '—', workout: 'Rest', focus: 'Rest' },
];

export const SPLIT_RULES = [
  'Each pattern runs twice a week: the strength version first (C, A, B from Monday), the volume and skill version second (F, D, E from Thursday).',
  'The two pull days and the two push days never land on back-to-back days, which is what the program asks for.',
  'Thursday is the lowest-stress session of the week, which is where it helps most: it falls on the fourth training day in a row.',
  'Missed a day? Use the shift control on the Today tab rather than pushing everything along. The split picks up again tomorrow.',
  'One session a day. A week is Monday to Sunday.',
  'Deload weeks: keep the same split, cut the sets roughly in half and stop well short of failure.',
];

export const PROGRESSION_RULES = [
  'Double progression. Every exercise has a rep range. Hit the top on all sets with clean form, then move to the next harder variation and restart at the bottom.',
  'Holds progress the same way. For static skills, once you can hold 15 s on all sets, move to the next progression.',
  'Strength days (A, B) use the hardest variation you can do cleanly. Volume days (D, E) use one step easier with shorter rests.',
  'Leave 1 to 2 reps in reserve on most sets. Never train straight-arm skills (planche, levers, handstand) to failure.',
  'Skills first, strength second. Quality beats quantity. Change one thing at a time. Film yourself once a week.',
  'Stalled for 3 weeks? Drop one progression, add a set, check sleep and food, then build back up.',
];

/** Where intensity comes from: tension, tempo and density rather than range. */
export const INTENSITY_TOOLS = [
  {
    tool: 'Hard effort on pull and push',
    how: 'Main sets at 8 to 9 out of 10 effort (1 to 2 reps left), hardest clean variation, 2 to 3 min rest',
    where: 'A and B',
  },
  {
    tool: 'Tempo and pauses',
    how: '3 to 5 s lowering, 1 to 2 s pause at the hardest point. Adds tension without adding range or load',
    where: 'All strength work',
  },
  {
    tool: 'Intensity block',
    how: '8 to 10 minutes of EMOM or ladders on pulling or pressing only, finishing each session',
    where: 'A, B, D, E',
  },
  {
    tool: 'Single-leg and hip work',
    how: 'Single-leg bridges, box work, step-ups: tough on legs and glutes, shallow range',
    where: 'C and F',
  },
  {
    tool: 'Short, hard trunk work',
    how: 'High-tension plank 20 to 30 s, side plank, dead bug at your rung. Short and tense beats long',
    where: 'Core slot',
  },
];

export const INTENSITY_BLOCK_EXPLAINER =
  'A short, timed finisher at the end of your main work on A, B, D and E days. ' +
  'You use a movement you have already done that day, pulling or pressing ' +
  'only, and pack a fixed amount of quality reps into 6 to 10 minutes with ' +
  'short rests. Every minute: set a timer, start each minute with the stated ' +
  'reps, then rest for whatever is left of that minute. Alternating minutes: ' +
  'odd minutes do exercise 1, even minutes do exercise 2. Ladder or pyramid: ' +
  'reps go up then down with short fixed rests. The reps are easy enough that ' +
  'you never grind. The challenge is the pace and the small rest. Stop the ' +
  'block if form breaks.';

export const SESSION_STRUCTURE = [
  {
    block: 'Warm-up',
    time: '10 min',
    what: 'Daily track steps 1 to 3, wrist prep 2 min, scapular pulls 10, band pull-aparts 15, bird dog 5 each side, 1 to 2 easy sets of your first exercise',
  },
  {
    block: 'Skill practice',
    time: '10 to 20 min',
    what: 'Handstand, crow, levers, planche, muscle-up while fresh',
  },
  {
    block: 'Strength work',
    time: '25 to 35 min',
    what: 'Main compound exercises',
  },
  {
    block: 'Core and intensity block',
    time: '8 to 12 min',
    what: 'Core at your current ladder rung, then the EMOM or ladder',
  },
  {
    block: 'Cool-down',
    time: '5 min',
    what: 'Press-ups x 10, side bends, easy walk',
  },
];

export const REST_PERIODS =
  'Skill holds 90 to 120 s. Heavy strength sets (1 to 6 reps) 2 to 3 min. ' +
  'Moderate sets (6 to 12 reps) 90 s. Leg sets 60 to 90 s. Core 45 to 60 s. ' +
  'On D and E days you can cut strength rests by about 30 s. Cap sessions at ' +
  'about 60 minutes: make them dense, not long.';

export const EQUIPMENT = [
  {
    item: 'Pull-up bar (doorway or park bar)',
    need: 'Essential',
    why: 'Hangs, negatives, pull-ups, hanging raise ladder',
  },
  {
    item: 'Parallel bars / dip station (or two sturdy chairs)',
    need: 'Essential',
    why: 'Dips, support holds',
  },
  {
    item: 'Resistance bands (light, medium, heavy)',
    need: 'Highly recommended',
    why: 'Assisted pull-ups, shoulder work',
  },
  {
    item: 'Low bar or sturdy table',
    need: 'Essential',
    why: 'Australian rows, a top priority early on',
  },
  {
    item: 'Exercise mat',
    need: 'Essential',
    why: 'Press-ups, dead bugs, bridges, floor rests between sets',
  },
  {
    item: 'Low box or step (30 to 40 cm)',
    need: 'Essential',
    why: 'Box squats, step-ups, split squats',
  },
  {
    item: 'Parallettes',
    need: 'Recommended from Phase 2',
    why: 'L-sit, planche work, easier on wrists',
  },
  { item: 'Wall space', need: 'Essential', why: 'Handstand practice' },
];

export const NUTRITION_GOALS = [
  {
    situation: 'Carrying noticeable extra body fat',
    goal: 'Fat loss while building strength',
    calories: 'Maintenance minus 300 to 500 kcal',
  },
  {
    situation: 'Roughly average build',
    goal: 'Recomposition',
    calories: 'Maintenance',
  },
  {
    situation: 'Very thin or struggling to gain weight',
    goal: 'Lean bulk',
    calories: 'Maintenance plus 200 to 300 kcal',
  },
];

export const NUTRITION_FORMULA =
  'Maintenance is about bodyweight (kg) x 30 to 33 kcal when training 4 to 6 ' +
  'days a week (use the low end at 4 days). Protein 1.6 to 2.2 g per kg. Fat ' +
  'about 0.8 to 1 g per kg. Fill the rest with carbs. Water about 35 ml per ' +
  'kg, plus 0.5 to 1 L on training days. Weigh yourself 3 to 4 mornings a ' +
  'week and adjust by 100 to 200 kcal every 2 to 3 weeks.';

export const NUTRITION_TABLE = [
  {
    weight: '55 kg',
    kcal: 'about 1730',
    protein: '99 g',
    fat: '50 g',
    carbs: '223 g',
    water: '1.9 L',
  },
  {
    weight: '65 kg',
    kcal: 'about 2050',
    protein: '117 g',
    fat: '58 g',
    carbs: '263 g',
    water: '2.3 L',
  },
  {
    weight: '75 kg',
    kcal: 'about 2360',
    protein: '135 g',
    fat: '68 g',
    carbs: '304 g',
    water: '2.6 L',
  },
  {
    weight: '85 kg',
    kcal: 'about 2680',
    protein: '153 g',
    fat: '76 g',
    carbs: '344 g',
    water: '3.0 L',
  },
  {
    weight: '95 kg',
    kcal: 'about 2990',
    protein: '171 g',
    fat: '86 g',
    carbs: '385 g',
    water: '3.3 L',
  },
];

export const PLATE_RULES = [
  'Protein at every meal (25 to 40 g): eggs, chicken, fish, paneer, Greek yogurt or hung curd, tofu, soya chunks, lentils, chickpeas, rajma, whey or plant protein.',
  'Carbs around training: rice, oats, roti, potatoes, poha, fruit. Vegetables at 2+ meals a day. Healthy fats: nuts, seeds, ghee or oils in moderation, fatty fish.',
  'Pre-workout (1 to 2 h before): carbs plus some protein, such as banana and curd. Post-workout (within about 2 h): a normal meal with 30 to 40 g protein and carbs.',
  'Optional, food first: creatine 3 to 5 g daily; protein powder to hit your target; vitamin D per blood test; caffeine before training but not within 8 h of bed.',
  'Consistency beats perfection: hitting protein and roughly your calories on 80 to 90% of days is enough.',
];

export const RECOVERY_RULES = [
  'Sleep 7 to 9 hours. The single most powerful recovery tool you have.',
  'Tendons adapt slower than muscles. Wrists, elbows and shoulders need months. Straight-arm skills stress them heavily, so add volume slowly.',
  'Flexible schedule, fixed recovery. Training 6 days is optional, not better. If energy or performance drops two sessions in a row, take the next week at 4 days.',
  'Warm up your wrists every session, especially before handstands, crow, planche and push work.',
  'Soreness vs pain: dull muscle soreness is fine. Sharp, joint or pinpoint pain, or pain that gets worse during a set, means stop that exercise.',
  'Elbow ache (common with levers and muscle-ups): cut straight-arm volume in half for 1 to 2 weeks and add light band curls and reverse wrist curls.',
  'Active recovery days: short walks in bouts, easy cycling, swimming or gentle yoga.',
  'Life gets busy? Minimum effective week: 3 sessions of 40 minutes (skill, 2 main exercises, core) plus the daily track, still following the queue.',
];

/** Tests repeated in every retest week. */
export const CHECKPOINT_TESTS = [
  'Max push-ups',
  'Max dips',
  'Wall handstand (chest to wall)',
  'Plank',
  'Max pull-ups (strict)',
  'Max Australian rows',
  'Dead hang',
  'Box squats to parallel',
  'Side plank each side',
  'Crow pose',
  'Ladder rungs (L / H / S / R)',
];

export const RETEST_NOTE =
  'Repeat the full test in Weeks 12, 26, 39 and 52. Warm up fully, rest 3 to ' +
  '5 minutes between tests, and count only full range, clean reps.';

export const DISCLAIMER =
  'General training information, not medical advice. Check with a doctor or ' +
  'physio before starting, and stop any movement that causes pain.';
