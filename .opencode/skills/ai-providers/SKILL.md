---
name: ai-providers
description: Multi-provider LLM inference (Anthropic Claude, OpenAI, OpenRouter, Kimi, Groq, DeepSeek), streaming SSE, provider fallback chain, function calling/tool use, cost tracking, caching layer, and behavioral spec architecture.
license: MIT
metadata:
  source: superagent-m7
---

## Provider Registry
| Provider | Best For |
|----------|----------|
| Anthropic Claude | Best reasoning, agent loops |
| OpenRouter | Multi-model gateway |
| Kimi (Moonshot) | 128k+ context, Asia langs |
| Groq | Ultra-fast (Llama/Mixtral) |
| DeepSeek | Cheap, strong on coding |

## Provider Selection Guide
- Best reasoning + agent loops → Anthropic Claude
- Cheapest decent quality → DeepSeek
- Long context (>50k) → Kimi (128k) or Gemini (1M)
- Fastest first token → Groq
- Multimodal → GPT-4o, Claude, Gemini

## Fallback Chain
```js
const CHAIN = [
  () => inferClaude(SPEC, prompt),
  () => inferOAICompat('openai', SPEC, prompt),
  () => inferOR('deepseek/deepseek-chat', SPEC, prompt),
  () => inferKimi(SPEC, prompt),
];
```

## Cost Tracking
- Track per-model pricing (USD per 1M tokens)
- log input_tokens + output_tokens
- Use Anthropic prompt caching for repeated system prompts (~90% cost reduction on hit)

## Behavioral Spec Architecture
[ROLE] [CONTEXT] [CAPABILITIES] [CONSTRAINTS] [OUTPUT_FORMAT] [EXAMPLES]

## Constraints
- Runnable implementation, never pseudocode
- Token cost estimate when call repeated >1000x/day
- Caching for repeated identical prompts
- Streaming for UI-facing response
- Fallback chain for production-critical paths
