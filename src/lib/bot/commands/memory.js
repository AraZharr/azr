import { sendMessage }                  from '../../telegram/api.js';
import { getUserByTelegramId, getUserMemories } from '../../db/supabase.js';

const LIMIT = parseInt(process.env.LONG_TERM_MEMORY_LIMIT || '50');

/**
 * /memory — Show all active long-term memories for the user
 */
export async function handleMemory(message) {
  const { chat, from } = message;
  const chatId = chat.id;

  if (!from) return;

  const user = await getUserByTelegramId(from.id);
  if (!user) {
    await sendMessage(chatId, '⚠️ Ketik /start dulu.');
    return;
  }

  const memories = await getUserMemories(user.id);

  if (memories.length === 0) {
    await sendMessage(
      chatId,
      `🧠 *Memory*\n\nBelum ada memory yang tersimpan.\n\n_Ketik /remember [teks] untuk menyimpan sesuatu._`
    );
    return;
  }

  const sourceLabel = (src) => src === 'manual' ? '_(manual)_' : '_(auto)_';

  const list = memories
    .map((m, i) => `${i + 1}. ${m.content} ${sourceLabel(m.source)}`)
    .join('\n');

  await sendMessage(
    chatId,
    `🧠 *Memory kamu (${memories.length}/${LIMIT} items)*\n\n${list}\n\n_/remember [teks] — tambah memory_\n_/forget [nomor] — hapus memory tertentu_\n_/forget all — hapus semua_`
  );
}
