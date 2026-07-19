import { useQuery } from '@tanstack/react-query';
import { _fetch } from '../../utils';

const STATS_PATH = '/notification/stats';

// Queue metrics for a single priority lane.
export interface QueueStats {
  backlog: number;
  inFlight: number;
  delayed: number;
  dlqSize: number;
}

export type NotificationPriorityKey = 'low' | 'medium' | 'high';

// The backend returns one QueueStats block per priority.
export type NotificationStatsResponse = Record<
  NotificationPriorityKey,
  QueueStats
>;

// Zeroed fallback rendered if the request fails (e.g. before the endpoint
// exists); the first successful load is covered by a loading skeleton.
export const PLACEHOLDER_STATS: NotificationStatsResponse = {
  low: { backlog: 0, inFlight: 0, delayed: 0, dlqSize: 0 },
  medium: { backlog: 0, inFlight: 0, delayed: 0, dlqSize: 0 },
  high: { backlog: 0, inFlight: 0, delayed: 0, dlqSize: 0 },
};

// How often to re-poll while work is still draining.
const POLL_INTERVAL_MS = 2000;

// There is still work in flight if any lane has a non-zero backlog, in-flight,
// or delayed count. DLQ size is intentionally ignored — a non-empty dead-letter
// queue is a terminal state, not something that drains on its own.
function hasPendingWork(stats: NotificationStatsResponse): boolean {
  return Object.values(stats).some(
    (lane) => lane.backlog > 0 || lane.inFlight > 0 || lane.delayed > 0,
  );
}

async function fetchNotificationStats(): Promise<NotificationStatsResponse> {
  const res = await _fetch(STATS_PATH);

  if (!res.ok) {
    throw new Error(`Failed to load stats (${res.status})`);
  }

  return res.json();
}

export function useNotificationStats() {
  return useQuery({
    queryKey: ['notification-stats'],
    queryFn: fetchNotificationStats,
    retry: false,
    // Poll while anything is still draining; stop once every lane is idle.
    refetchInterval: (query) =>
      query.state.data && hasPendingWork(query.state.data)
        ? POLL_INTERVAL_MS
        : false,
  });
}
