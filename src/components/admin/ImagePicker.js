'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Upload, Check, FileImage } from 'lucide-react'
import { toast } from 'sonner'

export default function ImagePicker({ open, onClose, onSelect }) {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchImages = useCallback(async () => {
    if (!open) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/media')
      const data = await res.json()
      setImages(data.error ? [] : data)
    } catch {
      setImages([])
    } finally {
      setLoading(false)
    }
  }, [open])

  useEffect(() => { fetchImages() }, [fetchImages])

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const fd = new FormData()
    fd.append('file', file)

    try {
      const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
      if (res.ok) {
        const data = await res.json()
        toast.success('Uploaded')
        fetchImages()
        onSelect(data.url)
        onClose()
      } else {
        toast.error('Upload failed')
      }
    } catch {
      toast.error('Upload error')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-[90vw] max-w-3xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-semibold text-lg">Select Image</h2>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="hidden" onChange={handleUpload} />
              <Upload size={14} /> Upload
            </label>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="text-gray-400 text-sm text-center py-10">Loading...</p>
          ) : images.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <FileImage size={40} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No images</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {images.map((img) => (
                <button
                  key={img.key}
                  onClick={() => { onSelect(img.url); onClose() }}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 border hover:border-black transition"
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
                    <Check size={24} className="text-white opacity-0 group-hover:opacity-100 drop-shadow-lg" />
                  </div>
                  {/* Metadata bottom */}
                  {img.width > 0 && img.height > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1.5 pt-5 opacity-0 group-hover:opacity-100 transition">
                      <p className="text-[10px] text-white font-medium">
                        {img.width}×{img.height}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
