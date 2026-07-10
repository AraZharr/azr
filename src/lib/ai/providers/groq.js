import Groq from 'groq-sdk';

const MODELS = {
  'llama-3.1-8b-instant':     'llama-3.1-8b-instant',
  'llama-3.3-70b-versatile':  'llama-3.3-70b-versatile',
  'mixtral-8x7b-32768':       'mixtral-8x7b-32768',
  'gemma2-9b-it':             'gemma2-9b-it',
};

const DEFAULT_MODEL = 'llama-3.1-8b-instant';

export const groqProvider = {
  name:          'groq',
  displayName:   'Groq',
  defaultModel:  DEFAULT_MODEL,
  availableModels: Object.keys(MODELS),

  /**
   * Send messages to Groq and return the text response.
   * @param {string} systemPrompt
   * @param {Array}  messages     — [{role:'user'|'assistant', content: string}]
   * @param {string} model
   * @returns {Promise<{text: string, tokensIn: number, tokensOut: number}>}
   */
  async chat(systemPrompt, messages, model = DEFAULT_MODEL) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('GROQ_API_KEY not set');

    const groq      = new Groq({ apiKey });
    const modelName = MODELS[model] || DEFAULT_MODEL;

    // Groq uses standard OpenAI-compatible format
    const completion = await groq.chat.completions.create({
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
    });

    const choice = completion.choices[0];
    const text   = choice?.message?.content || '';

    return {
      text,
      tokensIn:  completion.usage?.prompt_tokens     || 0,
      tokensOut: completion.usage?.completion_tokens || 0,
    };
  },
};
