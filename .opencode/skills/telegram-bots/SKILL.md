---
name: telegram-bots
description: Production Telegram bot patterns (Node.js/Telegraf), polling with anti-duplicate, webhook mode with signature verification, multi-bot orchestration, cron/APScheduler scheduling, webhook receivers (FastAPI), idempotent job processing, and worker queues.
license: MIT
metadata:
  source: superagent-m4
---

## Production Bot Patterns
- **Polling mode**: include dedupe by message_id + polling_error handler (409 conflict handling)
- **Webhook mode**: `bot.setWebHook(url)`, Express receiver with raw body + signature verification
- **Telegraf**: cleaner middleware API, `.use()` for logging, `.start()`, `.command()`, `.on('text')`

## Safe Send with Retry
```js
async function safeSend(chatId, text, opts = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await bot.sendMessage(chatId, text, { parse_mode: 'Markdown', ...opts });
    } catch (e) {
      if (e.response?.body?.error_code === 429) {
        const wait = (e.response.body.parameters?.retry_after || 1) * 1000;
        await new Promise(r => setTimeout(r, wait));
      } else throw e;
    }
  }
}
```

## Scheduling Options
- **cron**: system-wide `crontab -e`
- **node-cron**: in-process for bots
- **APScheduler**: Python services

## Webhook Receiver (FastAPI)
```python
@app.post('/webhook')
async def receive(request: Request, x_signature: str = Header(None)):
    body = await request.body()
    if not x_signature or not verify(x_signature, body):
        raise HTTPException(401, "Invalid signature")
```

## Idempotent Job Pattern
- File-backed Set or Redis SET or DB UNIQUE constraint
- `Promise.allSettled` over `Promise.all` for batch ops

## Multi-bot Orchestration
```js
const bots = {
  airdrop: new TelegramBot(process.env.AIRDROP_BOT_TOKEN, { polling: true }),
  alpha:   new TelegramBot(process.env.ALPHA_BOT_TOKEN,   { polling: true }),
};
```
