import { sendMessage }                          from '../../telegram/api.js';
import { getUserByTelegramId, resetSession }    from '../../db/supabase.js';

/**
 * /reset — Deactivate current session, create new one.
 * Long-term memory is preserved.
 */
export async function handleReset(message) {
  const { chat, from } = message;
  const chatId  = chat.id;
  const chatType = chat.type;

  if (!from) return;

  const user = await getUserByTelegramId(from.id);
  if (!user) {
    await sendMessage(chatId, '⚠️ Kamu belum terdaftar. Ketik /start dulu.');
    return;
  }

  await resetSession(user.id, chatId, chatType);

  await sendMessage(
    chatId,
    `✅ *Percakapan di-reset.*\n\nSesi baru dimulai. Memory jangka panjang tetap tersimpan.\n\n_Kalau mau hapus semua memory: /forget all_`
  );
}
