import { useState } from 'react';

import { useCanvasStore } from '../stores/canvasStore';
import { runSplit } from '../utils/runSplit';

export function Composer() {
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const nodes = useCanvasStore((s) => s.nodes);
  const addCard = useCanvasStore((s) => s.addCard);
  const splitNote = useCanvasStore((s) => s.splitNote);
  const setSplitNote = useCanvasStore((s) => s.setSplitNote);
  const empty = nodes.length === 0;
  const note = error || splitNote;

  const split = async () => {
    const title = query.trim();
    if (!title || busy) return;

    setBusy(true);
    setError('');
    setSplitNote('');
    try {
      await runSplit({ title });
      setQuery('');
    } catch {
      setError('拆不开，再试一次。');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={empty ? 'composer composer-empty' : 'composer composer-dock'}>
      {empty ? (
        <>
          <h1 className="composer-title">QuestSpace</h1>
          <p className="composer-deck">把一个问题拆开，看成一张图</p>
        </>
      ) : null}

      <div className="composer-card" data-busy={busy}>
        <div className="composer-row">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && void split()}
            placeholder="问一个问题，或写下一句还没理清的话"
            disabled={busy}
          />
          <button
            type="button"
            className="btn-cta pressable"
            onClick={() => void split()}
            disabled={busy || !query.trim()}
          >
            {busy ? '拆开中' : '拆开'}
          </button>
        </div>
        {note ? <p className="composer-note">{note}</p> : null}
        <button type="button" className="btn-text pressable" onClick={() => addCard('未命名', '')}>
          添加空白卡片
        </button>
      </div>
    </div>
  );
}
