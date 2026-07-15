CREATE TABLE IF NOT EXISTS Session (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_session_id ON Session(id);
