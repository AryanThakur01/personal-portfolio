type NodeBounds = { x: number; y: number; w: number; h: number };

export function edgePath(a: NodeBounds, b: NodeBounds): string {
  const ax = a.x + a.w / 2, ay = a.y + a.h / 2;
  const bx = b.x + b.w / 2, by = b.y + b.h / 2;
  const midX = (ax + bx) / 2;
  return `M ${ax} ${ay} L ${midX} ${ay} L ${midX} ${by} L ${bx} ${by}`;
}

export function isLatencyMetric(key: string): boolean {
  const k = key.toLowerCase();
  return k.includes('start') || k.includes('p9') || k.includes('ttfb') || k.includes('lag');
}
