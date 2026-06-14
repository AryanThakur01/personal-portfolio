import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { GraphNode } from './data';

type ArchGraphNode = Node<GraphNode, 'archNode'>;

export function ArchNode({ data, selected }: NodeProps<ArchGraphNode>) {
  return (
    <div
      className={`
        box-border w-full h-full flex relative rounded-[2px] border transition-colors duration-150
        ${selected ? 'border-accent brightness-125' : 'border-border'}
      `}>
      {/* Left accent stripe — only dynamic value is the per-node color */}
      <div
        className="w-[3px] shrink-0 rounded-l-[2px] transition-opacity duration-150"
        style={{ background: data.color, opacity: selected ? 1 : 0.5 }}
      />

      {/* Kind + label */}
      <div className="flex flex-col justify-center pl-3 pr-6 flex-1 min-w-0">
        <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-text-3">
          {data.kind}
        </span>
        <span className="font-mono text-[11px] tracking-[0.02em] text-text mt-1 truncate">
          {data.label}
        </span>
      </div>

      {/* Live status dot */}
      <div
        className={`absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-green transition-opacity duration-150 ${selected ? 'opacity-100' : 'opacity-40'}`}
      />

      {/* Handles — invisible, just needed for edge routing */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={false}
        className="opacity-0"
      />
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
        className="opacity-0"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={false}
        className="opacity-0"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        className="opacity-0"
      />
    </div>
  );
}
