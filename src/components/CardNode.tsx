import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { CardNode as CardNodeModel } from '../stores/canvasStore';

export function CardNodeView({ data, selected }: NodeProps<CardNodeModel>) {
  return (
    <div
      className={`
        min-w-[280px] max-w-[360px] rounded-xl
        bg-[var(--bg-card)] border transition-all duration-200
        ${selected ? 'border-[var(--accent)] shadow-lg shadow-[var(--accent)]/20' : 'border-[var(--border)]'}
        hover:border-[var(--accent-glow)]
      `}
    >
      {/* 连接点 */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-[var(--accent)] !border-2 !border-[var(--bg-primary)]"
      />

      {/* 卡片头部 */}
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-tight">
          {data.title || '无标题'}
        </h3>
      </div>

      {/* 卡片内容 */}
      <div className="px-4 py-3">
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-4">
          {data.content || '点击编辑内容...'}
        </p>
      </div>

      {/* 来源标签 */}
      {data.source && (
        <div className="px-4 pb-3">
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-[var(--accent)]/10 text-[var(--accent)] text-xs">
            📎 {data.source}
          </span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-[var(--accent)] !border-2 !border-[var(--bg-primary)]"
      />
    </div>
  );
}

const CardNodeComponent = memo(CardNodeView);
CardNodeComponent.displayName = 'CardNodeView';

export default CardNodeComponent;
