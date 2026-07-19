'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { Bold, Italic, Heading2, List, Quote, ImageIcon, Link2, Undo, Redo, Highlighter, Library, Image as ImageIconFull } from 'lucide-react'
import { compressImage } from '@/lib/compress-image'
import { toast } from 'sonner'

export default function TipTapEditor({ content, onChange }) {
  const [, forceRender] = useState(0)
  const uploadRef = useRef(null)
  const [showLibrary, setShowLibrary] = useState(false)
  const [media, setMedia] = useState([])

  const handleUpdate = useCallback(({ editor }) => {
    onChange(editor.getJSON())
    forceRender((n) => n + 1)
  }, [onChange])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true, allowBase64: true }),
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
    ],
    content: content ?? '',
    onUpdate: handleUpdate,
    editorProps: {
      handleKeyDown: (view, event) => {
        if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
          if (event.shiftKey) editor.chain().focus().redo().run()
          else editor.chain().focus().undo().run()
          return true
        }
        return false
      }
    }
  })

  useEffect(() => {
    if (editor && content && content !== editor.getJSON()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  useEffect(() => {
    if (showLibrary) {
      fetch('/api/admin/media').then(r => r.json()).then(setMedia)
    }
  }, [showLibrary])

  if (!editor) return null

  function withRender(fn) {
    return (...args) => { fn(...args); forceRender(n => n + 1) }
  }

  async function handleImageUpload(file) {
    if (!file) return
    file = await compressImage(file)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
    if (!res.ok) { toast.error('Upload failed'); return }
    const data = await res.json()
    editor.chain().focus().setImage({ src: data.url }).run()
    toast.success('Gambar ditambahkan')
  }

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      <div className="flex gap-1 p-2 border-b bg-gray-50 flex-wrap">
        {[
          { icon: Bold, act: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
          { icon: Italic, act: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
          { icon: Heading2, act: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
          { icon: List, act: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
          { icon: Quote, act: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
          { icon: Highlighter, act: () => editor.chain().focus().toggleHighlight().run(), active: editor.isActive('highlight') },
        ].map(({ icon: Icon, act, active }, i) => (
          <button key={i} type="button" onClick={withRender(act)} className={`p-1.5 rounded transition ${active ? 'bg-black text-white' : 'hover:bg-gray-200'}`}>
            <Icon size={16} />
          </button>
        ))}
        <input type="color" className="w-8 h-8 p-1 border rounded" onChange={(e) => withRender(() => editor.chain().focus().setColor(e.target.value).run())()} />
        <button type="button" onClick={() => uploadRef.current?.click()} className="p-1.5 rounded hover:bg-gray-200"><ImageIcon size={16} /></button>
        <button type="button" onClick={() => setShowLibrary(!showLibrary)} className="p-1.5 rounded hover:bg-gray-200"><Library size={16} /></button>
        <button type="button" onClick={withRender(() => editor.chain().focus().undo().run())} className="p-1.5 rounded hover:bg-gray-200"><Undo size={16} /></button>
        <input ref={uploadRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
      </div>

      {showLibrary && (
        <div className="p-2 border-b grid grid-cols-4 sm:grid-cols-6 gap-2 bg-gray-50">
          {media.map(m => (
            <img key={m.key} src={m.url} className="h-16 w-full object-cover cursor-pointer hover:opacity-80" onClick={() => { editor.chain().focus().setImage({ src: m.url }).run(); setShowLibrary(false) }} />
          ))}
        </div>
      )}

      <EditorContent editor={editor} className="p-4 min-h-[300px] prose prose-sm max-w-none" spellCheck={true} />
    </div>
  )
}