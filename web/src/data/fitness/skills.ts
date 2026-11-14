/** Skill tree: target windows and the step-by-step ladder for each skill. */

import type { SkillEstimate, SkillLadder } from './types';

/**
 * Target windows assume consistent training. They are estimates, not
 * deadlines.
 */
export const SKILL_TREE: SkillEstimate[] = [
  {
    skill: '20 push-ups',
    prerequisites: 'None',
    typicalTime: '1 to 3 months',
    window: 'Wk 3 to 8',
  },
  {
    skill: 'Crow pose',
    prerequisites: 'Wrist prep',
    typicalTime: '2 to 6 weeks',
    window: 'Wk 2 to 8',
  },
  {
    skill: 'First pull-up',
    prerequisites: 'Dead hang 45 s, 10 rows',
    typicalTime: '1 to 4 months',
    window: 'Wk 8 to 14',
  },
  {
    skill: '10 dips',
    prerequisites: 'Support hold 30 s',
    typicalTime: '2 to 4 months',
    window: 'Wk 11 to 16',
  },
  {
    skill: 'Wall handstand 60 s',
    prerequisites: 'Pike push-ups, wall plank',
    typicalTime: '3 to 5 months',
    window: 'Wk 12 to 20',
  },
  {
    skill: 'Box pistol',
    prerequisites: 'Box squats, ankle mobility',
    typicalTime: '4 to 8 months',
    window: 'Wk 17 to 26',
  },
  {
    skill: '8 pull-ups',
    prerequisites: 'First pull-up',
    typicalTime: '4 to 8 months',
    window: 'Wk 22 to 30',
  },
  {
    skill: 'Tuck front lever 10 to 15 s',
    prerequisites: '5+ pull-ups, rung L4',
    typicalTime: '3 to 6 months',
    window: 'Wk 22 to 30',
  },
  {
    skill: 'Lying straight leg raise 3 x 10',
    prerequisites: 'Ladder 1 to L6',
    typicalTime: 'Ladder-paced',
    window: 'Wk 24 to 32',
  },
  {
    skill: 'Tuck and advanced tuck back lever',
    prerequisites: 'German hang 30 s, 8 pull-ups',
    typicalTime: '4 to 8 months',
    window: 'Wk 30 to 42',
  },
  {
    skill: 'Muscle-up (bar)',
    prerequisites: '8+ pull-ups, 12 dips, rung H4',
    typicalTime: '6 to 12 months',
    window: 'Wk 33 to 46',
  },
  {
    skill: 'Hanging straight leg raise',
    prerequisites: 'Rungs L6 and R5',
    typicalTime: 'Ladder-paced',
    window: 'Wk 34 to 48',
  },
  {
    skill: 'Tuck planche 10 s',
    prerequisites: 'Planche lean 20 s, frog stand',
    typicalTime: '6 to 12 months',
    window: 'Wk 36 to 52',
  },
  {
    skill: 'Freestanding handstand 10 s',
    prerequisites: 'Wall handstand 60 s, kick-ups',
    typicalTime: '6 to 12 months',
    window: 'Wk 40 to 52',
  },
  {
    skill: 'Full L-sit 10 s',
    prerequisites: 'Rungs L6 and R5, S3',
    typicalTime: '4 to 8 months',
    window: 'Wk 40 to 52',
  },
  {
    skill: 'Dragon flag, human flag, full levers, V-sit',
    prerequisites: 'Years of base',
    typicalTime: '1 to 3 years',
    window: 'Year 2',
  },
];

/**
 * Move to the next step only when you own the current one, meaning the top of
 * its target on all sets.
 */
export const SKILL_LADDERS: SkillLadder[] = [
  {
    skill: 'Push-up',
    steps: [
      'Wall',
      'Incline',
      'Knee',
      'Full',
      'Feet-elevated',
      'Diamond',
      'Archer',
      'Pseudo-planche',
    ],
    target: '3 x 12 to 15',
  },
  {
    skill: 'Pull-up',
    steps: [
      'Dead hang',
      'Scap pulls',
      'Aus rows',
      'Negatives',
      'Band-assisted',
      'Full',
      'Chest-to-bar',
      'Archer',
    ],
    target: 'Negatives 3 x 5 at 5 s, then first rep',
  },
  {
    skill: 'Dip',
    steps: [
      'Support hold',
      'Bench dips',
      'Negatives',
      'Full',
      'Straight bar dips',
      'Weighted',
    ],
    target: '3 x 10',
  },
  {
    skill: 'Squat and pistol',
    steps: [
      'Box squat',
      'Split squat',
      'Bulgarian',
      'Box pistol (high to low)',
      'Counterbalanced',
      'Full',
      'Weighted',
    ],
    target: '3 x 8 each leg',
  },
  {
    skill: 'Muscle-up',
    steps: [
      'Explosive pull-ups',
      'High pull-ups',
      'Straight bar dips',
      'Band or low-bar transitions',
      'Kipping',
      'Strict',
    ],
    target: '5 x 5 chest-to-bar first',
  },
  {
    skill: 'Handstand',
    steps: [
      'Wall plank',
      'Chest-to-wall',
      'Toe pulls off wall',
      'Kick-ups',
      'Free handstand',
    ],
    target: '60 s wall, then 5 s free holds',
  },
  {
    skill: 'Handstand push-up',
    steps: [
      'Pike push-up',
      'Feet-elevated pike',
      'Wall HSPU negatives',
      'Partial range',
      'Full wall HSPU',
    ],
    target: '4 x 3 at each step',
  },
  {
    skill: 'Front lever',
    steps: ['Tuck', 'Advanced tuck', 'One leg', 'Straddle', 'Full'],
    target: '5 x 15 s',
  },
  {
    skill: 'Back lever',
    steps: [
      'German hang',
      'Tuck',
      'Advanced tuck',
      'One leg',
      'Straddle',
      'Full',
    ],
    target: '5 x 10 to 15 s',
  },
  {
    skill: 'Planche',
    steps: [
      'Planche lean',
      'Frog stand',
      'Tuck',
      'Advanced tuck',
      'Straddle',
      'Full',
    ],
    target: '5 x 15 s',
  },
  {
    skill: 'Hamstrings',
    steps: [
      'Glute bridge',
      'Sliding curl',
      'Nordic negatives',
      'Partial Nordics',
      'Full Nordics',
    ],
    target: '3 x 8 (Nordics 3 x 5)',
  },
  {
    skill: 'Dragon flag (Year 2)',
    steps: [
      'Lying leg raise to L6',
      'Tuck negatives',
      'One-leg negatives',
      'Full negatives',
      'Full reps',
    ],
    target: '3 x 5',
  },
];

/** Where a full year of consistent training should land. */
export const YEAR_END_TARGETS = [
  '10 pull-ups',
  '20 dips',
  '40 push-ups',
  '5 s freestanding handstand',
  '1 muscle-up',
  'Lying straight leg raises 3 x 12',
  'Hanging knee raises 3 x 12',
  'Hanging straight leg raises 3 x 5',
  '10 s L-sit',
  '10 s tuck front lever',
  '5 s tuck planche',
];
