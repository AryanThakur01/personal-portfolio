/**
 * Shared types for the 52-week calisthenics program.
 *
 * Content lives in this folder and nothing here reads the DOM or browser
 * storage, so the whole program is editable as plain data. Per-session tick
 * boxes are UI-only state (see components/fitness-routine/hooks.ts).
 */

/** Tone of a row inside a workout table, mirroring the printed program. */
export type RowKind =
  /** Before-workout warm-up and after-workout cool-down. */
  | 'prep'
  /** Trunk work: the core slot. */
  | 'core'
  /** The proper workout, including the intensity block. */
  | 'work';

export interface WorkoutRow {
  /** Exercise name as written in the program. */
  exercise: string;
  /** Sets x reps, or a time / duration. */
  dose: string;
  /** Coaching cue. Optional when the dose says everything. */
  notes?: string;
  kind: RowKind;
  /** True for the timed finisher, which renders with extra emphasis. */
  intensity?: boolean;
  /**
   * Set on rows that run at a ladder rung. The row then shows the rung you are
   * actually on (from CURRENT_RUNGS) rather than making you decode the
   * week-by-week schedule in `notes`.
   */
  ladder?: 'L' | 'H' | 'S' | 'R';
}

/** One of the six workouts in a phase's queue. */
export type WorkoutCode = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface Workout {
  code: WorkoutCode;
  /** e.g. "Pull: Strength" */
  title: string;
  /** Short framing line shown under the title. */
  summary: string;
  rows: WorkoutRow[];
}

export type PhaseId = 1 | 2 | 3 | 4;

/** A single pass/fail item inside a gate test. */
export interface GateTest {
  /** Stable key used by the progress config to record a result. */
  id: string;
  test: string;
  how: string;
  /** Exactly one number or hold. The program deliberately avoids ranges. */
  passMark: string;
}

export type GateArea = 'pull' | 'push' | 'legs';

export interface GateGroup {
  area: GateArea;
  label: string;
  tests: GateTest[];
}

export interface GateDecision {
  condition: string;
  outcome: string;
}

export interface Gate {
  /** Week the test is run in. */
  week: number;
  title: string;
  /** How to spread the test across the test week. */
  how: string;
  groups: GateGroup[];
  decisions: GateDecision[];
}

export interface Phase {
  id: PhaseId;
  /** e.g. "Foundation" */
  name: string;
  startWeek: number;
  endWeek: number;
  goal: string;
  /** Skills trained during the phase. */
  skills: string[];
  /** One-line summary of the gate, for the phase cards. */
  gateSummary: string;
  workouts: Workout[];
  gate: Gate;
}

/** A rung on one of the four progression ladders. */
export interface LadderRung {
  /** e.g. "L3" */
  code: string;
  exercise: string;
  /** Dose that counts as owning the rung. */
  passDose: string;
  /** Rungs that must be owned first. */
  needs: string;
  /** Earliest week the rung can start. Not a deadline. */
  earliestWeek: number | 'Year 2';
}

export interface Ladder {
  /** e.g. "L" */
  prefix: string;
  name: string;
  /** Where the ladder is used in the workouts. */
  usedIn: string;
  rungs: LadderRung[];
}

export type WeekType =
  | 'Build'
  | 'Peak'
  | 'Deload'
  | 'Deload + Test'
  | 'Taper'
  | 'Final test';

export interface WeekEntry {
  week: number;
  phase: PhaseId;
  type: WeekType;
  /** Focus and target for the week. */
  focus: string;
}

export interface SkillEstimate {
  skill: string;
  prerequisites: string;
  typicalTime: string;
  /** Target window in program weeks. */
  window: string;
}

export interface SkillLadder {
  skill: string;
  /** Ordered steps from easiest to hardest. */
  steps: string[];
  /** What you need to hit before moving up a step. */
  target: string;
}
