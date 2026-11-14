/**
 * Reusable warm-up and cool-down blocks.
 *
 * Every workout is written out start to finish, so these rows repeat across all
 * 24 workouts. They are composed here rather than duplicated so a change to the
 * warm-up lands in every workout at once.
 */

import type { WorkoutRow } from './types';

const prep = (exercise: string, dose: string, notes?: string): WorkoutRow => ({
  exercise,
  dose,
  notes,
  kind: 'prep',
});

/** Rows 1 to 3: the same opener on every single workout. */
const OPENER: WorkoutRow[] = [
  prep(
    'Lie face down and relax, then prone on elbows',
    '2 min',
    'Let the hips sink. Skip the elbows if it does not feel easing.',
  ),
  prep(
    'Prone press-ups',
    '10 reps, 2 s hold at top',
    'Hips stay on the floor. Go as high as feels comfortable.',
  ),
  prep('Easy march on the spot', '1 min', 'Easy pace. Stop if anything hurts.'),
];

const SHOULDER_PREP: WorkoutRow[] = [
  prep(
    'Arm circles and band shoulder dislocates',
    '1 min',
    'Slow, pain-free range.',
  ),
  prep(
    'Wrist prep: circles, palms-down rocks, fingers-back rocks',
    '2 min',
    'Never skip.',
  ),
];

const BAND_AND_BIRD_DOG: WorkoutRow[] = [
  prep('Band pull-aparts', '15 reps', 'Shoulders down and back.'),
  prep('Bird dog', '5 each side, 5 s hold', 'Back flat like a table.'),
];

/**
 * Warm-up for a pulling day. `firstExercise` is named in the final easy set so
 * the row reads exactly as it does in the program.
 */
export function pullWarmup(firstExercise: string): WorkoutRow[] {
  return [
    ...OPENER,
    ...SHOULDER_PREP,
    prep(
      'Scapular pulls on the bar',
      '10 reps',
      'Hang, pull shoulders down, arms straight.',
    ),
    ...BAND_AND_BIRD_DOG,
    prep(
      `Easy warm-up set: ${firstExercise}`,
      '1 to 2 sets at 50% effort',
      'Smooth and easy, no strain.',
    ),
  ];
}

/** Warm-up for a pushing day. */
export function pushWarmup(firstExercise: string): WorkoutRow[] {
  return [
    ...OPENER,
    ...SHOULDER_PREP,
    prep(
      'Scapular push-ups',
      '10 reps',
      'Arms locked, only the shoulder blades move.',
    ),
    ...BAND_AND_BIRD_DOG,
    prep(
      `Easy warm-up set: ${firstExercise}`,
      '1 to 2 sets at 50% effort',
      'Smooth and easy, no strain.',
    ),
  ];
}

/** Warm-up for a legs day: hips and ankles instead of shoulders and wrists. */
export function legsWarmup(firstExercise: string): WorkoutRow[] {
  return [
    ...OPENER,
    prep('Glute bridge', '10 reps, 2 s hold', 'Ribs down, squeeze glutes.'),
    prep('Bird dog', '6 each side, 5 s hold', 'Back flat like a table.'),
    prep(
      'Dead bug, heel taps, knees bent',
      '6 each side',
      'Slow, back neutral.',
    ),
    prep('Ankle rocks, hands on a wall', '10 each side', 'Heel stays down.'),
    prep(
      `Easy warm-up set: ${firstExercise}`,
      '1 to 2 sets at 50% effort',
      'Smooth and easy, no strain.',
    ),
  ];
}

/** Rows every cool-down opens and closes with. */
const COOLDOWN_OPEN: WorkoutRow[] = [
  prep(
    'Prone press-ups',
    '10 reps, 2 s hold at top',
    'Hips on the floor. This settles the back after training.',
  ),
  prep(
    'Side bends, or side-lying stretch over a pillow',
    '5 each side, 5 s',
    'Start toward the side that feels better.',
  ),
];

const COOLDOWN_CLOSE: WorkoutRow[] = [
  prep('Easy walk', '3 min', 'Easy pace.'),
  prep('Log the session', '1 min', 'Note what you hit and how it felt.'),
];

/** Cool-down after a pulling day. */
export const PULL_COOLDOWN: WorkoutRow[] = [
  ...COOLDOWN_OPEN,
  prep('Doorway chest stretch', '2 x 30 s', 'Elbows at shoulder height.'),
  prep('Forearm and wrist stretch', '30 s each side', 'Palms up, then down.'),
  ...COOLDOWN_CLOSE,
];

/** Cool-down after a pushing day. */
export const PUSH_COOLDOWN: WorkoutRow[] = [
  ...COOLDOWN_OPEN,
  prep('Doorway chest stretch', '2 x 30 s', 'Elbows at shoulder height.'),
  prep(
    'Wrist and forearm stretch',
    '30 s each side',
    'Palms up, then palms down.',
  ),
  prep('Cross-body shoulder stretch', '30 s each side', 'Gentle.'),
  ...COOLDOWN_CLOSE,
];

/** Cool-down after a legs day. */
export const LEGS_COOLDOWN: WorkoutRow[] = [
  ...COOLDOWN_OPEN,
  prep('Calf stretch against a wall', '30 s each leg', 'Heel down.'),
  prep(
    'Standing quad stretch, pelvis neutral',
    '30 s each leg',
    'Knee points down, do not arch the back.',
  ),
  ...COOLDOWN_CLOSE,
];

/** Helper for the darkest-tone rows: the proper workout. */
export const work = (
  exercise: string,
  dose: string,
  notes?: string,
): WorkoutRow => ({ exercise, dose, notes, kind: 'work' });

/** Helper for the core slot. */
export const core = (
  exercise: string,
  dose: string,
  notes?: string,
): WorkoutRow => ({ exercise, dose, notes, kind: 'core' });

/** Core slot running at a ladder rung. */
export const ladderCore = (
  ladder: 'L' | 'H' | 'S' | 'R',
  exercise: string,
  dose: string,
  notes: string,
): WorkoutRow => ({ exercise, dose, notes, kind: 'core', ladder });

/** Helper for the timed finisher. */
export const block = (
  exercise: string,
  dose: string,
  notes: string,
): WorkoutRow => ({ exercise, dose, notes, kind: 'work', intensity: true });
