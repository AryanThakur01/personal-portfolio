export interface CaseStudy {
  company: string;
  role: string;
  period: string;
  title: string;
  problem: string;
  outcomes: [string, string][];
  decisions: string[];
  tenx: string;
  diagram: string;
}

export const CASES: CaseStudy[] = [
  {
    company: 'Company Coming soon',
    role: 'Role Coming soon',
    period: '2023 — 2025',
    title: 'Title Coming soon',
    problem: 'Coming soon - check back soon for updates.',
    outcomes: [['18×', 'FASTER']],
    decisions: [
      'If this were a real case study, these would be the key architectural decisions I made to solve the problem.',
      'Each one would be a concise statement of the decision, not the rationale or implementation details.',
      'The rationale and implementation details would be in the system diagram and the accompanying text, respectively.',
    ],
    tenx: 'This is a placeholder case study. Check back soon for updates.',
    diagram: `flowchart LR
  A[API GW] --> B[SQS]
  B --> C[λ validate]
  B --> D[λ enrich]
  B --> E[λ adjudicate]
  B --> F[λ payout]
  C --> G[Aurora]
  E --> H[DLQ]`,
  },
];
