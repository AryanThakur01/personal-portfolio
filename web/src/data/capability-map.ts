export interface Capability {
  n: string;
  title: string;
  items: string[];
  demoLabel: string;
  href: string;
}

export const CAPABILITIES: Capability[] = [
  {
    n: '00',
    title: 'Coming Soon',
    items: [
      "I'm building out this section with detailed case studies of systems I've designed and implemented.",
      'Each case study will break down the problem space, design tradeoffs, and implementation details of a specific system or project.',
      'The goal is to move beyond buzzwords and surface the concrete skills and decisions that went into building real-world software.',
    ],
    demoLabel: 'Stay tuned',
    href: '#',
  },
];
