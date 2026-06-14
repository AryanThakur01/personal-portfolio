import mermaid from 'mermaid';
import { useEffect, useId, useRef } from 'react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    background:          '#111111',
    mainBkg:             '#1a1a1a',
    nodeBorder:          '#333333',
    primaryColor:        '#1a1a1a',
    primaryBorderColor:  '#333333',
    primaryTextColor:    '#ededed',
    lineColor:           '#06b6d4',
    edgeLabelBackground: '#111111',
    fontFamily:          'var(--font-mono)',
    fontSize:            '11px',
  },
});

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export function MermaidDiagram({ chart, className }: MermaidDiagramProps) {
  const uid = useId().replace(/:/g, '');
  const renderCount = useRef(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    let cancelled = false;
    const id = `m-${uid}-${++renderCount.current}`;

    mermaid.render(id, chart)
      .then(({ svg }) => {
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      })
      .catch(console.error);

    return () => { cancelled = true; };
  }, [chart, uid]);

  return <div ref={ref} className={className} />;
}
