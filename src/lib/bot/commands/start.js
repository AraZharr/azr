import { sendMessage }                      from '../../telegram/api.js';
import { getUserByTelegramId, registerUser } from '../../db/supabase.js';

/**
 * /start — Register new user and show welcome message
 */
export async function handleStart(message) {
  const { chat, from } = message;
  const chatId = chat.id;

  if (!from) return;

  // Register or get user
  let user = await getUserByTelegramId(from.id);
  const isNew = !user;

  if (isNew) {
    await registerUser(from);
    user = await getUserByTelegramId(from.id);
  }

  const prefs    = user?.user_preferences?.[0] || {};
  const provider = prefs.default_provider || 'gemini';
  const model    = prefs.default_model    || 'gemini-2.0-flash';

  const name = from.first_name || 'kamu';

  const welcomeText = isNew
    ? `Halo *${name}*! 👋\n\nSaya *Clover 🍀*, AI assistant kamu di Telegram.\n\nSaya didukung oleh beberapa AI provider dan bisa mengingat percakapan kita lintas sesi.\n\n*Provider aktif:* ${capitalize(provider)}\n*Model:* \`${model}\`\n*Memory:* Aktif ✅\n\nMulai chat langsung atau ketik /help untuk melihat semua perintah.`
    : `Halo lagi, *${name}*! 👋\n\nSaya masih di sini. Mau ngobrol tentang apa hari ini?\n\n_Ketik /help untuk daftar perintah atau langsung kirim pesan._`;

  await sendMessage(chatId, welcomeText);
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}
