import { sendMessage }                                          from '../../telegram/api.js';
import {
  getUserByTelegramId,
  getUserMemories,
  getUserSummaries,
  getActiveSession,
  getSessionMessages,
  getTodayMessageCount,
}                                                               from '../../db/supabase.js';

const DAILY_LIMIT = parseInt(process.env.DAILY_MESSAGE_LIMIT || '100');

/**
 * /status — Show comprehensive status: user info, bot settings, memory stats, usage
 */
export async function handleStatus(message) {
  const { chat, from } = message;
  const chatId  = chat.id;
  const chatType = chat.type;

  if (!from) return;

  const user = await getUserByTelegramId(from.id);
  if (!user) {
    await sendMessage(chatId, '⚠️ Ketik /start dulu.');
    return;
  }

  const prefs = user.user_preferences?.[0] || {};

  // Fetch all stats in parallel
  const [memories, summaries, activeSession, todayCount] = await Promise.all([
    getUserMemories(user.id),
    getUserSummaries(user.id, 5),
    getActiveSession(user.id, chatId),
    getTodayMessageCount(user.id),
  ]);

  const sessionMsgCount = activeSession
    ? (await getSessionMessages(activeSession.id, 100)).length
    : 0;

  // Format member since date
  const memberSince = new Date(user.created_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  // Format last active
  const lastActive = new Date(user.last_active_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  // Provider display
  const providerDisplay = {
    gemini:     'Google Gemini',
    groq:       'Groq',
    openrouter: 'OpenRouter',
  };

  // Mode display
  const modeDisplay = {
    balanced: '⚖️ Balanced',
    concise:  '⚡ Concise',
    detailed: '📖 Detailed',
    coding:   '💻 Coding',
    creative: '🎨 Creative',
  };

  const langDisplay = {
    id: '🇮🇩 Indonesia',
    en: '🇬🇧 English',
  };

  const provider      = prefs.default_provider  || 'gemini';
  const model         = prefs.default_model     || 'gemini-2.0-flash';
  const mode          = prefs.response_style    || 'balanced';
  const lang          = prefs.language          || 'id';
  const memoryEnabled = prefs.memory_enabled !== false;

  const limitForChat = chatType === 'private' ? DAILY_LIMIT : Math.floor(DAILY_LIMIT / 2);

  const statusText = `📊 *Status Clover 🍀*

👤 *User*
Nama: ${user.first_name || '-'}${user.last_name ? ' ' + user.last_name : ''}
Username: ${user.username ? '@' + user.username : '-'}
Member sejak: ${memberSince}
Total pesan: ${user.message_count || 0}
Terakhir aktif: ${lastActive}

🤖 *Bot*
Provider: ${providerDisplay[provider] || provider}
Model: \`${model}\`
Mode: ${modeDisplay[mode] || mode}
Bahasa: ${langDisplay[lang] || lang}

🧠 *Memory*
Status: ${memoryEnabled ? '✅ Aktif' : '❌ Nonaktif'}
Long-term: ${memories.length}/${process.env.LONG_TERM_MEMORY_LIMIT || 50} items
Session: ${sessionMsgCount} pesan
Summaries: ${summaries.length}

📈 *Usage hari ini*
Pesan: ${todayCount} / ${limitForChat}
Status: ${todayCount >= limitForChat ? '🔴 Limit tercapai' : '🟢 Normal'}`;

  await sendMessage(chatId, statusText);
}
