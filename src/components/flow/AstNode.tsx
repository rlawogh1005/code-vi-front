import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { FlowNodeData, FlowNodeType } from '../../interface/flow.interface';
import styles from './AstNode.module.css';

const NODE_CONFIG: Record<FlowNodeType, { emoji: string; className: string }> = {
  directory: { emoji: '📁', className: styles.directory },
  file: { emoji: '📄', className: styles.file },
  class: { emoji: '🏛️', className: styles.class },
  function: { emoji: '⚡', className: styles.function },
};

// @xyflow/react v12: NodeProps uses Record<string, unknown> generic
// We cast data to FlowNodeData after receiving it
function AstNode({ data: rawData, selected }: NodeProps) {
  const data = rawData as FlowNodeData;
  const config = NODE_CONFIG[data.nodeType] ?? { emoji: '🔷', className: '' };

  return (
    <div className={`${styles.node} ${config.className} ${selected ? styles.selected : ''}`}>
      <Handle type="target" position={Position.Top} className={styles.handle} />

      <div className={styles.header}>
        <span className={styles.emoji}>{config.emoji}</span>
        <span className={styles.label} title={data.label}>
          {data.label}
        </span>
      </div>

      {data.meta && (
        <div className={styles.meta}>
          {data.meta.startLine != null && (
            <span className={styles.metaTag}>
              L{data.meta.startLine}–{data.meta.endLine}
            </span>
          )}
          {data.meta.methodCount != null && (
            <span className={styles.metaTag}>{data.meta.methodCount} methods</span>
          )}
          {data.meta.fileCount != null && (
            <span className={styles.metaTag}>{data.meta.fileCount} files</span>
          )}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className={styles.handle} />
    </div>
  );
}

export default memo(AstNode);
