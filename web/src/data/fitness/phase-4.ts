/** Phase 4, weeks 40 to 52: Advanced. */

import {
  LEGS_COOLDOWN,
  PULL_COOLDOWN,
  PUSH_COOLDOWN,
  core,
  ladderCore,
  legsWarmup,
  pullWarmup,
  pushWarmup,
  work,
} from './blocks';
import type { Phase } from './types';

export const PHASE_4: Phase = {
  id: 4,
  name: 'Advanced',
  startWeek: 40,
  endWeek: 52,
  goal:
    'Refine, add reps and build advanced holds. A and B are heavy: low reps, ' +
    'long rest, hardest progressions. D and E use easier progressions with ' +
    'more total sets.',
  skills: [
    'Muscle-ups',
    'Advanced tuck holds',
    'Front and back lever work',
    'Weighted pulls',
    'Straight leg raises',
  ],
  gateSummary:
    'Final test in Week 52 against your Week 1 numbers. Hitting about 70% of ' +
    'the year-end targets is a very good first year.',
  workouts: [
    {
      code: 'A',
      title: 'Pull: Heavy',
      summary: 'Low reps, long rest.',
      rows: [
        ...pullWarmup('Muscle-ups, as strict as possible'),
        work(
          'Muscle-ups, as strict as possible',
          '5 x 1 to 3',
          'Reduce kip each week.',
        ),
        work(
          'One-leg to straddle front lever',
          '5 x 5 to 10 s',
          'Band-assist the straddle.',
        ),
        work(
          'Archer pull-ups',
          '4 x 3 to 5 each side',
          'One-arm pull-up foundation.',
        ),
        work('Weighted pull-ups (optional)', '5 x 5', '+5 to 15 kg.'),
        core('Hanging straight leg raises (H6)', '3 x 6 to 8', 'No swing.'),
        ...PULL_COOLDOWN,
      ],
    },
    {
      code: 'B',
      title: 'Push: Heavy',
      summary: 'Low reps, long rest.',
      rows: [
        ...pushWarmup('Freestanding handstand'),
        work(
          'Freestanding handstand',
          '10 to 15 min',
          'Goal: consistent 15 to 30 s holds.',
        ),
        work(
          'Advanced tuck planche',
          '6 x 5 to 10 s',
          'Flat back, hips at shoulder level.',
        ),
        work(
          'Wall handstand push-ups',
          '5 x 2 to 6',
          'Full range, head to floor.',
        ),
        work('Weighted dips (optional)', '4 x 5 to 8', '+5 to 20 kg.'),
        ladderCore(
          'S',
          'L-sit ladder (S3 one-leg tuck, then S4 full L-sit)',
          '5 x 10 to 20 s',
          'Use S4 only once its pass rule is met, otherwise stay on S3.',
        ),
        ...PUSH_COOLDOWN,
      ],
    },
    {
      code: 'C',
      title: 'Legs and Core',
      summary: 'Single-leg strength and trunk tension.',
      rows: [
        ...legsWarmup('Pistol squats'),
        work('Pistol squats', '4 x 5 to 8 each leg', 'Add weight at 10+.'),
        work('Shrimp squats', '3 x 5 each leg', 'Controlled.'),
        work(
          'Nordic curls',
          '3 x 3 to 6',
          'Stop at any pulling behind the knee.',
        ),
        work('Single-leg RDL', '3 x 8 each leg', 'Back neutral.'),
        core('Long-lever plank', '3 x 20 to 30 s', 'Ribs down, glutes tight.'),
        core('Lying leg raises', '3 x 12', 'Slow lowering.'),
        ...LEGS_COOLDOWN,
      ],
    },
    {
      code: 'D',
      title: 'Pull: Skill and Volume',
      summary: 'Lever skills and technique work.',
      rows: [
        ...pullWarmup('Straddle to full back lever'),
        work(
          'Straddle to full back lever',
          '5 x 5 to 10 s',
          'Progress slowly for elbow health.',
        ),
        work(
          'Muscle-up technique (band or low bar)',
          '4 x 2',
          'Smooth transitions.',
        ),
        work(
          'Front lever pulls (tuck or advanced tuck)',
          '3 x 5',
          'Controlled.',
        ),
        work('Pull-ups', '3 x 8 to 12', 'Volume, not max effort.'),
        core(
          'Toes to bar (H7)',
          '3 x 5 to 8',
          'Only once H6 is passed. Otherwise do hanging straight leg raises 3 x 6.',
        ),
        ...PULL_COOLDOWN,
      ],
    },
    {
      code: 'E',
      title: 'Push: Skill and Volume',
      summary: 'Handstand and planche skills with volume.',
      rows: [
        ...pushWarmup('Freestanding handstand'),
        work('Freestanding handstand', '10 min', 'Easy, frequent attempts.'),
        work(
          'Pike lean and press handstand drills',
          '4 x 5',
          'Future press to handstand.',
        ),
        work('Pseudo-planche push-ups', '3 x 8 to 12', 'Increase the lean.'),
        work('Partial-range wall HSPU', '3 x 3 to 5', 'Controlled.'),
        work('Dips', '3 x 12 to 15', 'Short rest.'),
        core('Planche leans', '3 x 20 s', 'Hands turned out, arms locked.'),
        ...PUSH_COOLDOWN,
      ],
    },
    {
      code: 'F',
      title: 'Legs 2 and Athleticism',
      summary: '6th day only. Athletic work, only when recovery is good.',
      rows: [
        ...legsWarmup('Box jumps or sprints'),
        work('Box jumps or sprints', '5 rounds', 'Sprints only once cleared.'),
        work('Bulgarian split squat', '3 x 8 each leg', 'Controlled.'),
        work('Single-leg hip thrust', '3 x 10 each leg', 'Pause 2 s at top.'),
        work('Single-leg calf raise', '3 x 15 each leg', 'Full range.'),
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
    week: 52,
    title: 'Final test: your year against Week 1',
    how:
      'Run it over the final test week, spread across 3 or 4 days, after full ' +
      'warm-ups. Rest 3 to 5 minutes between tests and count only clean reps. ' +
      'Hitting about 70% of these targets is a very good first year.',
    groups: [
      {
        area: 'pull',
        label: 'Pull',
        tests: [
          {
            id: 'p4-pull-pullups',
            test: 'Strict pull-ups',
            how: 'Dead hang start, chin clears the bar, no kipping. One set to max.',
            passMark: '10 reps',
          },
          {
            id: 'p4-pull-muscleup',
            test: 'Muscle-up',
            how: 'Bar muscle-up, as strict as possible.',
            passMark: '1 rep',
          },
          {
            id: 'p4-pull-frontlever',
            test: 'Tuck front lever',
            how: 'Hang, knees to chest, hips level, arms locked. Hold.',
            passMark: '10 s',
          },
        ],
      },
      {
        area: 'push',
        label: 'Push',
        tests: [
          {
            id: 'p4-push-pushups',
            test: 'Push-ups',
            how: 'Chest to a fist above the floor, full lockout.',
            passMark: '40 reps',
          },
          {
            id: 'p4-push-dips',
            test: 'Dips',
            how: 'Upper arms parallel at the bottom, full lockout.',
            passMark: '20 reps',
          },
          {
            id: 'p4-push-handstand',
            test: 'Freestanding handstand',
            how: 'Kick up away from the wall and hold balance.',
            passMark: '5 s',
          },
          {
            id: 'p4-push-planche',
            test: 'Tuck planche',
            how: 'On parallettes or floor, feet off the ground.',
            passMark: '5 s',
          },
        ],
      },
      {
        area: 'legs',
        label: 'Legs and core',
        tests: [
          {
            id: 'p4-legs-pistol',
            test: 'Pistol squat',
            how: 'Full depth, one leg, no counterweight. Each leg.',
            passMark: '3 each leg',
          },
          {
            id: 'p4-legs-lyingraise',
            test: 'Lying straight leg raise',
            how: 'Both legs, slow lowering.',
            passMark: '3 x 12',
          },
          {
            id: 'p4-legs-kneeraise',
            test: 'Hanging knee raise',
            how: 'To chest, no swing.',
            passMark: '3 x 12',
          },
          {
            id: 'p4-legs-legraise',
            test: 'Hanging straight leg raise',
            how: 'To 90 degrees, no swing.',
            passMark: '3 x 5',
          },
          {
            id: 'p4-legs-lsit',
            test: 'L-sit',
            how: 'On bars or parallettes, legs straight and lifted.',
            passMark: '10 s',
          },
        ],
      },
    ],
    decisions: [
      {
        condition: 'Hit about 70% of targets',
        outcome:
          'Plan Year 2 on the same structure: dragon flag, human flag, full ' +
          'levers, V-sit, one-arm pull-up work.',
      },
      {
        condition: 'Hit fewer targets',
        outcome:
          'Repeat Phase 4 for another 8 to 12 weeks, keeping every ladder ' +
          'where it is, then retest.',
      },
    ],
  },
};
