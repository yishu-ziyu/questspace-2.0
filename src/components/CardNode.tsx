import { memo, useEffect, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

import type { CardNode as CardNodeModel } from '../stores/canvasStore';
import { useCanvasStore } from '../stores/canvasStore';
import { runSplit } from '../utils/runSplit';

export function CardNodeView({ id, data, selected }: NodeProps<CardNodeModel>) {
  const updateCard = useCanvasStore((s) => s.updateCard);
  const deleteCard = useCanvasStore((s) => s.deleteCard);
  const splittingId = useCanvasStore((s) => s.splittingId);
  const setSplittingId = useCanvasStore((s) => s.setSplittingId);
  const [draftTitle, setDraftTitle] = useState(data.title);
  const [draftContent, setDraftContent] = useState(data.content);
  const busy = splittingId === id;

  useEffect(() => {
    setDraftTitle(data.title);
    setDraftContent(data.content);
  }, [data.title, data.content]);

  const split = async () => {
    if (busy || splittingId) return;
    setSplittingId(id);
    try {
      await runSplit({
        title: draftTitle.trim() || data.title,
        content: draftContent || data.content,
        parentId: id,
      });
    } finally {
      setSplittingId(null);
    }
  };

  return (
    <div className="card-node" data-selected={selected ? 'true' : 'false'} data-busy={busy}>
      <Handle type="target" id="t" position={Position.Top} />
      <Handle type="target" id="l" position={Position.Left} />

      <div className="card-actions">
        <button
          type="button"
          className="card-split pressable nodrag"
          disabled={busy || Boolean(splittingId)}
          onClick={() => void split()}
        >
          {busy ? '拆开中' : '拆开'}
        </button>
        <button type="button" className="card-delete pressable nodrag" onClick={() => deleteCard(id)}>
          删除
        </button>
      </div>

      <input
        className="card-title nodrag nopan nowheel"
        value={draftTitle}
        placeholder="未命名"
        onChange={(e) => setDraftTitle(e.target.value)}
        onBlur={() => updateCard(id, { title: draftTitle.trim() || '未命名' })}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur();
          e.stopPropagation();
        }}
      />

      <textarea
        className="card-body nodrag nopan nowheel"
        data-empty={draftContent.trim() ? 'false' : 'true'}
        value={draftContent}
        placeholder="点这里写"
        rows={3}
        onChange={(e) => setDraftContent(e.target.value)}
        onBlur={() => updateCard(id, { content: draftContent })}
        onKeyDown={(e) => e.stopPropagation()}
      />

      <Handle type="source" id="b" position={Position.Bottom} />
      <Handle type="source" id="r" position={Position.Right} />
    </div>
  );
}

const CardNodeComponent = memo(CardNodeView);
CardNodeComponent.displayName = 'CardNodeView';

export default CardNodeComponent;
