import { createClient } from '@supabase/supabase-js';

// Service role client — full access, used only on server-side bot logic
let _supabase = null;

export function getSupabase() {
  if (_supabase) return _supabase;

  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  _supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  return _supabase;
}

// ============================================================
// USER OPERATIONS
// ============================================================

/**
 * Get user by Telegram ID. Returns null if not found.
 */
export async function getUserByTelegramId(telegramId) {
  const db = getSupabase();
  const { data, error } = await db
    .from('users')
    .select('*, user_preferences(*)')
    .eq('telegram_id', telegramId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
  return data || null;
}

/**
 * Register a new user from a Telegram user object.
 * Also creates default user_preferences.
 */
export async function registerUser(telegramUser) {
  const db = getSupabase();

  // Upsert user
  const { data: user, error: userErr } = await db
    .from('users')
    .upsert({
      telegram_id:  telegramUser.id,
      username:     telegramUser.username || null,
      first_name:   telegramUser.first_name || null,
      last_name:    telegramUser.last_name || null,
    }, { onConflict: 'telegram_id', ignoreDuplicates: false })
    .select()
    .single();

  if (userErr) throw userErr;

  // Insert default preferences if not exists
  const { error: prefErr } = await db
    .from('user_preferences')
    .upsert({ user_id: user.id }, { onConflict: 'user_id', ignoreDuplicates: true });

  if (prefErr) throw prefErr;

  return user;
}

/**
 * Update user last_active_at and increment message_count.
 */
export async function touchUser(userId) {
  const db = getSupabase();
  await db
    .from('users')
    .update({ last_active_at: new Date().toISOString() })
    .eq('id', userId);

  await db.rpc('increment_message_count', { user_id: userId }).catch(() => {
    // Fallback if RPC not available
    db.from('users')
      .select('message_count')
      .eq('id', userId)
      .single()
      .then(({ data }) => {
        if (data) {
          db.from('users')
            .update({ message_count: (data.message_count || 0) + 1 })
            .eq('id', userId);
        }
      });
  });
}

// ============================================================
// SESSION OPERATIONS
// ============================================================

/**
 * Get the active session for a user in a specific chat.
 * Returns null if none exists or if last activity > 6 hours ago.
 */
export async function getActiveSession(userId, chatId) {
  const db = getSupabase();
  const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();

  const { data, error } = await db
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('chat_id', chatId)
    .eq('is_active', true)
    .gte('updated_at', sixHoursAgo)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

/**
 * Create a new session for a user in a chat.
 */
export async function createSession(userId, chatId, chatType = 'private') {
  const db = getSupabase();

  // Deactivate old sessions for this user+chat
  await db
    .from('sessions')
    .update({ is_active: false })
    .eq('user_id', userId)
    .eq('chat_id', chatId)
    .eq('is_active', true);

  const { data, error } = await db
    .from('sessions')
    .insert({
      user_id:   userId,
      chat_id:   chatId,
      chat_type: chatType,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Increment session message count and update timestamp.
 */
export async function touchSession(sessionId) {
  const db = getSupabase();
  const { data } = await db
    .from('sessions')
    .select('message_count')
    .eq('id', sessionId)
    .single();

  await db
    .from('sessions')
    .update({
      message_count: (data?.message_count || 0) + 1,
      updated_at:    new Date().toISOString(),
    })
    .eq('id', sessionId);
}

/**
 * Reset (deactivate) session for a user+chat. Returns new session.
 */
export async function resetSession(userId, chatId, chatType = 'private') {
  return createSession(userId, chatId, chatType);
}

// ============================================================
// MESSAGE OPERATIONS
// ============================================================

/**
 * Save a message to the database.
 */
export async function saveMessage({ sessionId, userId, role, content, provider, model, isFallback, latencyMs }) {
  const db = getSupabase();
  const { data, error } = await db
    .from('messages')
    .insert({
      session_id:       sessionId,
      user_id:          userId,
      role,
      content,
      provider:         provider || null,
      model:            model || null,
      is_fallback:      isFallback || false,
      tokens_estimated: Math.ceil(content.length / 4), // rough estimate
      latency_ms:       latencyMs || 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get last N messages for a session (for context building).
 */
export async function getSessionMessages(sessionId, limit = 25) {
  const db = getSupabase();
  const { data, error } = await db
    .from('messages')
    .select('role, content, provider, model')
    .eq('session_id', sessionId)
    .neq('role', 'system')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).reverse(); // chronological order
}

// ============================================================
// MEMORY OPERATIONS
// ============================================================

/**
 * Get all active long-term memories for a user.
 */
export async function getUserMemories(userId) {
  const db = getSupabase();
  const { data, error } = await db
    .from('memories')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('importance', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Add a new memory for a user. Enforces 50-entry limit.
 */
export async function addMemory(userId, content, source = 'manual', type = 'fact', importance = 3) {
  const db = getSupabase();

  // Check limit
  const { count } = await db
    .from('memories')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_active', true);

  const limit = parseInt(process.env.LONG_TERM_MEMORY_LIMIT || '50');
  if (count >= limit) {
    throw new Error(`MEMORY_LIMIT:${limit}`);
  }

  const { data, error } = await db
    .from('memories')
    .insert({ user_id: userId, content, source, type, importance })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Soft-delete a memory by index (1-based) from the user's active memories.
 */
export async function forgetMemoryByIndex(userId, index) {
  const memories = await getUserMemories(userId);
  const target   = memories[index - 1];
  if (!target) return false;

  const db = getSupabase();
  await db.from('memories').update({ is_active: false }).eq('id', target.id);
  return true;
}

/**
 * Soft-delete ALL memories for a user.
 */
export async function forgetAllMemories(userId) {
  const db = getSupabase();
  await db.from('memories').update({ is_active: false }).eq('user_id', userId);
}

// ============================================================
// SUMMARY OPERATIONS
// ============================================================

/**
 * Get latest N summaries for a user (cross-session context).
 */
export async function getUserSummaries(userId, limit = 5) {
  const db = getSupabase();
  const { data, error } = await db
    .from('summaries')
    .select('content, messages_covered, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []).reverse();
}

/**
 * Save a new summary for a session.
 */
export async function saveSummary(sessionId, userId, content, messagesCovered) {
  const db = getSupabase();
  const { data, error } = await db
    .from('summaries')
    .insert({ session_id: sessionId, user_id: userId, content, messages_covered: messagesCovered })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================
// USER PREFERENCES OPERATIONS
// ============================================================

/**
 * Update a specific preference field for a user.
 */
export async function updatePreference(userId, field, value) {
  const db = getSupabase();
  await db
    .from('user_preferences')
    .update({ [field]: value })
    .eq('user_id', userId);
}

// ============================================================
// AI LOG OPERATIONS
// ============================================================

/**
 * Log an AI provider call result.
 */
export async function logAiCall({ userId, provider, model, status, errorMessage, latencyMs, tokensIn, tokensOut, isFallback }) {
  const db = getSupabase();
  await db.from('ai_logs').insert({
    user_id:       userId || null,
    provider,
    model,
    status,
    error_message: errorMessage || null,
    latency_ms:    latencyMs || 0,
    tokens_in:     tokensIn || 0,
    tokens_out:    tokensOut || 0,
    is_fallback:   isFallback || false,
  });
}

// ============================================================
// RATE LIMIT CHECK
// ============================================================

/**
 * Count messages sent by a user today.
 */
export async function getTodayMessageCount(userId) {
  const db = getSupabase();
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const { count } = await db
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('role', 'user')
    .gte('created_at', startOfDay.toISOString());

  return count || 0;
}
