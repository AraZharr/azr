import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-cf'
import { getCloudflareContext } from '@opennextjs/cloudflare'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const TYPE_LABELS = {
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/webp': 'WebP',
  'image/gif': 'GIF',
  'image/avif': 'AVIF',
}

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { env } = getCloudflareContext()
    const objects = await env.IMAGES.list()

    const images = []
    for (const o of objects.objects) {
      if (o.key === '') continue

      // Fetch metadata per object via head
      let width = 0, height = 0, mimeType = '', originalName = ''
      try {
        const head = await env.IMAGES.head(o.key)
        if (head) {
          mimeType = head.httpMetadata?.contentType || ''
          originalName = head.customMetadata?.originalName || o.key
          width = parseInt(head.customMetadata?.width || '0')
          height = parseInt(head.customMetadata?.height || '0')
        }
      } catch {}

      images.push({
        key: o.key,
        size: o.size,
        uploaded: o.uploaded,
        width,
        height,
        mimeType,
        originalName,
        url: `/api/admin/media/${o.key}`,
        dims: width > 0 && height > 0 ? `${width}×${height}` : '',
      })
    }

    images.sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded))
    return NextResponse.json(images)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPG, PNG, WebP, GIF, AVIF allowed' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Max 10MB per file' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = new Uint8Array(bytes)

    // Get dimensions
    let width = 0, height = 0
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      const { getImageDimensions } = await import('@/lib/image-dimensions')
      const dims = getImageDimensions(Buffer.from(buffer), file.type)
      width = dims.width
      height = dims.height
    }

    const ext = file.name.split('.').pop()
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { env } = getCloudflareContext()

    await env.IMAGES.put(uniqueName, buffer, {
      httpMetadata: { contentType: file.type },
      customMetadata: {
        originalName: file.name,
        width: String(width),
        height: String(height),
      },
    })

    return NextResponse.json({
      key: uniqueName,
      url: `/api/admin/media/${uniqueName}`,
      width,
      height,
      size: file.size,
      mimeType: file.type,
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { key } = await req.json()
    if (!key) return NextResponse.json({ error: 'No key provided' }, { status: 400 })

    const { env } = getCloudflareContext()
    await env.IMAGES.delete(key)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
