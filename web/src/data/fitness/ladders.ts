/**
 * The four progression ladders.
 *
 * The core slot in every workout runs at whichever rung is current, so these
 * drive the hardest trunk work in the program. Rung codes (L, H, S, R) are
 * referenced from the workout tables and the gate tests.
 */

import type { Ladder } from './types';

export const LADDER_PASS_RULE =
  'Hit the dose for 3 sets in two sessions in a row with clean form, and stay ' +
  'at least 7 days on the rung. Move one ladder per week, never in a deload or ' +
  'test week. If a rung stops feeling clean, repeat it rather than moving up.';

export const LADDERS: Ladder[] = [
  {
    prefix: 'L',
    name: 'Lying leg raises',
    usedIn: 'The core slot in every workout uses your current rung.',
    rungs: [
      {
        code: 'L0',
        exercise: 'Dead bug, heel taps, knees bent at 90 degrees',
        passDose: '3 x 8 each side',
        needs: 'None',
        earliestWeek: 1,
      },
      {
        code: 'L1',
        exercise: 'Dead bug, slow heel slide to straight, leg just above floor',
        passDose: '3 x 8 each side',
        needs: 'L0',
        earliestWeek: 3,
      },
      {
        code: 'L2',
        exercise: 'Lying knee march, one foot at a time, knee stays bent',
        passDose: '3 x 10 each side',
        needs: 'L1',
        earliestWeek: 5,
      },
      {
        code: 'L3',
        exercise:
          'Single straight-leg lowering from 30 degrees, other knee bent',
        passDose: '3 x 8 each side',
        needs: 'L2',
        earliestWeek: 8,
      },
      {
        code: 'L4',
        exercise: 'Double knee raise to table-top, slow lower, knees bent',
        passDose: '3 x 8',
        needs: 'L3',
        earliestWeek: 12,
      },
      {
        code: 'L5',
        exercise: 'Double leg lowering with soft knees from 60 degrees',
        passDose: '3 x 8',
        needs: 'L4',
        earliestWeek: 17,
      },
      {
        code: 'L6',
        exercise: 'Lying straight leg raise, both legs, slow lowering',
        passDose: '3 x 10',
        needs: 'L5',
        earliestWeek: 24,
      },
    ],
  },
  {
    prefix: 'H',
    name: 'Hanging leg raises',
    usedIn: 'Pull days from Phase 2 onward.',
    rungs: [
      {
        code: 'H0',
        exercise: 'Dead hang, shoulders pulled down',
        passDose: '3 x 45 s',
        needs: 'None',
        earliestWeek: 1,
      },
      {
        code: 'H1',
        exercise: 'Hang with knees lifted slightly, held',
        passDose: '3 x 10 s',
        needs: 'L2',
        earliestWeek: 6,
      },
      {
        code: 'H2',
        exercise: 'Hanging knee raise, small range, to waist level',
        passDose: '3 x 6',
        needs: 'L3',
        earliestWeek: 10,
      },
      {
        code: 'H3',
        exercise: 'Hanging knee raise to hip height, no swing',
        passDose: '3 x 8',
        needs: 'L4',
        earliestWeek: 14,
      },
      {
        code: 'H4',
        exercise: 'Hanging knee raise to chest',
        passDose: '3 x 10',
        needs: 'L5',
        earliestWeek: 20,
      },
      {
        code: 'H5',
        exercise: 'Hanging raise, one leg straight, one bent',
        passDose: '3 x 6 each side',
        needs: 'L5',
        earliestWeek: 27,
      },
      {
        code: 'H6',
        exercise: 'Hanging straight leg raise, to 90 degrees',
        passDose: '3 x 5',
        needs: 'L6 and R5',
        earliestWeek: 34,
      },
      {
        code: 'H7',
        exercise: 'Toes to bar',
        passDose: '3 x 5',
        needs: 'H6',
        earliestWeek: 44,
      },
    ],
  },
  {
    prefix: 'S',
    name: 'L-sit',
    usedIn: 'Push days: the support hold and L-sit slots.',
    rungs: [
      {
        code: 'S0',
        exercise: 'Support hold on bars, legs relaxed',
        passDose: '3 x 30 s',
        needs: 'None',
        earliestWeek: 1,
      },
      {
        code: 'S1',
        exercise: 'Support hold, feet just off the floor, knees bent',
        passDose: '3 x 10 s',
        needs: 'L3',
        earliestWeek: 10,
      },
      {
        code: 'S2',
        exercise: 'Tuck L-sit on parallettes or bars',
        passDose: '3 x 10 s',
        needs: 'L4 and H2',
        earliestWeek: 17,
      },
      {
        code: 'S3',
        exercise: 'Tuck L-sit with one leg extended',
        passDose: '3 x 8 s each side',
        needs: 'L5 and R4',
        earliestWeek: 30,
      },
      {
        code: 'S4',
        exercise: 'Full L-sit',
        passDose: '3 x 10 s',
        needs: 'L6 and R5',
        earliestWeek: 40,
      },
      {
        code: 'S5',
        exercise: 'V-sit progressions',
        passDose: '5 x 10 s',
        needs: 'S4',
        earliestWeek: 'Year 2',
      },
    ],
  },
  {
    prefix: 'R',
    name: 'Hinge and hamstring work',
    usedIn: 'Legs days: the hinge slot on C and F.',
    rungs: [
      {
        code: 'R0',
        exercise: 'Glute bridge, then single-leg glute bridge',
        passDose: '3 x 12 each side',
        needs: 'None',
        earliestWeek: 1,
      },
      {
        code: 'R1',
        exercise: 'Wall hinge: bottom back to a wall, knees soft, back neutral',
        passDose: '3 x 10',
        needs: 'R0',
        earliestWeek: 8,
      },
      {
        code: 'R2',
        exercise: 'Kickstand RDL, short range to knee height',
        passDose: '3 x 8 each side',
        needs: 'R1',
        earliestWeek: 14,
      },
      {
        code: 'R3',
        exercise: 'Bodyweight RDL to mid-shin',
        passDose: '3 x 10',
        needs: 'R2',
        earliestWeek: 20,
      },
      {
        code: 'R4',
        exercise: 'Single-leg RDL to mid-shin',
        passDose: '3 x 8 each side',
        needs: 'R3',
        earliestWeek: 26,
      },
      {
        code: 'R5',
        exercise:
          'Standing hamstring stretch, heel on a low step, neutral spine',
        passDose: '3 x 20 s each side',
        needs: 'R4',
        earliestWeek: 28,
      },
      {
        code: 'R6',
        exercise: 'Seated forward fold, knees bent over a bolster',
        passDose: '3 x 30 s',
        needs: 'R5',
        earliestWeek: 36,
      },
      {
        code: 'R7',
        exercise: 'Pike and toe touch to the floor',
        passDose: '3 x 30 s',
        needs: 'R6',
        earliestWeek: 'Year 2',
      },
    ],
  },
];
