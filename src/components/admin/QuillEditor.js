'use client'

import { useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import { compressImage } from '@/lib/compress-image'
import { toast } from 'sonner'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function QuillEditor({ content, onChange }) {
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
    file = await compressImage(file)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
      if (!res.ok) { toast.error('Upload failed'); return }
      const { url } = await res.json()
      const quill = uploadRef.current?.quill
      if (quill) {
        const range = quill.getSelection(true)
        quill.insertEmbed(range.index, 'image', url)
      }
      toast.success('Gambar ditambahkan')
    } catch {
      toast.error('Upload error')
    }
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <ReactQuill
        theme="snow"
        value={content ?? ''}
        onChange={onChange}
        modules={modules}
        placeholder="Tulis artikel..."
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
