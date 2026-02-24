import { beforeEach, describe, expect, it } from 'vitest';

import { createCardId, resetCardIdSequenceForTests } from './cardId';

describe('createCardId', () => {
  beforeEach(() => {
    resetCardIdSequenceForTests();
  });

  it('generates unique ids when called many times in the same millisecond', () => {
    const now = () => 1_700_000_000_000;
    const ids = new Set<string>();

    for (let i = 0; i < 1000; i += 1) {
      ids.add(createCardId(now, () => 'fixed-suffix'));
    }

    expect(ids.size).toBe(1000);
  });

  it('resets the sequence when timestamp changes', () => {
    const timeline = [100, 100, 101];
    const now = () => timeline.shift() ?? 101;

    const first = createCardId(now, () => 'r1');
    const second = createCardId(now, () => 'r2');
    const third = createCardId(now, () => 'r3');

    expect(first).toContain('card-100-0-');
    expect(second).toContain('card-100-1-');
    expect(third).toContain('card-101-0-');
  });
});
