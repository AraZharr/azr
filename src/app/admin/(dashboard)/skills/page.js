'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react'

export default function SkillsPage() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', level: 80, sort_order: 0, visible: true })

  useEffect(() => { fetchSkills() }, [])

  async function fetchSkills() {
    const res = await fetch('/api/admin/skills')
    const data = await res.json()
    setSkills(data)
    setLoading(false)
  }

  function resetForm() {
    setForm({ name: '', level: 80, sort_order: skills.length, visible: true })
    setEditId(null)
    setShowForm(false)
  }

  function startEdit(skill) {
    setForm({ name: skill.name, level: skill.level, sort_order: skill.sort_order, visible: skill.visible })
    setEditId(skill.id)
    setShowForm(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const payload = { ...form }

    if (editId) {
      await fetch(`/api/admin/skills/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } else {
      await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }
    resetForm()
    fetchSkills()
  }

  async function handleDelete(id) {
    if (!confirm('Hapus skill ini?')) return
    await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' })
    fetchSkills()
  }

  async function toggleVisible(id, current) {
    await fetch(`/api/admin/skills/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: !current }),
    })
    fetchSkills()
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Skills</h1>
        <Button onClick={() => { resetForm(); setShowForm(true) }}>
          <Plus size={16} className="mr-1" /> Add Skill
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border rounded-xl p-5 mb-6 space-y-4 bg-gray-50">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nama Skill</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="JavaScript / TypeScript"
                required
                className="w-full text-sm border rounded-lg px-3 py-2 outline-none focus:border-black"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Level (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={form.level}
                onChange={(e) => setForm({ ...form, level: parseInt(e.target.value) || 0 })}
                className="w-full text-sm border rounded-lg px-3 py-2 outline-none focus:border-black"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Urutan</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full text-sm border rounded-lg px-3 py-2 outline-none focus:border-black"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => setForm({ ...form, visible: e.target.checked })}
                  className="rounded"
                />
                Tampilkan di website
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm">{editId ? 'Update' : 'Tambah'}</Button>
            <Button type="button" variant="ghost" size="sm" onClick={resetForm}>Batal</Button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : skills.length === 0 ? (
        <p className="text-gray-500">Belum ada skill. Klik &quot;Add Skill&quot; untuk menambah.</p>
      ) : (
        <div className="space-y-2">
          {skills.map((skill) => (
            <div key={skill.id} className="flex items-start gap-2 border rounded-lg px-3 py-3 bg-white sm:items-center sm:gap-3 sm:px-4">
              <GripVertical size={16} className="text-gray-300 mt-0.5 shrink-0 sm:mt-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{skill.name}</span>
                  <span className="text-xs text-gray-400 shrink-0">{skill.level}%</span>
                  {!skill.visible && (
                    <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded shrink-0">hidden</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleVisible(skill.id, skill.visible)}
                  className="p-1.5 text-gray-400 hover:text-black transition"
                  title={skill.visible ? 'Sembunyikan' : 'Tampilkan'}
                >
                  {skill.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  onClick={() => startEdit(skill)}
                  className="text-xs text-gray-500 hover:text-black px-2 py-1 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(skill.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
