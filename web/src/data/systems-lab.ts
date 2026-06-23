export interface LabProject {
  name: string;
  problem: string;
  pattern: { b: string; rest: string };
  tags: string[];
  live: boolean;
  demo: string;
  repoUrl: string;
}

export const LAB: LabProject[] = [
  {
    name: 'Coming soon',
    problem:
      "I'm building out the first few cards now. Follow along on Twitter for updates, or reach out if you have a mini-system you think would be a good fit for the lab!",
    pattern: {
      b: 'Under Planning',
      rest: ' - stay tuned for the first few cards to go live in the next couple months.',
    },
    tags: ['Planning'],
    live: true,
    demo: '#',
    repoUrl: 'https://www.github.com/AryanThakur01',
  },
];
