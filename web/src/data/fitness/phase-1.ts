/** Phase 1, weeks 1 to 12: Foundation. */

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

/** The core slot runs at whichever Ladder 1 rung is current. */
const LADDER_1_NOTE =
  'Wk 1 to 2: L0 heel taps. Wk 3 to 4: L1 heel slides. Wk 5 to 7: L2 knee ' +
  'march. Wk 8 to 12: L3 single straight-leg lowering. Move up only when the ' +
  'pass rule is met.';

export const PHASE_1: Phase = {
  id: 1,
  name: 'Foundation',
  startWeek: 1,
  endWeek: 12,
  goal:
    'Bring grip, rows, trunk control and legs up to your push strength, and ' +
    'earn your first pull-up.',
  skills: [
    'Dead hang',
    'Crow pose',
    'Chest-to-wall handstand',
    'Dead bug',
    'Bird dog',
    'Box squat',
    'Glute bridge',
  ],
  gateSummary:
    'Pull: 1 pull-up, 10 rows, 45 s hang. Push: 20 push-ups, 6 dips, 15 s ' +
    'crow. Legs: 25 box squats, 30 s side plank, bird dog 10 x 10 s, rung L2.',
  workouts: [
    {
      code: 'A',
      title: 'Pull: Strength',
      summary:
        'Your number one priority day. Max pull-up test at the start of the ' +
        'first A each week from Week 5. Heavy and crisp, 2 to 3 min rest.',
      rows: [
        ...pullWarmup('Pull-up negatives'),
        work(
          'Max pull-up attempt (from Wk 5)',
          '1 attempt',
          'Fresh, after warm-up. Log it.',
        ),
        work(
          'Pull-up negatives',
          '5 x 3 to 5 (5 to 6 s lower)',
          'Hardest work of the day. Jump to the top, lower slowly.',
        ),
        work(
          'Dead hang (H0)',
          '3 x 25 to 45 s',
          'Add 5 s per week. Ribs down, shoulders active.',
        ),
        work(
          'Australian rows, 1 s pause at top',
          '4 x 6 to 10',
          'Plank line, chest to bar.',
        ),
        work(
          'Scapular pulls',
          '3 x 8 to 10',
          'Straight arms, shoulders down and back.',
        ),
        core(
          'Bird dog, 5 s holds',
          '3 x 8 each side',
          'Back flat like a table.',
        ),
        core(
          'Prone cobra hold',
          '3 x 15 s',
          'Squeeze glutes, chest off the floor.',
        ),
        block(
          'Intensity block: alternating minutes',
          '8 min timer',
          'Minute 1: 3 Australian rows, then rest until the minute ends. ' +
            'Minute 2: 2 pull-up negatives, rest. Repeat 4 times. Stop if form breaks.',
        ),
        ...PULL_COOLDOWN,
      ],
    },
    {
      code: 'B',
      title: 'Push: Strength',
      summary: 'You are ahead here, so push hard. Crisp reps, ribs tucked.',
      rows: [
        ...pushWarmup('Crow pose'),
        work(
          'Crow pose',
          '5 x 10 to 20 s',
          'Knees on back of arms, pillow in front.',
        ),
        work(
          'Chest-to-wall handstand',
          '4 x 20 to 40 s',
          'Hands 10 to 20 cm from wall, ribs tucked.',
        ),
        work(
          'Strict dips',
          '5 x 3 to 6',
          'If under 3 reps, add 2 slow negatives per set.',
        ),
        work(
          'Feet-elevated push-ups',
          '4 x 8 to 12',
          'Feet on a low step. Harder than floor push-ups.',
        ),
        work(
          'Pike push-ups, knees soft',
          '3 x 6 to 10',
          'Pain-free range, head forward of hands.',
        ),
        work(
          'Support hold (S0)',
          '3 x 20 to 30 s',
          'Arms locked, shoulders pushed down.',
        ),
        core(
          'Side plank (knees bent ok)',
          '3 x 20 to 30 s each side',
          'Straight line from head to knees.',
        ),
        block(
          'Intensity block: every minute',
          '6 min timer',
          'At the start of each minute do 6 diamond push-ups, then rest until ' +
            'the next minute starts. 6 rounds.',
        ),
        ...PUSH_COOLDOWN,
      ],
    },
    {
      code: 'C',
      title: 'Legs and Core',
      summary:
        'Fixes your low squat number and builds hip strength. Stay at ' +
        'parallel depth, use tempo for intensity.',
      rows: [
        ...legsWarmup('Box squat to parallel, 3 s down'),
        work(
          'Box squat to parallel, 3 s down',
          '4 x 8 to 12',
          'Sit back to the box, tap, stand. No deeper than parallel.',
        ),
        work(
          'Step-ups, knee-height box',
          '3 x 8 to 10 each leg',
          'Drive through the heel, little push from the back foot.',
        ),
        work(
          'Single-leg glute bridge (R0)',
          '4 x 10 to 12 each leg',
          'Pause 2 s at top, ribs down.',
        ),
        work(
          'Short-range split squat (from Wk 6)',
          '3 x 8 each leg',
          'Stop at a comfortable depth.',
        ),
        work(
          'Calf raises, two legs then one',
          '3 x 15 to 20',
          'Full range on a step.',
        ),
        core(
          'High-tension plank',
          '4 x 20 to 30 s',
          'Squeeze glutes, fists, legs. Short and hard.',
        ),
        core('Side plank', '3 x 30 s each side', 'Hips high.'),
        ladderCore(
          'L',
          'Lying core ladder (dead bug to knee march)',
          '3 x 8 each side',
          LADDER_1_NOTE,
        ),
        ...LEGS_COOLDOWN,
      ],
    },
    {
      code: 'D',
      title: 'Pull: Volume and Skill',
      summary:
        'More total pulling at an easier level. Grip and row volume get you ' +
        'to the first rep. Rest 60 to 90 s.',
      rows: [
        ...pullWarmup('Band-assisted pull-ups'),
        work(
          'Band-assisted pull-ups',
          '4 x 5 to 8',
          'Lighter band when 4 x 8 is easy.',
        ),
        work('Chin-up negatives', '3 x 3', '5 s lowering.'),
        work(
          'Australian rows, 2 s pause at top',
          '3 x 8 to 12',
          'Raise the bar a little if you need reps.',
        ),
        work('Active hang', '3 x 20 to 30 s', 'Grip and shoulder control.'),
        work('Band pull-aparts', '3 x 15', 'Shoulder health.'),
        work('Prone Y and T raises', '3 x 8', 'Upper back and rear shoulders.'),
        ladderCore(
          'L',
          'Lying core ladder (dead bug to knee march)',
          '3 x 8 each side',
          LADDER_1_NOTE,
        ),
        block(
          'Intensity block: row ladder',
          'about 8 min',
          'Do 2 rows, rest 30 s, 4 rows, rest 30 s, then 6, 8, 6, 4 and 2 rows ' +
            'the same way.',
        ),
        ...PULL_COOLDOWN,
      ],
    },
    {
      code: 'E',
      title: 'Push: Volume and Skill',
      summary: 'Easier pushing, more practice time on skills.',
      rows: [
        ...pushWarmup('Crow pose'),
        work('Crow pose', '4 x 10 to 20 s', 'Try to lift one toe off at 20 s.'),
        work(
          'Chest-to-wall handstand',
          '4 x 20 to 30 s',
          'Easier holds, perfect line.',
        ),
        work('Push-ups, 3 s lowering', '4 x 8 to 12', 'Rest 60 s.'),
        work('Dip negatives', '4 x 3 to 5', '5 s lowering.'),
        work('Pike push-ups', '3 x 6 to 8', 'Pain-free range.'),
        work(
          'Support hold, knees bent',
          '3 x 20 s',
          'Shoulders pushed down hard.',
        ),
        core('Cobra hold', '3 x 20 s', 'Glutes squeezed.'),
        block(
          'Intensity block: every minute',
          '6 min timer',
          'At the start of each minute do 6 feet-elevated push-ups, then rest ' +
            'until the next minute starts. 6 rounds.',
        ),
        ...PUSH_COOLDOWN,
      ],
    },
    {
      code: 'F',
      title: 'Legs 2 and Mobility',
      summary:
        '6th day only. Lower-stress work that will not eat into your A to E ' +
        'recovery.',
      rows: [
        ...legsWarmup('Tempo box squat, 4 s down, 1 s pause'),
        work(
          'Tempo box squat, 4 s down, 1 s pause',
          '3 x 8',
          'Parallel depth.',
        ),
        work('Box step-ups, slow', '3 x 10 each leg', 'Knee-height step.'),
        work('Glute bridge march', '3 x 10 each side', 'Hips stay level.'),
        work(
          'Wall hinge (once R1 is unlocked)',
          '3 x 10',
          'Back neutral, knees soft.',
        ),
        work('Wall sit', '3 x 30 to 45 s', 'Thighs parallel.'),
        work('Calf raises', '2 x 20', 'Slow.'),
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
    week: 12,
    title: 'Phase 1 gate test: can you move to Phase 2?',
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
            id: 'p1-pull-pullup',
            test: 'Strict pull-up',
            how:
              'Start from a dead hang, arms straight. Pull until the chin ' +
              'clears the bar. No kicking or swinging. Lower to a full hang.',
            passMark: '1 rep',
          },
          {
            id: 'p1-pull-rows',
            test: 'Australian rows',
            how:
              'Bar at waist height, heels on the floor, body straight. Chest ' +
              'touches the bar, 1 s pause at the top.',
            passMark: '10 reps',
          },
          {
            id: 'p1-pull-hang',
            test: 'Dead hang',
            how: 'Shoulders pulled down, ribs down, no swinging.',
            passMark: '45 s',
          },
        ],
      },
      {
        area: 'push',
        label: 'Push test',
        tests: [
          {
            id: 'p1-push-pushups',
            test: 'Push-ups',
            how:
              'Hands under shoulders, body straight. Chest to a fist above ' +
              'the floor, full lockout at the top.',
            passMark: '20 reps',
          },
          {
            id: 'p1-push-dips',
            test: 'Strict dips',
            how:
              'On bars. Lower until upper arms are parallel to the floor, ' +
              'press to full lockout. No swinging.',
            passMark: '6 reps',
          },
          {
            id: 'p1-push-crow',
            test: 'Crow pose',
            how: 'Knees on the backs of your arms, both feet lifted off the floor.',
            passMark: '15 s',
          },
        ],
      },
      {
        area: 'legs',
        label: 'Legs and core test',
        tests: [
          {
            id: 'p1-legs-squats',
            test: 'Box squat to parallel',
            how:
              'Box at knee height. Sit back, tap the box, stand. Hip crease ' +
              'level with the knees, heels down.',
            passMark: '25 reps',
          },
          {
            id: 'p1-legs-sideplank',
            test: 'Side plank',
            how: 'Elbow under shoulder, hips high, straight line. Test each side.',
            passMark: '30 s each side',
          },
          {
            id: 'p1-legs-birddog',
            test: 'Bird dog',
            how:
              'Opposite arm and leg out, hold 10 s, back flat like a table. ' +
              'Each side.',
            passMark: '10 reps, 10 s holds',
          },
          {
            id: 'p1-legs-l2',
            test: 'Ladder 1: rung L2',
            how:
              'Lying knee march, one knee at a time, knee stays bent, back ' +
              'neutral.',
            passMark: '3 x 10 each side',
          },
        ],
      },
    ],
    decisions: [
      {
        condition: 'Pass pull, push, and legs and core',
        outcome: 'Start Phase 2 workouts the following week.',
      },
      {
        condition: 'Pass some areas but not all',
        outcome:
          'Start Phase 2 workouts for the areas you passed. Keep Phase 1 ' +
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
