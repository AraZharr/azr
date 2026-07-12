'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'
import { Bold, Italic, Heading2, List, Quote, Undo, Redo } from 'lucide-react'

export default function TipTapEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content ?? '',
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
  })

  useEffect(() => {
    if (editor && content && content !== editor.getJSON()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  const tools = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList') },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote') },
    { icon: Undo, action: () => editor.chain().focus().undo().run(), active: false },
    { icon: Redo, action: () => editor.chain().focus().redo().run(), active: false },
  ]

  return (
    <div className="border rounded-md">
      <div className="flex gap-1 p-2 border-b bg-gray-50">
        {tools.map(({ icon: Icon, action, active }, i) => (
          <button
            key={i}
            type="button"
            onClick={action}
            className={`p-1.5 rounded ${active ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
          >
            <Icon size={16} />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} className="p-4 min-h-[300px] prose prose-sm max-w-none" />
    </div>
  )
}
