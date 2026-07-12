'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, ArrowUpRight } from 'lucide-react'

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || '6281234567890'

function buildWAText(messages) {
  const lines = messages
    .filter((m) => m.role !== 'system')
    .map((m) => {
      const label = m.role === 'user' ? 'Saya' : 'AraZhar AI'
      return `${label}: ${m.content}`
    })
  return encodeURIComponent(
    `Halo AraZhar, saya ingin konsultasi lebih lanjut.\n\nRiwayat chat:\n${lines.join('\n')}`
  )
}

const QUICK_REPLIES = [
  'Apa saja skills yang dimiliki?',
  'Ada project apa saja?',
  'Bagaimana cara kerja sama?',
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Halo! Saya AI assistant AraZhar. Saya bisa membantu Anda mengenal portfolio, project, dan layanan yang tersedia. Ada yang ingin ditanyakan?',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  async function send(text) {
    const msg = (text || input).trim()
    if (!msg || loading) return

    const userMsg = { role: 'user', content: msg }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: res.ok
            ? data.reply
            : data.error || 'Gagal memproses. Silakan hubungi via WhatsApp.',
        },
      ])
    } catch {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Koneksi error. Silakan hubungi via WhatsApp.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* Bubble */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 w-[52px] h-[52px] rounded-full bg-black text-white flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.18)] hover:scale-105 active:scale-95 transition-all duration-200"
        aria-label={open ? 'Tutup chat' : 'Buka chat'}
      >
        {open ? <X size={20} strokeWidth={2.2} /> : <MessageCircle size={20} strokeWidth={2.2} />}
      </button>

      {/* Card */}
      {open && (
        <div
          className="fixed bottom-[72px] right-5 z-50 w-[380px] max-w-[calc(100vw-2.5rem)] bg-white border border-gray-200 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden"
          style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold">
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 leading-tight">AraZhar CS</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Online &middot; Biasanya membalas sebentar</p>
                </div>
              </div>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${buildWAText(messages)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-medium text-green-600 hover:text-green-700 flex items-center gap-0.5 transition"
              >
                WhatsApp
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-h-[360px] min-h-[200px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-black text-white rounded-2xl rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-2xl rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies — tampilkan hanya di awal */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr}
                  onClick={() => send(qr)}
                  className="text-[11px] font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full px-3 py-1.5 transition"
                >
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200 focus-within:border-gray-400 transition">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ketik pesan..."
                disabled={loading}
                className="flex-1 text-[13px] bg-transparent outline-none placeholder:text-gray-400 disabled:opacity-50"
              />
              <button
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="text-gray-400 hover:text-black transition disabled:opacity-30"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
