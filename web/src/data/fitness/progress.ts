/**
 * ============================================================================
 * PROGRESS CONFIG — this is the only file you edit as you train.
 * ============================================================================
 *
 * Everything else in this folder is the program content and stays put. This
 * file is the state: what has been passed, where the ladders are, and what is
 * next in the queue. Edit it, commit, redeploy, and the page updates.
 *
 * HOW TO MARK A GATE TEST PASSED
 *   1. Find the phase below, then the area ('pull', 'push' or 'legs').
 *   2. Set `status: 'passed'` and add `testedOn` as the date you tested.
 *   3. Put the number you actually hit in `results`, keyed by the test id.
 *      Test ids live next to each test in phase-1.ts … phase-4.ts, e.g.
 *      'p1-pull-pullup'. Results are optional: a bare 'passed' is fine.
 *
 *   Example — Phase 1 pull passed:
 *     pull: {
 *       status: 'passed',
 *       testedOn: '2026-12-05',
 *       results: { 'p1-pull-pullup': '2 reps', 'p1-pull-hang': '48 s' },
 *     },
 *
 * HOW TO MOVE A LADDER UP
 *   Change the rung code in CURRENT_RUNGS, e.g. L: 'L3' becomes L: 'L4'.
 *   Only move up once the rung's pass rule is met (see ladders.ts).
 *
 * HOW TO CHANGE THE WEEKLY SPLIT
 *   Edit WEEKLY_SCHEDULE. Today's session is worked out from the weekday, so
 *   nothing here needs touching day to day. To move a single session around,
 *   use the "shift" control on the Today tab instead: that lives in your
 *   browser and clears itself overnight.
 *
 * The phase a given area trains is worked out from these statuses: an area
 * moves on once its gate is passed, so a slipped gate keeps that one area in
 * the earlier phase without moving everything else.
 */

import type { GateArea, PhaseId, WorkoutCode } from './types';

/** Day 1 of Week 1. Everything on the page counts forward from here. */
export const PROGRAM_START = '2026-09-16';

/**
 * The fixed weekly split: legs, pull, push from Monday, twice over, with
 * Sunday off. The strength versions (C, A, B) run Monday to Wednesday and the
 * volume and skill versions (F, D, E) run Thursday to Saturday, which keeps
 * the two pull days and the two push days apart as the program requires.
 *
 * Index 0 is Sunday, matching JavaScript's getDay().
 */
export const WEEKLY_SCHEDULE: readonly (WorkoutCode | 'rest')[] = [
  'rest', // Sunday
  'C', // Monday — legs: Legs and Core
  'A', // Tuesday — pull: Pull Strength
  'B', // Wednesday — push: Push Strength
  'F', // Thursday — legs: Legs 2 and Mobility
  'D', // Friday — pull: Pull Volume and Skill
  'E', // Saturday — push: Push Volume and Skill
];

/** Where each of the four ladders currently sits. */
export const CURRENT_RUNGS: Record<'L' | 'H' | 'S' | 'R', string> = {
  L: 'L3',
  H: 'H1',
  S: 'S0',
  R: 'R1',
};

export type AreaStatus =
  /** Gate passed: this area trains the next phase. */
  | 'passed'
  /** Tested and missed, or holding here on purpose. Retest in 2 to 4 weeks. */
  | 'retesting'
  /** Not tested yet. */
  | 'pending';

export interface AreaProgress {
  status: AreaStatus;
  /** ISO date the test was run. */
  testedOn?: string;
  /** Result per test id, e.g. { 'p1-pull-pullup': '2 reps' }. */
  results?: Record<string, string>;
  /** Optional one-liner shown on the gate card. */
  note?: string;
}

export type GateProgress = Record<GateArea, AreaProgress>;

/**
 * Gate status per phase, per area. Phase 4's gate is the Week 52 final test.
 */
export const GATES: Record<PhaseId, GateProgress> = {
  1: {
    pull: { status: 'pending' },
    push: { status: 'pending' },
    legs: { status: 'pending' },
  },
  2: {
    pull: { status: 'pending' },
    push: { status: 'pending' },
    legs: { status: 'pending' },
  },
  3: {
    pull: { status: 'pending' },
    push: { status: 'pending' },
    legs: { status: 'pending' },
  },
  4: {
    pull: { status: 'pending' },
    push: { status: 'pending' },
    legs: { status: 'pending' },
  },
};

/**
 * Milestones worth showing on the page. Add a line whenever something lands.
 */
export const MILESTONES: { date: string; label: string }[] = [
  { date: PROGRAM_START, label: 'Week 1. Program started.' },
];
