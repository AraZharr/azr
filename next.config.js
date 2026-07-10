/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Telegram webhook: disable body parsing on webhook route
  // (handled per-route via route config)
  
  // Vercel deployment optimizations
  experimental: {
    serverComponentsExternalPackages: ['@google/generative-ai', 'groq-sdk'],
  },

  // Environment variables exposed to server
  serverRuntimeConfig: {
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
    telegramWebhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
    groqApiKey: process.env.GROQ_API_KEY,
    openrouterApiKey: process.env.OPENROUTER_API_KEY,
    botAdminIds: process.env.BOT_ADMIN_TELEGRAM_IDS,
    defaultProvider: process.env.DEFAULT_PROVIDER || 'gemini',
    fallbackOrder: process.env.FALLBACK_ORDER || 'groq,openrouter',
    dailyMessageLimit: parseInt(process.env.DAILY_MESSAGE_LIMIT || '100'),
    sessionMemoryLimit: parseInt(process.env.SESSION_MEMORY_LIMIT || '25'),
    longTermMemoryLimit: parseInt(process.env.LONG_TERM_MEMORY_LIMIT || '50'),
    summaryMemoryLimit: parseInt(process.env.SUMMARY_MEMORY_LIMIT || '5'),
  },

  publicRuntimeConfig: {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
  },
};

module.exports = nextConfig;
