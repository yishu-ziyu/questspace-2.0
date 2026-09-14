import { describe, expect, it } from 'vitest';

import { childPositions, CARD_W, CARD_H, CARD_PAD, parseSplitResponse, scaffoldSplit } from './splitThought';

const GAP = 8; // acceptance-contract minimum gap between card edges

function hasOverlap(
  spots: { x: number; y: number }[],
  extra: { x: number; y: number }[] = [],
): boolean {
  const all = [...spots, ...extra];
  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      const a = all[i], b = all[j];
      if (
        a.x < b.x + CARD_W + GAP &&
        a.x + CARD_W + GAP > b.x &&
        a.y < b.y + CARD_H + GAP &&
        a.y + CARD_H + GAP > b.y
      )
        return true;
    }
  }
  return false;
}

describe('parseSplitResponse', () => {
  it('reads a json object and drops empty titles', () => {
    const cards = parseSplitResponse(
      '```json\n{"cards":[{"title":"光反应","content":"膜上"},{"title":"","content":"x"},{"title":"碳反应","content":"基质"},{"title":"条件","content":"光"}]}\n```'
    );
    expect(cards.map((card) => card.title)).toEqual(['光反应', '碳反应', '条件']);
  });

  it('rejects a reply that is not a split', () => {
    expect(() => parseSplitResponse('先从光反应说起')).toThrow('拆开的结果读不出来');
  });
});

describe('scaffoldSplit', () => {
  it('cuts a how-it-works question into 3 process cards', () => {
    const titles = scaffoldSplit('光合作用是怎么工作的').map((card) => card.title);
    expect(titles).toEqual(['输入', '过程', '输出']);
  });

  it('always returns exactly 3 cards', () => {
    for (const q of ['还是', '为什么', '怎么', '随便']) {
      expect(scaffoldSplit(q)).toHaveLength(3);
    }
  });
});

describe('childPositions', () => {
  const step = CARD_H + CARD_PAD;
  const col = CARD_W + 40;

  it('fans three children in one column to the right', () => {
    const spots = childPositions({ x: 100, y: 200 }, 3);
    expect(spots).toEqual([
      { x: 100 + col, y: 200 - step },
      { x: 100 + col, y: 200 },
      { x: 100 + col, y: 200 + step },
    ]);
    expect(hasOverlap(spots)).toBe(false);
  });

  it('keeps four children in one column to the right', () => {
    const spots = childPositions({ x: 0, y: 0 }, 4);
    const xs = [...new Set(spots.map((spot) => spot.x))];
    expect(xs.length).toBe(1);
    expect(hasOverlap(spots)).toBe(false);
  });

  it('avoids an existing card that occupies the first candidate slot', () => {
    const blocker = { x: 100 + col, y: 200 - step };
    const spots = childPositions({ x: 100, y: 200 }, 3, [blocker]);
    expect(hasOverlap(spots, [blocker])).toBe(false);
    expect(spots[0].x).toBeGreaterThan(blocker.x);
  });

  it('re-splitting the same parent produces no overlap with the first split', () => {
    const first = childPositions({ x: 100, y: 200 }, 3);
    const second = childPositions({ x: 100, y: 200 }, 3, first);
    expect(hasOverlap([...first, ...second])).toBe(false);
    expect(Math.min(...second.map((spot) => spot.x))).toBeGreaterThan(
      Math.max(...first.map((spot) => spot.x)),
    );
  });

  it('places up to 6 cards without overlap', () => {
    const spots = childPositions({ x: 0, y: 0 }, 6);
    expect(spots).toHaveLength(6);
    expect(hasOverlap(spots)).toBe(false);
  });
});
