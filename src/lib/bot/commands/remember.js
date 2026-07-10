import { sendMessage }                    from '../../telegram/api.js';
import { getUserByTelegramId, addMemory } from '../../db/supabase.js';

const MIN_LENGTH  = 3;
const MAX_LENGTH  = 200;
const LIMIT       = parseInt(process.env.LONG_TERM_MEMORY_LIMIT || '50');

/**
 * /remember [teks] — Save a fact to long-term memory
 *
 * Validation:
 * - Text required (not empty)
 * - Min 3 characters
 * - Max 200 characters
 * - Max LIMIT entries per user
 */
export async function handleRemember(message, args) {
  const { chat, from } = message;
  const chatId = chat.id;

  if (!from) return;

  // ── VALIDATE INPUT ────────────────────────────────────────
  const text = args?.join(' ').trim() || '';

  if (!text) {
    await sendMessage(
      chatId,
      `💡 *Cara pakai:*\n\`/remember [informasi yang ingin disimpan]\`\n\n*Contoh:*\n/remember nama saya Budi\n/remember saya sedang belajar Rust\n/remember jangan pakai emoji terlalu banyak`
    );
    return;
  }

  if (text.length < MIN_LENGTH) {
    await sendMessage(chatId, `❌ Teks terlalu pendek. Minimal ${MIN_LENGTH} karakter.`);
    return;
  }

  if (text.length > MAX_LENGTH) {
    await sendMessage(chatId, `❌ Teks terlalu panjang. Maksimal ${MAX_LENGTH} karakter. (saat ini: ${text.length})`);
    return;
  }

  // ── GET USER ──────────────────────────────────────────────
  const user = await getUserByTelegramId(from.id);
  if (!user) {
    await sendMessage(chatId, '⚠️ Ketik /start dulu.');
    return;
  }

  // ── SAVE MEMORY ───────────────────────────────────────────
  try {
    await addMemory(user.id, text, 'manual', 'fact', 4);

    await sendMessage(
      chatId,
      `✅ *Disimpan ke memory:*\n"${text}"\n\n_Saya akan mengingat ini di percakapan selanjutnya._`
    );
  } catch (err) {
    if (err.message?.startsWith('MEMORY_LIMIT')) {
      await sendMessage(
        chatId,
        `⚠️ *Memory sudah penuh* (${LIMIT}/${LIMIT}).\n\nHapus beberapa memory dulu dengan /forget sebelum menambah yang baru.`
      );
    } else {
      console.error('[/remember] Error:', err.message);
      await sendMessage(chatId, '❌ Gagal menyimpan memory. Coba lagi.');
    }
  }
}
