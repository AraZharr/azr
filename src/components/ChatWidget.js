'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, ExternalLink, Bot, User } from 'lucide-react'

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER || '6281234567890'
const WA_API = `https://wa.me/${WA_NUMBER}?text=`

function buildWAText(messages) {
  const lines = messages
    .filter((m) => m.role !== 'system')
    .map((m) => {
      const label = m.role === 'user' ? 'Pelanggan' : 'AraZhar AI'
      return `${label}: ${m.content}`
    })
  return encodeURIComponent(
    `Halo AraZhar, saya ingin konsultasi lebih lanjut.\n\nRiwayat chat:\n${lines.join('\n')}`
  )
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Halo! Saya AI assistant AraZhar. Ada yang bisa saya bantu? Anda juga bisa langsung chat via WhatsApp.',
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
    if (open) inputRef.current?.focus()
  }, [open])

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
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

      if (res.ok) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }])
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: data.error || 'Gagal memproses. Silakan hubungi via WhatsApp.',
          },
        ])
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Koneksi error. Silakan hubungi via WhatsApp.',
        },
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
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition"
        aria-label={open ? 'Tutup chat' : 'Buka chat'}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-white border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <div>
                <p className="font-semibold text-sm">AraZhar CS</p>
                <p className="text-xs text-gray-400">Online</p>
              </div>
            </div>
            <a
              href={`${WA_API}${buildWAText(messages)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-full flex items-center gap-1 transition"
            >
              <ExternalLink size={12} />
              WhatsApp
            </a>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-80 min-h-48">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-black text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <span className="text-[10px] text-gray-500 block mb-0.5">AraZhar AI</span>
                  )}
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-xl rounded-bl-sm text-sm text-gray-500">
                  <span className="animate-pulse">Mengetik...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3 flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan..."
              disabled={loading}
              className="flex-1 text-sm border rounded-lg px-3 py-2 outline-none focus:border-black disabled:opacity-50"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
