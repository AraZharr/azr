import { NextResponse } from 'next/server'

export const runtime = 'edge'

const GEMINI_KEY = process.env.GEMINI_API_KEY
const GROQ_KEY = process.env.GROQ_API_KEY
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash'
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'

const SYSTEM_PROMPT = `Kamu adalah customer service AI untuk AraZhar, seorang developer & creator digital.
Tugasmu membantu pengunjung yang ingin:
- Bertanya tentang layanan jasa development (web, bot, automation)
- Bertanya tentang project AraZhar
- Konsultasi kebutuhan digital
- Booking jasa / kerja sama

Jawab dengan:
- Bahasa Indonesia (kecuali ditanya pakai bahasa lain)
- Singkat, jelas, profesional
- Jika ditanya harga/biaya, arahkan ke WhatsApp untuk konsultasi lebih lanjut
- Jika pertanyaan di luar konteks, tetap bantu dengan sopan

Signature: "AraZhar — Developer & Creator"
Jika ditanya siapa kamu: "Saya adalah AI assistant milik AraZhar, siap membantu Anda."`

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
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
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
      temperature: 0.7,
      max_tokens: 1024,
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
          { error: 'AI service unavailable. Silakan hubungi via WhatsApp.' },
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
