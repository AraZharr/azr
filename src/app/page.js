export default function Home() {
  const botUsername = process.env.NEXT_PUBLIC_BOT_USERNAME || 'clover_ai_bot';

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>🍀</div>

        {/* Title */}
        <h1 style={styles.title}>Clover</h1>
        <p style={styles.subtitle}>Telegram AI Assistant Bot</p>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Features */}
        <ul style={styles.features}>
          <li>🤖 <strong>3 AI Providers</strong> — Gemini, Groq, OpenRouter</li>
          <li>🔄 <strong>Auto Fallback</strong> — tidak pernah offline</li>
          <li>🧠 <strong>Persistent Memory</strong> — ingat kamu lintas sesi</li>
          <li>⚡ <strong>Response cepat</strong> — target &lt; 5 detik</li>
          <li>🎭 <strong>5 mode jawaban</strong> — balanced, concise, detailed, coding, creative</li>
        </ul>

        {/* CTA */}
        <a
          href={`https://t.me/${botUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.cta}
        >
          Mulai Chat di Telegram →
        </a>

        {/* Commands preview */}
        <div style={styles.commandBox}>
          <p style={styles.commandTitle}>Quick Commands</p>
          <code style={styles.code}>
            /start · /help · /reset · /status<br />
            /provider · /model · /mode · /lang<br />
            /memory · /remember · /forget · /summary
          </code>
        </div>

        {/* Footer */}
        <p style={styles.footer}>
          Built with Next.js · Deployed on Vercel · Powered by Supabase
        </p>
      </div>
    </main>
  );
}

const styles = {
  main: {
    minHeight:       '100vh',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    background:      'linear-gradient(135deg, #0f1b0f 0%, #1a2e1a 100%)',
    fontFamily:      '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    padding:         '24px',
  },
  card: {
    background:    'rgba(255,255,255,0.05)',
    border:        '1px solid rgba(255,255,255,0.1)',
    borderRadius:  '24px',
    padding:       '48px 40px',
    maxWidth:      '480px',
    width:         '100%',
    textAlign:     'center',
    backdropFilter: 'blur(12px)',
  },
  logo: {
    fontSize:    '64px',
    marginBottom: '12px',
  },
  title: {
    fontSize:     '36px',
    fontWeight:   '800',
    color:        '#4ade80',
    margin:       '0 0 4px',
    letterSpacing: '-0.5px',
  },
  subtitle: {
    fontSize:   '15px',
    color:      '#86efac',
    margin:     '0 0 24px',
    opacity:    0.8,
  },
  divider: {
    height:       '1px',
    background:   'rgba(255,255,255,0.1)',
    margin:       '0 0 24px',
  },
  features: {
    listStyle:   'none',
    padding:     0,
    margin:      '0 0 28px',
    textAlign:   'left',
    color:       '#d1fae5',
    fontSize:    '14px',
    lineHeight:  '1.8',
  },
  cta: {
    display:         'inline-block',
    background:      '#4ade80',
    color:           '#0a1a0a',
    fontWeight:      '700',
    fontSize:        '15px',
    padding:         '14px 32px',
    borderRadius:    '12px',
    textDecoration:  'none',
    marginBottom:    '28px',
    transition:      'opacity 0.2s',
  },
  commandBox: {
    background:   'rgba(0,0,0,0.3)',
    borderRadius: '12px',
    padding:      '16px',
    marginBottom: '24px',
  },
  commandTitle: {
    color:        '#86efac',
    fontSize:     '12px',
    fontWeight:   '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    margin:       '0 0 10px',
  },
  code: {
    color:      '#a7f3d0',
    fontSize:   '13px',
    lineHeight: '1.8',
    fontFamily: '"SF Mono", "Fira Code", monospace',
  },
  footer: {
    color:     'rgba(255,255,255,0.3)',
    fontSize:  '12px',
    margin:    0,
  },
};
