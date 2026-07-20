import { AwsClient } from 'aws4fetch'

// R2 lewat S3-compatible API — bucket azr tetap dipakai,
// tidak perlu binding Workers.
let aws

function getAws() {
  if (!aws) {
    aws = new AwsClient({
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      service: 's3',
      region: 'auto',
    })
  }
  return aws
}

function baseUrl() {
  return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.R2_BUCKET_NAME}`
}

function decodeXmlEntities(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
}

export async function listObjects() {
  const res = await getAws().fetch(`${baseUrl()}?list-type=2&max-keys=1000`)
  if (!res.ok) throw new Error(`R2 list failed: ${res.status}`)
  const xml = await res.text()

  const objects = []
  const re = /<Contents>([\s\S]*?)<\/Contents>/g
  let m
  while ((m = re.exec(xml))) {
    const block = m[1]
    const key = /<Key>([\s\S]*?)<\/Key>/.exec(block)?.[1]
    const size = /<Size>(\d+)<\/Size>/.exec(block)?.[1]
    const lastModified = /<LastModified>([\s\S]*?)<\/LastModified>/.exec(block)?.[1]
    if (key) {
      objects.push({
        key: decodeXmlEntities(key),
        size: parseInt(size || '0'),
        uploaded: lastModified || '',
      })
    }
  }
  return objects
}

export async function headObject(key) {
  const res = await getAws().fetch(`${baseUrl()}/${encodeURIComponent(key)}`, { method: 'HEAD' })
  if (!res.ok) return null
  return {
    contentType: res.headers.get('content-type') || '',
    customMetadata: {
      originalName: res.headers.get('x-amz-meta-originalname') || '',
      width: res.headers.get('x-amz-meta-width') || '0',
      height: res.headers.get('x-amz-meta-height') || '0',
    },
  }
}

export async function getObject(key) {
  const res = await getAws().fetch(`${baseUrl()}/${encodeURIComponent(key)}`)
  if (!res.ok) return null
  return {
    body: res.body,
    contentType: res.headers.get('content-type') || 'application/octet-stream',
    customMetadata: {
      originalName: res.headers.get('x-amz-meta-originalname') || '',
      width: res.headers.get('x-amz-meta-width') || '0',
      height: res.headers.get('x-amz-meta-height') || '0',
    },
  }
}

export async function putObject(key, body, { contentType, customMetadata = {} } = {}) {
  const headers = {
    'Content-Type': contentType || 'application/octet-stream',
    'Content-Length': String(body.length || body.byteLength || 0),
  }
  for (const [k, v] of Object.entries(customMetadata)) {
    headers[`x-amz-meta-${k.toLowerCase()}`] = String(v)
  }
  const res = await getAws().fetch(`${baseUrl()}/${encodeURIComponent(key)}`, {
    method: 'PUT',
    headers,
    body,
  })
  if (!res.ok) throw new Error(`R2 put failed: ${res.status}`)
}

export async function deleteObject(key) {
  const res = await getAws().fetch(`${baseUrl()}/${encodeURIComponent(key)}`, { method: 'DELETE' })
  if (!res.ok && res.status !== 404) throw new Error(`R2 delete failed: ${res.status}`)
}
