import { cn } from '../../utils';
import { SectionHeader } from '../ui/section-header';
import {
  useNotificationStats,
  PLACEHOLDER_STATS,
  type NotificationPriorityKey,
  type NotificationStatsResponse,
  type QueueStats,
} from '../../hooks/apis/use-notification-stats';

// Display order (most severe first) + severity dot color per priority.
const PRIORITY_META: Record<
  NotificationPriorityKey,
  { label: string; dot: string }
> = {
  high: { label: 'High', dot: 'bg-red' },
  medium: { label: 'Medium', dot: 'bg-amber' },
  low: { label: 'Low', dot: 'bg-green' },
};

const PRIORITY_ORDER: NotificationPriorityKey[] = ['high', 'medium', 'low'];

// The four metrics inside each priority lane, in display order.
const METRICS: { key: keyof QueueStats; label: string }[] = [
  { key: 'backlog', label: 'Backlog' },
  { key: 'inFlight', label: 'In-Flight' },
  { key: 'delayed', label: 'Delayed' },
  { key: 'dlqSize', label: 'DLQ Size' },
];

function LaneCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-border bg-bg-card overflow-hidden">
      {children}
    </div>
  );
}

function MetricCell({
  label,
  value,
  danger,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className="bg-bg-card p-5">
      <div className="mb-2 font-mono text-[10px] uppercase leading-none tracking-[0.14em] text-text-3">
        {label}
      </div>
      <div
        className={cn(
          'font-mono text-[22px] leading-none tracking-[-0.02em]',
          danger ? 'text-red' : 'text-accent',
        )}>
        {value}
      </div>
    </div>
  );
}

function StatsGrid({ stats }: { stats: NotificationStatsResponse }) {
  return (
    <div className="flex flex-col gap-3">
      {PRIORITY_ORDER.map((priority) => {
        const meta = PRIORITY_META[priority];
        const lane = stats[priority];

        return (
          <LaneCard key={priority}>
            {/* Priority header */}
            <div className="flex items-center gap-[10px] border-b border-border bg-bg-elev px-[18px] py-3">
              <span className={cn('h-2 w-2 shrink-0 rounded-full', meta.dot)} />
              <span className="font-mono text-[12px] uppercase leading-none tracking-[0.14em] text-text">
                {meta.label}
              </span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
              {METRICS.map((metric) => (
                <MetricCell
                  key={metric.key}
                  label={metric.label}
                  value={lane[metric.key]}
                  danger={metric.key === 'dlqSize' && lane[metric.key] > 0}
                />
              ))}
            </div>
          </LaneCard>
        );
      })}
    </div>
  );
}

// Mirrors StatsGrid's markup exactly so swapping to real data causes no shift.
function StatsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {PRIORITY_ORDER.map((priority) => (
        <LaneCard key={priority}>
          {/* Priority header */}
          <div className="flex items-center gap-[10px] border-b border-border bg-bg-elev px-[18px] py-3">
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-bg-elev-2" />
            <span className="h-[12px] w-16 animate-pulse rounded bg-bg-elev-2" />
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
            {METRICS.map((metric) => (
              <div key={metric.key} className="bg-bg-card p-5">
                <div className="mb-2 h-[10px] w-16 animate-pulse rounded bg-bg-elev" />
                <div className="h-[22px] w-14 animate-pulse rounded bg-bg-elev" />
              </div>
            ))}
          </div>
        </LaneCard>
      ))}
    </div>
  );
}

export function NotificationStats() {
  const { data, isLoading } = useNotificationStats();

  return (
    <section className="border-t border-border pt-12 pb-16 sm:pb-24">
      <div className="max-w-[1240px] mx-auto px-[22px] sm:px-8">
        <SectionHeader eyebrow="METRICS" title="Queue depth by priority." />

        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <StatsGrid stats={data ?? PLACEHOLDER_STATS} />
        )}
      </div>
    </section>
  );
}
