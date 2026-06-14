export interface GraphNode {
  id: string;
  w: number;
  h: number;
  kind: string;
  label: string;
  desc: string;
  code: string;
  file: string;
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
    code: `resource "aws_cloudfront_distribution" "site" {\n  default_root_object = "index.html"\n  price_class         = "PriceClass_100"\n  origin {\n    domain_name = aws_s3_bucket.site.bucket_regional_domain_name\n    origin_id   = "s3-site"\n  }\n}`,
    file: 'infra/cloudfront.tf',
    color: '#7dd3fc',
  },
  {
    id: 'cf',
    w: 150,
    h: 56,
    kind: 'EDGE/CDN',
    label: 'CloudFront',
    desc: 'Global CDN. 247 edge POPs. Lambda@Edge handles auth, header rewrites, and routing.',
    code: `resource "aws_cloudfront_distribution" "site" {\n  enabled         = true\n  is_ipv6_enabled = true\n  default_cache_behavior {\n    target_origin_id       = "s3-site"\n    viewer_protocol_policy = "redirect-to-https"\n    compress               = true\n  }\n}`,
    file: 'infra/cloudfront.tf',
    color: '#06b6d4',
  },
  // {
  //   id: 's3',
  //   w: 150,
  //   h: 56,
  //   kind: 'STORAGE',
  //   label: 'S3 — site assets',
  //   desc: 'Versioned static bucket. Origin-shielded behind CloudFront. Lifecycle policy archives >90d.',
  //   metrics: [
  //     ['Objects', '12,840'],
  //     ['Size', '248 MB'],
  //     ['GETs/min', '1,420'],
  //     ['Replication', 'us-west-2'],
  //   ],
  //   code: `resource "aws_s3_bucket" "site" {\n  bucket = "aryanthakur-dev-site"\n}\n\nresource "aws_s3_bucket_versioning" "site" {\n  bucket = aws_s3_bucket.site.id\n  versioning_configuration { status = "Enabled" }\n}`,
  //   file: 'infra/s3.tf',
  //   color: '#a78bfa',
  // },
  // {
  //   id: 'apigw',
  //   w: 150,
  //   h: 56,
  //   kind: 'GATEWAY',
  //   label: 'API Gateway',
  //   desc: 'HTTP API. JWT authorizer. Per-route throttling. WAF rules for OWASP top 10 + bot scoring.',
  //   metrics: [
  //     ['RPS', '84'],
  //     ['p95', '118ms'],
  //     ['5xx', '0.001%'],
  //     ['Throttled', '0'],
  //   ],
  //   code: `resource "aws_apigatewayv2_api" "main" {\n  name          = "aryanthakur-api"\n  protocol_type = "HTTP"\n  cors_configuration {\n    allow_methods = ["GET", "POST"]\n    allow_origins = ["https://aryanthakur.dev"]\n  }\n}`,
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
  //   metrics: [
  //     ['Invocations/min', '1,840'],
  //     ['Cold start', '218ms'],
  //     ['p99', '190ms'],
  //     ['Errors', '0'],
  //   ],
  //   code: `resource "aws_lambda_function" "api" {\n  function_name    = "aryanthakur-api"\n  runtime          = "nodejs20.x"\n  architectures    = ["arm64"]\n  memory_size      = 512\n  timeout          = 8\n  snap_start { apply_on = "PublishedVersions" }\n}`,
  //   file: 'infra/lambda.tf',
  //   color: '#06b6d4',
  // },
  // {
  //   id: 'neon',
  //   w: 150,
  //   h: 56,
  //   kind: 'DATABASE',
  //   label: 'Neon — Postgres',
  //   desc: 'Branched Postgres. Read replicas autoscale 0→4. Connection pooler at PgBouncer layer.',
  //   metrics: [
  //     ['Conn pool', '12 / 100'],
  //     ['Replicas', '2'],
  //     ['WAL lag', '32 ms'],
  //     ['IOPS', '180'],
  //   ],
  //   code: `data "aws_ssm_parameter" "neon_url" {\n  name            = "/prod/neon/url"\n  with_decryption = true\n}\n\nresource "aws_lambda_function" "api" {\n  environment {\n    variables = {\n      DATABASE_URL = data.aws_ssm_parameter.neon_url.value\n    }\n  }\n}`,
  //   file: 'infra/db.tf',
  //   color: '#34d399',
  // },
  // {
  //   id: 'ddb',
  //   w: 150,
  //   h: 56,
  //   kind: 'DATABASE',
  //   label: 'DynamoDB — sessions',
  //   desc: 'Single-table design. TTL-expired sessions. Point-in-time recovery enabled.',
  //   metrics: [
  //     ['Items', '14.2 k'],
  //     ['RCU avg', '22 / 5,000'],
  //     ['WCU avg', '8 / 5,000'],
  //     ['P95 read', '4ms'],
  //   ],
  //   code: `resource "aws_dynamodb_table" "sessions" {\n  name         = "sessions"\n  billing_mode = "PAY_PER_REQUEST"\n  hash_key     = "pk"\n  range_key    = "sk"\n  ttl { attribute_name = "expires_at"; enabled = true }\n  point_in_time_recovery { enabled = true }\n}`,
  //   file: 'infra/dynamo.tf',
  //   color: '#fbbf24',
  // },
  // {
  //   id: 'gha',
  //   w: 380,
  //   h: 56,
  //   kind: 'PIPELINE',
  //   label: 'GitHub Actions — deploy pipeline',
  //   desc: 'Trunk-based. Required checks: typecheck, unit, integration, Terraform plan. OIDC to AWS, no long-lived keys.',
  //   metrics: [
  //     ['Avg run', '2m 14s'],
  //     ['Success', '98.4%'],
  //     ['Deploys/wk', '12'],
  //     ['MTTR', '9m'],
  //   ],
  //   code: `name: deploy\non: { push: { branches: [main] } }\npermissions: { id-token: write, contents: read }\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: aws-actions/configure-aws-credentials@v4\n        with:\n          role-to-assume: arn:aws:iam::***:role/gha-deploy\n          aws-region: us-east-1\n      - run: terraform apply -auto-approve`,
  //   file: '.github/workflows/deploy.yml',
  //   color: '#a78bfa',
  // },
];

export const EDGES: EdgeDef[] = [
  ['client', 'cf', 'HTTPS', 1],
  // ['cf', 's3', 'origin', 1],
  // ['cf', 'apigw', '/api/*', 1],
  // ['apigw', 'lambda', 'invoke', 1],
  // ['lambda', 'neon', 'queries', 2],
  // ['lambda', 'ddb', 'sessions', 2],
  // ['gha', 's3', 'publish', 1],
  // ['gha', 'lambda', 'deploy', 1],
  // ['gha', 'apigw', 'redeploy', 1],
];
