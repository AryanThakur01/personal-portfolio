/** Phase 2, weeks 13 to 26: Strength. */

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
  'Wk 13: H2 small range to waist. Wk 14 to 19: H3 to hip height. Wk 20 on: ' +
  'H4 to chest. Move up only when the pass rule is met.';

const L_SIT_LADDER_NOTE =
  'Wk 13 to 16: S1 feet just off floor, knees bent. Wk 17 on: S2 tuck L-sit. ' +
  'Move up only when the pass rule is met.';

export const PHASE_2: Phase = {
  id: 2,
  name: 'Strength',
  startWeek: 13,
  endWeek: 26,
  goal: 'Build the base strength every skill needs while the ladders keep climbing.',
  skills: [
    'Pull-up volume',
    'Dips',
    'Tuck front lever',
    'Frog stand',
    'Box pistol',
    'Tuck L-sit',
  ],
  gateSummary:
    'Pull: 8 pull-ups, 10 feet-elevated rows. Push: 30 push-ups, 12 dips, ' +
    '60 s wall handstand. Legs: 5 box pistols each leg, rungs L5, H3, R3.',
  workouts: [
    {
      code: 'A',
      title: 'Pull: Strength',
      summary: 'Hardest progressions, 2 to 3 min rest.',
      rows: [
        ...pullWarmup('Pull-ups, 3 s lowering'),
        work(
          'Pull-ups, 3 s lowering',
          '5 x 3 to 8',
          'If under 3 reps: singles, 60 s rest.',
        ),
        work(
          'Tuck front lever hold (needs L4)',
          '5 x 5 s',
          'Ribs down, hips level, arms locked.',
        ),
        work('Feet-elevated Australian rows', '4 x 6 to 10', 'Pause at top.'),
        ladderCore(
          'H',
          'Hanging raise ladder',
          '3 x 6 to 10',
          HANGING_LADDER_NOTE,
        ),
        core('Cobra hold', '3 x 20 s', 'Glutes squeezed, chest off the floor.'),
        block(
          'Intensity block: pull-up pyramid',
          'about 10 min',
          'Do 1 pull-up, rest 20 s, 2 pull-ups, rest 20 s, then 3, 4, 3, 2 and ' +
            '1 the same way. Use a band if form slips.',
        ),
        ...PULL_COOLDOWN,
      ],
    },
    {
      code: 'B',
      title: 'Push: Strength',
      summary: 'Hardest progressions, 2 to 3 min rest.',
      rows: [
        ...pushWarmup('Chest-to-wall handstand'),
        work(
          'Chest-to-wall handstand',
          '5 x 30 to 60 s',
          'Straight line, ribs tucked.',
        ),
        work(
          'Frog stand to tuck planche lean',
          '5 x 10 to 20 s',
          'Lean shoulders past hands.',
        ),
        work(
          'Dips (add backpack at 12 clean)',
          '5 x 6 to 12',
          'Full depth, controlled.',
        ),
        work(
          'Feet-elevated pike push-ups, knees soft',
          '4 x 6 to 10',
          'Raise the box as it gets easy.',
        ),
        ladderCore(
          'S',
          'L-sit ladder (support hold to tuck L-sit)',
          '4 x 10 to 15 s',
          L_SIT_LADDER_NOTE,
        ),
        core('Side plank with top leg lift', '3 x 8 each side', 'Slow.'),
        block(
          'Intensity block: every minute',
          '8 min timer',
          'At the start of each minute do 4 dips, then rest until the next ' +
            'minute starts. 8 rounds.',
        ),
        ...PUSH_COOLDOWN,
      ],
    },
    {
      code: 'C',
      title: 'Legs and Core',
      summary: 'Strength base for pistols. Stay inside pain-free depth.',
      rows: [
        ...legsWarmup('Box pistol (knee height, then lower)'),
        work(
          'Box pistol (knee height, then lower)',
          '4 x 5 to 8 each leg',
          'Sit back to the box, stand on one leg.',
        ),
        work(
          'Bulgarian split squat (from Wk 17)',
          '3 x 8 to 12 each leg',
          'Rear foot on a bench. Shorten range if the front of the hip tightens.',
        ),
        work(
          'Slider hamstring curls',
          '4 x 8 to 12',
          'Hips up, heels pull in slowly.',
        ),
        work(
          'Single-leg glute bridge, feet elevated',
          '3 x 10 each leg',
          'Pause 2 s at top.',
        ),
        ladderCore(
          'R',
          'Hinge ladder (wall hinge to RDL)',
          '3 x 8 to 10',
          'Wk 13: R1 wall hinge. Wk 14 to 19: R2 kickstand RDL to knee ' +
            'height. Wk 20 to 26: R3 bodyweight RDL to mid-shin.',
        ),
        work('Single-leg calf raise', '3 x 15', 'Full range.'),
        ladderCore(
          'L',
          'Lying leg raise ladder',
          '3 x 8 to 10',
          'Wk 13 to 16: L4 double knee raise. Wk 17 to 23: L5 double leg ' +
            'lowering. Wk 24 to 26: L6 straight leg raise. Move up only when ' +
            'the pass rule is met.',
        ),
        core('Side plank', '3 x 30 to 45 s each side', 'Hips high.'),
        ...LEGS_COOLDOWN,
      ],
    },
    {
      code: 'D',
      title: 'Pull: Volume and Skill',
      summary: 'One step easier, higher reps, 60 to 90 s rest.',
      rows: [
        ...pullWarmup('Tuck front lever holds'),
        work(
          'Tuck front lever holds',
          '4 x 8 to 12 s',
          'Easier holds, perfect position.',
        ),
        work('Chin-ups', '3 x max minus 2', 'Leave 2 in reserve.'),
        work(
          'Pull-ups or band-assisted',
          '3 x 8 to 12',
          'Volume, not max effort.',
        ),
        work('Feet-elevated rows', '3 x 10 to 12', 'Pause at top.'),
        core('Plank', '3 x 40 to 60 s', 'Glutes squeezed.'),
        block(
          'Intensity block: alternating minutes',
          '8 min timer',
          'Minute 1: 3 chin-ups, then rest until the minute ends. Minute 2: 8 ' +
            'rows, rest. Repeat 4 times.',
        ),
        ...PULL_COOLDOWN,
      ],
    },
    {
      code: 'E',
      title: 'Push: Volume and Skill',
      summary: 'One step easier, higher reps, 60 to 90 s rest.',
      rows: [
        ...pushWarmup('Handstand kick-ups at wall plus holds'),
        work(
          'Handstand kick-ups at wall plus holds',
          '10 min',
          'Controlled entries.',
        ),
        work(
          'Planche leans',
          '3 x 15 to 20 s',
          'Hands turned out, arms locked.',
        ),
        work(
          'Diamond to archer push-ups',
          '3 x 6 to 10 each side',
          'Archer: straight arm does little work at first.',
        ),
        work('Dips', '3 x 10 to 15', 'Short rest.'),
        ladderCore(
          'S',
          'L-sit ladder (support hold to tuck L-sit)',
          '4 x 10 s',
          L_SIT_LADDER_NOTE,
        ),
        core('Cobra hold', '3 x 30 s', 'Chest off the floor, glutes squeezed.'),
        block(
          'Intensity block: every minute',
          '6 min timer',
          'At the start of each minute do 8 push-ups, then rest until the next ' +
            'minute starts. 6 rounds.',
        ),
        ...PUSH_COOLDOWN,
      ],
    },
    {
      code: 'F',
      title: 'Legs 2 and Mobility',
      summary: '6th day only. Lower-stress legs and a long mobility block.',
      rows: [
        ...legsWarmup('Reverse lunges, short range'),
        work(
          'Reverse lunges, short range',
          '3 x 10 to 12 each leg',
          'Controlled.',
        ),
        work(
          'Cossack squats, pain-free range',
          '3 x 6 each side',
          'Hip and ankle mobility under load.',
        ),
        work('Single-leg glute bridge', '3 x 12 each leg', 'Pause 2 s at top.'),
        work('Wall sit', '3 x 45 to 60 s', 'Thighs parallel.'),
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
    week: 26,
    title: 'Phase 2 gate test: can you move to Phase 3?',
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
            id: 'p2-pull-pullups',
            test: 'Strict pull-ups',
            how:
              'Dead hang start, chin clears the bar, no kipping, full hang ' +
              'between reps. One set to your max.',
            passMark: '8 reps',
          },
          {
            id: 'p2-pull-rows',
            test: 'Feet-elevated Australian rows',
            how:
              'Feet on a box, body level, chest touches the bar, 1 s pause at ' +
              'the top.',
            passMark: '10 reps',
          },
        ],
      },
      {
        area: 'push',
        label: 'Push test',
        tests: [
          {
            id: 'p2-push-pushups',
            test: 'Push-ups',
            how: 'Chest to a fist above the floor, body straight, full lockout.',
            passMark: '30 reps',
          },
          {
            id: 'p2-push-dips',
            test: 'Dips',
            how:
              'Upper arms parallel to the floor at the bottom, full lockout, ' +
              'no swinging.',
            passMark: '12 reps',
          },
          {
            id: 'p2-push-handstand',
            test: 'Chest-to-wall handstand',
            how: 'Hands 15 cm from the wall, ribs tucked, straight line.',
            passMark: '60 s',
          },
        ],
      },
      {
        area: 'legs',
        label: 'Legs and core test',
        tests: [
          {
            id: 'p2-legs-pistol',
            test: 'Box pistol',
            how:
              'Box at knee height. Sit back to the box and stand on one leg. ' +
              'Test each leg.',
            passMark: '5 reps each leg',
          },
          {
            id: 'p2-legs-l5',
            test: 'Ladder 1: rung L5',
            how: 'Lying double leg lowering with soft knees from 60 degrees, slow.',
            passMark: '3 x 8',
          },
          {
            id: 'p2-legs-h3',
            test: 'Ladder 2: rung H3',
            how: 'Hanging knee raise to hip height, no swing.',
            passMark: '3 x 8',
          },
          {
            id: 'p2-legs-r3',
            test: 'Ladder 4: rung R3',
            how: 'Bodyweight RDL to mid-shin, back neutral.',
            passMark: '3 x 10',
          },
        ],
      },
    ],
    decisions: [
      {
        condition: 'Pass pull, push, and legs and core',
        outcome: 'Start Phase 3 workouts the following week.',
      },
      {
        condition: 'Pass some areas but not all',
        outcome:
          'Start Phase 3 workouts for the areas you passed. Keep Phase 2 ' +
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
