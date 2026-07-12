# Project Clover — Portfolio AraZhar

## Info
- **Project**: Landing page portofolio multi-halaman
- **Tech Stack**: Next.js 15 (App Router), Tailwind CSS, Cloudflare Workers + D1 + OpenNext
- **Auth**: Custom JWT (jose) — no NextAuth
- **Deploy**: Cloudflare Workers (opennextjs-cloudflare)
- **Domain**: https://clover-two-ashy.vercel.app (legacy Vercel — migrating to CF)

## Pages
- `/` — Hero, Projects, Contact
- `/about` — About
- `/skills` — Skills
- `/blog` — Blog articles list
- `/blog/[slug]` — Single article
- `/admin/dashboard` — Admin dashboard
- `/admin/pages` — Manage pages
- `/admin/blog` — Manage blog articles
- `/admin/login` — Admin login

## Features
- **Chatbot CS**: Floating bubble → popup card, Gemini + Groq auto-fallback, restricted to portfolio topics only, WhatsApp forward
- **SEO**: JSON-LD, Open Graph, dynamic sitemap, robots.txt, per-page metadata
- **Auth**: Custom JWT (jose) — login/logout/me API routes
- **Social Links**: Admin CRUD → dynamic frontend icons (email, WA, IG, TikTok, Telegram, Discord, GitHub, etc.)

## Social Media
- Email, WhatsApp, Instagram, TikTok, Telegram, Discord
- Tidak ada GitHub sebagai social contact (hanya untuk code repo)
- Social links dikelola sendiri via admin dashboard

## Changelog

### 2026-07-12 — Inisialisasi project Next.js + Tailwind
- **Aksi**: dibuat
- **File**: package.json, next.config.js, tailwind.config.js, postcss.config.js, jsconfig.json
- **Detail**: Setup Next.js 14 App Router dengan Tailwind CSS

### 2026-07-12 — Buat komponen & halaman portfolio
- **Aksi**: dibuat
- **File**: Navbar.js, Hero.js, About.js, Skills.js, Projects.js, Contact.js, Footer.js
- **Detail**: 7 komponen untuk portfolio multi-halaman (Home, About, Skills)

### 2026-07-12 — Buat halaman routing
- **Aksi**: dibuat
- **File**: layout.js, page.js, about/page.js, skills/page.js, globals.css
- **Detail**: Routing Next.js App Router — `/`, `/about`, `/skills`

### 2026-07-12 — Buat README.md
- **Aksi**: dibuat
- **File**: README.md
- **Detail**: Dokumentasi project portfolio AraZhar

### 2026-07-12 — Persiapan deploy ke Vercel
- **Aksi**: dibuat
- **File**: vercel.json
- **Detail**: Konfigurasi framework Next.js untuk Vercel

### 2026-07-12 — Update README.md
- **Aksi**: diedit
- **File**: README.md
- **Detail**: Tambah badge Vercel + link live

### 2026-07-12 — Tambah .gitignore & push
- **Aksi**: dibuat
- **File**: .gitignore
- **Detail**: Exclude node_modules/ dan .next/ dari git tracking. Commit ulang bersih tanpa large files. Push sukses ke GitHub.

### 2026-07-12 — Setup admin dashboard + blog + animasi
- **Aksi**: dibuat
- **File**: (massal) prisma schema, auth, API routes, admin pages, blog pages, komponen
- **Detail**: Admin dashboard (NextAuth + Prisma + Supabase), Blog CRUD (TipTap editor), public blog pages, Framer Motion animasi, shadcn/ui, Lucide icons, GitHub Action keepalive

### 2026-07-12 — Setup environment Vercel
- **Aksi**: dibuat
- **File**: .env.example, scripts/seed.js
- **Detail**: Template env variables + seed script untuk insert admin user

### 2026-07-12 — Buat SQL schema file
- **Aksi**: dibuat
- **File**: prisma/schema.sql
- **Detail**: SQL schema dari Prisma models (User, Page, BlogArticle) untuk PostgreSQL, di-commit & push ke repo

### 2026-07-12 — Buat seed SQL admin user
- **Aksi**: dibuat
- **File**: prisma/seed.sql
- **Detail**: Seed admin user (admin@gdsi.my.id) via SQL untuk Supabase SQL Editor

### 2026-07-12 — Fix redirect loop /admin/login
- **Aksi**: diedit
- **File**: app/admin/(dashboard)/layout.js, app/api/auth/[...nextauth]/route.js
- **Detail**: Restruktur admin layout pakai route group `(dashboard)` agar login page tidak kena auth guard. Fix route handler NextAuth — revert pakai pola create instance di route handler langsung (import NextAuth + authOptions) karena pola exported handlers error di Vercel build-time.

### 2026-07-12 — Ganti password jadi plain text (dev mode)
- **Aksi**: diedit
- **File**: prisma/seed.sql, src/lib/auth.js
- **Detail**: Password disimpan plain text, bcrypt dihapus dari auth.js

### 2026-07-12 — Tambah toggle show/hide password di login
- **Aksi**: diedit
- **File**: src/app/admin/login/page.js
- **Detail**: Icon mata (Lucide Eye/EyeOff) untuk buka/tutup password

### 2026-07-12 — Fix login gagal (ganti Base UI Input ke native input)
- **Aksi**: diedit
- **File**: src/app/admin/login/page.js, src/lib/auth.js
- **Detail**: Ganti `@base-ui/react/input` ke native `<input>` + React state (bukan FormData) agar nilai input tidak hilang saat toggle type password

### 2026-07-12 — Buat folder buglist
- **Aksi**: dibuat
- **File**: buglist/
- **Detail**: Folder untuk dokumentasi bug

### 2026-07-12 — Dokumentasi bug auth 401
- **Aksi**: dibuat
- **File**: buglist/auth-401-login-gagal.md
- **Detail**: Laporan bug lengkap + root cause + solusi untuk issue login 401

### 2026-07-12 — Auth audit & fix 401 (NextAuth + env + error handling)
- **Aksi**: diedit/dibuat
- **File**: src/lib/auth.js, src/lib/auth-helpers.js, src/app/admin/(dashboard)/layout.js, src/app/api/auth/[...nextauth]/route.js, src/app/admin/login/page.js, src/app/api/admin/pages/route.js, src/app/api/admin/pages/[id]/route.js, src/app/api/admin/blog/route.js, src/app/api/admin/blog/[id]/route.js, .env, .env.example
- **Detail**: 
  - Hapus module-level `NextAuth()` dari auth.js (mencegah dual-instance & build-time error)
  - Buat `auth-helpers.js` untuk lazy singleton `auth()` (runtime-only, tidak trigger build)
  - Layout admin + semua API route admin pakai `auth-helpers` bukan langsung dari auth.js
  - `.env` diisi value real (DATABASE_URL, NEXTAUTH_SECRET dengan secret tergenerate)
  - `.env.local` dikosongkan (hanya komentar) agar tidak override .env
  - Login page tambah error handling untuk `CredentialsSignin` vs CSRF error
  - Console.error di authorize() untuk diagnosa di Vercel function logs
  - `secret: process.env.NEXTAUTH_SECRET` ditambahkan ke authOptions

### 2026-07-12 — Install SuperAgent v3 OpenClaw sebagai opencode skills
- **Aksi**: dibuat
- **File**: .opencode/skills/{16 skill}/SKILL.md, .opencode/superagent-instructions.md, .opencode/opencode.json
- **Detail**: Adaptasi SUPERAGENT-v3-OPENCLAW-HERMES.zip ke dalam format skill opencode:
  - 16 skills (monetization, infrastructure, content-strategy, telegram-bots, data-transformation, api-integration, ai-providers, document-generation, frontend, web3, security-audit, batch-operations, nft-minter, self-audit, strategy, debug)
  - Core identity, rules R1-R10, routing dari SOUL.md + IDENTITY.md + AGENTS.md
  - Di-load via `skill` tool on-demand

### 2026-07-12 — Migrasi Vercel+Supabase+Prisma+NextAuth → Cloudflare Workers+D1+OpenNext+JWT
- **Aksi**: diedit/dibuat
- **File**: next.config.mjs, open-next.config.ts, wrangler.jsonc, migrations/0001_init.sql, src/lib/d1.js, src/lib/auth-cf.js, src/app/api/auth/login/route.js, src/app/api/auth/logout/route.js, src/app/api/auth/me/route.js, src/app/api/admin/dashboard/stats/route.js
- **Detail**: 
  - Hapus Prisma/Supabase/NextAuth → ganti Cloudflare D1 + custom JWT (jose)
  - `d1.js`: CRUD functions via `@opennextjs/cloudflare` getCloudflareContext
  - `auth-cf.js`: JWT sign/verify + getSession via cookie
  - API routes migrasi: login/logout/me, admin dashboard stats
  - Hapus next.config.js → next.config.mjs (OpenNext dev init)
  - OpenNext + Wrangler config untuk CF Workers deployment
  - Migration SQL untuk D1 (User, Page, BlogArticle tables + indexes)
  - Hapus .env vars Supabase/NextAuth legacy

### 2026-07-12 — Fix Next.js 15 async params di route handlers & pages
- **Aksi**: diedit
- **File**: src/app/api/admin/pages/[id]/route.js, src/app/api/admin/blog/[id]/route.js, src/app/api/blog/[slug]/route.js, src/app/blog/[slug]/page.js
- **Detail**: Next.js 15 bikin `params` jadi Promise — semua akses `params.id`/`params.slug` harus `await` dulu

### 2026-07-12 — Hapus semua localhost, persiapan production live
- **Aksi**: diedit
- **File**: .env, .env.example, README.md, .gitignore
- **Detail**: Ganti `NEXT_PUBLIC_URL` ke production domain, hapus Supabase legacy vars, tambah `.open-next/` `.wrangler/` ke .gitignore, rewrite README untuk Cloudflare stack

### 2026-07-12 — Rename AraZharr → AraZhar + SEO + Chatbot CS + WhatsApp
- **Aksi**: diedit/dibuat
- **File**: 13 files (semua komponen, pages, layout, README, memory.md), src/app/sitemap.js, src/app/robots.js, src/app/api/chat/route.js, src/components/ChatWidget.js
- **Detail**:
  - **Rename**: `AraZharr` → `AraZhar` di semua file (13 occurrences)
  - **SEO**: metadataBase, Open Graph, Twitter Card, JSON-LD Person schema, per-page metadata dengan description
  - **sitemap.js**: Dynamic — auto-add blog articles dari D1
  - **robots.js**: Allow public, block `/admin/` `/api/`
  - **Chatbot CS**: API route `/api/chat` → Gemini primary → Groq fallback → error message
  - **ChatWidget.js**: Floating bubble 52px, card popup, typing indicator, quick replies, WhatsApp forward button
  - **WhatsApp**: Tombol link di header chat → `wa.me` + pre-filled text dari riwayat chat

### 2026-07-12 — Refine chatbot: restricted knowledge base + modern UI
- **Aksi**: diedit
- **File**: src/app/api/chat/route.js, src/components/ChatWidget.js, src/app/layout.js
- **Detail**:
  - **Knowledge base**: Seluruh konten website (about, skills, projects, layanan) di-inject ke system prompt
  - **Restriction**: HANYA jawab pertanyaan portfolio/project/layanan. Off-topic → tolak sopan + arahkan WhatsApp
  - **Temperature**: Diturunkan ke 0.5 (lebih fokus), max_tokens 512 (concise)
  - **Font**: Inter via `next/font/google` + system-ui fallback
  - **UI**: Clean card, avatar circle, bounce dot typing indicator, quick reply buttons, seamless input bar

### 2026-07-12 — Rewrite README sebagai portfolio introduction
- **Aksi**: diedit
- **File**: README.md
- **Detail**: README dijadikan seperti SEO content — memperkenalkan AraZhar, skills, projects, layanan, kontak, dan tech stack website ini. Bukan lagi technical project README.

### 2026-07-12 — Social Links: admin CRUD + dynamic frontend icons
- **Aksi**: dibuat
- **File**: migrations/0002_social_link.sql, src/app/api/social/route.js, src/app/api/social/[id]/route.js, src/app/admin/(dashboard)/social/page.js, src/components/SocialLinks.js, src/components/Contact.js, src/components/Footer.js, src/components/admin/Sidebar.js, src/app/admin/(dashboard)/dashboard/page.js, src/lib/d1.js
- **Detail**:
  - Tabel SocialLink: platform, url, label, visible, sort_order
  - API routes: GET (public), POST/PUT/DELETE (auth)
  - Admin page: /admin/social — add, edit, toggle visible, delete, reorder
  - SocialLinks component: fetch dari API, render icons dengan hover colors
  - Platforms: email, WA, IG, TikTok, Telegram, Discord, GitHub, Twitter, LinkedIn, YouTube, custom
  - Contact.js & Footer.js: dynamic social links dari database
  - Dashboard: tambah social link count stat

## Catatan
