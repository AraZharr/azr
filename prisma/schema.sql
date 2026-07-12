-- ============================================================
-- Project Clover — Portfolio AraZharr
-- Database : PostgreSQL (Supabase)
-- Skema ini auto-generated dari prisma/schema.prisma
-- ============================================================

-- Tabel User (admin login)
CREATE TABLE "User" (
    id       TEXT NOT NULL,
    email    TEXT NOT NULL,
    password TEXT NOT NULL,
    name     TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY (id),
    CONSTRAINT "User_email_key" UNIQUE (email)
);

-- Tabel Page (halaman dinamis via admin)
CREATE TABLE "Page" (
    id        TEXT        NOT NULL,
    slug      TEXT        NOT NULL,
    title     TEXT        NOT NULL,
    content   JSONB,
    published BOOLEAN     NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT "Page_pkey" PRIMARY KEY (id),
    CONSTRAINT "Page_slug_key" UNIQUE (slug)
);

-- Tabel BlogArticle (artikel blog)
CREATE TABLE "BlogArticle" (
    id        TEXT        NOT NULL,
    slug      TEXT        NOT NULL,
    title     TEXT        NOT NULL,
    excerpt   TEXT,
    content   JSONB       NOT NULL,
    published BOOLEAN     NOT NULL DEFAULT false,
    image     TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT "BlogArticle_pkey" PRIMARY KEY (id),
    CONSTRAINT "BlogArticle_slug_key" UNIQUE (slug)
);

-- Index untuk pencarian slug (sering di-query)
CREATE INDEX "Page_slug_idx" ON "Page" (slug);
CREATE INDEX "BlogArticle_slug_idx" ON "BlogArticle" (slug);
CREATE INDEX "BlogArticle_published_idx" ON "BlogArticle" (published);
CREATE INDEX "BlogArticle_createdAt_idx" ON "BlogArticle" ("createdAt" DESC);
