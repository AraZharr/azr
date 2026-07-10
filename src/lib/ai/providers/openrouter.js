// ============================================================
// OpenRouter Provider
// OpenRouter is OpenAI-API-compatible, so we use fetch directly
// Free models available at: https://openrouter.ai/models?q=free
// ============================================================

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';

// Free models available on OpenRouter (may change — check dashboard)
const MODELS = {
  'mistralai/mistral-7b-instruct:free':   'mistralai/mistral-7b-instruct:free',
  'meta-llama/llama-3.2-3b-instruct:free': 'meta-llama/llama-3.2-3b-instruct:free',
  'google/gemma-2-9b-it:free':            'google/gemma-2-9b-it:free',
  'qwen/qwen-2.5-7b-instruct:free':       'qwen/qwen-2.5-7b-instruct:free',
};

const DEFAULT_MODEL = 'mistralai/mistral-7b-instruct:free';

export const openrouterProvider = {
  name:          'openrouter',
  displayName:   'OpenRouter',
  defaultModel:  DEFAULT_MODEL,
  availableModels: Object.keys(MODELS),

  /**
   * Send messages to OpenRouter and return the text response.
   * @param {string} systemPrompt
   * @param {Array}  messages     — [{role:'user'|'assistant', content: string}]
   * @param {string} model
   * @returns {Promise<{text: string, tokensIn: number, tokensOut: number}>}
   */
  async chat(systemPrompt, messages, model = DEFAULT_MODEL) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error('OPENROUTER_API_KEY not set');

    const modelName = MODELS[model] || DEFAULT_MODEL;

    const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer':  process.env.NEXT_PUBLIC_APP_URL || 'https://clover-bot.vercel.app',
        'X-Title':       'Clover Telegram Bot',
      },
      body: JSON.stringify({
        model:       modelName,
        temperature: 0.7,
        max_tokens:  2048,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map((m) => ({
            role:    m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
          })),
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenRouter ${res.status}: ${err}`);
    }

    const json    = await res.json();
    const choice  = json.choices?.[0];
    const text    = choice?.message?.content || '';

    return {
      text,
      tokensIn:  json.usage?.prompt_tokens     || 0,
      tokensOut: json.usage?.completion_tokens || 0,
    };
  },
};
