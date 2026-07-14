import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'

export async function GET(req, { params }) {
  const { key } = await params

  try {
    const { env } = getCloudflareContext()
    const object = await env.IMAGES.get(key)
    if (!object) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const headers = new Headers()
    object.writeHttpMetadata(headers)
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')

    return new NextResponse(object.body, {
      headers,
      status: 200,
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
