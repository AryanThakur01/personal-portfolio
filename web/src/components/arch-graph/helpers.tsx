export function highlightHCL(code: string): React.ReactNode[] {
  return code.split('\n').map((line, li) => {
    if (/^\s*#/.test(line)) {
      return (
        <span key={li} className="tk-com">
          {line}
        </span>
      );
    }

    const parts: React.ReactNode[] = [];
    const re =
      /("[^"]*"|#.*$|\b\d+\.?\d*\b|\b(resource|data|variable|module|locals|provider|name|on|jobs|steps|uses|with|run|permissions|enabled|environment|version|true|false)\b|\b[a-z_][a-z0-9_-]*(?=\s*[:=]))/gi;
    let lastIdx = 0;
    let m: RegExpExecArray | null;

    while ((m = re.exec(line)) !== null) {
      if (m.index > lastIdx) parts.push(line.slice(lastIdx, m.index));
      const tok = m[0];
      let cls = 'tk-key';
      if (tok.startsWith('"')) cls = 'tk-str';
      else if (tok.startsWith('#')) cls = 'tk-com';
      else if (/^\d/.test(tok)) cls = 'tk-num';
      else if (/^(resource|data|variable|module|locals|provider)$/.test(tok))
        cls = 'tk-ty';
      else if (/^(true|false)$/.test(tok)) cls = 'tk-num';
      parts.push(
        <span key={parts.length} className={cls}>
          {tok}
        </span>,
      );
      lastIdx = m.index + tok.length;
    }

    if (lastIdx < line.length) parts.push(line.slice(lastIdx));
    return <span key={li}>{parts}</span>;
  });
}

export function isLatencyMetric(key: string): boolean {
  const k = key.toLowerCase();
  return (
    k.includes('start') ||
    k.includes('p9') ||
    k.includes('ttfb') ||
    k.includes('lag')
  );
}
