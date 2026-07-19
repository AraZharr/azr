import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_URL || 'https://azr.is-a.dev'
  const title = process.env.NEXT_PUBLIC_OG_TITLE || 'AraZhar'
  const tagline = process.env.NEXT_PUBLIC_OG_TAGLINE || 'Developer & Creator'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* soft glow */}
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: 120,
            width: 280,
            height: 280,
            borderRadius: 999,
            background: 'rgba(99,102,241,0.12)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 100,
            width: 200,
            height: 200,
            borderRadius: 999,
            background: 'rgba(139,92,246,0.1)',
            display: 'flex',
          }}
        />

        {/* frame */}
        <div
          style={{
            position: 'absolute',
            top: 48,
            left: 48,
            right: 48,
            bottom: 48,
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            display: 'flex',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: 'white',
              letterSpacing: -2,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              width: 120,
              height: 4,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
              display: 'flex',
            }}
          />
          <div
            style={{
              fontSize: 28,
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: 1,
            }}
          >
            {tagline}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 18,
              color: 'rgba(255,255,255,0.35)',
              fontFamily: 'monospace',
            }}
          >
            {siteUrl.replace(/^https?:\/\//, '')}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    }
  )
}
