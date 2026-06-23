import { SectionHeader } from './ui/section-header';

const ROLES = [
  {
    company: 'Blinker Technology',
    location: 'Hong Kong · Remote',
    badge: 'CURRENT' as const,
    role: 'Software Engineer',
    period: 'Jun 2024 — Present',
    duration: '2Y',
    bullets: [
      'Owned end-to-end development of key features in a production KaiOS app serving 200K+ users, contributing to $1.5M funding.',
      'Built microservice-oriented backend systems using Node.js and AWS Lambda — modular, scalable, maintainable.',
      'Implemented real-time data workflows and optimised system performance under high traffic.',
      'Managed multi-environment AWS infrastructure (Dev/Staging/Prod) with CI/CD pipelines and monitoring.',
    ],
    stack: ['KAIOS', 'NODE', 'AWS', 'LAMBDA', 'CI/CD'],
    caseStudy: false,
  },
  {
    company: 'Devneural Solutions',
    location: 'Delhi, India · Remote',
    badge: null,
    role: 'Full-Stack Developer',
    period: 'Jan 2024 — May 2024',
    duration: '5M',
    bullets: [
      'Owned end-to-end development of a Next.js + Supabase application with secure REST APIs and modular backend architecture.',
      'Designed PostgreSQL schemas, SQL functions, and triggers to encapsulate business logic and ensure data integrity.',
      'Implemented authentication, authorisation, and third-party API integrations.',
      'Built automated cron workflows to streamline backend processes and improve operational efficiency.',
    ],
    stack: ['NEXT.JS', 'SUPABASE', 'POSTGRES', 'REST'],
    caseStudy: false,
  },
  {
    company: 'Freelance / Contract',
    location: 'Remote',
    badge: null,
    role: 'Full-Stack Developer',
    period: 'Jan 2023 — Dec 2024',
    duration: '~2Y',
    bullets: [
      'Developed and maintained Shopify applications with backend integration and REST APIs.',
      'Implemented web analytics tracking to improve user insights and system performance.',
      'Built serverless ML pipelines on AWS (Lambda, S3, API Gateway) for automated data processing.',
    ],
    stack: ['SHOPIFY', 'AWS', 'LAMBDA', 'S3', 'ML'],
    caseStudy: false,
  },
  {
    company: 'Arterns Technologies',
    location: 'Dehradun, India · Remote',
    badge: null,
    role: 'Front-End Engineer',
    period: 'Jun 2023 — Dec 2023',
    duration: '7M',
    bullets: [
      'Developed scalable React + TypeScript interfaces with modular component architecture, integrating with backend APIs.',
      'Optimised performance using code-splitting, lazy loading, and efficient state management.',
      'Collaborated cross-functionally to deliver responsive, accessible UI systems aligned with backend services.',
    ],
    stack: ['REACT', 'TYPESCRIPT', 'CSS'],
    caseStudy: false,
  },
];

const DOT_TOP = 36;
const DOT_SIZE = 10;

export function Experience() {
  return (
    <section id="experience" className="border-t border-border py-16 sm:py-24">
      <div className="max-w-[1240px] mx-auto px-[22px] sm:px-8">
        <SectionHeader
          eyebrow="07 / EXPERIENCE"
          title="The full track record."
        />

        <div className="border border-border">
          {ROLES.map((r, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 sm:grid-cols-[220px_1fr_auto] ${i !== 0 ? 'border-t border-border' : ''}`}>
              {/* Date column */}
              <div className="hidden sm:flex flex-col justify-center px-6 py-6">
                <span className="font-mono text-[12px] text-text-2 tracking-[-0.01em] leading-[1.5]">
                  {r.period}
                </span>
                <span className="font-mono text-[10px] text-text-3 mt-[5px] tracking-[0.06em]">
                  {r.duration}
                </span>
                <span className="font-mono text-[10px] text-text-3 mt-[4px] tracking-[0.04em]">
                  {r.location}
                </span>
              </div>

              {/* Content area — timeline track + text */}
              <div className="flex min-w-0">
                {/* Timeline track */}
                <div
                  className="hidden sm:flex self-stretch relative flex-shrink-0"
                  style={{ width: 52 }}>
                  <div
                    className="absolute"
                    style={{
                      left: '50%',
                      transform: 'translateX(-50%)',
                      top: DOT_TOP + DOT_SIZE / 2,
                      bottom: 0,
                      width: 1,
                      background: '#333',
                    }}
                  />
                  <div
                    className="absolute"
                    style={{
                      left: '50%',
                      top: DOT_TOP - DOT_SIZE / 2,
                      transform: 'translateX(-50%)',
                      width: DOT_SIZE,
                      height: DOT_SIZE,
                      borderRadius: '50%',
                      zIndex: 1,
                      ...(r.badge === 'CURRENT'
                        ? {
                            background: '#22c55e',
                            boxShadow: '0 0 0 4px rgba(34,197,94,0.15)',
                          }
                        : {
                            background: '#111',
                            border: '1.5px solid #3a3a3a',
                          }),
                    }}
                  />
                </div>

                {/* Text content */}
                <div className="flex-1 py-5 sm:py-6 px-5 sm:pl-2 sm:pr-7 flex flex-col gap-[10px] min-w-0">
                  {/* Mobile: dot + date + location */}
                  <div className="flex items-center gap-2 sm:hidden">
                    <span
                      className={`w-[7px] h-[7px] rounded-full flex-shrink-0 ${
                        r.badge === 'CURRENT' ? 'bg-green' : 'bg-[#333]'
                      }`}
                    />
                    <span className="font-mono text-[11px] text-text-3 tracking-[0.06em]">
                      {r.period} · {r.duration}
                    </span>
                  </div>

                  {/* Company + badge */}
                  <div className="flex items-center gap-[10px] flex-wrap">
                    <h3 className="font-mono font-medium text-[17px] tracking-[-0.01em] text-text m-0">
                      {r.company}
                    </h3>
                    {r.badge && (
                      <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-green border border-green/30 px-[7px] py-[3px]">
                        {r.badge}
                      </span>
                    )}
                  </div>

                  <p className="font-mono text-[12px] text-text-3 tracking-[0.04em] m-0">
                    {r.role}
                  </p>

                  {/* Bullet points */}
                  <ul className="m-0 p-0 list-none flex flex-col gap-[8px]">
                    {r.bullets.map((b, j) => (
                      <li
                        key={j}
                        className="text-[13px] text-text-2 leading-[1.6] pl-[16px] relative">
                        <span className="absolute left-0 top-[1px] text-text-4 font-mono text-[10px]">
                          ◦
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-[6px] pt-[2px]">
                    {r.stack.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] tracking-[0.1em] uppercase text-text-3 border border-border px-[8px] py-[4px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Case study button */}
              {r.caseStudy && (
                <div className="hidden sm:flex items-center justify-end px-6 border-l border-border">
                  <a
                    href="#work"
                    className="font-mono text-[11px] tracking-[0.1em] uppercase text-text-3 border border-border px-[10px] py-[6px] whitespace-nowrap hover:border-border-hover hover:text-text-2 transition-colors">
                    ↑ case study
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
