type RandomIdGenerator = () => string;

let lastTimestamp = 0;
let sequence = 0;

function defaultRandomId(): string {
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2, 10);
}

export function createCardId(
  now: () => number = Date.now,
  randomId: RandomIdGenerator = defaultRandomId
): string {
  const timestamp = now();

  if (timestamp === lastTimestamp) {
    sequence += 1;
  } else {
    lastTimestamp = timestamp;
    sequence = 0;
  }

  return `card-${timestamp}-${sequence}-${randomId()}`;
}

export function resetCardIdSequenceForTests(): void {
  lastTimestamp = 0;
  sequence = 0;
}
