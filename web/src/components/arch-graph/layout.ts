import Dagre from '@dagrejs/dagre';
import { NODES, EDGES } from './data';

// ── Dagre layout ──────────────────────────────────────────────────────────────

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
g.setGraph({ rankdir: 'LR', nodesep: 60, ranksep: 100, marginx: 30, marginy: 30 });
NODES.forEach((n) => g.setNode(n.id, { width: n.w, height: n.h }));
EDGES.forEach(([source, target]) => g.setEdge(source, target));
Dagre.layout(g);

export const POSITIONS: Record<string, { x: number; y: number }> = Object.fromEntries(
  NODES.map((n) => {
    const { x, y } = g.node(n.id);
    return [n.id, { x: x - n.w / 2, y: y - n.h / 2 }];
  }),
);

// ── Handle counts ─────────────────────────────────────────────────────────────

export const SOURCE_COUNT: Record<string, number> = {};
export const TARGET_COUNT: Record<string, number> = {};

EDGES.forEach(([source, target]) => {
  SOURCE_COUNT[source] = (SOURCE_COUNT[source] ?? 0) + 1;
  TARGET_COUNT[target] = (TARGET_COUNT[target] ?? 0) + 1;
});

// ── Handle assignments per edge ───────────────────────────────────────────────
// Sorted by target/source y-position so the top handle routes to the topmost
// neighbour — edges fan out naturally without crossing each other.

export interface EdgeHandles {
  sourceHandle: string;
  targetHandle: string;
}

function assignHandles(): EdgeHandles[] {
  const result: EdgeHandles[] = Array.from({ length: EDGES.length }, () => ({
    sourceHandle: 's-0',
    targetHandle: 't-0',
  }));

  // Source side: group by source node, sort by target y, assign s-0, s-1, …
  const bySrc: Record<string, { edgeIdx: number; targetY: number }[]> = {};
  EDGES.forEach(([source, target], i) => {
    (bySrc[source] ??= []).push({ edgeIdx: i, targetY: POSITIONS[target]?.y ?? 0 });
  });
  Object.values(bySrc).forEach((group) => {
    group.sort((a, b) => a.targetY - b.targetY);
    group.forEach(({ edgeIdx }, hi) => { result[edgeIdx].sourceHandle = `s-${hi}`; });
  });

  // Target side: group by target node, sort by source y, assign t-0, t-1, …
  const byTgt: Record<string, { edgeIdx: number; sourceY: number }[]> = {};
  EDGES.forEach(([source, target], i) => {
    (byTgt[target] ??= []).push({ edgeIdx: i, sourceY: POSITIONS[source]?.y ?? 0 });
  });
  Object.values(byTgt).forEach((group) => {
    group.sort((a, b) => a.sourceY - b.sourceY);
    group.forEach(({ edgeIdx }, hi) => { result[edgeIdx].targetHandle = `t-${hi}`; });
  });

  return result;
}

export const EDGE_HANDLES = assignHandles();
