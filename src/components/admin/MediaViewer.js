'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Download, Trash2, Copy, Pencil, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function MediaViewer({ image, onClose, onDelete, onRename }) {
  const [renaming, setRenaming] = useState(false)
  const [newName, setNewName] = useState('')
  const [deleting, setDeleting] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [renaming])

  if (!image) return null

  function startRename() {
    setNewName(image.originalName || image.key)
    setRenaming(true)
  }

  async function submitRename() {
    if (!newName.trim() || newName === image.originalName) {
      setRenaming(false)
      return
    }

    try {
      const res = await fetch(`/api/admin/media/${image.key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalName: newName.trim() }),
      })
      if (res.ok) {
        toast.success('Nama diubah')
        onRename?.(image.key, newName.trim())
      } else {
        toast.error('Gagal mengubah nama')
      }
    } catch {
      toast.error('Error')
    }
    setRenaming(false)
  }

  function formatDate(ts) {
    if (!ts) return ''
    const d = new Date(ts)
    return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  function formatSize(bytes) {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  function handleDelete() {
    if (!confirm('Hapus gambar ini?')) return
    setDeleting(true)
    onDelete?.(image.key)
  }

  function copyUrl() {
    navigator.clipboard.writeText(image.url)
    toast.success('URL disalin')
  }

  function download() {
    const a = document.createElement('a')
    a.href = image.url
    a.download = image.originalName || image.key
    a.click()
  }

  // Close on backdrop click
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }

  // Close on Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-2 sm:p-6"
      onClick={handleBackdrop}
    >
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[95vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow text-gray-600"
        >
          <X size={18} />
        </button>

        {/* Image area */}
        <div className="flex-1 min-h-0 bg-black/5 flex items-center justify-center p-4">
          <img
            src={image.url}
            alt={image.originalName || image.key}
            className="max-w-full max-h-[55vh] object-contain rounded"
          />
        </div>

        {/* Detail panel */}
        <div className="p-4 sm:p-5 space-y-3 border-t">
          {/* File name + rename */}
          <div className="flex items-center gap-2">
            {renaming ? (
              <div className="flex-1 flex gap-2">
                <Input
                  ref={inputRef}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') submitRename(); if (e.key === 'Escape') setRenaming(false) }}
                  className="flex-1 text-sm"
                />
                <Button size="sm" onClick={submitRename}>
                  <Check size={14} />
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-sm font-medium truncate flex-1" title={image.originalName || image.key}>
                  {image.originalName || image.key}
                </h3>
                <button onClick={startRename} className="text-gray-400 hover:text-black p-1" title="Ubah nama">
                  <Pencil size={14} />
                </button>
              </>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
            {image.width > 0 && image.height > 0 && (
              <>
                <span className="text-gray-400">Dimensi</span>
                <span>{image.width} × {image.height}</span>
              </>
            )}
            <span className="text-gray-400">Ukuran</span>
            <span>{formatSize(image.size)}</span>
            {image.mimeType && (
              <>
                <span className="text-gray-400">Tipe</span>
                <span>{image.mimeType}</span>
              </>
            )}
            {image.uploaded && (
              <>
                <span className="text-gray-400">Diunggah</span>
                <span>{formatDate(image.uploaded)}</span>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={copyUrl} className="flex-1">
              <Copy size={14} className="mr-1.5" /> Salin URL
            </Button>
            <Button variant="outline" size="sm" onClick={download} className="flex-1">
              <Download size={14} className="mr-1.5" /> Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete} disabled={deleting} className="text-red-500 border-red-200 flex-1">
              <Trash2 size={14} className="mr-1.5" /> {deleting ? '...' : 'Hapus'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
