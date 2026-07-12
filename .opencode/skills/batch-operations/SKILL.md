---
name: batch-operations
description: Parallel execution patterns (JS p-limit, Python asyncio semaphore, ProcessPoolExecutor), rate-limit aware batching (token bucket), progress tracking, error aggregation, resume-from-failure with checkpointing, chunked file processing, Web3-specific parallel send patterns.
license: MIT
metadata:
  source: superagent-m12
---

## When to Batch
- N > 5 independent ops with same shape
- Each op is idempotent OR retryable
- Total sequential time > 30s

## Pattern A — JS p-limit
```js
const limit = pLimit(5);
const tasks = wallets.map(w => limit(() => process(w)));
const results = await Promise.allSettled(tasks);
```

## Pattern B — Python asyncio semaphore
```python
sem = asyncio.Semaphore(5)
results = await asyncio.gather(*[bounded(process(w)) for w in wallets], return_exceptions=True)
```

## Rate-Limit Aware Batching (token bucket)
```js
class TokenBucket {
  constructor(rate, capacity) { /* tokens refill at rate/sec */ }
  async take() { /* wait until token available */ }
}
```

## Resume from Failure (checkpointing)
Save state every N items:
```js
state = { done: [], failed: [] };
// load from ./batch-state.json if exists
// save after each item (or every 10 for 100+ items)
```

## Progress Tracking
```js
let done = 0;
setInterval(() => console.log(`[${done}/${total}] ${pct}%`), 5000);
```

## Output Format
```
[BATCH START] N=300 concurrency=10
[50/300] 16.7% eta ~1m40s
[DONE] ok=287 fail=13 → errors-1748150400.json
```

## Web3 — Parallel Send
- ONE wallet → serial only (or pre-assign nonces)
- MANY wallets → fully parallel safe
