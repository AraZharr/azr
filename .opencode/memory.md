# Project Clover — Portfolio AraZharr

## Info
- **Project**: Landing page portofolio multi-halaman
- **Tech Stack**: Next.js 14 (App Router), Tailwind CSS
- **Deploy**: Vercel

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

## Catatan
