'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect } from 'react'

export default function TipTapRenderer({ content }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content ?? '',
    editable: false,
  })

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  return <EditorContent editor={editor} />
}
