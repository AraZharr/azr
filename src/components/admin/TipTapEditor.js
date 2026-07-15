'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { useEffect, useState, useRef, useCallback } from 'react'
import { Bold, Italic, Heading2, List, Quote, ImageIcon, Link2, Undo, Redo } from 'lucide-react'
import { compressImage } from '@/lib/compress-image'
import { toast } from 'sonner'

export default function TipTapEditor({ content, onChange }) {
  const [linkInput, setLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  // Force re-render on every editor state change so toolbar indicators update immediately
  const [, forceRender] = useState(0)
  const uploadRef = useRef(null)

  const handleUpdate = useCallback(({ editor }) => {
    onChange(editor.getJSON())
    forceRender((n) => n + 1)
  }, [onChange])

  const handleSelectionUpdate = useCallback(() => {
    forceRender((n) => n + 1)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
    ],
    content: content ?? '',
    onUpdate: handleUpdate,
    onSelectionUpdate: handleSelectionUpdate,
  })

  useEffect(() => {
    if (editor && content && content !== editor.getJSON()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  function withRender(fn) {
    return (...args) => {
      fn(...args)
      forceRender((n) => n + 1)
    }
  }

  const tools = [
    { icon: Bold, action: withRender(() => editor.chain().focus().toggleBold().run()), active: editor.isActive('bold') },
    { icon: Italic, action: withRender(() => editor.chain().focus().toggleItalic().run()), active: editor.isActive('italic') },
    { icon: Heading2, action: withRender(() => editor.chain().focus().toggleHeading({ level: 2 }).run()), active: editor.isActive('heading', { level: 2 }) },
    { icon: List, action: withRender(() => editor.chain().focus().toggleBulletList().run()), active: editor.isActive('bulletList') },
    { icon: Quote, action: withRender(() => editor.chain().focus().toggleBlockquote().run()), active: editor.isActive('blockquote') },
  ]

  async function handleImageUpload(file) {
    if (!file) return
    file = await compressImage(file)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
      if (!res.ok) { toast.error('Upload failed'); return }
      const data = await res.json()
      editor.chain().focus().setImage({ src: data.url }).run()
      toast.success('Gambar ditambahkan')
      forceRender((n) => n + 1)
    } catch {
      toast.error('Upload error')
    }
  }

  function handleLinkSubmit(e) {
    e?.preventDefault()
    if (!linkUrl) {
      editor.chain().focus().unsetLink().run()
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run()
    }
    setLinkInput(false)
    setLinkUrl('')
    forceRender((n) => n + 1)
  }

  function openLinkInput() {
    const prev = editor.getAttributes('link').href || ''
    setLinkUrl(prev)
    setLinkInput(true)
  }

  return (
    <div className="border rounded-md">
      {/* Toolbar */}
      <div className="flex gap-1 p-2 border-b bg-gray-50 flex-wrap">
        {tools.map(({ icon: Icon, action, active }, i) => (
          <button
            key={i}
            type="button"
            onClick={action}
            className={`p-1.5 rounded transition-colors ${active ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
          >
            <Icon size={16} />
          </button>
        ))}

        {/* Image */}
        <button
          type="button"
          onClick={() => uploadRef.current?.click()}
          className="p-1.5 rounded hover:bg-gray-200"
          title="Sisipkan gambar"
        >
          <ImageIcon size={16} />
        </button>
        <input
          ref={uploadRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { handleImageUpload(e.target.files?.[0]); if (e.target) e.target.value = '' }}
        />

        {/* Link */}
        <button
          type="button"
          onClick={openLinkInput}
          className={`p-1.5 rounded transition-colors ${editor.isActive('link') ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
          title="Tambah link"
        >
          <Link2 size={16} />
        </button>

        <span className="w-px bg-gray-300 mx-1" />

        <button
          type="button"
          onClick={withRender(() => editor.chain().focus().undo().run())}
          className="p-1.5 rounded hover:bg-gray-200"
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onClick={withRender(() => editor.chain().focus().redo().run())}
          className="p-1.5 rounded hover:bg-gray-200"
        >
          <Redo size={16} />
        </button>
      </div>

      {/* Link input popup */}
      {linkInput && (
        <form onSubmit={handleLinkSubmit} className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 text-sm border rounded px-2 py-1 outline-none focus:border-black"
            autoFocus
          />
          <button type="submit" className="text-xs bg-black text-white px-3 py-1 rounded hover:bg-gray-800">
            {linkUrl ? 'Simpan' : 'Hapus link'}
          </button>
          <button type="button" onClick={() => setLinkInput(false)} className="text-xs text-gray-500 px-2 py-1">
            Batal
          </button>
        </form>
      )}

      <EditorContent editor={editor} className="p-4 min-h-[300px] prose prose-sm max-w-none" />
    </div>
  )
}
