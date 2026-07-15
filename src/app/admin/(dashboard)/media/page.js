'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Copy, Upload, ExternalLink, FileImage } from 'lucide-react'
import { toast } from 'sonner'
import { compressImage } from '@/lib/compress-image'
import MediaViewer from '@/components/admin/MediaViewer'

const FORMAT_BADGES = {
  'image/jpeg': { label: 'JPEG', color: 'bg-blue-50 text-blue-700' },
  'image/png': { label: 'PNG', color: 'bg-green-50 text-green-700' },
  'image/webp': { label: 'WebP', color: 'bg-purple-50 text-purple-700' },
  'image/gif': { label: 'GIF', color: 'bg-pink-50 text-pink-700' },
  'image/avif': { label: 'AVIF', color: 'bg-orange-50 text-orange-700' },
}

export default function MediaPage() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [viewerImage, setViewerImage] = useState(null)
  const inputRef = useRef(null)

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/media')
      const data = await res.json()
      setImages(data.error ? [] : data)
    } catch {
      setImages([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchImages() }, [fetchImages])

  async function handleUpload(files) {
    if (!files.length) return
    setUploading(true)

    let ok = 0, fail = 0
    for (const raw of files) {
      let file = raw
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'].includes(file.type)) {
        toast.error(`${file.name}: format not supported`)
        fail++
        continue
      }
      file = await compressImage(file)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name}: max 10MB`)
        fail++
        continue
      }

      const fd = new FormData()
      fd.append('file', file)

      try {
        const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
        if (res.ok) ok++
        else fail++
      } catch {
        fail++
      }
    }

    if (ok > 0) toast.success(`${ok} file uploaded`)
    if (fail > 0) toast.error(`${fail} file failed`)

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
    fetchImages()
  }

  async function handleDelete(key) {
    if (!confirm('Delete this image?')) return
    try {
      const res = await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      })
      if (res.ok) {
        toast.success('Deleted')
        fetchImages()
      } else {
        toast.error('Delete failed')
      }
    } catch {
      toast.error('Delete error')
    }
  }

  function copyUrl(url) {
    const full = window.location.origin + url
    navigator.clipboard.writeText(full)
    toast.success('URL copied')
  }

  function formatSize(bytes) {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  }

  function formatRatio(w, h) {
    if (!w || !h) return ''
    const g = gcd(w, h)
    return `${w / g}:${h / g}`
  }

  function gcd(a, b) { return b === 0 ? a : gcd(b, a % b) }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
            <Upload size={16} className="mr-2" />
            {uploading ? 'Uploading...' : 'Upload Images'}
          </Button>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleUpload(e.dataTransfer.files) }}
        className="border-2 border-dashed border-gray-200 rounded-xl p-8 mb-6 text-center text-gray-400 hover:border-gray-400 transition cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={32} className="mx-auto mb-2 opacity-40" />
        <p className="text-sm">Drop images here or click to browse</p>
        <p className="text-xs mt-1">JPG, PNG, WebP, GIF, AVIF — max 10MB per file</p>
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : images.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FileImage size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No images yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img) => {
            const badge = FORMAT_BADGES[img.mimeType] || { label: img.mimeType?.split('/')[1]?.toUpperCase() || '?', color: 'bg-gray-50 text-gray-600' }
            const ratio = formatRatio(img.width, img.height)
            return (
              <div key={img.key} className="group relative border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setViewerImage(img)}
          >
                {/* Thumbnail */}
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={img.url}
                    alt={img.originalName || img.key}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>

                {/* Metadata */}
                <div className="p-2.5 space-y-1.5">
                  {/* Format badge */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {formatSize(img.size)}
                    </span>
                  </div>

                  {/* Dimensions + ratio */}
                  {img.width > 0 && img.height > 0 && (
                    <div className="text-[11px] text-gray-600 flex items-center gap-1">
                      <span className="font-medium">{img.width}×{img.height}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-400">{ratio}</span>
                    </div>
                  )}

                  {/* File name */}
                  <p className="text-[10px] text-gray-400 truncate" title={img.originalName}>
                    {img.originalName}
                  </p>
                </div>

                {/* Actions overlay */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={(e) => { e.stopPropagation(); copyUrl(img.url) }}
                    className="bg-white/90 hover:bg-white rounded-full p-1.5 shadow-sm text-gray-600 hover:text-black"
                    title="Copy URL"
                  >
                    <Copy size={12} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); window.open(img.url, '_blank') }}
                    className="bg-white/90 hover:bg-white rounded-full p-1.5 shadow-sm text-gray-600 hover:text-black"
                    title="Open"
                  >
                    <ExternalLink size={12} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(img.key) }}
                    className="bg-white/90 hover:bg-white rounded-full p-1.5 shadow-sm text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Viewer modal */}
      {viewerImage && (
        <MediaViewer
          image={viewerImage}
          onClose={() => setViewerImage(null)}
          onDelete={(key) => {
            setViewerImage(null)
            handleDelete(key)
          }}
          onRename={(key, newName) => {
            setImages((prev) => prev.map((img) => img.key === key ? { ...img, originalName: newName } : img))
          }}
        />
      )}
    </div>
  )
}
