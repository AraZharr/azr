import { getCloudflareContext } from '@opennextjs/cloudflare'

function getDB() {
  const { env } = getCloudflareContext()
  return env.DB
}

function safeJson(val) {
  if (!val) return {}
  if (typeof val === 'object') return val
  try { return JSON.parse(val) } catch { return {} }
}

const toPage = (r) => r ? { ...r, published: !!r.published, content: safeJson(r.content) } : null
const toArticle = (r) => r ? { ...r, published: !!r.published, content: safeJson(r.content) } : null

export async function findUserByEmail(email) {
  const db = getDB()
  return db.prepare('SELECT * FROM User WHERE email = ?').bind(email).first()
}

export async function getPages() {
  const db = getDB()
  const { results } = await db.prepare('SELECT * FROM Page ORDER BY updatedAt DESC').all()
  return results.map(toPage)
}

export async function getPageById(id) {
  const db = getDB()
  return toPage(await db.prepare('SELECT * FROM Page WHERE id = ?').bind(id).first())
}

export async function createPage({ slug, title, content, meta_title, meta_description, og_image, keywords, noindex }) {
  const db = getDB()
  const id = crypto.randomUUID()
  await db.prepare(
    "INSERT INTO Page (id, slug, title, content, published, meta_title, meta_description, og_image, keywords, noindex, updatedAt) VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, ?, datetime('now'))"
  ).bind(id, slug, title, JSON.stringify(content ?? {}), meta_title ?? null, meta_description ?? null, og_image ?? null, keywords ?? null, noindex ? 1 : 0).run()
  return getPageById(id)
}

export async function updatePage(id, data) {
  const db = getDB()
  const sets = []
  const vals = []
  for (const [k, v] of Object.entries(data)) {
    if (k === 'content') { sets.push('content = ?'); vals.push(JSON.stringify(v)) }
    else if (k === 'published') { sets.push('published = ?'); vals.push(v ? 1 : 0) }
    else if (k === 'noindex') { sets.push('noindex = ?'); vals.push(v ? 1 : 0) }
    else if (['slug', 'title', 'meta_title', 'meta_description', 'og_image', 'keywords'].includes(k)) { sets.push(`${k} = ?`); vals.push(v) }
  }
  if (!sets.length) return getPageById(id)
  sets.push("updatedAt = datetime('now')")
  vals.push(id)
  await db.prepare(`UPDATE Page SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run()
  return getPageById(id)
}

export async function deletePage(id) {
  const db = getDB()
  await db.prepare('DELETE FROM Page WHERE id = ?').bind(id).run()
}

export async function getBlogArticles() {
  const db = getDB()
  const { results } = await db.prepare('SELECT * FROM BlogArticle ORDER BY createdAt DESC').all()
  return results.map(toArticle)
}

export async function getPublishedArticles() {
  const db = getDB()
  const { results } = await db.prepare(
    "SELECT id, title, slug, excerpt, createdAt, image FROM BlogArticle WHERE published = 1 ORDER BY createdAt DESC"
  ).all()
  return results
}

export async function getArticleBySlug(slug) {
  const db = getDB()
  return toArticle(await db.prepare('SELECT * FROM BlogArticle WHERE slug = ? AND published = 1').bind(slug).first())
}

export async function getArticleById(id) {
  const db = getDB()
  return toArticle(await db.prepare('SELECT * FROM BlogArticle WHERE id = ?').bind(id).first())
}

export async function createArticle({ slug, title, excerpt, content, published, image, meta_title, meta_description, og_image, keywords, noindex }) {
  const db = getDB()
  const id = crypto.randomUUID()
  await db.prepare(
    `INSERT INTO BlogArticle (id, slug, title, excerpt, content, published, image, meta_title, meta_description, og_image, keywords, noindex, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
  ).bind(id, slug, title, excerpt ?? null, JSON.stringify(content ?? {}), published ? 1 : 0, image ?? null, meta_title ?? null, meta_description ?? null, og_image ?? null, keywords ?? null, noindex ? 1 : 0).run()
  return getArticleById(id)
}

export async function updateArticle(id, data) {
  const db = getDB()
  const sets = []
  const vals = []
  for (const [k, v] of Object.entries(data)) {
    if (k === 'content') { sets.push('content = ?'); vals.push(JSON.stringify(v)) }
    else if (k === 'published') { sets.push('published = ?'); vals.push(v ? 1 : 0) }
    else if (['slug', 'title', 'excerpt', 'image', 'meta_title', 'meta_description', 'og_image', 'keywords'].includes(k)) { sets.push(`${k} = ?`); vals.push(v ?? null) }
    else if (k === 'noindex') { sets.push('noindex = ?'); vals.push(v ? 1 : 0) }
  }
  if (!sets.length) return getArticleById(id)
  sets.push("updatedAt = datetime('now')")
  vals.push(id)
  await db.prepare(`UPDATE BlogArticle SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run()
  return getArticleById(id)
}

export async function deleteArticle(id) {
  const db = getDB()
  await db.prepare('DELETE FROM BlogArticle WHERE id = ?').bind(id).run()
}

export async function getCounts() {
  const db = getDB()
  const { results } = await db.prepare(
    "SELECT (SELECT COUNT(*) FROM Page) as pageCount, (SELECT COUNT(*) FROM BlogArticle) as articleCount, (SELECT COUNT(*) FROM SocialLink) as socialCount, (SELECT COUNT(*) FROM Skill) as skillCount, (SELECT COUNT(*) FROM Project) as projectCount"
  ).all()
  return results[0] || { pageCount: 0, articleCount: 0, socialCount: 0, skillCount: 0, projectCount: 0 }
}

// === Social Links ===

export async function getSocialLinks() {
  const db = getDB()
  const { results } = await db.prepare('SELECT * FROM SocialLink ORDER BY sort_order ASC, createdAt ASC').all()
  return results.map((r) => ({ ...r, visible: !!r.visible }))
}

export async function getVisibleSocialLinks() {
  const db = getDB()
  const { results } = await db.prepare('SELECT * FROM SocialLink WHERE visible = 1 ORDER BY sort_order ASC, createdAt ASC').all()
  return results.map((r) => ({ ...r, visible: true }))
}

export async function createSocialLink({ platform, url, label, icon, visible, sort_order }) {
  const db = getDB()
  const id = crypto.randomUUID()
  await db.prepare(
    "INSERT INTO SocialLink (id, platform, url, label, icon, visible, sort_order, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))"
  ).bind(id, platform, url, label ?? null, icon ?? null, visible !== false ? 1 : 0, sort_order ?? 0).run()
  return (await db.prepare('SELECT * FROM SocialLink WHERE id = ?').bind(id).first())
}

export async function updateSocialLink(id, data) {
  const db = getDB()
  const sets = []
  const vals = []
  for (const [k, v] of Object.entries(data)) {
    if (k === 'visible') { sets.push('visible = ?'); vals.push(v ? 1 : 0) }
    else if (k === 'sort_order') { sets.push('sort_order = ?'); vals.push(v ?? 0) }
    else if (['platform', 'url', 'label', 'icon'].includes(k)) { sets.push(`${k} = ?`); vals.push(v ?? null) }
  }
  if (!sets.length) return (await db.prepare('SELECT * FROM SocialLink WHERE id = ?').bind(id).first())
  sets.push("updatedAt = datetime('now')")
  vals.push(id)
  await db.prepare(`UPDATE SocialLink SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run()
  return (await db.prepare('SELECT * FROM SocialLink WHERE id = ?').bind(id).first())
}

export async function deleteSocialLink(id) {
  const db = getDB()
  await db.prepare('DELETE FROM SocialLink WHERE id = ?').bind(id).run()
}

// === Skills ===

export async function getSkills() {
  const db = getDB()
  const { results } = await db.prepare('SELECT * FROM Skill ORDER BY sort_order ASC, createdAt ASC').all()
  return results.map((r) => ({ ...r, visible: !!r.visible }))
}

export async function getVisibleSkills() {
  const db = getDB()
  const { results } = await db.prepare('SELECT * FROM Skill WHERE visible = 1 ORDER BY sort_order ASC').all()
  return results.map((r) => ({ ...r, visible: true }))
}

export async function getSkillById(id) {
  const db = getDB()
  const r = await db.prepare('SELECT * FROM Skill WHERE id = ?').bind(id).first()
  return r ? { ...r, visible: !!r.visible } : null
}

export async function createSkill({ name, level, sort_order, visible }) {
  const db = getDB()
  const id = crypto.randomUUID()
  await db.prepare(
    "INSERT INTO Skill (id, name, level, sort_order, visible, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))"
  ).bind(id, name, level ?? 80, sort_order ?? 0, visible !== false ? 1 : 0).run()
  return getSkillById(id)
}

export async function updateSkill(id, data) {
  const db = getDB()
  const sets = []
  const vals = []
  for (const [k, v] of Object.entries(data)) {
    if (k === 'name') { sets.push('name = ?'); vals.push(v) }
    else if (k === 'level') { sets.push('level = ?'); vals.push(v ?? 80) }
    else if (k === 'sort_order') { sets.push('sort_order = ?'); vals.push(v ?? 0) }
    else if (k === 'visible') { sets.push('visible = ?'); vals.push(v ? 1 : 0) }
  }
  if (!sets.length) return getSkillById(id)
  sets.push("updatedAt = datetime('now')")
  vals.push(id)
  await db.prepare(`UPDATE Skill SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run()
  return getSkillById(id)
}

export async function deleteSkill(id) {
  const db = getDB()
  await db.prepare('DELETE FROM Skill WHERE id = ?').bind(id).run()
}

// === Projects ===

export async function getProjects() {
  const db = getDB()
  const { results } = await db.prepare('SELECT * FROM Project ORDER BY sort_order ASC, createdAt ASC').all()
  return results.map((r) => ({ ...r, tech: safeJson(r.tech), visible: !!r.visible }))
}

export async function getVisibleProjects() {
  const db = getDB()
  const { results } = await db.prepare('SELECT * FROM Project WHERE visible = 1 ORDER BY sort_order ASC').all()
  return results.map((r) => ({ ...r, tech: safeJson(r.tech), visible: true }))
}

export async function getProjectById(id) {
  const db = getDB()
  const r = await db.prepare('SELECT * FROM Project WHERE id = ?').bind(id).first()
  return r ? { ...r, tech: safeJson(r.tech), visible: !!r.visible } : null
}

export async function createProject({ title, description, tech, link, image, sort_order, visible }) {
  const db = getDB()
  const id = crypto.randomUUID()
  await db.prepare(
    "INSERT INTO Project (id, title, description, tech, link, image, sort_order, visible, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))"
  ).bind(id, title, description ?? null, JSON.stringify(tech ?? []), link ?? null, image ?? null, sort_order ?? 0, visible !== false ? 1 : 0).run()
  return getProjectById(id)
}

export async function updateProject(id, data) {
  const db = getDB()
  const sets = []
  const vals = []
  for (const [k, v] of Object.entries(data)) {
    if (k === 'title' || k === 'description' || k === 'link' || k === 'image') { sets.push(`${k} = ?`); vals.push(v ?? null) }
    else if (k === 'tech') { sets.push('tech = ?'); vals.push(JSON.stringify(v ?? [])) }
    else if (k === 'sort_order') { sets.push('sort_order = ?'); vals.push(v ?? 0) }
    else if (k === 'visible') { sets.push('visible = ?'); vals.push(v ? 1 : 0) }
  }
  if (!sets.length) return getProjectById(id)
  sets.push("updatedAt = datetime('now')")
  vals.push(id)
  await db.prepare(`UPDATE Project SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run()
  return getProjectById(id)
}

export async function deleteProject(id) {
  const db = getDB()
  await db.prepare('DELETE FROM Project WHERE id = ?').bind(id).run()
}

// === Site Settings ===

const DEFAULTS = {
  site_title: 'AraZhar',
  site_tagline: 'Developer & Creator',
  logo: '',
  og_image: '/api/og',
  og_title: '',
  meta_description: 'Portfolio pribadi AraZhar — Developer, kreator digital. Membangun solusi web, bot, dan automation yang berdampak.',
  keywords: 'AraZhar,developer,portfolio,web developer,fullstack,Next.js,Telegram bot,automation,Indonesia',
  canonical_url: 'https://clover.azhr.workers.dev',
  copyright_text: '© {year} AraZhar. All rights reserved.',
}

export async function getSettings() {
  const db = getDB()
  const { results } = await db.prepare('SELECT key, value FROM SiteSetting').all()
  const stored = {}
  for (const row of results) stored[row.key] = row.value
  return { ...DEFAULTS, ...stored }
}

export async function upsertSettings(data) {
  const db = getDB()
  for (const [key, value] of Object.entries(data)) {
    if (!(key in DEFAULTS)) continue
    await db.prepare(
      "INSERT INTO SiteSetting (key, value, updatedAt) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = datetime('now')"
    ).bind(key, String(value ?? '')).run()
  }
  return getSettings()
}

// === CV (multi-CV) ===

function toCV(r) {
  if (!r) return null
  return { ...r, published: !!r.published, data: safeJson(r.data) }
}

export async function getCVList() {
  const db = getDB()
  const { results } = await db.prepare('SELECT * FROM CV ORDER BY sort_order ASC, createdAt ASC').all()
  return results.map(toCV)
}

export async function getVisibleCV() {
  const db = getDB()
  const { results } = await db.prepare('SELECT * FROM CV WHERE published = 1 ORDER BY sort_order ASC').all()
  return results.map(toCV)
}

export async function getCVById(id) {
  const db = getDB()
  return toCV(await db.prepare('SELECT * FROM CV WHERE id = ?').bind(id).first())
}

export async function getCVBySlug(slug) {
  const db = getDB()
  return toCV(await db.prepare('SELECT * FROM CV WHERE slug = ?').bind(slug).first())
}

export async function createCV({ title, slug, data, published, sort_order }) {
  const db = getDB()
  const id = crypto.randomUUID()
  await db.prepare(
    "INSERT INTO CV (id, title, slug, data, published, sort_order, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))"
  ).bind(id, title, slug, JSON.stringify(data ?? {}), published ? 1 : 0, sort_order ?? 0).run()
  return getCVById(id)
}

export async function updateCV(id, fields) {
  const db = getDB()
  const sets = []
  const vals = []
  for (const [k, v] of Object.entries(fields)) {
    if (k === 'title') { sets.push('title = ?'); vals.push(v) }
    else if (k === 'slug') { sets.push('slug = ?'); vals.push(v) }
    else if (k === 'data') { sets.push('data = ?'); vals.push(JSON.stringify(v ?? {})) }
    else if (k === 'published') { sets.push('published = ?'); vals.push(v ? 1 : 0) }
    else if (k === 'sort_order') { sets.push('sort_order = ?'); vals.push(v ?? 0) }
  }
  if (!sets.length) return getCVById(id)
  sets.push("updatedAt = datetime('now')")
  vals.push(id)
  await db.prepare(`UPDATE CV SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run()
  return getCVById(id)
}

export async function deleteCV(id) {
  const db = getDB()
  await db.prepare('DELETE FROM CV WHERE id = ?').bind(id).run()
}

export async function reorderCV(ids) {
  const db = getDB()
  for (let i = 0; i < ids.length; i++) {
    await db.prepare('UPDATE CV SET sort_order = ?, updatedAt = datetime(\'now\') WHERE id = ?').bind(i, ids[i]).run()
  }
}

export async function checkRateLimit(key, limit, windowSeconds) {
  const db = getDB()
  const now = Date.now()
  const resetAt = new Date(now + windowSeconds * 1000).toISOString()

  const row = await db.prepare('SELECT * FROM RateLimit WHERE key = ?').bind(key).first()

  if (!row) {
    await db.prepare('INSERT INTO RateLimit (key, count, reset_at) VALUES (?, 1, ?)').bind(key, resetAt).run()
    return { allowed: true, remaining: limit - 1 }
  }

  const resetTime = new Date(row.reset_at).getTime()

  if (now > resetTime) {
    await db.prepare('UPDATE RateLimit SET count = 1, reset_at = ? WHERE key = ?').bind(resetAt, key).run()
    return { allowed: true, remaining: limit - 1 }
  }

  if (row.count >= limit) {
    return { allowed: false, remaining: 0, retryAfter: Math.ceil((resetTime - now) / 1000) }
  }

  await db.prepare('UPDATE RateLimit SET count = count + 1 WHERE key = ?').bind(key).run()
  return { allowed: true, remaining: limit - row.count - 1 }
}

// === Session (D1-backed auth) ===

export async function createSession(sid, { userId, email, name }) {
  const db = getDB()
  await db.prepare(
    'INSERT INTO Session (id, user_id, email, name) VALUES (?, ?, ?, ?)'
  ).bind(sid, userId, email, name ?? null).run()
}

export async function getSessionById(sid) {
  const db = getDB()
  const row = await db.prepare('SELECT * FROM Session WHERE id = ?').bind(sid).first()
  if (!row) return null
  // Expire sessions older than 24h
  const created = new Date(row.created_at + 'Z').getTime()
  if (Date.now() - created > 86400000) {
    await db.prepare('DELETE FROM Session WHERE id = ?').bind(sid).run()
    return null
  }
  return { id: row.id, userId: row.user_id, email: row.email, name: row.name }
}

export async function deleteSession(sid) {
  const db = getDB()
  await db.prepare('DELETE FROM Session WHERE id = ?').bind(sid).run()
}

export async function cleanupExpiredSessions() {
  const db = getDB()
  const cutoff = new Date(Date.now() - 86400000).toISOString().replace('T', ' ').replace('Z', '')
  await db.prepare("DELETE FROM Session WHERE created_at < ?").bind(cutoff).run()
}
