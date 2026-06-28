export interface Role {
  company: string;
  location: string;
  badge: 'CURRENT'|null;
  role: string;
  period: string;
  duration: string;
  bullets: string[];
  stack: string[];
  caseStudy: boolean;
}

const calculateDuration = (start: string, end: string): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffInMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                       (endDate.getMonth() - startDate.getMonth() + 1);
  const years = Math.floor(diffInMonths / 12);
  const months = diffInMonths % 12;
  return `${years > 0 ? years + 'Y ' : ''}${months > 0 ? months + 'M' : ''}`
      .trim();
};

export const ROLES: Role[] = [
  {
    company : 'Blinker Technology',
    location : 'Hong Kong · Remote',
    badge : 'CURRENT',
    role : 'Software Engineer',
    period : 'Jun 2024 — Present',
    duration : calculateDuration(
        '2024-06',
        new Date().toISOString().slice(0, 7),
        ),
    bullets : [
      'Owned end-to-end development of key features in a production KaiOS app.',
      'Built microservice-oriented backend systems using Node.js and AWS Lambda. Modular, scalable, maintainable.',
      'Implemented real-time data workflows and optimised system performance under high traffic.',
      'Managed multi-environment AWS infrastructure (Dev/Staging/Prod) with CI/CD pipelines and monitoring.',
    ],
    stack : [ 'KAIOS', 'NODE', 'AWS', 'LAMBDA', 'CI/CD' ],
    caseStudy : false,
  },
  {
    company : 'Devneural Solutions',
    location : 'Delhi, India · Remote',
    badge : null,
    role : 'Full-Stack Developer',
    period : 'Apr 2024 — May 2024',
    duration : calculateDuration('2024-04', '2024-05'),
    bullets : [
      'Owned end-to-end development of a Next.js + Supabase application with secure REST APIs and modular backend architecture.',
      'Designed PostgreSQL schemas, SQL functions, and triggers to encapsulate business logic and ensure data integrity.',
      'Implemented authentication, authorisation, and third-party API integrations.',
      'Built automated cron workflows to streamline backend processes and improve operational efficiency.',
    ],
    stack : [ 'NEXT.JS', 'SUPABASE', 'POSTGRES', 'REST' ],
    caseStudy : false,
  },
  {
    company : 'Freelance',
    location : 'Remote',
    badge : null,
    role : 'Full-Stack Developer',
    period : 'Oct 2023 — Mar 2024',
    duration : calculateDuration('2023-10', '2024-03'),
    bullets : [
      'Developed and maintained Shopify applications with backend integration and REST APIs.',
      'Implemented web analytics tracking to improve user insights and system performance.',
    ],
    stack : [ 'SHOPIFY', 'AWS', 'LAMBDA', 'S3', 'ML' ],
    caseStudy : false,
  },
  {
    company : 'Arterns Technologies',
    location : 'Dehradun, India · Remote',
    badge : null,
    role : 'Front-End Engineer',
    period : 'Jun 2023 — Sep 2023',
    duration : calculateDuration('2023-06', '2023-09'),
    bullets : [
      'Developed scalable React + TypeScript interfaces with modular component architecture, integrating with backend APIs.',
      'Optimised performance using code-splitting, lazy loading, and efficient state management.',
      'Collaborated cross-functionally to deliver responsive, accessible UI systems aligned with backend services.',
    ],
    stack : [ 'REACT', 'TYPESCRIPT', 'CSS' ],
    caseStudy : false,
  },
];
