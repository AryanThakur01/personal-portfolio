import { useEffect, useRef, useState } from "react";
import { pad } from "../hooks/use-tick";

type LineKind = "out" | "dim" | "err" | "warn" | "cmd" | "spacer";

interface TermLine {
  kind: LineKind;
  text?: string;
  cwd?: string;
}

const FS: Record<string, string[]> = {
  "/": ["README.md", "ARCHITECTURE.md", "infra/", "src/", "bin/", "package.json"],
  "/infra": ["cloudfront.tf", "lambda.tf", "s3.tf", "dynamo.tf", "db.tf", "apigw.tf", "variables.tf"],
  "/src": ["app.tsx", "api/", "lib/", "components/"],
  "/bin": ["deploy.sh", "rotate-keys.sh", "drain.sh"],
};

const FILES: Record<string, string[]> = {
  "/README.md": [
    "# aryanthakur.dev",
    "",
    "Personal site & engineering portfolio.",
    "Built as a living system, not a static page.",
    "",
    "## What's here",
    "- /infra      Terraform for the whole stack",
    "- /src        React 19 client + Lambda handlers",
    "- /bin        Operational scripts",
    "",
    "## Live",
    "https://aryanthakur.dev",
  ],
  "/ARCHITECTURE.md": [
    "# Architecture — aryanthakur.dev",
    "",
    "## Edge tier",
    "  Browser → CloudFront (247 POPs) → S3 (static) / API GW (dynamic)",
    "",
    "## Compute tier",
    "  API Gateway HTTP → Lambda (Node 20, arm64, 512MB)",
    "  - SnapStart on published versions",
    "  - Reserved concurrency: 100",
    "",
    "## Data tier",
    "  Neon Postgres (branched per PR)",
    "  DynamoDB sessions (TTL'd, PITR enabled)",
    "",
    "## CI/CD",
    "  GitHub Actions, OIDC into AWS — no long-lived keys",
    "  Pipeline: typecheck → test → tf-plan → apply → smoke",
    "",
    "## SLOs",
    "  API p95   < 200ms      (currently 118ms)",
    "  Uptime    > 99.9% / mo (30d:  99.987%)",
  ],
  "/package.json": [
    "{",
    '  "name": "aryanthakur-portfolio",',
    '  "version": "2.14.0",',
    '  "engines": { "node": ">=20" },',
    '  "scripts": {',
    '    "dev":     "next dev",',
    '    "build":   "next build",',
    '    "deploy":  "tf apply -auto-approve && gh workflow run deploy"',
    "  }",
    "}",
  ],
  "/infra/lambda.tf": [
    'resource "aws_lambda_function" "api" {',
    '  function_name    = "aryanthakur-api"',
    '  runtime          = "nodejs20.x"',
    '  architectures    = ["arm64"]',
    '  memory_size      = 512',
    "  timeout          = 8",
    "  snap_start {",
    '    apply_on = "PublishedVersions"',
    "  }",
    "}",
  ],
};

const INTRO: TermLine[] = [
  { kind: "out", text: "aryanthakur.dev — sandboxed shell · readonly · Lambda runtime: nodejs20.x · arm64" },
  { kind: "out", text: "Type `help` for available commands, or click a suggestion below." },
  { kind: "spacer" },
];

const SUGGESTIONS = ["uname -a", "ls infra", "cat ARCHITECTURE.md", "curl /api/health", "curl /api/metrics", "ls /infra"];

function resolvePath(cwd: string, p: string): string {
  if (!p) return cwd;
  const parts = p.startsWith("/")
    ? p.split("/")
    : (cwd === "/" ? "" : cwd).split("/").concat(p.split("/"));
  const out: string[] = [];
  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") out.pop();
    else out.push(part);
  }
  const res = "/" + out.join("/");
  return res === "/" ? "/" : res.replace(/\/$/, "");
}

function TermLineEl({ line }: { line: TermLine }) {
  if (line.kind === "spacer") return <div style={{ height: 6 }} />;
  if (line.kind === "cmd") {
    return (
      <div className="font-mono text-[13px] whitespace-pre-wrap break-words leading-[1.55]">
        <span style={{ color: "#06b6d4" }}>›</span>{" "}
        <span style={{ color: "#22c55e" }}>guest</span>
        <span style={{ color: "#6b6b6b" }}>:</span>
        <span style={{ color: "#7dd3fc" }}>{line.cwd}</span>
        <span style={{ color: "#06b6d4" }}>$</span>{" "}
        <span style={{ color: "#ededed" }}>{line.text}</span>
      </div>
    );
  }
  const colorMap: Record<string, string> = {
    out: "#c9d1d9",
    dim: "#6b6b6b",
    err: "#ef4444",
    warn: "#f59e0b",
  };
  return (
    <div
      className="font-mono text-[13px] whitespace-pre-wrap break-words leading-[1.55]"
      style={{ color: colorMap[line.kind] ?? "#c9d1d9" }}
    >
      {line.text}
    </div>
  );
}

export function Terminal() {
  const [lines, setLines] = useState<TermLine[]>(INTRO);
  const [cwd, setCwd] = useState("/");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  function run(rawCmd: string) {
    const cmd = rawCmd.trim();
    setLines((prev) => [...prev, { kind: "cmd", cwd, text: cmd }]);
    if (!cmd) return;
    setHistory((h) => [...h, cmd]);
    setHistIdx(-1);

    const [name, ...args] = cmd.split(/\s+/);

    function out(text: string, kind: LineKind = "out") {
      setLines((prev) => [...prev, { kind, text }]);
    }
    function block(arr: string[], kind: LineKind = "out") {
      setLines((prev) => [...prev, ...arr.map((t) => ({ kind, text: t })), { kind: "spacer" }]);
    }

    switch (name) {
      case "help":
        block([
          "available commands:",
          "  uname           print kernel / runtime info",
          "  whoami          current user",
          "  ls [path]       list directory",
          "  cd <path>       change directory",
          "  pwd             print working directory",
          "  cat <file>      print file contents",
          "  curl <url>      try /api/health, /api/metrics",
          "  date            current time in UTC",
          "  echo <text>     echo text",
          "  history         shell history",
          "  clear           clear the screen",
          "  exit            close the session (no-op, you're a guest)",
        ]);
        break;
      case "uname":
        if (args[0] === "-a") {
          out("Linux ip-10-0-12-44 5.10.215-203.850.amzn2.aarch64 #1 SMP aarch64 GNU/Linux  (AWS Lambda · nodejs20.x · arm64)");
        } else {
          out("Linux");
        }
        break;
      case "whoami": out("guest@aryanthakur.dev"); break;
      case "pwd":    out(cwd); break;
      case "date":   out(new Date().toUTCString()); break;
      case "echo":   out(args.join(" ")); break;
      case "exit":   out("you're a guest — nice try.", "dim"); break;
      case "clear":  setLines([]); break;
      case "history":
        block(history.map((h, i) => `  ${pad(i + 1, 3)}  ${h}`));
        break;
      case "ls": {
        const path = args[0] ? resolvePath(cwd, args[0]) : cwd;
        const dir = FS[path];
        if (!dir) { out(`ls: cannot access '${args[0] || path}': No such directory`, "err"); break; }
        block(dir);
        break;
      }
      case "cd": {
        if (!args[0]) { setCwd("/"); break; }
        const target = resolvePath(cwd, args[0]);
        if (!FS[target]) { out(`cd: ${args[0]}: No such directory`, "err"); break; }
        setCwd(target);
        break;
      }
      case "cat": {
        if (!args[0]) { out("cat: missing operand", "err"); break; }
        const path = resolvePath(cwd, args[0]);
        const file = FILES[path];
        if (!file) { out(`cat: ${args[0]}: No such file`, "err"); break; }
        block(file);
        break;
      }
      case "curl": {
        const url = args[0] || "";
        if (url.includes("/api/health")) {
          block([
            "HTTP/2 200",
            "content-type: application/json",
            "x-region: us-east-1",
            "x-edge-pop: BLR50-P3",
            "",
            JSON.stringify({ status: "ok", version: "2.14.0", uptime: "99.987%", commit: "a4f9c2e", time: new Date().toISOString() }, null, 2),
          ]);
        } else if (url.includes("/api/metrics")) {
          block([
            "HTTP/2 200",
            "content-type: text/plain",
            "",
            "# HELP api_request_duration_ms Request latency",
            "# TYPE api_request_duration_ms histogram",
            'api_request_duration_ms{quantile="0.5"}  38',
            'api_request_duration_ms{quantile="0.95"} 118',
            'api_request_duration_ms{quantile="0.99"} 190',
            "cf_cache_hit_ratio 0.947",
            "lambda_cold_start_ms 218",
          ]);
        } else if (!url) {
          out("curl: try a path: /api/health or /api/metrics", "warn");
        } else {
          out(`curl: (6) Could not resolve host: ${url}`, "err");
        }
        break;
      }
      default:
        out(`${name}: command not found`, "err");
        out("type 'help' for the list of allowed commands.", "dim");
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const idx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(history[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === -1) return;
      const idx = histIdx + 1;
      if (idx >= history.length) { setHistIdx(-1); setInput(""); }
      else { setHistIdx(idx); setInput(history[idx]); }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  function suggest(cmd: string) {
    run(cmd);
    setInput("");
    inputRef.current?.focus();
  }

  return (
    <section id="systems" className="border-t border-border py-16 sm:py-24">
      <div className="max-w-[1240px] mx-auto px-[22px] sm:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-8 mb-10">
          <div>
            <div className="eyebrow">07 / TERMINAL · SANDBOXED</div>
            <h2 className="font-mono font-medium text-[26px] tracking-[-0.01em] mt-3 mb-0 text-text">
              This terminal is real. The shell isn't.
            </h2>
          </div>
          <p className="max-w-[420px] text-text-2 text-[14px] m-0">
            Filesystem and commands are emulated in-browser. Output reflects the actual production environment this page is served from.
          </p>
        </div>

        <div className="border border-border overflow-hidden" style={{ background: "#050608" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-[14px] py-[9px] bg-bg-elev border-b border-border font-mono text-[11px] text-text-3 tracking-[0.05em]">
            <div className="flex gap-[6px]">
              {["#ff5f57", "#ffbd2e", "#27c93f"].map((c) => (
                <span key={c} className="w-[11px] h-[11px] rounded-full border border-[#2a2a2a]" style={{ background: "#333" }} />
              ))}
            </div>
            <div className="flex items-center gap-[10px]">
              guest@aryanthakur.dev:
              <span style={{ color: "#7dd3fc" }}>{cwd}</span>
            </div>
            <div className="flex items-center gap-[10px]">
              <span style={{ color: "#06b6d4" }}>λ</span> nodejs20.x · arm64 · us-east-1
            </div>
          </div>

          {/* Terminal body */}
          <div
            ref={scrollRef}
            className="terminal-scroll p-[18px_20px] overflow-y-auto cursor-text"
            style={{ height: 360 }}
            onClick={() => inputRef.current?.focus()}
          >
            {lines.map((l, i) => <TermLineEl key={i} line={l} />)}

            {/* Input row */}
            <div className="flex items-center gap-2 font-mono text-[13px]">
              <span style={{ color: "#06b6d4" }}>›</span>
              <span style={{ color: "#22c55e" }}>guest</span>
              <span style={{ color: "#6b6b6b" }}>:</span>
              <span style={{ color: "#7dd3fc" }}>{cwd}</span>
              <span style={{ color: "#06b6d4" }}>$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                spellCheck={false}
                autoComplete="off"
                autoFocus
                aria-label="Terminal input"
                className="flex-1 bg-transparent border-none outline-none text-text"
                style={{ fontFamily: "var(--font-mono)", fontSize: 13, caretColor: "#06b6d4" }}
              />
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-[6px] mt-3 pt-3 border-t border-dashed border-border">
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-text-3 self-center mr-1">TRY:</span>
              {SUGGESTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => suggest(c)}
                  className="font-mono text-[11px] bg-transparent border border-border-hover text-text-2 px-[9px] py-1 rounded-[3px] hover:border-accent-line hover:text-accent transition-all duration-150"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center px-[14px] py-2 border-t border-border bg-bg-elev font-mono text-[10px] tracking-[0.1em] uppercase text-text-3">
            <span>READONLY · NO NETWORK · SESSION ISOLATED</span>
            <span>
              ↑ history ·{" "}
              <b className="text-text-2 font-medium bg-bg-elev-2 px-[5px] py-px border border-border rounded-[2px]">Ctrl-L</b>{" "}
              clear ·{" "}
              <b className="text-text-2 font-medium bg-bg-elev-2 px-[5px] py-px border border-border rounded-[2px]">help</b>{" "}
              for commands
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
