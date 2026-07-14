// OG Image generator — returns SVG as image
// Fully self-contained, no deps needed
export const runtime = 'edge'
export const dynamic = 'force-static'

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_URL || 'https://clover.azhr.workers.dev'
  const title = 'AraZhar'
  const tagline = 'Developer & Creator'

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#1a1a2e"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="60" y="60" width="1080" height="510" rx="16" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
  <!-- Decorative circles -->
  <circle cx="200" cy="150" r="180" fill="rgba(99,102,241,0.08)"/>
  <circle cx="1000" cy="480" r="120" fill="rgba(139,92,246,0.06)"/>
  <!-- Main title -->
  <text x="600" y="290" text-anchor="middle" fill="white" font-family="system-ui,sans-serif" font-size="72" font-weight="800" letter-spacing="-2">${escapeXml(title)}</text>
  <!-- Accent line -->
  <rect x="540" y="320" width="120" height="4" rx="2" fill="url(#accent)"/>
  <!-- Tagline -->
  <text x="600" y="370" text-anchor="middle" fill="rgba(255,255,255,0.6)" font-family="system-ui,sans-serif" font-size="28" font-weight="400" letter-spacing="1">${escapeXml(tagline)}</text>
  <!-- URL -->
  <text x="600" y="440" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="monospace" font-size="18" letter-spacing="0.5">${escapeXml(siteUrl)}</text>
</svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
