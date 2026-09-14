import { describe, expect, it } from 'vitest';

import { nextCardPosition } from './cardPosition';

describe('nextCardPosition', () => {
  it('places the first card at the origin', () => {
    expect(nextCardPosition(0)).toEqual({ x: 288, y: 96 });
  });

  it('offsets later cards on a 3-column grid so they do not stack', () => {
    expect(nextCardPosition(1)).toEqual({ x: 628, y: 96 });
    expect(nextCardPosition(2)).toEqual({ x: 968, y: 96 });
    expect(nextCardPosition(3)).toEqual({ x: 288, y: 316 });
  });
});
