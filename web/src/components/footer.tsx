import { useMemo } from 'react';
import { relTime, useEdgeInfo } from './system-health/hooks';
import { Skeleton } from './system-health/primitives';

export function Footer() {
  const { pop, loading: edgeLoading, isLocal } = useEdgeInfo();
  const year = new Date().getFullYear();
  const edgeValue = isLocal ? 'LOCAL' : (pop ?? '-');
  const popSegment = isLocal ? (
    'local'
  ) : edgeLoading ? (
    <Skeleton w="w-8" h="h-[9px]" inline />
  ) : (
    (pop ?? '—')
  );
  const gitSha = import.meta.env.VITE_GIT_SHA?.slice(0, 7) ?? '---';
  const deployedAt = useMemo(() => {
    const buildTime = import.meta.env.VITE_BUILD_TIME;
    return buildTime
      ? new Date(buildTime).getTime()
      : Date.now() - 1000 * 60 * 27;
  }, []);
  const deployAgo = relTime(Date.now() - deployedAt);

  return (
    <footer
      id="contact"
      className="border-t border-border"
      style={{ padding: '60px 0 40px', background: '#0a0a0a' }}>
      <div className="max-w-[1240px] mx-auto px-[22px] sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-end">
          {/* Left */}
          <div>
            <div className="eyebrow mb-4">07 / CONTACT</div>
            <h2
              className="font-mono font-medium text-text m-0 mb-[14px]"
              style={{ fontSize: 40, letterSpacing: '-0.02em' }}>
              Let's build something
              <br />
              <span className="text-accent">that survives prod.</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                {
                  label: '✉ aryan197297@gmail.com',
                  href: 'mailto:aryan197297@gmail.com',
                },
                {
                  label: '↗ github.com/AryanThakur01',
                  href: 'https://github.com/AryanThakur01',
                },
                {
                  label: '↗ linkedin.com/in/aryanthakur010',
                  href: 'https://linkedin.com/in/aryanthakur010',
                },
                { label: '↗ /resume.pdf', href: '/resume.pdf' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="no-underline font-mono text-[12px] text-text px-[14px] py-[9px] border border-border-hover rounded-[3px] inline-flex items-center gap-2 hover:border-accent-line hover:text-accent transition-all duration-150">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: build meta */}
          <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-3 flex flex-col gap-1 lg:text-right lg:items-end">
            <span>
              COMMIT <span className="text-accent">{gitSha}</span>
            </span>
            <span>
              DEPLOYED <b className="text-text-2 font-medium">{deployAgo}</b>
            </span>
            <span>
              REGION{' '}
              <b className="text-text-2 font-medium">
                {popSegment} · {edgeValue}
              </b>
            </span>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-5 border-t border-border flex flex-col sm:flex-row justify-between gap-2 font-mono text-[10px] tracking-[0.12em] uppercase text-text-4">
          <span>
            © {year} Aryan Thakur · This site is open source —
            <a
              href="https://github.com/AryanThakur01/personal-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline ml-2">
              view the repo
            </a>
          </span>
          <span>Designed &amp; built · 0 trackers · 0 cookies</span>
        </div>
      </div>
    </footer>
  );
}
