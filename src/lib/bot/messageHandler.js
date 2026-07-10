import {
  getUserByTelegramId,
  registerUser,
  getActiveSession,
  createSession,
  saveMessage,
  touchUser,
  touchSession,
  getTodayMessageCount,
  updatePreference,
} from '../db/supabase.js';
import { sendMessage, sendTyping } from '../telegram/api.js';
import { chat }                    from '../ai/router.js';
import { buildContext, maybeAutoExtract } from './memory.js';

const DAILY_LIMIT = parseInt(process.env.DAILY_MESSAGE_LIMIT || '100');

// ============================================================
// MAIN HANDLER
// ============================================================

/**
 * Handle an incoming non-command text message.
 * @param {object} message — Telegram message object
 */
export async function handleMessage(message) {
  const { chat: tgChat, from, text, message_id } = message;
  const chatId   = tgChat.id;
  const chatType = tgChat.type;

  if (!from || !text) return;

  // ── 1. GET OR REGISTER USER ────────────────────────────────
  let userData = await getUserByTelegramId(from.id);

  if (!userData) {
    await registerUser(from);
    userData = await getUserByTelegramId(from.id);
  }

  if (!userData) {
    console.error('[Handler] Could not get/register user:', from.id);
    return;
  }

  // ── 2. CHECK BAN ───────────────────────────────────────────
  if (userData.is_banned) {
    await sendMessage(chatId, '❌ Kamu tidak dapat menggunakan bot ini.');
    return;
  }

  const prefs = userData.user_preferences?.[0] || {};

  // ── 3. RATE LIMIT CHECK ────────────────────────────────────
  const todayCount = await getTodayMessageCount(userData.id);
  const limit      = chatType === 'private' ? DAILY_LIMIT : Math.floor(DAILY_LIMIT / 2);

  if (todayCount >= limit) {
    await sendMessage(
      chatId,
      `⏳ Kamu sudah mencapai batas harian (${todayCount}/${limit} pesan).\nCoba lagi besok ya!`
    );
    return;
  }

  // ── 4. GET OR CREATE SESSION ───────────────────────────────
  let session = await getActiveSession(userData.id, chatId);

  if (!session) {
    session = await createSession(userData.id, chatId, chatType);
  }

  // ── 5. SEND TYPING INDICATOR ───────────────────────────────
  await sendTyping(chatId);

  // ── 6. SAVE USER MESSAGE ───────────────────────────────────
  await saveMessage({
    sessionId: session.id,
    userId:    userData.id,
    role:      'user',
    content:   text,
  });

  await touchSession(session.id);
  await touchUser(userData.id);

  // ── 7. BUILD CONTEXT ────────────────────────────────────────
  const { systemPrompt, messages } = await buildContext(userData.id, session.id, prefs);

  // ── 8. CALL AI ─────────────────────────────────────────────
  let aiResult;

  try {
    aiResult = await chat({
      systemPrompt,
      messages: [
        ...messages,
        { role: 'user', content: text },
      ],
      primaryProvider: prefs.default_provider || process.env.DEFAULT_PROVIDER || 'gemini',
      primaryModel:    prefs.default_model    || null,
      userId:          userData.id,
    });
  } catch (err) {
    console.error('[Handler] All AI providers failed:', err.message);
    await sendMessage(
      chatId,
      '🔴 Semua AI provider sedang tidak tersedia. Coba lagi dalam beberapa menit.'
    );
    return;
  }

  // ── 9. SAVE AI RESPONSE ────────────────────────────────────
  await saveMessage({
    sessionId:  session.id,
    userId:     userData.id,
    role:       'assistant',
    content:    aiResult.text,
    provider:   aiResult.provider,
    model:      aiResult.model,
    isFallback: aiResult.isFallback,
    latencyMs:  aiResult.latencyMs,
  });

  // ── 10. UPDATE SESSION PROVIDER ────────────────────────────
  const { getSupabase } = await import('../db/supabase.js');
  await getSupabase()
    .from('sessions')
    .update({ provider_used: aiResult.provider, model_used: aiResult.model })
    .eq('id', session.id);

  // ── 11. SEND RESPONSE TO USER ──────────────────────────────
  let responseText = aiResult.text;

  if (aiResult.isFallback) {
    responseText = `_[via ${aiResult.provider} — fallback]_\n\n${responseText}`;
  }

  await sendMessage(chatId, responseText);

  // ── 12. AUTO MEMORY EXTRACTION (async, don't await) ────────
  const updatedSession = { ...session, message_count: (session.message_count || 0) + 2 };
  maybeAutoExtract(updatedSession, userData.id, prefs).catch(console.error);
}
