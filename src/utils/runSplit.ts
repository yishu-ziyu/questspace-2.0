import { requestSplit } from '../api/requestSplit';
import { useCanvasStore } from '../stores/canvasStore';

export async function runSplit(input: {
  title: string;
  content?: string;
  parentId?: string;
}): Promise<'model' | 'scaffold'> {
  const nearbyTitles = useCanvasStore
    .getState()
    .nodes.filter((node) => node.id !== input.parentId)
    .map((node) => node.data.title);

  const result = await requestSplit({
    title: input.title,
    content: input.content,
    nearbyTitles,
  });

  const store = useCanvasStore.getState();
  store.applySplit({
    parentId: input.parentId,
    hubTitle: input.parentId ? undefined : input.title,
    children: result.cards,
  });
  store.setSplitNote(
    result.via === 'scaffold' ? '还没有接上模型，先按问题类型切开。你可以改、删。' : ''
  );

  return result.via;
}
