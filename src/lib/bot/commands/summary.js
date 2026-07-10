import { sendMessage }                          from '../../telegram/api.js';
import { getUserByTelegramId, getUserSummaries, getActiveSession, getSessionMessages } from '../../db/supabase.js';

/**
 * /summary — Show auto-generated conversation summaries
 */
export async function handleSummary(message) {
  const { chat, from } = message;
  const chatId = chat.id;

  if (!from) return;

  const user = await getUserByTelegramId(from.id);
  if (!user) {
    await sendMessage(chatId, '⚠️ Ketik /start dulu.');
    return;
  }

  // Get summaries and current session info in parallel
  const [summaries, activeSession] = await Promise.all([
    getUserSummaries(user.id, 5),
    getActiveSession(user.id, chatId),
  ]);

  // Count messages in current session
  const sessionMsgCount = activeSession
    ? (await getSessionMessages(activeSession.id, 100)).length
    : 0;

  // ── NO SUMMARIES YET ─────────────────────────────────────
  if (summaries.length === 0 && sessionMsgCount < 2) {
    await sendMessage(
      chatId,
      `📝 *Ringkasan Percakapan*\n\nBelum ada ringkasan yang tersimpan.\n\nRingkasan dibuat otomatis setiap beberapa pesan. Terus ngobrol dan saya akan membuat ringkasannya! 💬`
    );
    return;
  }

  let responseText = `📝 *Ringkasan Percakapan*\n\n`;

  // Current session info
  if (activeSession && sessionMsgCount > 0) {
    responseText += `*Sesi saat ini (${sessionMsgCount} pesan):*\n`;

    // Show last summary if it exists for current session
    const latestSummary = summaries[summaries.length - 1];
    if (latestSummary) {
      responseText += `_"${latestSummary.content}"_\n\n`;
    } else {
      responseText += `_Belum ada ringkasan — percakapan masih berlangsung._\n\n`;
    }
  }

  // Previous session summaries (exclude the latest one shown above)
  const prevSummaries = sessionMsgCount > 0 ? summaries.slice(0, -1) : summaries;

  if (prevSummaries.length > 0) {
    responseText += `*Sesi sebelumnya:*\n`;
    for (const s of prevSummaries.reverse()) {
      const date = new Date(s.created_at).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short',
      });
      responseText += `• _"${s.content}"_ (${date})\n`;
    }
  }

  await sendMessage(chatId, responseText.trim());
}
