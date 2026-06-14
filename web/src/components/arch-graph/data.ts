export interface GraphNode {
  id: string;
  w: number;
  h: number;
  kind: string;
  label: string;
  desc: string;
  file?: string;
  color: string;
  [key: string]: unknown;
}

export type EdgeDef = [string, string, string, number];

export const NODES: GraphNode[] = [
  {
    id: 'client',
    w: 130,
    h: 56,
    kind: 'CLIENT',
    label: 'Browser',
    desc: 'Static React 19 client. Hydrated from edge cache. Service worker pre-fetches likely routes.',
    color: '#7dd3fc',
  },
  {
    id: 'cf',
    w: 150,
    h: 56,
    kind: 'EDGE/CDN',
    label: 'CloudFront',
    desc: 'CDN across North America, Europe, and parts of Asia. Serves static assets from S3 over HTTPS with optimized caching.',
    file: 'infra/cloudfront.tf',
    color: '#06b6d4',
  },
  {
    id: 's3',
    w: 150,
    h: 56,
    kind: 'STORAGE',
    label: 'S3 — site assets',
    desc: 'Versioned static bucket. Origin-shielded behind CloudFront, not publicly accessible.',
    file: 'infra/s3.tf',
    color: '#a78bfa',
  },
  // {
  //   id: 'apigw',
  //   w: 150,
  //   h: 56,
  //   kind: 'GATEWAY',
  //   label: 'API Gateway',
  //   desc: 'HTTP API. JWT authorizer. Per-route throttling. WAF rules for OWASP top 10 + bot scoring.',
  //   file: 'infra/apigw.tf',
  //   color: '#06b6d4',
  // },
  // {
  //   id: 'lambda',
  //   w: 150,
  //   h: 56,
  //   kind: 'COMPUTE',
  //   label: 'Lambda — handlers',
  //   desc: '12 functions. arm64. Cold-start under 220ms with snapstart + provisioned concurrency on hot paths.',
  //   file: 'infra/lambda.tf',
  //   color: '#06b6d4',
  // },
  {
    id: 'gha',
    w: 200,
    h: 56,
    kind: 'PIPELINE',
    label: 'GitHub Actions',
    desc: 'Pushes to prod trigger a build and deploy to S3. OIDC to AWS — no long-lived keys stored as secrets.',
    file: '.github/workflows/deploy.yml',
    color: '#a78bfa',
  },
];

export const EDGES: EdgeDef[] = [
  ['client', 'cf',  'HTTPS',   1],
  ['cf',     's3',  'origin',  1],
  ['gha',    's3',  'publish', 1],
  // ['cf',     'apigw',  '/api/*',   1],
  // ['apigw',  'lambda', 'invoke',   1],
  // ['gha',    'lambda', 'deploy',   1],
  // ['gha',    'apigw',  'redeploy', 1],
];
