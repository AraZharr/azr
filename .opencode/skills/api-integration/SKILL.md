---
name: api-integration
description: HTTP bridge layer with retry + timeout + idempotency (JS/Python), circuit breaker, rate limiter (token bucket), HMAC webhook verification, Midtrans Snap/Xendit payments, WhatsApp Cloud API integration.
license: MIT
metadata:
  source: superagent-m6
---

## JS Bridge Layer
```js
async function call(url, { method = 'GET', body = null, headers = {}, timeout = 30000, retries = 3, idempotencyKey = null } = {}) {
  // fetch with retry on 5xx/429, exponential backoff, timeout via AbortController
}
```

## Circuit Breaker
Prevents hammering broken services: CLOSED → OPEN (after threshold failures) → HALF (after timeout)

## Rate Limit Handler (token bucket)
```js
class RateLimit {
  constructor({ rps = 10 } = {}) { /* token bucket algorithm */ }
  async acquire() { /* waits until token available */ }
}
```

## Webhook Signature Verification (HMAC)
```js
function verifySignature(body, signature, secret) {
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
```

## Midtrans Snap
```js
const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === 'production',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});
```

## Constraints
- `.env.example` with every var
- Idempotency key on POST that creates resources
- Webhook receivers: ALWAYS verify signature
- Timeout on every external call
- Retry only on transient errors (429, 5xx, network)
