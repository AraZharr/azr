import { sendMessage }                          from '../../telegram/api.js';
import { getUserByTelegramId, updatePreference } from '../../db/supabase.js';

const MODES = {
  balanced: {
    label:   'Balanced',
    emoji:   '⚖️',
    desc:    'Default — jawaban seimbang, baik dan jelas',
    confirm: 'Saya akan menjawab dengan seimbang — tidak terlalu singkat, tidak terlalu panjang.',
  },
  concise: {
    label:   'Concise',
    emoji:   '⚡',
    desc:    'Singkat & padat — langsung ke inti',
    confirm: 'Saya akan menjawab sesingkat mungkin. Langsung ke inti.',
  },
  detailed: {
    label:   'Detailed',
    emoji:   '📖',
    desc:    'Lengkap & mendalam — dengan penjelasan',
    confirm: 'Saya akan menjawab dengan lengkap dan mendalam, disertai penjelasan dan contoh.',
  },
  coding: {
    label:   'Coding',
    emoji:   '💻',
    desc:    'Fokus programming — kode, contoh, best practice',
    confirm: 'Mode coding aktif. Saya akan fokus pada kode, implementasi, dan best practice teknis.',
  },
  creative: {
    label:   'Creative',
    emoji:   '🎨',
    desc:    'Kreatif & bebas — eksplorasi ide',
    confirm: 'Mode kreatif aktif. Saya bebas bereksplorasi, pakai analogi, dan berpikir di luar kebiasaan.',
  },
};

/**
 * /mode          — show available modes
 * /mode coding   — switch to coding mode
 */
export async function handleMode(message, args) {
  const { chat, from } = message;
  const chatId = chat.id;

  if (!from) return;

  const user = await getUserByTelegramId(from.id);
  if (!user) {
    await sendMessage(chatId, '⚠️ Ketik /start dulu.');
    return;
  }

  const prefs   = user.user_preferences?.[0] || {};
  const current = prefs.response_style || 'balanced';

  // ── VIEW MODE ─────────────────────────────────────────────
  if (!args || args.length === 0) {
    const list = Object.entries(MODES)
      .map(([key, m]) => {
        const active = key === current ? ' ✅' : '';
        return `${m.emoji}${active} *${m.label}* — ${m.desc}\n  Ketik: /mode ${key}`;
      })
      .join('\n\n');

    await sendMessage(
      chatId,
      `🎭 *Mode Jawaban*\n\n*Mode aktif:* ${MODES[current]?.emoji} ${MODES[current]?.label}\n\n${list}`
    );
    return;
  }

  // ── SWITCH MODE ───────────────────────────────────────────
  const target = args[0].toLowerCase().trim();

  if (!MODES[target]) {
    const valid = Object.keys(MODES).join(', ');
    await sendMessage(chatId, `❌ Mode tidak valid.\n\nPilihan: \`${valid}\``);
    return;
  }

  if (target === current) {
    await sendMessage(chatId, `ℹ️ Mode *${MODES[target].label}* sudah aktif.`);
    return;
  }

  await updatePreference(user.id, 'response_style', target);

  const m = MODES[target];
  await sendMessage(
    chatId,
    `✅ *Mode diganti ke: ${m.emoji} ${m.label}*\n\n${m.confirm}`
  );
}
