import { sendMessage } from '../../telegram/api.js';

/**
 * /help — Display all available commands
 */
export async function handleHelp(message) {
  const { chat } = message;
  const chatId   = chat.id;

  const helpText = `*Perintah Clover 🍀*

💬 *Chat*
Kirim pesan langsung untuk mulai ngobrol dengan AI

⚙️ *Pengaturan*
/provider — Lihat atau ganti AI provider
/model — Lihat atau ganti model AI
/mode — Ganti gaya jawaban bot
/lang — Atur bahasa respons

🧠 *Memory*
/memory — Lihat memory yang tersimpan
/remember \`[teks]\` — Simpan informasi penting
/forget — Hapus memory
/summary — Lihat ringkasan percakapan

📊 *Sesi*
/reset — Reset percakapan, mulai baru
/status — Lihat status bot & sesi aktif

ℹ️ *Lainnya*
/help — Tampilkan pesan ini`;

  await sendMessage(chatId, helpText);
}
