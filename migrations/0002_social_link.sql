CREATE TABLE IF NOT EXISTS SocialLink (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  label TEXT,
  icon TEXT,
  visible INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX idx_social_platform ON SocialLink(platform);
CREATE INDEX idx_social_sort ON SocialLink(sort_order);
