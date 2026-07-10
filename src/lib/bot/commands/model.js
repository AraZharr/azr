import { sendMessage }                          from '../../telegram/api.js';
import { getUserByTelegramId, updatePreference } from '../../db/supabase.js';
import { getModelsForProvider }                  from '../../ai/router.js';

const MODEL_DESC = {
  // Gemini
  'gemini-2.0-flash':  'Cepat, hemat token',
  'gemini-1.5-flash':  'Stabil, context besar',
  // Groq
  'llama-3.1-8b-instant':    'Sangat cepat, ringan',
  'llama-3.3-70b-versatile': 'Lebih pintar, sedikit lebih lambat',
  'mixtral-8x7b-32768':      'Context panjang, balanced',
  'gemma2-9b-it':            'Compact, efisien',
  // OpenRouter
  'mistralai/mistral-7b-instruct:free':    'Mistral 7B, gratis',
  'meta-llama/llama-3.2-3b-instruct:free': 'Llama 3.2 3B, sangat cepat',
  'google/gemma-2-9b-it:free':             'Gemma 2 9B, gratis',
  'qwen/qwen-2.5-7b-instruct:free':        'Qwen 2.5 7B, multilingual',
};

/**
 * /model           — show models for current provider
 * /model [name]    — switch to that model
 */
export async function handleModel(message, args) {
  const { chat, from } = message;
  const chatId = chat.id;

  if (!from) return;

  const user = await getUserByTelegramId(from.id);
  if (!user) {
    await sendMessage(chatId, '⚠️ Ketik /start dulu.');
    return;
  }

  const prefs    = user.user_preferences?.[0] || {};
  const provider = prefs.default_provider || 'gemini';
  const current  = prefs.default_model    || '';
  const models   = getModelsForProvider(provider);

  // ── VIEW MODE ─────────────────────────────────────────────
  if (!args || args.length === 0) {
    const list = models
      .map((m, i) => {
        const active = m === current ? ' ✅' : '';
        const desc   = MODEL_DESC[m] || '';
        return `${i + 1}.${active} \`${m}\`${desc ? '\n   _' + desc + '_' : ''}`;
      })
      .join('\n\n');

    await sendMessage(
      chatId,
      `🧩 *AI Model*\n\n*Provider:* ${capitalize(provider)}\n*Model aktif:* \`${current || '(default)'}\`\n\n*Model tersedia:*\n\n${list}\n\n_Ketik /model [nama] untuk mengganti._`
    );
    return;
  }

  // ── SWITCH MODE ───────────────────────────────────────────
  const target = args.join(' ').trim();

  if (!models.includes(target)) {
    await sendMessage(
      chatId,
      `❌ Model tidak valid untuk provider *${capitalize(provider)}*.\n\nKetik /model untuk melihat pilihan yang tersedia.`
    );
    return;
  }

  if (target === current) {
    await sendMessage(chatId, `ℹ️ Kamu sudah pakai model \`${target}\`.`);
    return;
  }

  await updatePreference(user.id, 'default_model', target);

  await sendMessage(
    chatId,
    `✅ *Model diganti ke* \`${target}\``
  );
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}
