-- ============================================================
-- CLOVER — Telegram AI Assistant Bot
-- Supabase Database Schema v1.0
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: users
-- Telegram users who have interacted with the bot
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telegram_id       BIGINT UNIQUE NOT NULL,
  username          TEXT,
  first_name        TEXT,
  last_name         TEXT,
  is_banned         BOOLEAN DEFAULT FALSE,
  is_admin          BOOLEAN DEFAULT FALSE,
  message_count     INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  last_active_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: user_preferences
-- Per-user settings (provider, model, language, style)
-- ============================================================
CREATE TABLE IF NOT EXISTS user_preferences (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  default_provider  TEXT DEFAULT 'gemini' CHECK (default_provider IN ('gemini', 'groq', 'openrouter')),
  default_model     TEXT DEFAULT 'gemini-2.0-flash',
  language          TEXT DEFAULT 'id' CHECK (language IN ('id', 'en')),
  response_style    TEXT DEFAULT 'balanced' CHECK (response_style IN ('balanced', 'concise', 'detailed', 'coding', 'creative')),
  memory_enabled    BOOLEAN DEFAULT TRUE,
  group_mode        TEXT DEFAULT 'mention' CHECK (group_mode IN ('mention', 'always', 'command_only')),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- TABLE: sessions
-- Conversation sessions per user per chat
-- ============================================================
CREATE TABLE IF NOT EXISTS sessions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chat_id           BIGINT NOT NULL,
  chat_type         TEXT DEFAULT 'private' CHECK (chat_type IN ('private', 'group', 'supergroup', 'channel')),
  title             TEXT,
  is_active         BOOLEAN DEFAULT TRUE,
  provider_used     TEXT,
  model_used        TEXT,
  message_count     INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: messages
-- All messages in all sessions
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id        UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role              TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content           TEXT NOT NULL,
  provider          TEXT,
  model             TEXT,
  is_fallback       BOOLEAN DEFAULT FALSE,
  tokens_estimated  INTEGER DEFAULT 0,
  latency_ms        INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: memories
-- Long-term memory facts per user
-- ============================================================
CREATE TABLE IF NOT EXISTS memories (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type              TEXT DEFAULT 'fact' CHECK (type IN ('fact', 'preference', 'project', 'personal')),
  content           TEXT NOT NULL,
  source            TEXT DEFAULT 'auto' CHECK (source IN ('manual', 'auto')),
  importance        INTEGER DEFAULT 3 CHECK (importance BETWEEN 1 AND 5),
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: summaries
-- Auto-generated conversation summaries
-- ============================================================
CREATE TABLE IF NOT EXISTS summaries (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id        UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content           TEXT NOT NULL,
  messages_covered  INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: ai_logs
-- Logs for all AI provider calls (for debugging & stats)
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_logs (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID REFERENCES users(id) ON DELETE SET NULL,
  provider          TEXT,
  model             TEXT,
  status            TEXT CHECK (status IN ('success', 'error', 'timeout', 'rate_limited')),
  error_message     TEXT,
  latency_ms        INTEGER DEFAULT 0,
  tokens_in         INTEGER DEFAULT 0,
  tokens_out        INTEGER DEFAULT 0,
  is_fallback       BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: bot_settings
-- Global bot configuration (key-value)
-- ============================================================
CREATE TABLE IF NOT EXISTS bot_settings (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key               TEXT UNIQUE NOT NULL,
  value             TEXT NOT NULL,
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- DEFAULT BOT SETTINGS
-- ============================================================
INSERT INTO bot_settings (key, value) VALUES
  ('default_provider',      'gemini'),
  ('fallback_order',        'groq,openrouter'),
  ('maintenance_mode',      'false'),
  ('max_messages_per_day',  '100'),
  ('session_memory_limit',  '25'),
  ('long_term_mem_limit',   '50'),
  ('summary_mem_limit',     '5'),
  ('bot_persona',           'friendly'),
  ('auto_extract_memory',   'true'),
  ('extract_every_n_msgs',  '10')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_telegram_id         ON users(telegram_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id          ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_chat_id          ON sessions(chat_id);
CREATE INDEX IF NOT EXISTS idx_sessions_active           ON sessions(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_messages_session_id       ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created          ON messages(session_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memories_user_id          ON memories(user_id);
CREATE INDEX IF NOT EXISTS idx_memories_active           ON memories(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_summaries_session_id      ON summaries(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_user_id           ON ai_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created           ON ai_logs(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables — service role bypasses it
-- ============================================================
ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences   ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions           ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages           ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories           ENABLE ROW LEVEL SECURITY;
ALTER TABLE summaries          ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_logs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_settings       ENABLE ROW LEVEL SECURITY;

-- Service role (used by bot) can read/write everything
-- Anon role (used by admin dashboard frontend) cannot access directly
-- Admin dashboard uses service role key on the server

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER trg_user_preferences_updated
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_sessions_updated
  BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_memories_updated
  BEFORE UPDATE ON memories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_bot_settings_updated
  BEFORE UPDATE ON bot_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
