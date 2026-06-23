export interface Role {
  company: string;
  location: string;
  badge: 'CURRENT' | null;
  role: string;
  period: string;
  duration: string;
  bullets: string[];
  stack: string[];
  caseStudy: boolean;
}

export const ROLES: Role[] = [
  {
    company: 'Blinker Technology',
    location: 'Hong Kong · Remote',
    badge: 'CURRENT',
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
