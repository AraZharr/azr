import { cookies } from 'next/headers'
import { createSession, getSessionById, deleteSession } from '@/lib/d1'

const COOKIE_NAME = 'session'

export async function createSessionToken(payload) {
  const sid = crypto.randomUUID()
  await createSession(sid, payload)
  return sid
}

export async function getSession() {
  const cookieStore = await cookies()
  const sid = cookieStore.get(COOKIE_NAME)?.value
  if (!sid) return null
  return getSessionById(sid)
}

export async function destroySession() {
  const cookieStore = await cookies()
  const sid = cookieStore.get(COOKIE_NAME)?.value
  if (sid) {
    await deleteSession(sid)
  }
}
