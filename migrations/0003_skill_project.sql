CREATE TABLE IF NOT EXISTS Skill (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 80,
  sort_order INTEGER DEFAULT 0,
  visible INTEGER DEFAULT 1,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS Project (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  title TEXT NOT NULL,
  description TEXT,
  tech TEXT DEFAULT '[]',
  link TEXT,
  image TEXT,
  sort_order INTEGER DEFAULT 0,
  visible INTEGER DEFAULT 1,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_skill_sort ON Skill(sort_order);
CREATE INDEX idx_project_sort ON Project(sort_order);
