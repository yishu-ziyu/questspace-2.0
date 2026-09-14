export type SplitCard = {
  title: string;
  content: string;
};

export type SplitResult = {
  cards: SplitCard[];
  via: 'model' | 'scaffold';
};

const MIN = 3;
const MAX = 4;

export function clampSplitCards(cards: SplitCard[]): SplitCard[] {
  return cards
    .map((card) => ({
      title: card.title.trim(),
      content: card.content.trim(),
    }))
    .filter((card) => card.title)
    .slice(0, MAX);
}

export function parseSplitResponse(text: string): SplitCard[] {
  const trimmed = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start < 0 || end <= start) {
    throw new Error('拆开的结果读不出来');
  }

  const parsed = JSON.parse(trimmed.slice(start, end + 1)) as { cards?: SplitCard[] };
  const cards = clampSplitCards(parsed.cards ?? []);
  if (cards.length < MIN) {
    throw new Error('拆开的结果太少');
  }
  return cards;
}

export function scaffoldSplit(question: string): SplitCard[] {
  const q = question.trim();

  if (/还是|对比|区别|不同|vs|VS|和.+比/.test(q)) {
    return [
      { title: '一边', content: `先只写其中一方。\n\n从「${q}」里拆出来。` },
      { title: '另一边', content: '再只写另一方，先不要比较。' },
      { title: '差异', content: '两边必须分开谈的那一点。' },
    ];
  }

  if (/为什么|为何|原因/.test(q)) {
    return [
      { title: '直接原因', content: `最靠近结果的那一层。\n\n问题：${q}` },
      { title: '更深一层', content: '直接原因背后还有什么。' },
      { title: '反例', content: '有没有同样条件却没发生的情况。' },
    ];
  }

  if (/怎么|如何|怎样|工作|运作|发生/.test(q)) {
    return [
      { title: '输入', content: `「${q}」里，先进来的是什么。` },
      { title: '过程', content: '中间发生了哪几步。一步一张卡更好。' },
      { title: '输出', content: '最后变成了什么。' },
    ];
  }

  return [
    { title: '一句话', content: `用一句话重写：${q}` },
    { title: '零件', content: '这里面混了几个不同的东西。' },
    { title: '先放一边', content: '哪一块现在可以先不谈。' },
  ];
}

// Card bounding-box constants (must match .card-node CSS dimensions).
// CARD_H is conservative: actual min-height is 168px but content can grow.
export const CARD_W = 280;
export const CARD_H = 220;
export const CARD_PAD = 20; // min gap between card edges

type Pos = { x: number; y: number };

function blocked(candidate: Pos, occupied: Pos[]): boolean {
  const cw = CARD_W + CARD_PAD;
  const ch = CARD_H + CARD_PAD;
  return occupied.some(
    (o) =>
      candidate.x < o.x + cw &&
      candidate.x + cw > o.x &&
      candidate.y < o.y + ch &&
      candidate.y + ch > o.y,
  );
}

// Cards land in a single column to the right of the parent.
// If that column overlaps any occupied card, the whole column shifts right by one step.
// ponytail: O(n·cols) scan; fine for dozens of cards.
export function childPositions(
  origin: Pos,
  count: number,
  occupied: Pos[] = [],
): Pos[] {
  const colW = CARD_W + 40;
  const rowH = CARD_H + CARD_PAD;
  for (let col = 1; col <= 20; col++) {
    const spots = Array.from({ length: count }, (_, i) => ({
      x: origin.x + col * colW,
      y: origin.y + (i - (count - 1) / 2) * rowH,
    }));
    if (!spots.some((s) => blocked(s, occupied))) return spots;
  }
  // ponytail: unreachable in practice; board would need to be 20 columns wide
  return Array.from({ length: count }, (_, i) => ({
    x: origin.x + 20 * colW,
    y: origin.y + (i - (count - 1) / 2) * rowH,
  }));
}
