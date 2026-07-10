import { NextResponse } from 'next/server';
import { handleMessage }  from '../../../../lib/bot/messageHandler.js';
import { routeCommand }   from '../../../../lib/bot/commandRouter.js';

// ============================================================
// TELEGRAM WEBHOOK — POST /api/webhook/telegram
// ============================================================

export async function POST(request) {
  // ── 1. VALIDATE SECRET TOKEN ──────────────────────────────
  const secret   = process.env.TELEGRAM_WEBHOOK_SECRET;
  const incoming = request.headers.get('x-telegram-bot-api-secret-token');

  if (secret && incoming !== secret) {
    console.warn('[Webhook] Invalid secret token');
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  // ── 2. PARSE BODY ─────────────────────────────────────────
  let update;

  try {
    update = await request.json();
  } catch (err) {
    console.error('[Webhook] Invalid JSON body:', err.message);
    return NextResponse.json({ ok: true }); // Return 200 so Telegram doesn't retry
  }

  // ── 3. ACKNOWLEDGE IMMEDIATELY (Telegram requires < 1s) ───
  // Processing happens in the background
  processUpdate(update).catch((err) =>
    console.error('[Webhook] Unhandled error:', err)
  );

  return NextResponse.json({ ok: true });
}

// ============================================================
// UPDATE PROCESSOR
// ============================================================

async function processUpdate(update) {
  // Telegram sends either a `message` or `callback_query`
  if (update.message) {
    await processMessage(update.message);
  } else if (update.callback_query) {
    // Future: handle inline keyboard callbacks
    console.log('[Webhook] callback_query received (not yet implemented)');
  }
}

async function processMessage(message) {
  const text     = message.text || '';
  const chatType = message.chat?.type;
  const from     = message.from;

  // Ignore messages from other bots
  if (from?.is_bot) return;

  // Ignore empty messages and non-text types for now
  if (!text) return;

  // ── GROUP CHAT FILTER ────────────────────────────────────
  // In groups, only respond if mentioned, replied to, or command
  if (chatType === 'group' || chatType === 'supergroup') {
    const botUsername = process.env.BOT_USERNAME || '';
    const isMentioned = text.includes(`@${botUsername}`);
    const isReply     = !!message.reply_to_message?.from?.is_bot;
    const isCommand   = text.startsWith('/');

    if (!isMentioned && !isReply && !isCommand) {
      return; // Ignore message
    }
  }

  // ── COMMAND ROUTING ───────────────────────────────────────
  if (text.startsWith('/')) {
    await routeCommand(message);
    return;
  }

  // ── REGULAR CHAT ──────────────────────────────────────────
  await handleMessage(message);
}

// ============================================================
// GET — health check / info
// ============================================================
export async function GET() {
  return NextResponse.json({
    status:  'ok',
    bot:     'Clover 🍀',
    version: '1.0.0',
  });
}
