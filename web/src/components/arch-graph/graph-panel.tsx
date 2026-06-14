import '@xyflow/react/dist/style.css';
import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MarkerType,
  type Edge,
  type NodeMouseHandler,
  type Node,
} from '@xyflow/react';
import type { GraphNode, EdgeDef } from './data';
import { POSITIONS, SOURCE_COUNT, TARGET_COUNT } from './layout';
import { ArchNode } from './arch-node';

const NODE_TYPES = { archNode: ArchNode };

interface GraphPanelProps {
  nodes: GraphNode[];
  edges: EdgeDef[];
  active: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function GraphPanel({
  nodes,
  edges,
  active,
  onSelect,
  className,
}: GraphPanelProps) {
  const rfNodes = useMemo<Node[]>(
    () =>
      nodes.map((n) => ({
        id: n.id,
        type: 'archNode',
        position: POSITIONS[n.id],
        data: {
          ...n,
          sourceHandles: SOURCE_COUNT[n.id] ?? 0,
          targetHandles: TARGET_COUNT[n.id] ?? 0,
        },
        width: n.w,
        height: n.h,
        selected: n.id === active,
        draggable: false,
        selectable: true,
      })),
    [nodes, active],
  );

  const rfEdges = useMemo<Edge[]>(
    () =>
      edges.map(([source, target, label], i) => {
        const isActive = source === active || target === active;
        return {
          id: `e-${i}`,
          source,
          target,
          label,
          type: 'smoothstep',
          animated: isActive,
          style: {
            stroke: isActive ? '#06b6d4' : '#444',
            strokeWidth: isActive ? 1.5 : 1,
          },
          labelStyle: {
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            fill: '#555',
          },
          labelBgStyle: { fill: '#111', fillOpacity: 0.85 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isActive ? '#06b6d4' : '#444',
            width: 12,
            height: 12,
          },
        };
      }),
    [edges, active],
  );

  const handleNodeClick: NodeMouseHandler<Node> = (_, node) =>
    onSelect(node.id);

  return (
    <div
      className={className}
      style={{
        background:
          'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.05) 0%, transparent 50%), #111111',
      }}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={NODE_TYPES}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
        minZoom={0.4}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}>
        <Background
          color="#222"
          variant={BackgroundVariant.Lines}
          gap={32}
          lineWidth={0.5}
        />
      </ReactFlow>
    </div>
  );
}
