import { useCallback, useEffect, useMemo, useState } from 'react';
import { getProgramState, type ProgramState } from '../../data/fitness';

/** Today as 'YYYY-MM-DD' in local time, used to key a session's tick boxes. */
export function todayKey(now: Date = new Date()): string {
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${m}-${d}`;
}

/**
 * Derives the program state once on mount and again when the tab is brought
 * back into focus, which is enough to roll the day over without a timer.
 */
export function useProgramState(): ProgramState {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const refresh = () => setNow(new Date());
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  return useMemo(() => getProgramState(now), [now]);
}

function readSet(key: string): Set<string> {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.map(String)) : new Set();
  } catch {
    // Private windows and blocked site data both throw here. Ticks are a
    // convenience, so an empty set is a fine answer.
    return new Set();
  }
}

function writeSet(key: string, value: Set<string>): void {
  try {
    window.localStorage.setItem(key, JSON.stringify([...value]));
  } catch {
    // Nothing to do: the page works without persistence.
  }
}

export interface Checklist {
  /** Ids ticked off in this session. */
  done: Set<string>;
  toggle: (id: string) => void;
  clear: () => void;
  /** How many of `total` are ticked. */
  count: number;
}

/**
 * A set of tick boxes persisted per browser under `key`.
 *
 * Session ticks are deliberately local-only: they reset with the key (a new
 * day gets a new key) and never leave the device.
 */
export function useChecklist(key: string): Checklist {
  // Stored alongside its key so a key change (a new day, a different workout)
  // reloads from storage during render rather than in an effect.
  const [state, setState] = useState(() => ({ key, done: readSet(key) }));

  if (state.key !== key) {
    setState({ key, done: readSet(key) });
  }

  const toggle = useCallback((id: string) => {
    setState((prev) => {
      const next = new Set(prev.done);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      writeSet(prev.key, next);
      return { key: prev.key, done: next };
    });
  }, []);

  const clear = useCallback(() => {
    setState((prev) => {
      const empty = new Set<string>();
      writeSet(prev.key, empty);
      return { key: prev.key, done: empty };
    });
  }, []);

  const done = state.key === key ? state.done : new Set<string>();

  return { done, toggle, clear, count: done.size };
}

/** A workout code, 'rest', or null meaning "follow the weekly split". */
export type DayOverride = string | null;

export interface Override {
  /** What today has been shifted to, or null when following the split. */
  value: DayOverride;
  set: (value: DayOverride) => void;
}

/**
 * A one-day override of the weekly split, kept in the browser.
 *
 * Keyed by date, so shifting a session today leaves tomorrow alone and the
 * override disappears by itself overnight. This is what makes moving a day
 * around a click rather than a config change.
 */
export function useDayOverride(day: string = todayKey()): Override {
  const key = `fitness:override:${day}`;
  const [state, setState] = useState(() => ({ key, value: readValue(key) }));

  if (state.key !== key) {
    setState({ key, value: readValue(key) });
  }

  const set = useCallback((value: DayOverride) => {
    setState((prev) => {
      writeValue(prev.key, value);
      return { key: prev.key, value };
    });
  }, []);

  return { value: state.key === key ? state.value : null, set };
}

function readValue(key: string): DayOverride {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeValue(key: string, value: DayOverride): void {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // The page works without persistence.
  }
}
