import { sendMessage }                            from '../../telegram/api.js';
import {
  getUserByTelegramId,
  getUserMemories,
  forgetMemoryByIndex,
  forgetAllMemories,
  resetSession,
  getActiveSession,
}                                                  from '../../db/supabase.js';

/**
 * /forget              — show options
 * /forget [nomor]      — delete memory at that index
 * /forget all          — delete all long-term memories
 * /forget session      — delete current session messages (not long-term)
 */
export async function handleForget(message, args) {
  const { chat, from } = message;
  const chatId  = chat.id;
  const chatType = chat.type;

  if (!from) return;

  const user = await getUserByTelegramId(from.id);
  if (!user) {
    await sendMessage(chatId, '⚠️ Ketik /start dulu.');
    return;
  }

  // ── NO ARG — show options ─────────────────────────────────
  if (!args || args.length === 0) {
    await sendMessage(
      chatId,
      `🗑️ *Hapus Memory*\n\nKetik:\n/forget \`[nomor]\` — Hapus memory tertentu\n/forget all — Hapus semua memory\n/forget session — Hapus session memory saja\n\n_Ketik /memory untuk melihat daftar memory._`
    );
    return;
  }

  const arg = args[0].toLowerCase().trim();

  // ── FORGET ALL ────────────────────────────────────────────
  if (arg === 'all') {
    await forgetAllMemories(user.id);
    await sendMessage(
      chatId,
      `✅ *Semua memory telah dihapus.*\n\nSaya tidak mengingat apapun tentang kamu.\n\n_Ketik /remember untuk mulai menyimpan lagi._`
    );
    return;
  }

  // ── FORGET SESSION ────────────────────────────────────────
  if (arg === 'session') {
    await resetSession(user.id, chatId, chatType);
    await sendMessage(
      chatId,
      `✅ *Session memory dihapus.*\n\nPercakapan saat ini di-reset. Memory jangka panjang tetap tersimpan.`
    );
    return;
  }

  // ── FORGET BY INDEX ───────────────────────────────────────
  const index = parseInt(arg, 10);

  if (isNaN(index) || index < 1) {
    await sendMessage(
      chatId,
      `❌ Nomor tidak valid. Gunakan angka dari daftar /memory\n\nContoh: /forget 2`
    );
    return;
  }

  const memories = await getUserMemories(user.id);

  if (index > memories.length) {
    await sendMessage(
      chatId,
      `❌ Nomor *${index}* tidak ditemukan. Kamu punya *${memories.length}* memory.\n\nKetik /memory untuk melihat daftar.`
    );
    return;
  }

  const deleted = await forgetMemoryByIndex(user.id, index);

  if (deleted) {
    const content = memories[index - 1]?.content || '';
    await sendMessage(
      chatId,
      `✅ Memory #${index} dihapus:\n_"${content}"_`
    );
  } else {
    await sendMessage(chatId, '❌ Gagal menghapus memory. Coba lagi.');
  }
}
