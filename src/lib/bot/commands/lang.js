import { sendMessage }                          from '../../telegram/api.js';
import { getUserByTelegramId, updatePreference } from '../../db/supabase.js';

const LANGUAGES = {
  id: { label: 'Bahasa Indonesia', flag: '🇮🇩', confirm: 'Oke! Saya akan menjawab dalam Bahasa Indonesia.' },
  en: { label: 'English',          flag: '🇬🇧', confirm: "Got it! I'll respond in English from now on." },
};

/**
 * /lang       — show current language & options
 * /lang en    — switch to English
 * /lang id    — switch to Bahasa Indonesia
 */
export async function handleLang(message, args) {
  const { chat, from } = message;
  const chatId = chat.id;

  if (!from) return;

  const user = await getUserByTelegramId(from.id);
  if (!user) {
    await sendMessage(chatId, '⚠️ Ketik /start dulu.');
    return;
  }

  const prefs   = user.user_preferences?.[0] || {};
  const current = prefs.language || 'id';

  // ── VIEW MODE ─────────────────────────────────────────────
  if (!args || args.length === 0) {
    const list = Object.entries(LANGUAGES)
      .map(([code, l]) => {
        const active = code === current ? ' ✅' : '';
        return `${l.flag}${active} *${l.label}* — /lang ${code}`;
      })
      .join('\n');

    await sendMessage(
      chatId,
      `🌐 *Bahasa*\n\n*Aktif:* ${LANGUAGES[current]?.flag} ${LANGUAGES[current]?.label}\n\n*Pilihan:*\n${list}`
    );
    return;
  }

  // ── SWITCH MODE ───────────────────────────────────────────
  const target = args[0].toLowerCase().trim();

  if (!LANGUAGES[target]) {
    await sendMessage(chatId, '❌ Bahasa tidak valid.\n\nPilihan: `id` (Indonesia) atau `en` (English)');
    return;
  }

  if (target === current) {
    await sendMessage(chatId, `ℹ️ Bahasa sudah diatur ke *${LANGUAGES[target].label}*.`);
    return;
  }

  await updatePreference(user.id, 'language', target);

  const l = LANGUAGES[target];
  await sendMessage(chatId, `${l.flag} ${l.confirm}`);
}
