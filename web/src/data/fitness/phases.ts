/** The four phases in order. */

import { PHASE_1 } from './phase-1';
import { PHASE_2 } from './phase-2';
import { PHASE_3 } from './phase-3';
import { PHASE_4 } from './phase-4';
import type { Phase, PhaseId } from './types';

export const PHASES: Phase[] = [PHASE_1, PHASE_2, PHASE_3, PHASE_4];

export function phaseById(id: PhaseId): Phase {
  return PHASES.find((p) => p.id === id) ?? PHASE_1;
}
