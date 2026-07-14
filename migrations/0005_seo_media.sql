-- SEO: add columns to Page
ALTER TABLE Page ADD COLUMN meta_title TEXT;
ALTER TABLE Page ADD COLUMN meta_description TEXT;
ALTER TABLE Page ADD COLUMN og_image TEXT;
ALTER TABLE Page ADD COLUMN keywords TEXT;
ALTER TABLE Page ADD COLUMN noindex INTEGER DEFAULT 0;

-- SEO: add columns to BlogArticle
ALTER TABLE BlogArticle ADD COLUMN meta_title TEXT;
ALTER TABLE BlogArticle ADD COLUMN meta_description TEXT;
ALTER TABLE BlogArticle ADD COLUMN og_image TEXT;
ALTER TABLE BlogArticle ADD COLUMN keywords TEXT;
ALTER TABLE BlogArticle ADD COLUMN noindex INTEGER DEFAULT 0;

-- Media Library tracking table
CREATE TABLE IF NOT EXISTS Media (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT,
  size INTEGER,
  width INTEGER,
  height INTEGER,
  alt TEXT,
  createdAt TEXT DEFAULT (datetime('now'))
);
