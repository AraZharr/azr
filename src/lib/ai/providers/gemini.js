import { GoogleGenerativeAI } from '@google/generative-ai';

const MODELS = {
  'gemini-2.0-flash':  'gemini-2.0-flash',
  'gemini-1.5-flash':  'gemini-1.5-flash',
};

const DEFAULT_MODEL = 'gemini-2.0-flash';

export const geminiProvider = {
  name:          'gemini',
  displayName:   'Google Gemini',
  defaultModel:  DEFAULT_MODEL,
  availableModels: Object.keys(MODELS),

  /**
   * Send messages to Gemini and return the text response.
   * @param {string} systemPrompt
   * @param {Array}  messages     — [{role:'user'|'assistant', content: string}]
   * @param {string} model
   * @returns {Promise<{text: string, tokensIn: number, tokensOut: number}>}
   */
  async chat(systemPrompt, messages, model = DEFAULT_MODEL) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not set');

    const genAI     = new GoogleGenerativeAI(apiKey);
    const modelName = MODELS[model] || DEFAULT_MODEL;

    const geminiModel = genAI.getGenerativeModel({
      model:              modelName,
      systemInstruction:  systemPrompt,
      generationConfig: {
        temperature:     0.7,
        topK:            40,
        topP:            0.95,
        maxOutputTokens: 2048,
      },
    });

    // Convert messages to Gemini format
    // Gemini uses 'user' and 'model' roles
    const history = messages.slice(0, -1).map((m) => ({
      role:  m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1]?.content || '';

    const chat    = geminiModel.startChat({ history });
    const result  = await chat.sendMessage(lastMessage);
    const response = result.response;
    const text     = response.text();

    return {
      text,
      tokensIn:  response.usageMetadata?.promptTokenCount     || 0,
      tokensOut: response.usageMetadata?.candidatesTokenCount || 0,
    };
  },
};
