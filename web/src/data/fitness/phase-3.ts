/** Phase 3, weeks 27 to 39: Skills. */

import {
  LEGS_COOLDOWN,
  PULL_COOLDOWN,
  PUSH_COOLDOWN,
  block,
  core,
  ladderCore,
  legsWarmup,
  pullWarmup,
  pushWarmup,
  work,
} from './blocks';
import type { Phase } from './types';

const HANGING_LADDER_NOTE =
  'Wk 27 to 33: H5 one leg straight, one bent. Wk 34 on: H6 straight leg ' +
  'raise to 45 then 90 degrees. Move up only when the pass rule is met.';

const L_SIT_LADDER_NOTE =
  'Wk 27 to 29: S2 tuck L-sit. Wk 30 on: S3 tuck L-sit with one leg ' +
  'extended. Move up only when the pass rule is met.';

export const PHASE_3: Phase = {
  id: 3,
  name: 'Skills',
  startWeek: 27,
  endWeek: 39,
  goal:
    'Unlock your first big skills on a stable trunk. Start muscle-up work ' +
    'only once you have 8 strict pull-ups and 12 dips.',
  skills: [
    'Muscle-up',
    'Freestanding handstand',
    'Tuck planche',
    'Pistols',
    'Hanging raises',
    'Hinge work',
  ],
  gateSummary:
    'Pull: 12 pull-ups, 3 chest-to-bar pull-ups. Push: 20 dips, 5 wall HSPU ' +
    'negatives, 3 s free handstand. Legs: 3 pistols each side, rungs L6, H5, R4.',
  workouts: [
    {
      code: 'A',
      title: 'Pull: Strength',
      summary: 'Strength and the first muscle-up work.',
      rows: [
        ...pullWarmup('Muscle-up practice (band or low bar)'),
        work(
          'Muscle-up practice (band or low bar)',
          '5 x 3 transitions',
          'Smooth, no kipping.',
        ),
        work(
          'Advanced tuck front lever (needs L5)',
          '5 x 5 to 10 s',
          'Flat back, hips in line.',
        ),
        work(
          'Explosive chest-to-bar pull-ups',
          '5 x 3 to 5',
          'Bar to lower chest.',
        ),
        work(
          'Straight bar dips',
          '4 x 6 to 10',
          'Key for the muscle-up top half.',
        ),
        ladderCore(
          'H',
          'Hanging raise ladder',
          '3 x 6 to 10',
          HANGING_LADDER_NOTE,
        ),
        block(
          'Intensity block: every minute',
          '8 min timer',
          'At the start of each minute do 2 chest-to-bar pull-ups, then rest ' +
            'until the next minute starts. 8 rounds.',
        ),
        ...PULL_COOLDOWN,
      ],
    },
    {
      code: 'B',
      title: 'Push: Strength',
      summary: 'Handstand and planche work, heavy dips.',
      rows: [
        ...pushWarmup('Freestanding handstand practice'),
        work(
          'Freestanding handstand practice',
          '10 to 15 min',
          'Kick-ups, bail by cartwheeling out.',
        ),
        work('Tuck planche', '6 x 5 to 10 s', 'On parallettes or floor.'),
        work(
          'Wall handstand push-up negatives',
          '4 x 3 to 5',
          'Head to cushion slowly, 4 to 5 s.',
        ),
        work(
          'Dips (weighted at 20+ reps)',
          '4 x 8 to 12',
          'Full depth, controlled.',
        ),
        ladderCore(
          'S',
          'L-sit ladder (tuck L-sit)',
          '5 x 10 to 15 s',
          L_SIT_LADDER_NOTE,
        ),
        block(
          'Intensity block: every minute',
          '6 min timer',
          'At the start of each minute do 3 dips and 3 push-ups, then rest ' +
            'until the next minute starts. 6 rounds.',
        ),
        ...PUSH_COOLDOWN,
      ],
    },
    {
      code: 'C',
      title: 'Legs and Core',
      summary: 'Single-leg strength and the first real hamstring loading.',
      rows: [
        ...legsWarmup('Counterbalanced pistols'),
        work(
          'Counterbalanced pistols',
          '4 x 3 to 6 each leg',
          'Hold a light weight in front.',
        ),
        work('Shrimp squat progression', '3 x 5 each leg', 'Controlled.'),
        work(
          'Nordic curls, partial range (from Wk 33, needs R4)',
          '3 x 3 to 5',
          'Stop at any pulling behind the knee.',
        ),
        work('Single-leg RDL', '3 x 8 each leg', 'Back neutral.'),
        core('Long-lever plank', '4 x 15 to 20 s', 'Ribs down, glutes tight.'),
        core('Lying leg raise (L6)', '3 x 8 to 12', 'Slow lowering.'),
        ...LEGS_COOLDOWN,
      ],
    },
    {
      code: 'D',
      title: 'Pull: Volume and Skill',
      summary: 'Lever work and pulling volume.',
      rows: [
        ...pullWarmup('Tuck to advanced tuck back lever'),
        work(
          'Tuck to advanced tuck back lever',
          '5 x 5 to 10 s',
          'Only after a 30 s German hang, and only if it feels fine.',
        ),
        work('Pull-ups (backpack at 12+)', '3 x 6 to 8', 'Controlled.'),
        work(
          'Tuck front lever holds',
          '3 x 10 to 15 s',
          'Easier version for volume.',
        ),
        work('Archer Australian rows', '3 x 6 to 8 each side', 'Pause at top.'),
        ladderCore('H', 'Hanging raise ladder', '3 x 10', HANGING_LADDER_NOTE),
        block(
          'Intensity block: row ladder',
          'about 8 min',
          'Do 2 archer or feet-elevated rows, rest 30 s, 4 rows, rest 30 s, ' +
            'then 6, 8, 6, 4 and 2 the same way.',
        ),
        ...PULL_COOLDOWN,
      ],
    },
    {
      code: 'E',
      title: 'Push: Volume and Skill',
      summary: 'Easier pushing, more skill practice.',
      rows: [
        ...pushWarmup('Freestanding handstand'),
        work('Freestanding handstand', '10 min', 'Easy, frequent attempts.'),
        work(
          'Planche leans or tuck planche',
          '4 x 8 to 10 s',
          'One step easier than B.',
        ),
        work(
          'Pseudo-planche push-ups',
          '3 x 6 to 10',
          'Hands by hips, lean forward.',
        ),
        work('Feet-elevated pike push-ups', '3 x 8 to 10', 'Pain-free range.'),
        work('Dips', '3 x 12 to 15', 'Short rest.'),
        ladderCore(
          'S',
          'L-sit ladder (tuck L-sit)',
          '4 x 15 s',
          L_SIT_LADDER_NOTE,
        ),
        ...PUSH_COOLDOWN,
      ],
    },
    {
      code: 'F',
      title: 'Legs 2 and Mobility',
      summary: '6th day only. Lower-stress legs and hamstring ladder work.',
      rows: [
        ...legsWarmup('Bulgarian split squat'),
        work('Bulgarian split squat', '3 x 8 to 10 each leg', 'Controlled.'),
        work('Single-leg RDL', '3 x 8 each leg', 'Back neutral.'),
        work('Box jumps, step down', '3 x 5', 'Only after 4 good weeks.'),
        ladderCore(
          'R',
          'Hinge and hamstring ladder',
          '3 x 8 to 10 or 20 to 30 s',
          'Wk 27: R4 single-leg RDL. Wk 28 on: add R5 standing hamstring ' +
            'stretch. Wk 36 on: R6 seated fold, knees bent.',
        ),
        core(
          'Extended mobility block',
          '15 min',
          'Press-ups, side work, ankle rocks.',
        ),
        ...LEGS_COOLDOWN,
      ],
    },
  ],
  gate: {
    week: 39,
    title: 'Phase 3 gate test: can you move to Phase 4?',
    how:
      'Spread the test over the test week. Day 1: pull test after the Workout ' +
      'A warm-up. Day 2: push test after the Workout B warm-up. Day 3: legs ' +
      'and core test after the Workout C warm-up. Rest 3 to 5 minutes between ' +
      'tests and count only full range, clean reps.',
    groups: [
      {
        area: 'pull',
        label: 'Pull test',
        tests: [
          {
            id: 'p3-pull-pullups',
            test: 'Strict pull-ups',
            how:
              'Dead hang start, chin clears the bar, no kipping. One set to ' +
              'your max.',
            passMark: '12 reps',
          },
          {
            id: 'p3-pull-c2b',
            test: 'Explosive chest-to-bar pull-up',
            how:
              'Pull fast until the bar touches your lower chest. Three clean ' +
              'reps in one set.',
            passMark: '3 reps',
          },
        ],
      },
      {
        area: 'push',
        label: 'Push test',
        tests: [
          {
            id: 'p3-push-dips',
            test: 'Dips',
            how: 'Upper arms parallel to the floor at the bottom, full lockout.',
            passMark: '20 reps',
          },
          {
            id: 'p3-push-hspu',
            test: 'Wall handstand push-up negatives',
            how: 'Kick up to the wall, lower your head to a cushion over 5 s. One set.',
            passMark: '5 reps',
          },
          {
            id: 'p3-push-handstand',
            test: 'Freestanding handstand',
            how: 'Kick up away from the wall and hold balance with a straight line.',
            passMark: '3 s',
          },
        ],
      },
      {
        area: 'legs',
        label: 'Legs and core test',
        tests: [
          {
            id: 'p3-legs-pistol',
            test: 'Pistol squat',
            how:
              'Full depth, one leg, a light counterweight in front is ' +
              'allowed. Test each leg.',
            passMark: '3 reps each leg',
          },
          {
            id: 'p3-legs-l6',
            test: 'Ladder 1: rung L6',
            how: 'Lying straight leg raise, both legs, slow lowering.',
            passMark: '3 x 10',
          },
          {
            id: 'p3-legs-h5',
            test: 'Ladder 2: rung H5',
            how: 'Hanging raise with one leg straight and one bent.',
            passMark: '3 x 6 each side',
          },
          {
            id: 'p3-legs-r4',
            test: 'Ladder 4: rung R4',
            how: 'Single-leg RDL to mid-shin, back neutral.',
            passMark: '3 x 8 each side',
          },
        ],
      },
    ],
    decisions: [
      {
        condition: 'Pass pull, push, and legs and core',
        outcome: 'Start Phase 4 workouts the following week.',
      },
      {
        condition: 'Pass some areas but not all',
        outcome:
          'Start Phase 4 workouts for the areas you passed. Keep Phase 3 ' +
          'workouts for the areas you did not pass for 2 to 4 more weeks, ' +
          'then retest only those areas.',
      },
      {
        condition: 'Miss the same test twice',
        outcome:
          'Drop one progression for that area, add a set, check sleep and ' +
          'food, and retest in 2 weeks.',
      },
    ],
  },
};
