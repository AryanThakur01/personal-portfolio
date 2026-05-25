import { useMemo, useState } from "react";
import { useTick } from "../hooks/use-tick";

interface GraphNode {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind: string;
  label: string;
  desc: string;
  metrics: [string, string][];
  code: string;
  file: string;
  color: string;
}

const NODES: GraphNode[] = [
  {
    id: "client", x: 80, y: 80, w: 130, h: 56, kind: "CLIENT", label: "Browser",
    desc: "Static React 19 client. Hydrated from edge cache. Service worker pre-fetches likely routes.",
    metrics: [["TTFB p50", "94ms"], ["LCP", "1.2s"], ["JS bundle", "78kb"], ["Status", "OK"]],
    code: `resource "aws_cloudfront_distribution" "site" {\n  default_root_object = "index.html"\n  price_class         = "PriceClass_100"\n  origin {\n    domain_name = aws_s3_bucket.site.bucket_regional_domain_name\n    origin_id   = "s3-site"\n  }\n}`,
    file: "infra/cloudfront.tf", color: "#7dd3fc",
  },
  {
    id: "cf", x: 290, y: 80, w: 150, h: 56, kind: "EDGE/CDN", label: "CloudFront",
    desc: "Global CDN. 247 edge POPs. Lambda@Edge handles auth, header rewrites, and routing.",
    metrics: [["Hit rate", "94.7%"], ["Edges", "247"], ["L@E p50", "8ms"], ["4xx", "0.02%"]],
    code: `resource "aws_cloudfront_distribution" "site" {\n  enabled         = true\n  is_ipv6_enabled = true\n  default_cache_behavior {\n    target_origin_id       = "s3-site"\n    viewer_protocol_policy = "redirect-to-https"\n    compress               = true\n  }\n}`,
    file: "infra/cloudfront.tf", color: "#06b6d4",
  },
  {
    id: "s3", x: 290, y: 200, w: 150, h: 56, kind: "STORAGE", label: "S3 — site assets",
    desc: "Versioned static bucket. Origin-shielded behind CloudFront. Lifecycle policy archives >90d.",
    metrics: [["Objects", "12,840"], ["Size", "248 MB"], ["GETs/min", "1,420"], ["Replication", "us-west-2"]],
    code: `resource "aws_s3_bucket" "site" {\n  bucket = "aryanthakur-dev-site"\n}\n\nresource "aws_s3_bucket_versioning" "site" {\n  bucket = aws_s3_bucket.site.id\n  versioning_configuration { status = "Enabled" }\n}`,
    file: "infra/s3.tf", color: "#a78bfa",
  },
  {
    id: "apigw", x: 520, y: 80, w: 150, h: 56, kind: "GATEWAY", label: "API Gateway",
    desc: "HTTP API. JWT authorizer. Per-route throttling. WAF rules for OWASP top 10 + bot scoring.",
    metrics: [["RPS", "84"], ["p95", "118ms"], ["5xx", "0.001%"], ["Throttled", "0"]],
    code: `resource "aws_apigatewayv2_api" "main" {\n  name          = "aryanthakur-api"\n  protocol_type = "HTTP"\n  cors_configuration {\n    allow_methods = ["GET", "POST"]\n    allow_origins = ["https://aryanthakur.dev"]\n  }\n}`,
    file: "infra/apigw.tf", color: "#06b6d4",
  },
  {
    id: "lambda", x: 520, y: 200, w: 150, h: 56, kind: "COMPUTE", label: "Lambda — handlers",
    desc: "12 functions. arm64. Cold-start under 220ms with snapstart + provisioned concurrency on hot paths.",
    metrics: [["Invocations/min", "1,840"], ["Cold start", "218ms"], ["p99", "190ms"], ["Errors", "0"]],
    code: `resource "aws_lambda_function" "api" {\n  function_name    = "aryanthakur-api"\n  runtime          = "nodejs20.x"\n  architectures    = ["arm64"]\n  memory_size      = 512\n  timeout          = 8\n  snap_start { apply_on = "PublishedVersions" }\n}`,
    file: "infra/lambda.tf", color: "#06b6d4",
  },
  {
    id: "neon", x: 750, y: 80, w: 150, h: 56, kind: "DATABASE", label: "Neon — Postgres",
    desc: "Branched Postgres. Read replicas autoscale 0→4. Connection pooler at PgBouncer layer.",
    metrics: [["Conn pool", "12 / 100"], ["Replicas", "2"], ["WAL lag", "32 ms"], ["IOPS", "180"]],
    code: `data "aws_ssm_parameter" "neon_url" {\n  name            = "/prod/neon/url"\n  with_decryption = true\n}\n\nresource "aws_lambda_function" "api" {\n  environment {\n    variables = {\n      DATABASE_URL = data.aws_ssm_parameter.neon_url.value\n    }\n  }\n}`,
    file: "infra/db.tf", color: "#34d399",
  },
  {
    id: "ddb", x: 750, y: 200, w: 150, h: 56, kind: "DATABASE", label: "DynamoDB — sessions",
    desc: "Single-table design. TTL-expired sessions. Point-in-time recovery enabled.",
    metrics: [["Items", "14.2 k"], ["RCU avg", "22 / 5,000"], ["WCU avg", "8 / 5,000"], ["P95 read", "4ms"]],
    code: `resource "aws_dynamodb_table" "sessions" {\n  name         = "sessions"\n  billing_mode = "PAY_PER_REQUEST"\n  hash_key     = "pk"\n  range_key    = "sk"\n  ttl { attribute_name = "expires_at"; enabled = true }\n  point_in_time_recovery { enabled = true }\n}`,
    file: "infra/dynamo.tf", color: "#fbbf24",
  },
  {
    id: "gha", x: 290, y: 320, w: 380, h: 56, kind: "PIPELINE", label: "GitHub Actions — deploy pipeline",
    desc: "Trunk-based. Required checks: typecheck, unit, integration, Terraform plan. OIDC to AWS, no long-lived keys.",
    metrics: [["Avg run", "2m 14s"], ["Success", "98.4%"], ["Deploys/wk", "12"], ["MTTR", "9m"]],
    code: `name: deploy\non: { push: { branches: [main] } }\npermissions: { id-token: write, contents: read }\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: aws-actions/configure-aws-credentials@v4\n        with:\n          role-to-assume: arn:aws:iam::***:role/gha-deploy\n          aws-region: us-east-1\n      - run: terraform apply -auto-approve`,
    file: ".github/workflows/deploy.yml", color: "#a78bfa",
  },
];

type EdgeDef = [string, string, string, number];
const EDGES: EdgeDef[] = [
  ["client", "cf",    "HTTPS",    1],
  ["cf",     "s3",    "origin",   1],
  ["cf",     "apigw", "/api/*",   1],
  ["apigw",  "lambda","invoke",   1],
  ["lambda", "neon",  "queries",  2],
  ["lambda", "ddb",   "sessions", 2],
  ["gha",    "s3",    "publish",  1],
  ["gha",    "lambda","deploy",   1],
  ["gha",    "apigw", "redeploy", 1],
];

function edgePath(a: GraphNode, b: GraphNode) {
  const ax = a.x + a.w / 2, ay = a.y + a.h / 2;
  const bx = b.x + b.w / 2, by = b.y + b.h / 2;
  const midX = (ax + bx) / 2;
  return `M ${ax} ${ay} L ${midX} ${ay} L ${midX} ${by} L ${bx} ${by}`;
}

function AnimatedFlow({ d }: { d: string }) {
  return (
    // @ts-expect-error animateMotion is valid SVG
    <circle r="2.5" fill="#06b6d4" opacity="0.9">
      <animateMotion dur="2.2s" repeatCount="indefinite" path={d} />
    </circle>
  );
}

function highlightHCL(code: string) {
  return code.split("\n").map((line, li) => {
    if (/^\s*#/.test(line)) {
      return <span key={li} className="tk-com">{line}</span>;
    }
    const parts: React.ReactNode[] = [];
    const re = /("[^"]*"|#.*$|\b\d+\.?\d*\b|\b(resource|data|variable|module|locals|provider|name|on|jobs|steps|uses|with|run|permissions|enabled|environment|version|true|false)\b|\b[a-z_][a-z0-9_-]*(?=\s*[:=]))/gi;
    let lastIdx = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      if (m.index > lastIdx) parts.push(line.slice(lastIdx, m.index));
      const tok = m[0];
      let cls = "tk-key";
      if (tok.startsWith('"')) cls = "tk-str";
      else if (tok.startsWith("#")) cls = "tk-com";
      else if (/^\d/.test(tok)) cls = "tk-num";
      else if (/^(resource|data|variable|module|locals|provider)$/.test(tok)) cls = "tk-ty";
      else if (/^(true|false)$/.test(tok)) cls = "tk-num";
      parts.push(<span key={parts.length} className={cls}>{tok}</span>);
      lastIdx = m.index + tok.length;
    }
    if (lastIdx < line.length) parts.push(line.slice(lastIdx));
    return <span key={li}>{parts}</span>;
  });
}

function CodeBlock({ filename, code }: { filename: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");
  const highlighted = highlightHCL(code);

  function copy() {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="border border-border rounded-[4px] overflow-hidden" style={{ background: "#0b0e10" }}>
      <div className="flex justify-between items-center px-3 py-2 border-b border-border bg-bg-card">
        <span className="font-mono text-[11px] text-text-3 tracking-[0.04em]">{filename}</span>
        <button
          onClick={copy}
          className="font-mono text-[10px] text-text-3 bg-transparent border border-border-hover px-2 py-[3px] rounded-[3px] hover:text-accent hover:border-accent-line transition-colors duration-150"
        >
          {copied ? "✓ COPIED" : "COPY"}
        </button>
      </div>
      <pre className="m-0 p-0 overflow-x-auto" style={{ display: "grid", gridTemplateColumns: "36px 1fr", fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.65 }}>
        <code className="text-right pr-3 text-text-4 select-none border-r border-border py-3">
          {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
        </code>
        <code className="pl-[14px] text-text-2 whitespace-pre py-3">
          {highlighted.map((line, i) => <div key={i}>{line}</div>)}
        </code>
      </pre>
    </div>
  );
}

function ArchDrawer({ node, metrics }: { node: GraphNode; metrics: [string, string][] }) {
  return (
    <div className="border-l border-border bg-bg-card p-[28px_26px] flex flex-col gap-[18px] overflow-y-auto" style={{ maxHeight: 540 }}>
      <div className="flex items-center justify-between">
        <h4 className="m-0 font-mono font-medium text-[15px] text-text">{node.label}</h4>
        <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-3 border border-border-hover px-2 py-[3px] rounded-[3px]">
          {node.kind}
        </span>
      </div>
      <p className="m-0 text-text-2 text-[13px] leading-[1.55]">{node.desc}</p>
      <div className="grid grid-cols-2 gap-px bg-border border border-border">
        {metrics.map(([k, v], i) => (
          <div key={i} className="bg-bg-elev p-[12px_14px]">
            <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-text-3 mb-1">{k}</div>
            <div className={`font-mono text-[14px] ${k.toLowerCase().includes("start") || k.toLowerCase().includes("p9") || k.toLowerCase().includes("ttfb") || k.toLowerCase().includes("lag") ? "text-accent" : "text-text"}`}>
              {v}
            </div>
          </div>
        ))}
      </div>
      <CodeBlock filename={node.file} code={node.code} />
    </div>
  );
}

export function ArchitectureGraph() {
  const [active, setActive] = useState("lambda");
  const tick = useTick(2000);
  const nodeById = Object.fromEntries(NODES.map((n) => [n.id, n]));
  const node = nodeById[active];

  const liveMetrics = useMemo<[string, string][]>(() => {
    return node.metrics.map(([k, v]) => {
      if (typeof v === "string" && v.endsWith("ms")) {
        const base = parseFloat(v);
        return [k, `${Math.round(base + Math.sin(tick * 0.7) * base * 0.08)}ms`];
      }
      return [k, v];
    });
  }, [node, tick]);

  return (
    <section id="infra" className="border-t border-border py-16 sm:py-24">
      <div className="max-w-[1240px] mx-auto px-[22px] sm:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-8 mb-10">
          <div>
            <div className="eyebrow">03 / ARCHITECTURE — THIS SITE</div>
            <h2 className="font-mono font-medium text-[26px] tracking-[-0.01em] mt-3 mb-0 text-text">
              What you're looking at, drawn as a graph.
            </h2>
          </div>
          <p className="max-w-[420px] text-text-2 text-[14px] m-0">
            Click any node. The drawer shows the live metric, what the component does,
            and the actual Terraform that defines it.
          </p>
        </div>

        {/* Desktop: graph + drawer */}
        <div className="hidden md:grid border border-border bg-bg-card overflow-hidden" style={{ gridTemplateColumns: "1fr 360px", minHeight: 540 }}>
          {/* Graph panel */}
          <div
            className="relative overflow-hidden"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(6,182,212,0.05) 0%, transparent 50%), #111111",
            }}
          >
            {/* Grid dots overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage: "linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <svg
              viewBox="0 0 980 420"
              preserveAspectRatio="xMidYMid meet"
              className="block w-full"
              style={{ minHeight: 540 }}
            >
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
                </marker>
                <marker id="arrowdim" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#3a3a3a" />
                </marker>
              </defs>

              {/* Edges */}
              {EDGES.map(([from, to], i) => {
                const a = nodeById[from], b = nodeById[to];
                const isActive = from === active || to === active;
                const d = edgePath(a, b);
                return (
                  <g key={i}>
                    <path
                      d={d}
                      fill="none"
                      stroke={isActive ? "#06b6d4" : "#333"}
                      strokeWidth={isActive ? 1.3 : 1}
                      strokeDasharray={isActive ? "0" : "3 3"}
                      markerEnd={`url(#${isActive ? "arrow" : "arrowdim"})`}
                      style={{ transition: "stroke 0.15s" }}
                    />
                    {isActive && <AnimatedFlow d={d} />}
                  </g>
                );
              })}

              {/* Nodes */}
              {NODES.map((n) => {
                const isActive = n.id === active;
                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x}, ${n.y})`}
                    onClick={() => setActive(n.id)}
                    style={{ cursor: "pointer", filter: isActive ? "brightness(1.3)" : undefined }}
                  >
                    <rect
                      width={n.w} height={n.h} rx={2}
                      fill="#1a1a1a"
                      stroke={isActive ? "#06b6d4" : "#333"}
                      strokeWidth={1}
                      style={{ transition: "stroke 0.15s, fill 0.15s" }}
                    />
                    {/* Accent stripe */}
                    <rect x={0} y={0} width={3} height={n.h} fill={isActive ? "#06b6d4" : n.color} opacity={isActive ? 1 : 0.6} />
                    <text x={14} y={22} fontFamily="var(--font-mono)" fontSize={9} letterSpacing="0.12em" fill="#6b6b6b" textTransform="uppercase">
                      {n.kind}
                    </text>
                    <text x={14} y={42} fontFamily="var(--font-mono)" fontSize={11} letterSpacing="0.02em" fill={isActive ? "#ededed" : "#ededed"}>
                      {n.label}
                    </text>
                    <circle cx={n.w - 12} cy={14} r={3} fill="#22c55e" opacity={isActive ? 1 : 0.4} />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Drawer */}
          <ArchDrawer node={node} metrics={liveMetrics} />
        </div>

        {/* Mobile: node list */}
        <div className="md:hidden border border-border divide-y divide-border">
          {NODES.map((n) => (
            <button
              key={n.id}
              onClick={() => setActive(n.id)}
              className={`w-full text-left flex items-start gap-4 px-4 py-3 transition-colors duration-150 ${n.id === active ? "bg-bg-elev" : "bg-bg-card hover:bg-bg-elev"}`}
            >
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-accent shrink-0 mt-0.5 w-[80px]">{n.kind}</span>
              <div className="min-w-0">
                <div className="font-mono text-[12px] text-text truncate">{n.label}</div>
                <div className="font-mono text-[10px] text-text-3 mt-0.5 truncate">{n.desc.slice(0, 60)}…</div>
              </div>
            </button>
          ))}
          {/* Drawer below on mobile */}
          <div className="p-5">
            <ArchDrawer node={node} metrics={liveMetrics} />
          </div>
        </div>
      </div>
    </section>
  );
}
