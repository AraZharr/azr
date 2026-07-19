'use client'

import { useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import { compressImage } from '@/lib/compress-image'
import { toast } from 'sonner'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

export default function QuillEditor({ content, onChange }) {
  const quillRef = useRef(null)
  const uploadRef = useRef(null)

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: {
        image: () => uploadRef.current?.click(),
      },
    },
  }), [])

  async function handleImageUpload(file) {
    if (!file) return
    if (!file.type?.startsWith('image/')) {
      toast.error('File harus gambar')
      return
    }
    file = await compressImage(file)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
      if (!res.ok) {
        toast.error('Upload failed')
        return
      }
      const { url } = await res.json()
      const editor = quillRef.current?.getEditor?.()
      if (editor) {
        const range = editor.getSelection(true)
        editor.insertEmbed(range?.index ?? 0, 'image', url)
      }
      toast.success('Gambar ditambahkan')
    } catch {
      toast.error('Upload error')
    } finally {
      if (uploadRef.current) uploadRef.current.value = ''
    }
  }

  // Normalize TipTap JSON leftovers → empty string for Quill
  const value = typeof content === 'string'
    ? content
    : content && typeof content === 'object'
      ? ''
      : (content ?? '')

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-md border bg-white quill-wrap">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder="Tulis artikel..."
        className="w-full max-w-full"
      />
      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleImageUpload(e.target.files?.[0])}
      />
    </div>
  )
}
