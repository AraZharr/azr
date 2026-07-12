# Project Clover — Portfolio AraZharr

## Info
- **Project**: Landing page portofolio multi-halaman
- **Tech Stack**: Next.js 14 (App Router), Tailwind CSS
- **Deploy**: Vercel
- **Domain**: https://clover-two-ashy.vercel.app

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
- **Detail**: Dokumentasi project portfolio AraZharr

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

## Catatan
