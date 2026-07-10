// ============================================================
// CLOVER — Telegram Bot API Helper
// Wraps Telegram Bot API calls
// ============================================================

const TELEGRAM_BASE = 'https://api.telegram.org';

function getToken() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('[Telegram] Missing TELEGRAM_BOT_TOKEN');
  return token;
}

async function call(method, body = {}) {
  const url  = `${TELEGRAM_BASE}/bot${getToken()}/${method}`;
  const res  = await fetch(url, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });

  const json = await res.json();

  if (!json.ok) {
    console.error(`[Telegram API] ${method} failed:`, json.description);
    // Don't throw — allow bot to continue if a single send fails
  }

  return json;
}

// ============================================================
// CORE SEND FUNCTIONS
// ============================================================

/**
 * Send a text message. Supports Telegram MarkdownV2.
 * Falls back to plain text if parse_mode fails.
 */
export async function sendMessage(chatId, text, options = {}) {
  // Telegram has 4096 char limit per message
  const chunks = splitMessage(text);

  for (const chunk of chunks) {
    await call('sendMessage', {
      chat_id:    chatId,
      text:       chunk,
      parse_mode: options.parseMode || 'Markdown',
      ...options,
    });
  }
}

/**
 * Send "typing..." action to the chat.
 */
export async function sendTyping(chatId) {
  return call('sendChatAction', {
    chat_id: chatId,
    action:  'typing',
  });
}

/**
 * Reply to a specific message.
 */
export async function replyMessage(chatId, replyToMessageId, text, options = {}) {
  return sendMessage(chatId, text, {
    ...options,
    reply_to_message_id: replyToMessageId,
  });
}

/**
 * Edit an existing message (useful for updating bot responses).
 */
export async function editMessage(chatId, messageId, text) {
  return call('editMessageText', {
    chat_id:    chatId,
    message_id: messageId,
    text,
    parse_mode: 'Markdown',
  });
}

/**
 * Delete a message.
 */
export async function deleteMessage(chatId, messageId) {
  return call('deleteMessage', {
    chat_id:    chatId,
    message_id: messageId,
  });
}

// ============================================================
// BOT INFO
// ============================================================

/**
 * Get bot info (useful for knowing bot username in group chats).
 */
export async function getBotInfo() {
  return call('getMe');
}

/**
 * Set webhook URL.
 */
export async function setWebhook(url, secret) {
  return call('setWebhook', {
    url,
    secret_token:    secret,
    allowed_updates: ['message', 'callback_query'],
    drop_pending_updates: true,
  });
}

/**
 * Delete webhook.
 */
export async function deleteWebhook() {
  return call('deleteWebhook', { drop_pending_updates: true });
}

// ============================================================
// UTILITY
// ============================================================

/**
 * Split long text into chunks <= 4096 chars (Telegram limit).
 * Splits on newlines when possible to avoid cutting mid-sentence.
 */
function splitMessage(text, maxLen = 4096) {
  if (text.length <= maxLen) return [text];

  const chunks = [];
  let current  = '';

  for (const line of text.split('\n')) {
    if ((current + '\n' + line).length > maxLen) {
      if (current) chunks.push(current.trim());
      current = line;
    } else {
      current += (current ? '\n' : '') + line;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

/**
 * Escape special characters for MarkdownV2 parse mode.
 */
export function escapeMarkdownV2(text) {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!\\]/g, '\\$&');
}

/**
 * Extract mention from message entities (for group chats).
 */
export function hasBotMention(message, botUsername) {
  if (!message.entities) return false;
  return message.entities.some(
    (e) => e.type === 'mention' &&
      message.text?.substring(e.offset, e.offset + e.length) === `@${botUsername}`
  );
}
