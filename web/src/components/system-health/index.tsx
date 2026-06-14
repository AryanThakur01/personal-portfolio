import { useMemo } from 'react';
import { relTime, useEdgeInfo, usePagePerf } from './hooks';
import { Skeleton } from './primitives';
import { StatCell } from './stat-cell';
import { StatusHeader } from './status-header';

const DESKTOP_CELL =
  'relative min-h-[84px] py-[18px] px-[22px] border-r border-border';
const MOBILE_CELL = 'relative min-h-[84px] px-4 py-4';

export function SystemHealth() {
  const {
    pop,
    latency,
    fromCache,
    loading: edgeLoading,
    isLocal,
  } = useEdgeInfo();
  const { ttfb, loading: perfLoading } = usePagePerf();

  const deployedAt = useMemo(() => {
    const buildTime = import.meta.env.VITE_BUILD_TIME;
    return buildTime
      ? new Date(buildTime).getTime()
      : Date.now() - 1000 * 60 * 27;
  }, []);

  const environment = import.meta.env.VITE_DEPLOY_ENV ?? 'local';
  const gitSha = import.meta.env.VITE_GIT_SHA?.slice(0, 7) ?? '---';
  const deployAgo = relTime(Date.now() - deployedAt);
  const deploySubline = `${gitSha} · ${environment}`;

  const popSegment = isLocal ? (
    'local'
  ) : edgeLoading ? (
    <Skeleton w="w-8" h="h-[9px]" inline />
  ) : (
    (pop ?? '—')
  );

  const headerStats = (
    <>
      {environment}
      {' · '}
      {popSegment}
      {' · '}
      {gitSha}
    </>
  );

  const edgeValue = isLocal ? 'LOCAL' : (pop ?? '-');
  const edgeUnit = !isLocal && latency != null ? `${latency}ms` : undefined;

  const cacheValue = fromCache === null ? '-' : fromCache ? 'HIT' : 'MISS';
  const cacheColor =
    fromCache == null ? 'text-text' : fromCache ? 'text-green' : 'text-amber';
  const cacheSub =
    fromCache === null
      ? '-'
      : fromCache
        ? 'served from edge cache'
        : 'fetched from origin';

  return (
    <div id="status" className="border-y border-border bg-bg-card">
      {/* ── Desktop ── */}
      <div
        className="hidden md:grid border-l border-border"
        style={{ gridTemplateColumns: '240px repeat(4, 1fr)' }}>
        <StatusHeader
          stats={headerStats}
          className={`${DESKTOP_CELL} bg-bg flex flex-col justify-center`}
        />

        <StatCell
          label="EDGE LOCATION"
          loading={edgeLoading}
          value={edgeValue}
          unit={edgeUnit}
          sub={isLocal ? 'dev environment' : 'CloudFront PoP · nearest edge'}
          className={DESKTOP_CELL}
        />

        <StatCell
          label="LAST DEPLOY"
          value={deployAgo}
          sub={deploySubline}
          accentSub
          className={DESKTOP_CELL}
        />

        <StatCell
          label="TTFB"
          loading={perfLoading}
          value={ttfb ?? '—'}
          unit={ttfb != null ? 'ms' : undefined}
          sub="Time to first byte · this visit"
          className={DESKTOP_CELL}
        />

        <StatCell
          label="CACHE"
          loading={edgeLoading}
          value={<span className={cacheColor}>{cacheValue}</span>}
          sub={cacheSub}
          className={DESKTOP_CELL}
        />
      </div>

      {/* ── Mobile ── */}
      <div className="md:hidden">
        <StatusHeader
          stats={headerStats}
          className="bg-bg px-4 py-3.5 border-b border-border flex flex-col gap-1"
        />

        <div className="grid grid-cols-2">
          <StatCell
            label="EDGE LOCATION"
            loading={edgeLoading}
            value={edgeValue}
            unit={edgeUnit}
            sub={isLocal ? 'dev environment' : 'CloudFront PoP'}
            className={`${MOBILE_CELL} border-r border-b border-border`}
          />

          <StatCell
            label="LAST DEPLOY"
            value={deployAgo}
            sub={deploySubline}
            accentSub
            className={`${MOBILE_CELL} border-b border-border`}
          />

          <StatCell
            label="TTFB"
            loading={perfLoading}
            value={ttfb ?? '—'}
            unit={ttfb != null ? 'ms' : undefined}
            sub="Time to first byte"
            className={`${MOBILE_CELL} border-r border-border`}
          />

          <StatCell
            label="CACHE"
            loading={edgeLoading}
            value={<span className={cacheColor}>{cacheValue}</span>}
            sub={cacheSub}
            className={MOBILE_CELL}
          />
        </div>
      </div>
    </div>
  );
}
