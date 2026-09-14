const ORIGIN = { x: 288, y: 96 };
const COL = 340;
const ROW = 220;

export function nextCardPosition(count: number): { x: number; y: number } {
  return {
    x: ORIGIN.x + (count % 3) * COL,
    y: ORIGIN.y + Math.floor(count / 3) * ROW,
  };
}
