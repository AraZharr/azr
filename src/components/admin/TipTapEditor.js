'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { useEffect, useState, useRef, useCallback } from 'react'
import { Bold, Italic, Heading2, List, Quote, ImageIcon, Link2, Undo, Redo, Palette, Highlighter } from 'lucide-react'
import { compressImage } from '@/lib/compress-image'
import { toast } from 'sonner'

export default function TipTapEditor({ content, onChange }) {
  const [linkInput, setLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [, forceRender] = useState(0)
  const uploadRef = useRef(null)

  const handleUpdate = useCallback(({ editor }) => {
    onChange(editor.getJSON())
    forceRender((n) => n + 1)
  }, [onChange])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: content ?? '',
    onUpdate: handleUpdate,
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
    { icon: Highlighter, action: withRender(() => editor.chain().focus().toggleHighlight().run()), active: editor.isActive('highlight') },
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
    } catch {
      toast.error('Upload error')
    }
  }

  return (
    <div className="border rounded-md">
      <div className="flex gap-1 p-2 border-b bg-gray-50 flex-wrap">
        {tools.map(({ icon: Icon, action, active }, i) => (
          <button key={i} type="button" onClick={action} className={`p-1.5 rounded transition ${active ? 'bg-black text-white' : 'hover:bg-gray-200'}`}>
            <Icon size={16} />
          </button>
        ))}
        <input type="color" className="w-8 h-8 p-1 border rounded" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} />
        <button type="button" onClick={() => uploadRef.current?.click()} className="p-1.5 rounded hover:bg-gray-200"><ImageIcon size={16} /></button>
        <input ref={uploadRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
        <button type="button" onClick={() => withRender(() => editor.chain().focus().undo().run())()} className="p-1.5 rounded hover:bg-gray-200"><Undo size={16} /></button>
      </div>
      <EditorContent editor={editor} className="p-4 min-h-[300px] prose prose-sm max-w-none" spellCheck={true} />
    </div>
  )
}