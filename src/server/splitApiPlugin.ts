import type { IncomingMessage, ServerResponse } from 'node:http';

import type { Plugin } from 'vite';

import { parseSplitResponse, scaffoldSplit, type SplitResult } from '../utils/splitThought';

type SplitRequest = {
  title?: string;
  content?: string;
  nearbyTitles?: string[];
};

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

async function callAnthropicCompat(base: string, token: string, model: string, prompt: string): Promise<string> {
  const response = await fetch(`${base}/v1/messages`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': token,
      authorization: `Bearer ${token}`,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`model ${response.status}`);
  const data = (await response.json()) as { content?: Array<{ type?: string; text?: string }> };
  return data.content?.filter((p) => p.type === 'text').map((p) => p.text ?? '').join('') ?? '';
}

async function askModel(title: string, content: string, nearbyTitles: string[]): Promise<string> {
  const nearby = nearbyTitles.filter(Boolean).slice(0, 20).join('、') || '无';
  const prompt = [
    '你在帮人理清思路。把下面的问题或卡片拆成 3 或 4 个互不重复的概念。',
    '每个概念一个短标题，加一两句人可以改的说明。',
    '不要搜索网络，不要写长文，不要用编号当标题。',
    '只输出 JSON：{"cards":[{"title":"","content":""}]}',
    `已有卡片（不要重复）：${nearby}`,
    `标题：${title}`,
    content ? `正文：${content}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  // MiniMax first (Anthropic-compatible endpoint)
  const mmKey = process.env.MINIMAX_API_KEY;
  const mmBase = (process.env.MINIMAX_BASE_URL ?? 'https://api.minimaxi.com/anthropic').replace(/\/$/, '');
  const mmModel = process.env.MINIMAX_MODEL ?? 'MiniMax-M3';
  if (mmKey) return callAnthropicCompat(mmBase, mmKey, mmModel, prompt);

  // Anthropic fallback
  const base = process.env.ANTHROPIC_BASE_URL?.replace(/\/$/, '');
  const token = process.env.ANTHROPIC_AUTH_TOKEN;
  const model = process.env.ANTHROPIC_DEFAULT_SONNET_MODEL || 'claude-sonnet-4-6';
  if (base && token) return callAnthropicCompat(base, token, model, prompt);

  // StepFun fallback
  const stepKey = process.env.STEP_API_KEY || process.env.STEPFUN_API_KEY;
  if (stepKey) {
    const response = await fetch('https://api.stepfun.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${stepKey}` },
      body: JSON.stringify({ model: 'step-2-mini', messages: [{ role: 'user', content: prompt }], max_tokens: 800 }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`model ${response.status}`);
    const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    return data.choices?.[0]?.message?.content ?? '';
  }

  throw new Error('no model');
}

async function handleSplit(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    send(res, 405, { error: 'method' });
    return;
  }

  let payload: SplitRequest = {};
  try {
    payload = JSON.parse(await readBody(req)) as SplitRequest;
  } catch {
    send(res, 400, { error: 'bad json' });
    return;
  }

  const title = payload.title?.trim() ?? '';
  if (!title) {
    send(res, 400, { error: 'empty' });
    return;
  }

  const content = payload.content?.trim() ?? '';
  const nearbyTitles = payload.nearbyTitles ?? [];

  try {
    const text = await askModel(title, content, nearbyTitles);
    const cards = parseSplitResponse(text);
    const result: SplitResult = { cards, via: 'model' };
    send(res, 200, result);
  } catch {
    const result: SplitResult = { cards: scaffoldSplit(title), via: 'scaffold' };
    send(res, 200, result);
  }
}

export function splitApiPlugin(): Plugin {
  const middleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (req.url?.split('?')[0] !== '/api/split') {
      next();
      return;
    }
    void handleSplit(req, res);
  };

  return {
    name: 'split-api',
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}
