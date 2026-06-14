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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    mermaid.render(`m-${uid}`, chart).then(({ svg }) => {
      if (ref.current) ref.current.innerHTML = svg;
    }).catch(() => {});
  }, [chart, uid]);

  return <div ref={ref} className={className} />;
}
