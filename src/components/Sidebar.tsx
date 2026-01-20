import { useState } from 'react';
import { useCanvasStore } from '../stores/canvasStore';

export function Sidebar() {
  const [query, setQuery] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const addCard = useCanvasStore((s) => s.addCard);
  const nodes = useCanvasStore((s) => s.nodes);

  const handleResearch = async () => {
    if (!query.trim()) return;
    
    setIsResearching(true);
    
    // TODO: 连接 AI 后端
    // 现在先模拟添加卡片
    setTimeout(() => {
      const centerX = 300 + Math.random() * 200;
      const centerY = 200 + Math.random() * 200;
      
      addCard(
        query,
        `这是关于「${query}」的研究结果。\n\nAI 分析将在后续版本中集成...`,
        { x: centerX, y: centerY }
      );
      
      setQuery('');
      setIsResearching(false);
    }, 800);
  };

  return (
    <aside className="w-80 h-screen bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-[var(--border)]">
        <h1 className="text-xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--accent-glow)] bg-clip-text text-transparent">
          🧠 QuestSpace
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          知识图谱白板
        </p>
      </div>

      {/* 研究输入 */}
      <div className="p-4 border-b border-[var(--border)]">
        <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">
          AI 研究
        </label>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
            placeholder="输入研究问题..."
            className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg
                       text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]
                       focus:outline-none focus:border-[var(--accent)]"
          />
          <button
            onClick={handleResearch}
            disabled={isResearching || !query.trim()}
            className="w-full py-2 bg-[var(--accent)] hover:bg-[var(--accent-glow)] 
                       text-white font-medium rounded-lg transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResearching ? '🔍 研究中...' : '🚀 开始研究'}
          </button>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="p-4 border-b border-[var(--border)]">
        <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">
          快捷操作
        </label>
        <button
          onClick={() => addCard('新卡片', '', { x: 200, y: 200 })}
          className="w-full py-2 bg-[var(--bg-primary)] border border-[var(--border)]
                     hover:border-[var(--accent)] text-[var(--text-primary)] rounded-lg transition-colors"
        >
          ➕ 添加空白卡片
        </button>
      </div>

      {/* 卡片列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        <label className="text-xs text-[var(--text-secondary)] uppercase tracking-wider mb-2 block">
          卡片 ({nodes.length})
        </label>
        <div className="space-y-2">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="p-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg
                         hover:border-[var(--accent)] cursor-pointer transition-colors"
            >
              <p className="text-sm text-[var(--text-primary)] truncate">
                {node.data.title || '无标题'}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1 truncate">
                {node.data.content?.slice(0, 50) || '无内容'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
