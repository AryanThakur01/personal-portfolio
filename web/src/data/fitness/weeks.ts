/**
 * The 52-week plan.
 *
 * Use the phase workouts plus this table for the focus each week. Targets apply
 * to whichever workouts land in that week, however many days you train. Ladder
 * rungs listed as "begins" start only if the previous rung's pass rule is met.
 */

import type { WeekEntry } from './types';

export const WEEKS: WeekEntry[] = [
  {
    week: 1,
    phase: 1,
    type: 'Build',
    focus:
      'Baseline done. Test crow. Learn every movement at the low end of the ' +
      'ranges. Walk in short bouts.',
  },
  {
    week: 2,
    phase: 1,
    type: 'Build',
    focus:
      '+1 rep per set where form is clean. Dead hang 30 s. Box squats 3 x 15. ' +
      'Bird dog 3 x 8.',
  },
  {
    week: 3,
    phase: 1,
    type: 'Build',
    focus: 'Negatives 4 x 4 at 5 s. Rows 4 x 8. L1 heel slides begin.',
  },
  {
    week: 4,
    phase: 1,
    type: 'Deload',
    focus: 'Half the sets, 4 days max. Review the log.',
  },
  {
    week: 5,
    phase: 1,
    type: 'Build',
    focus:
      'Weekly max pull-up attempt starts. Push-ups 4 x 12. Dips 4 x 4. Hang ' +
      '35 s. L2 knee march begins.',
  },
  {
    week: 6,
    phase: 1,
    type: 'Build',
    focus:
      'Negatives 4 x 5. Rows 4 x 10. Hang 40 s. Single-leg bridge 3 x 10. H1 begins.',
  },
  {
    week: 7,
    phase: 1,
    type: 'Build',
    focus: 'Wall handstand 40 s. Dips 4 x 5. Step-ups 3 x 10.',
  },
  {
    week: 8,
    phase: 1,
    type: 'Deload',
    focus: 'Half the sets. Wall hinge trial (R1).',
  },
  {
    week: 9,
    phase: 1,
    type: 'Build',
    focus:
      'Band pull-ups 4 x 8 on a lighter band. Diamond push-up finisher: 6 at ' +
      'the top of each minute, 6 rounds. Crow 20 s. Box squats 3 x 20.',
  },
  {
    week: 10,
    phase: 1,
    type: 'Build',
    focus:
      'Hang 45 s. Side plank 30 s each side. Rows 3 x 12. L3 and H2 begin.',
  },
  {
    week: 11,
    phase: 1,
    type: 'Peak',
    focus: 'First strict pull-up attempts. Squats 3 x 25.',
  },
  {
    week: 12,
    phase: 1,
    type: 'Deload + Test',
    focus: 'Checkpoint 1: full test. Decide Phase 2 by area.',
  },
  {
    week: 13,
    phase: 2,
    type: 'Build',
    focus: 'Phase 2 workouts. Pull-ups as singles or doubles. L4 begins.',
  },
  {
    week: 14,
    phase: 2,
    type: 'Build',
    focus: 'Pull-ups 5 x 2. Dips 4 x 8. Frog stand 10 s. H3 begins.',
  },
  {
    week: 15,
    phase: 2,
    type: 'Build',
    focus:
      'Pull-ups 5 x 3. Feet-elevated pike push-ups. Archer push-ups, slow on ' +
      'the straight-arm side.',
  },
  {
    week: 16,
    phase: 2,
    type: 'Deload',
    focus: 'Half volume. Extra mobility work.',
  },
  {
    week: 17,
    phase: 2,
    type: 'Build',
    focus:
      'Pull-ups 5 x 4. Dips 4 x 10. L5 and S2 begin. Bulgarian split squats start.',
  },
  {
    week: 18,
    phase: 2,
    type: 'Build',
    focus: 'Wall handstand 45 s. Tuck front lever 5 s (needs L4).',
  },
  {
    week: 19,
    phase: 2,
    type: 'Build',
    focus: 'Pull-ups 5 x 5. Frog stand 20 s. Kickstand RDL practice.',
  },
  {
    week: 20,
    phase: 2,
    type: 'Build',
    focus:
      'Wall handstand 60 s. Tuck planche lean. Lower the pistol box. H4 and R3 begin.',
  },
  { week: 21, phase: 2, type: 'Deload', focus: 'Half volume.' },
  {
    week: 22,
    phase: 2,
    type: 'Build',
    focus: 'Pull-ups 5 x 6. Dips 4 x 10. Tuck front lever 10 s.',
  },
  {
    week: 23,
    phase: 2,
    type: 'Build',
    focus: 'Pull-ups 5 x 6 to 8. Archer push-ups 3 x 5 each side.',
  },
  {
    week: 24,
    phase: 2,
    type: 'Peak',
    focus: 'L6 begins. Dips 3 x 12. Tuck front lever 12 to 15 s.',
  },
  {
    week: 25,
    phase: 2,
    type: 'Build',
    focus: 'Low volume, high quality. Rehearse the test moves.',
  },
  {
    week: 26,
    phase: 2,
    type: 'Deload + Test',
    focus:
      'Checkpoint 2: need 8 pull-ups and 12 dips before muscle-up work. R4 begins.',
  },
  {
    week: 27,
    phase: 3,
    type: 'Build',
    focus:
      'Phase 3 workouts. Explosive pull-ups 5 x 3. Straight bar dips 3 x 6. H5 begins.',
  },
  {
    week: 28,
    phase: 3,
    type: 'Build',
    focus:
      'Advanced tuck front lever 5 s. Handstand kick-ups 10 min. R5 begins.',
  },
  {
    week: 29,
    phase: 3,
    type: 'Build',
    focus:
      'Muscle-up transitions on band or low bar 5 x 3. Wall HSPU negatives 4 x 3.',
  },
  {
    week: 30,
    phase: 3,
    type: 'Build',
    focus: 'Tuck planche 5 x 5 s. S3 begins.',
  },
  {
    week: 31,
    phase: 3,
    type: 'Deload',
    focus: 'Half volume. Check elbows and wrists.',
  },
  {
    week: 32,
    phase: 3,
    type: 'Build',
    focus: 'Pull-ups to belly button. Counterbalanced pistols 3 x 3.',
  },
  {
    week: 33,
    phase: 3,
    type: 'Build',
    focus:
      'First muscle-up attempts. Free handstand 3 to 5 s. Partial Nordics 3 x 3.',
  },
  {
    week: 34,
    phase: 3,
    type: 'Build',
    focus: 'Advanced tuck front lever 8 s. H6 begins.',
  },
  { week: 35, phase: 3, type: 'Deload', focus: 'Half volume.' },
  {
    week: 36,
    phase: 3,
    type: 'Build',
    focus: 'Muscle-up attempts. Tuck planche 8 s. R6 begins.',
  },
  {
    week: 37,
    phase: 3,
    type: 'Build',
    focus: 'Pistols 3 x 5. Free handstand 5 s.',
  },
  {
    week: 38,
    phase: 3,
    type: 'Peak',
    focus: 'Fresh, strong singles. 3 to 5 muscle-up attempts.',
  },
  {
    week: 39,
    phase: 3,
    type: 'Deload + Test',
    focus: 'Checkpoint 3: film every skill, Phase 4 gate decision.',
  },
  {
    week: 40,
    phase: 4,
    type: 'Build',
    focus: 'Phase 4 workouts. Muscle-up singles 5 x 1. S4 full L-sit attempts.',
  },
  {
    week: 41,
    phase: 4,
    type: 'Build',
    focus: 'One-leg front lever 5 s. Archer pull-ups 4 x 3 each side.',
  },
  {
    week: 42,
    phase: 4,
    type: 'Build',
    focus: 'Full-range wall HSPU 3 x 2. Optional weighted pull-ups.',
  },
  {
    week: 43,
    phase: 4,
    type: 'Build',
    focus: 'Free handstand 10 s. Pistols 4 x 5.',
  },
  {
    week: 44,
    phase: 4,
    type: 'Deload',
    focus: 'Half volume. H7 toes to bar attempts afterwards.',
  },
  {
    week: 45,
    phase: 4,
    type: 'Build',
    focus: 'Muscle-ups 5 x 2. Advanced tuck planche 5 s.',
  },
  {
    week: 46,
    phase: 4,
    type: 'Peak',
    focus: 'Straddle back lever attempts. Wall HSPU 4 x 3.',
  },
  {
    week: 47,
    phase: 4,
    type: 'Build',
    focus: 'Free handstand 15 s. Hanging straight leg raises 3 x 6.',
  },
  {
    week: 48,
    phase: 4,
    type: 'Deload',
    focus: 'Half volume. Recover fully before the final block.',
  },
  {
    week: 49,
    phase: 4,
    type: 'Peak',
    focus: 'Low volume, maximum quality. Skill doubles and heavy singles.',
  },
  {
    week: 50,
    phase: 4,
    type: 'Peak',
    focus: 'Mock test in the checkpoint format.',
  },
  {
    week: 51,
    phase: 4,
    type: 'Taper',
    focus: 'About 50% volume. Stay sharp, sleep a lot.',
  },
  {
    week: 52,
    phase: 4,
    type: 'Final test',
    focus: 'Final test. Compare with Week 1. Plan Year 2.',
  },
];

/** Weeks that run at half volume. */
export const DELOAD_WEEKS = WEEKS.filter((w) =>
  w.type.startsWith('Deload'),
).map((w) => w.week);

/** Weeks that carry a full retest. */
export const TEST_WEEKS = [12, 26, 39, 52];
