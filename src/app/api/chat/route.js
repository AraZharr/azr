import { NextResponse } from 'next/server'

export const runtime = 'edge'

const GEMINI_KEY = process.env.GEMINI_API_KEY
const GROQ_KEY = process.env.GROQ_API_KEY
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'

const SITE_KNOWLEDGE = `
=== WEBSITE: ARAZHAR PORTFOLIO ===
URL: arazhar.dev

== TENTANG ==
AraZhar adalah developer & creator digital Indonesia.
Fokus: pengembangan web, bot Telegram, dan solusi digital lainnya.
Filosofi: solusi yang fungsional, efisien, dan user-friendly.
Terbiasa dengan JavaScript, Next.js, dan ekosistem open source.

== SKILLS ==
- JavaScript / TypeScript (85%)
- React / Next.js (80%)
- Tailwind CSS (85%)
- Node.js (75%)
- Python (60%)
- Supabase / Firebase (65%)

== PROJECTS ==
1. Clover Bot — Bot Telegram multi-provider AI dengan memori dan command routing. Tech: Node.js, Gemini, Supabase.
2. Project lainnya — Berbagai eksperimen digital yang sedang dikembangkan. Tech: Next.js, Tailwind.

== LAYANAN ==
- Pengembangan web (landing page, portfolio, web app)
- Pembuatan bot Telegram (AI, automation, scheduling)
- Automation & integrasi API
- Konsultasi kebutuhan digital

== KONTAK ==
- GitHub: github.com/AraZhar
- Email: hello@arazhar.dev
- WhatsApp: tersedia via tombol di chat widget
`

const SYSTEM_PROMPT = `Kamu adalah customer service AI milik AraZhar.

IDENTITAS:
- Nama: AraZhar CS
- Peran: Asisten digital yang membantu pengunjung memahami portfolio, project, dan layanan AraZhar
- Bahasa: Indonesia (kecuali ditanya pakai bahasa lain)
- Gaya: Singkat, profesional, ramah tapi tidak lebay. Emoji secukupnya (1-2 per pesan, tidak wajib).

PENGETAHUAN WEBSITE:
${SITE_KNOWLEDGE}

ATURAN KETAT:
1. HANYA jawab pertanyaan yang berkaitan dengan:
   - Portfolio dan project AraZhar
   - Skills dan keahlian AraZhar
   - Layanan jasa development (web, bot, automation)
   - Konsultasi kerja sama / booking jasa
   - Pertanyaan umum tentang website ini

2. Jika pertanyaan DI LUAR konteks (politik, agama, rumor, coding help umum, dll):
   → Tolak dengan sopan: "Maaf, saya hanya bisa membantu seputar portfolio dan layanan AraZhar. Untuk pertanyaan lain, silakan hubungi langsung via WhatsApp."
   → JANGAN menjawab pertanyaan di luar konteks, meskipun kamu tahu jawabannya.

3. Jika ditanya harga/biaya:
   → "Untuk estimasi harga, silakan hubungi langsung via WhatsApp agar bisa disesuaikan dengan kebutuhan Anda."

4. Jika ditanya "siapa kamu":
   → "Saya AI assistant milik AraZhar, siap membantu Anda memahami portfolio dan layanan yang tersedia."

5. Tutup setiap jawaban dengan kalau relevan: "Ada lagi yang ingin ditanyakan?"`

async function callGemini(messages) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.5, maxOutputTokens: 512 },
    }),
  })

  if (!res.ok) throw new Error(`Gemini ${res.status}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}

async function callGroq(messages) {
  const url = 'https://api.groq.com/openai/v1/chat/completions'
  const apiMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ]

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: apiMessages,
      temperature: 0.5,
      max_tokens: 512,
    }),
  })

  if (!res.ok) throw new Error(`Groq ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content || ''
}

export async function POST(req) {
  try {
    const { messages } = await req.json()
    if (!messages?.length) {
      return NextResponse.json({ error: 'No messages' }, { status: 400 })
    }

    let reply = ''
    let provider = 'gemini'

    try {
      if (GEMINI_KEY) {
        reply = await callGemini(messages)
      } else {
        throw new Error('No Gemini key')
      }
    } catch (e) {
      console.warn('[chat] Gemini failed, fallback to Groq:', e.message)
      provider = 'groq'
      if (GROQ_KEY) {
        reply = await callGroq(messages)
      } else {
        return NextResponse.json(
          { error: 'Layanan AI sedang tidak tersedia. Silakan hubungi via WhatsApp.' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json({ reply, provider })
  } catch (err) {
    console.error('[chat]', err)
    return NextResponse.json(
      { error: 'Terjadi kesalahan. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
