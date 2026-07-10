import {
  getUserMemories,
  getUserSummaries,
  getSessionMessages,
  addMemory,
  saveSummary,
} from '../db/supabase.js';
import { chat, buildSystemPrompt } from '../ai/router.js';

// How many messages trigger auto-extract
const EXTRACT_EVERY_N = parseInt(process.env.EXTRACT_EVERY_N_MSGS || '10');

// ============================================================
// CONTEXT BUILDER
// Assembles full context for an AI call
// ============================================================

/**
 * Build complete context object for an AI call.
 * Returns { systemPrompt, messages }
 */
export async function buildContext(userId, sessionId, preferences) {
  const [memories, summaries, sessionMessages] = await Promise.all([
    getUserMemories(userId),
    getUserSummaries(userId, parseInt(process.env.SUMMARY_MEMORY_LIMIT || '5')),
    getSessionMessages(sessionId, parseInt(process.env.SESSION_MEMORY_LIMIT || '25')),
  ]);

  const systemPrompt = buildSystemPrompt({
    language:      preferences?.language      || 'id',
    responseStyle: preferences?.response_style || 'balanced',
    memories,
    summaries,
  });

  return { systemPrompt, messages: sessionMessages };
}

// ============================================================
// AUTO MEMORY EXTRACTION
// Triggered every N messages in a session
// ============================================================

/**
 * Check if auto-extraction should run and do it if needed.
 * @param {object} session   — the current session row
 * @param {string} userId
 * @param {object} prefs     — user preferences
 */
export async function maybeAutoExtract(session, userId, prefs) {
  if (!prefs?.memory_enabled) return;

  const msgCount = session.message_count || 0;

  // Run every EXTRACT_EVERY_N messages
  if (msgCount > 0 && msgCount % EXTRACT_EVERY_N === 0) {
    try {
      await extractMemoriesFromSession(session.id, userId, prefs);
    } catch (err) {
      console.error('[Memory] Auto-extract failed:', err.message);
    }
  }
}

/**
 * Ask AI to:
 * 1. Extract new facts about the user
 * 2. Generate a summary of the session so far
 */
async function extractMemoriesFromSession(sessionId, userId, prefs) {
  const messages = await getSessionMessages(sessionId, 25);
  if (messages.length < 5) return; // Not enough to summarize

  const provider = prefs?.default_provider || process.env.DEFAULT_PROVIDER || 'gemini';
  const model    = prefs?.default_model    || null;

  const conversationText = messages
    .map((m) => `${m.role === 'user' ? 'User' : 'Clover'}: ${m.content}`)
    .join('\n');

  // ── SUMMARY ──────────────────────────────────────────────
  try {
    const summaryResult = await chat({
      systemPrompt: 'Kamu adalah asisten yang membuat ringkasan percakapan. Jawab HANYA dengan ringkasan, tanpa kalimat pembuka.',
      messages: [{
        role:    'user',
        content: `Buat ringkasan singkat (2-3 kalimat) dari percakapan berikut:\n\n${conversationText}`,
      }],
      primaryProvider: provider,
      primaryModel:    model,
      userId,
    });

    await saveSummary(sessionId, userId, summaryResult.text, messages.length);
  } catch (err) {
    console.error('[Memory] Summary generation failed:', err.message);
  }

  // ── FACT EXTRACTION ───────────────────────────────────────
  try {
    const factResult = await chat({
      systemPrompt: `Kamu adalah asisten yang mengekstrak fakta penting tentang user dari percakapan.
Jawab HANYA dengan JSON array of strings.
Contoh: ["User bernama Budi", "User sedang belajar Next.js", "User prefer jawaban singkat"]
Jika tidak ada fakta baru, jawab dengan array kosong: []`,
      messages: [{
        role:    'user',
        content: `Ekstrak fakta penting tentang user dari percakapan ini (maksimal 3 fakta baru):\n\n${conversationText}`,
      }],
      primaryProvider: provider,
      primaryModel:    model,
      userId,
    });

    // Parse JSON array
    const raw   = factResult.text.replace(/```json|```/g, '').trim();
    const facts = JSON.parse(raw);

    if (Array.isArray(facts)) {
      for (const fact of facts.slice(0, 3)) {
        if (typeof fact === 'string' && fact.trim().length >= 3) {
          await addMemory(userId, fact.trim(), 'auto').catch((err) => {
            if (!err.message?.startsWith('MEMORY_LIMIT')) {
              console.error('[Memory] Save fact failed:', err.message);
            }
          });
        }
      }
    }
  } catch (err) {
    console.error('[Memory] Fact extraction failed:', err.message);
  }
}
