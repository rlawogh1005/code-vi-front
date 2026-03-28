import type { Node, Edge } from '@xyflow/react';

// React Flow 노드 타입
export type FlowNodeType = 'directory' | 'file' | 'class' | 'function';

// @xyflow/react v12: NodeData must satisfy Record<string, unknown>
export interface FlowNodeData extends Record<string, unknown> {
  label: string;
  nodeType: FlowNodeType;
  meta?: {
    startLine?: number;
    endLine?: number;
    startCol?: number;
    endCol?: number;
    fileName?: string;
    methodCount?: number;
    fileCount?: number;
    childDirCount?: number;
  };
}

export type AstFlowNode = Node<FlowNodeData>;
export type AstFlowEdge = Edge;

export interface FlowResult {
  nodes: AstFlowNode[];
  edges: AstFlowEdge[];
}
