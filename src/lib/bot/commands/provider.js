import { sendMessage }                          from '../../telegram/api.js';
import { getUserByTelegramId, updatePreference } from '../../db/supabase.js';

const PROVIDERS = {
  gemini:     { label: 'Google Gemini', desc: 'General purpose, stabil',     defaultModel: 'gemini-2.0-flash' },
  groq:       { label: 'Groq',          desc: 'Sangat cepat',                defaultModel: 'llama-3.1-8b-instant' },
  openrouter: { label: 'OpenRouter',    desc: 'Banyak pilihan model gratis', defaultModel: 'mistralai/mistral-7b-instruct:free' },
};

/**
 * /provider        — show current provider & list
 * /provider groq   — switch to groq
 */
export async function handleProvider(message, args) {
  const { chat, from } = message;
  const chatId = chat.id;

  if (!from) return;

  const user  = await getUserByTelegramId(from.id);
  if (!user) {
    await sendMessage(chatId, '⚠️ Ketik /start dulu.');
    return;
  }

  const prefs   = user.user_preferences?.[0] || {};
  const current = prefs.default_provider || 'gemini';

  // ── VIEW MODE (no args) ───────────────────────────────────
  if (!args || args.length === 0) {
    const list = Object.entries(PROVIDERS)
      .map(([key, p]) => {
        const active = key === current ? ' ✅' : '';
        return `${active} *${p.label}* — ${p.desc}\n  Ketik: /provider ${key}`;
      })
      .join('\n\n');

    await sendMessage(
      chatId,
      `🤖 *AI Provider*\n\n*Provider aktif:* ${PROVIDERS[current]?.label || current}\n*Model:* \`${prefs.default_model || PROVIDERS[current]?.defaultModel}\`\n\n*Provider tersedia:*\n\n${list}`
    );
    return;
  }

  // ── SWITCH MODE ───────────────────────────────────────────
  const target = args[0].toLowerCase().trim();

  if (!PROVIDERS[target]) {
    const validList = Object.keys(PROVIDERS).join(', ');
    await sendMessage(chatId, `❌ Provider tidak valid.\n\nPilihan: \`${validList}\``);
    return;
  }

  if (target === current) {
    await sendMessage(chatId, `ℹ️ Kamu sudah pakai *${PROVIDERS[target].label}*.`);
    return;
  }

  const newModel = PROVIDERS[target].defaultModel;
  await updatePreference(user.id, 'default_provider', target);
  await updatePreference(user.id, 'default_model', newModel);

  await sendMessage(
    chatId,
    `✅ *Provider diganti ke ${PROVIDERS[target].label}*\n\nModel default: \`${newModel}\`\n\n_Ketik /model untuk melihat model lain._`
  );
}
