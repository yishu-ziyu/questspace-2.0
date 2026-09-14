import type { SplitResult } from '../utils/splitThought';

export async function requestSplit(input: {
  title: string;
  content?: string;
  nearbyTitles: string[];
}): Promise<SplitResult> {
  const response = await fetch('/api/split', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error('拆不开');
  }

  return (await response.json()) as SplitResult;
}
