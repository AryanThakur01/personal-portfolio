/**
 * Everything derived from the start date and the progress config.
 *
 * Pure functions only: `now` is always passed in so the whole thing is
 * predictable and the UI can re-derive on a tick.
 *
 * Program weeks run Monday to Sunday, aligned to the Monday of the week the
 * program started in, because the weekly split is keyed to weekdays.
 */

import { GATES, PROGRAM_START, WEEKLY_SCHEDULE } from './progress';
import { PHASES } from './phases';
import { WEEKS } from './weeks';
import type { GateArea, Phase, PhaseId, WeekEntry, WorkoutCode } from './types';

const MS_PER_DAY = 86_400_000;
export const TOTAL_WEEKS = 52;

/** Monday first, matching how the week reads on the page. */
export const WEEKDAY_NAMES = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
] as const;

/** Parses 'YYYY-MM-DD' as a local date, so no timezone drift creeps in. */
export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Midnight local time, so day counting is not thrown off by the clock time. */
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** The Monday on or before `date`. */
function mondayOf(date: Date): Date {
  const d = startOfDay(date);
  // getDay() is 0 for Sunday, so Sunday counts back a full six days.
  const shift = (d.getDay() + 6) % 7;
  return new Date(d.getTime() - shift * MS_PER_DAY);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Monday of Week 1: the Monday of the week the program started in. */
function week1Monday(): Date {
  return mondayOf(parseDate(PROGRAM_START));
}

/** Day 1 is the start date itself. */
export function dayNumber(now: Date): number {
  const diff =
    startOfDay(now).getTime() - startOfDay(parseDate(PROGRAM_START)).getTime();
  return Math.floor(diff / MS_PER_DAY) + 1;
}

/** The Monday a given program week starts on. */
export function weekStartDate(week: number): Date {
  return new Date(week1Monday().getTime() + (week - 1) * 7 * MS_PER_DAY);
}

/** The Sunday a given program week ends on. */
export function weekEndDate(week: number): Date {
  return new Date(weekStartDate(week).getTime() + 6 * MS_PER_DAY);
}

/** Monday = 1 through Sunday = 7. */
export function weekdayIndex(now: Date): number {
  return ((now.getDay() + 6) % 7) + 1;
}

/** The scheduled session for a date, or 'rest'. */
export function scheduledFor(now: Date): WorkoutCode | 'rest' {
  return WEEKLY_SCHEDULE[now.getDay()] ?? 'rest';
}

export interface ProgramState {
  /** 1-based day since the start date. Negative before the start. */
  day: number;
  /** 1-based program week, Monday aligned, clamped into 1 to 52. */
  week: number;
  /** Monday = 1 through Sunday = 7. */
  dayOfWeek: number;
  /** 'Mon' … 'Sun'. */
  weekdayName: string;
  /** The session the weekly split puts on today, or 'rest'. */
  scheduled: WorkoutCode | 'rest';
  /** True once week 52 is behind us. */
  complete: boolean;
  /** True before the start date. */
  notStarted: boolean;
  phase: Phase;
  weekEntry: WeekEntry;
  /** 0 to 1 through the whole 52 weeks. */
  yearProgress: number;
  /** 0 to 1 through the current phase. */
  phaseProgress: number;
  /** Whole weeks left before this phase's gate test week. */
  weeksToGate: number;
  /** Days left before the gate test week starts. */
  daysToGate: number;
  /** Which phase each area is training, once gates have been passed. */
  areaPhase: Record<GateArea, PhaseId>;
}

const AREAS: GateArea[] = ['pull', 'push', 'legs'];

/**
 * The phase an area trains: it steps forward one phase per consecutively
 * passed gate, so one slipped area does not hold the others back.
 */
export function areaPhaseIds(): Record<GateArea, PhaseId> {
  const out = {} as Record<GateArea, PhaseId>;

  for (const area of AREAS) {
    let phase: PhaseId = 1;
    while (phase < 4 && GATES[phase][area].status === 'passed') {
      phase = (phase + 1) as PhaseId;
    }
    out[area] = phase;
  }

  return out;
}

export function phaseForWeek(week: number): Phase {
  const clamped = Math.min(Math.max(week, 1), TOTAL_WEEKS);
  return (
    PHASES.find((p) => clamped >= p.startWeek && clamped <= p.endWeek) ??
    PHASES[0]
  );
}

export function getProgramState(now: Date = new Date()): ProgramState {
  const day = dayNumber(now);

  const weeksSinceStart = Math.floor(
    (mondayOf(now).getTime() - week1Monday().getTime()) / (7 * MS_PER_DAY),
  );
  const rawWeek = weeksSinceStart + 1;
  const week = Math.min(Math.max(rawWeek, 1), TOTAL_WEEKS);

  const phase = phaseForWeek(week);
  const weekEntry = WEEKS[week - 1];

  const phaseWeeks = phase.endWeek - phase.startWeek + 1;
  const weeksDone = week - phase.startWeek;

  const gateWeekStart = weekStartDate(phase.gate.week);
  const daysToGate = Math.ceil(
    (gateWeekStart.getTime() - startOfDay(now).getTime()) / MS_PER_DAY,
  );

  const dayOfWeek = weekdayIndex(now);

  return {
    day,
    week,
    dayOfWeek,
    weekdayName: WEEKDAY_NAMES[dayOfWeek - 1],
    scheduled: scheduledFor(now),
    complete: rawWeek > TOTAL_WEEKS,
    notStarted: day < 1,
    phase,
    weekEntry,
    yearProgress: Math.min(Math.max(week / TOTAL_WEEKS, 0), 1),
    phaseProgress: Math.min(Math.max(weeksDone / phaseWeeks, 0), 1),
    weeksToGate: Math.max(phase.gate.week - week, 0),
    daysToGate: Math.max(daysToGate, 0),
    areaPhase: areaPhaseIds(),
  };
}

/** 'passed' when every area of a phase's gate is passed. */
export function gateStatus(phaseId: PhaseId): 'passed' | 'partial' | 'pending' {
  const areas = AREAS.map((a) => GATES[phaseId][a].status);
  if (areas.every((s) => s === 'passed')) return 'passed';
  if (areas.some((s) => s === 'passed')) return 'partial';
  return 'pending';
}

/** Where a phase sits relative to today: done, running, or still ahead. */
export function phaseState(
  phase: Phase,
  state: ProgramState,
): 'done' | 'active' | 'upcoming' {
  if (gateStatus(phase.id) === 'passed') return 'done';
  if (state.week > phase.endWeek) return 'done';
  if (state.week >= phase.startWeek) return 'active';
  return 'upcoming';
}

/** Which area each workout trains, so a split gate routes it to its phase. */
export const AREA_OF_WORKOUT: Record<WorkoutCode, GateArea> = {
  A: 'pull',
  D: 'pull',
  B: 'push',
  E: 'push',
  C: 'legs',
  F: 'legs',
};

/**
 * The phase a given workout should be run at.
 *
 * Normally this is the current phase, but once an area passes its gate ahead
 * of the others that area trains the next phase's version of the workout.
 */
export function phaseForWorkout(code: WorkoutCode, state: ProgramState): Phase {
  const id = state.areaPhase[AREA_OF_WORKOUT[code]];
  return PHASES.find((p) => p.id === id) ?? state.phase;
}
