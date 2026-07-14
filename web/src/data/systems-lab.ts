import { WEBSITE_URL } from '../constants';

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
    name: 'Notification Fan-out Engine',
    problem:
      'A webhook fan-out delivery system with at-least-once guarantees: one dispatch ' +
      'explodes into N deliveries through SQS, processed by Lambda, with automatic ' +
      'retries and a dead-letter queue for messages that keep failing. Point it at a ' +
      'webhook.site URL and watch deliveries, retries, and backoff happen live.',
    pattern: {
      b: 'Live',
      rest: ' — dispatch a fan-out, inject failures, and watch retries and dead-lettering happen live.',
    },
    tags: ['SQS', 'Lambda', 'DynamoDB', 'At-least-once'],
    live: true,
    demo: `${WEBSITE_URL}/notification-fan-out-engine`,
    repoUrl: 'https://github.com/AryanThakur01',
  },
];
