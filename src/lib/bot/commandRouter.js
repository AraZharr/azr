import { sendMessage }       from '../telegram/api.js';
import { getUserByTelegramId, registerUser } from '../db/supabase.js';

// ============================================================
// LAZY IMPORT HANDLERS (keep webhook fast)
// ============================================================

const commandHandlers = {
  '/start':    () => import('./commands/start.js').then(m => m.handleStart),
  '/help':     () => import('./commands/help.js').then(m => m.handleHelp),
  '/reset':    () => import('./commands/reset.js').then(m => m.handleReset),
  '/provider': () => import('./commands/provider.js').then(m => m.handleProvider),
  '/model':    () => import('./commands/model.js').then(m => m.handleModel),
  '/mode':     () => import('./commands/mode.js').then(m => m.handleMode),
  '/lang':     () => import('./commands/lang.js').then(m => m.handleLang),
  '/memory':   () => import('./commands/memory.js').then(m => m.handleMemory),
  '/remember': () => import('./commands/remember.js').then(m => m.handleRemember),
  '/forget':   () => import('./commands/forget.js').then(m => m.handleForget),
  '/summary':  () => import('./commands/summary.js').then(m => m.handleSummary),
  '/status':   () => import('./commands/status.js').then(m => m.handleStatus),
};

/**
 * Route a command message to the correct handler.
 * @param {object} message — Telegram message object
 */
export async function routeCommand(message) {
  const { chat, from, text } = message;
  const chatId = chat.id;

  // Parse command and args (strip bot username if present, e.g. /start@clover_bot)
  const [rawCommand, ...args] = text.trim().split(/\s+/);
  const command = rawCommand.split('@')[0].toLowerCase();

  // ── ENSURE USER IS REGISTERED ────────────────────────────
  if (from && !from.is_bot) {
    let user = await getUserByTelegramId(from.id);
    if (!user) {
      await registerUser(from);
    }
  }

  // ── FIND HANDLER ─────────────────────────────────────────
  const handlerLoader = commandHandlers[command];

  if (!handlerLoader) {
    await sendMessage(
      chatId,
      `❓ Command *${command}* tidak dikenali.\nKetik /help untuk melihat daftar perintah.`
    );
    return;
  }

  // ── EXECUTE HANDLER ───────────────────────────────────────
  try {
    const handler = await handlerLoader();
    await handler(message, args);
  } catch (err) {
    console.error(`[CommandRouter] Error in ${command}:`, err.message);
    await sendMessage(
      chatId,
      '⚠️ Terjadi kesalahan saat memproses perintah. Coba lagi.'
    );
  }
}
