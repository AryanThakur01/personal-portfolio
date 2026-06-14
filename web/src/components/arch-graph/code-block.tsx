import { useState } from 'react';
import { highlightHCL } from './helpers';

interface CodeBlockProps {
  filename: string;
  code: string;
}

export function CodeBlock({ filename, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split('\n');
  const highlighted = highlightHCL(code);

  function copy() {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div
      className="border border-border rounded-[4px] overflow-hidden"
      style={{ background: '#0b0e10' }}>
      <div className="flex justify-between items-center px-3 py-2 border-b border-border bg-bg-card">
        <span className="font-mono text-[11px] text-text-3 tracking-[0.04em]">
          {filename}
        </span>
        <button
          onClick={copy}
          className="font-mono text-[10px] text-text-3 bg-transparent border border-border-hover px-2 py-[3px] rounded-[3px] hover:text-accent hover:border-accent-line transition-colors duration-150">
          {copied ? '✓ COPIED' : 'COPY'}
        </button>
      </div>
      <pre
        className="m-0 p-0 overflow-x-auto"
        style={{
          display: 'grid',
          gridTemplateColumns: '36px 1fr',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          lineHeight: 1.65,
        }}>
        <code className="text-right pr-3 text-text-4 select-none border-r border-border py-3">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </code>
        <code className="pl-[14px] text-text-2 whitespace-pre py-3">
          {highlighted.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </code>
      </pre>
    </div>
  );
}
