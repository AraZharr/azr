# AraZhar — Developer & Creator

> Portfolio pribadi AraZhar — Developer & kreator digital Indonesia. Membangun solusi web, bot, dan automation yang berdampak.

[![Website](https://img.shields.io/badge/🌐-arazhar.dev-black)](https://arazhar.dev)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## Tentang AraZhar

Saya AraZhar — seorang **developer & kreator digital Indonesia** yang fokus pada pengembangan web, bot Telegram, dan berbagai solusi digital lainnya.

Filosofi saya sederhana: **bangun sesuatu yang fungsional, efisien, dan user-friendly.** Saya percaya teknologi harus bekerja untuk manusia, bukan sebaliknya. Setiap project yang saya bangun dimulai dari satu pertanyaan: *bagaimana cara membuat ini lebih mudah?*

Terbiasa bekerja dengan **JavaScript**, **Next.js**, dan ekosistem open source. Senang bereksperimen dengan hal baru dan membangun tools yang menyelesaikan masalah nyata.

### Layanan

| Layanan | Deskripsi |
|---------|-----------|
| **Web Development** | Landing page, portfolio, web app — dari konsep sampai deployment |
| **Telegram Bot** | Bot AI, automation, scheduling, multi-provider |
| **Automation & Integration** | API integration, workflow automation, data pipeline |
| **Konsultasi Digital** | Review kebutuhan teknologi, rekomendasi solusi, planning |

---

## Skills & Keahlian

| Teknologi | Level | Keterangan |
|-----------|-------|------------|
| JavaScript / TypeScript | 85% | Core language — fullstack |
| React / Next.js | 80% | App Router, Server Components, API routes |
| Tailwind CSS | 85% | Utility-first styling (v4) |
| Node.js | 75% | Backend, bot, API |
| Python | 60% | Scripting, automation |
| Supabase / Firebase | 65% | BaaS, database, auth |

**Core stack**: JavaScript fullstack — dari UI sampai backend, dari bot sampai automation.

### Tools & Libraries yang Dipakai

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Styling** | Tailwind CSS v4 |
| **UI Components** | shadcn/ui, Lucide icons |
| **Animation** | Framer Motion |
| **Rich Text Editor** | TipTap |
| **Database** | Cloudflare D1 (SQLite at the edge) |
| **Deploy** | Cloudflare Workers via OpenNext |
| **Auth** | Custom JWT (jose) |
| **AI** | Google Gemini, Groq (LLM inference) |
| **Font** | Inter (Google Fonts) |

---

## Projects

### Clover Bot

Bot Telegram multi-provider AI dengan memori dan command routing.

| Aspek | Detail |
|-------|--------|
| **Tech** | Node.js, Gemini AI, Supabase |
| **Fitur** | Multi-provider AI, memory system, command routing |
| **Use case** | AI assistant di Telegram dengan percakapan kontekstual |

### Portfolio Website (ini)

Website portfolio multi-halaman dengan admin dashboard, blog engine, dan AI customer service chatbot.

| Aspek | Detail |
|-------|--------|
| **Tech** | Next.js 15, Tailwind CSS v4, Cloudflare Workers + D1 |
| **Deploy** | Cloudflare Workers (opennextjs-cloudflare) |
| **Admin** | Login, CRUD pages, blog (TipTap editor), social links |
| **Chatbot** | Gemini + Groq auto-fallback, restricted knowledge base, WhatsApp forward |
| **SEO** | JSON-LD, Open Graph, dynamic sitemap, robots.txt, per-page metadata |
| **Blog** | TipTap rich text editor, public blog pages, slug-based routing |
| **Social** | Dynamic social links dari database (email, WA, IG, TikTok, Telegram, Discord, GitHub, Twitter, LinkedIn, YouTube) |

### Eksperimen Lainnya

Berbagai project eksperimen dan tools yang sedang dikembangkan — mulai dari automation, bot utilities, sampai web apps. Selalu dalam proses belajar dan iterasi.

---

## Fitur Website Ini

### Admin Dashboard

Dashboard admin dengan autentikasi JWT untuk mengelola seluruh konten website:

- **Login** — Autentikasi via `/admin/login` dengan JWT cookie
- **Pages Management** — CRUD halaman statis (about, skills, dll)
- **Blog Management** — Buat, edit, hapus artikel blog dengan TipTap rich text editor
- **Social Links** — Kelola social media yang tampil di website (add, edit, toggle visible, reorder)

### AI Chatbot (Customer Service)

Floating chat widget yang muncul di pojok kanan bawah:

- **Provider**: Google Gemini (primary) + Groq (fallback)
- **Knowledge base**: Seluruh konten website di-inject ke system prompt
- **Restriction**: Hanya jawab pertanyaan seputar portfolio, project, dan layanan
- **WhatsApp forward**: Riwayat chat bisa diteruskan ke WhatsApp
- **Quick replies**: Tombol pertanyaan cepat untuk pengunjung

### SEO & Performance

- **JSON-LD Structured Data** — Schema Person untuk Google
- **Open Graph + Twitter Card** — Preview sharing di social media
- **Dynamic Sitemap** — Auto-generate dari blog articles di D1
- **Robots.txt** — Allow public, block `/admin/` dan `/api/`
- **Per-page metadata** — Title, description, keywords per halaman
- **Edge deployment** — Cloudflare Workers untuk performa global

### Responsive Design

Desain responsif untuk semua device:

- **Mobile** (< 640px) — Layout single column, hamburger menu
- **Tablet** (640px - 1024px) — Grid 2 kolom, sidebar
- **Desktop** (> 1024px) — Grid 3 kolom, full layout

---

## Tech Stack

```
├── Framework     → Next.js 15 (App Router)
├── Styling       → Tailwind CSS v4
├── UI            → shadcn/ui + Lucide icons
├── Animation     → Framer Motion
├── Editor        → TipTap (rich text)
├── Database      → Cloudflare D1 (SQLite edge)
├── Auth          → Custom JWT (jose)
├── AI            → Google Gemini + Groq
├── Deploy        → Cloudflare Workers (OpenNext)
├── Font          → Inter (Google Fonts)
└── Toast         → Sonner
```

### Project Structure

```
clover/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.js            # Homepage (Hero, Projects, Contact)
│   │   ├── about/page.js      # About page
│   │   ├── skills/page.js     # Skills page
│   │   ├── blog/              # Blog pages
│   │   │   ├── page.js        # Blog list
│   │   │   └── [slug]/page.js # Single article
│   │   ├── admin/             # Admin dashboard
│   │   │   ├── login/         # Admin login
│   │   │   └── (dashboard)/   # Protected admin pages
│   │   │       ├── dashboard/
│   │   │       ├── pages/     # Page management
│   │   │       ├── blog/      # Blog management
│   │   │       └── social/    # Social links management
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Login, logout, me
│   │   │   ├── admin/         # Admin API (protected)
│   │   │   ├── blog/          # Public blog API
│   │   │   ├── social/        # Social links API
│   │   │   └── chat/          # AI chatbot API
│   │   ├── sitemap.js         # Dynamic sitemap
│   │   ├── robots.js          # Robots.txt
│   │   └── layout.js          # Root layout
│   ├── components/            # Reusable components
│   │   ├── admin/             # Admin UI components
│   │   └── ui/                # shadcn/ui components
│   └── lib/                   # Utilities
│       ├── d1.js              # Cloudflare D1 CRUD
│       ├── auth-cf.js         # JWT auth helpers
│       └── auth-helpers.js    # Lazy auth singleton
├── migrations/                # D1 SQL migrations
│   ├── 0001_init.sql          # Users, Pages, BlogArticle tables
│   └── 0002_social_link.sql   # SocialLink table
├── next.config.mjs            # Next.js config
├── open-next.config.ts        # OpenNext (CF Workers) config
├── wrangler.jsonc             # Cloudflare Workers config
└── package.json
```

---

## Social Media & Kontak

Tersedia di website dan bisa dihubungi melalui:

| Platform | Link |
|----------|------|
| GitHub | [github.com/AraZhar](https://github.com/AraZhar) |
| Email | Tersedia via tombol di website |
| WhatsApp | Tersedia via tombol di website |
| Instagram | Tersedia via tombol di website |
| TikTok | Tersedia via tombol di website |
| Telegram | Tersedia via tombol di website |
| Discord | Tersedia via tombol di website |
| Twitter / X | Tersedia via tombol di website |
| LinkedIn | Tersedia via tombol di website |
| YouTube | Tersedia via tombol di website |

> Semua social links dikelola via admin dashboard (`/admin/social`). Login untuk mengelola link yang aktif.

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) atau yarn/pnpm
- [Cloudflare account](https://dash.cloudflare.com/) (untuk deploy)

### Install & Development

```bash
# Clone repository
git clone https://github.com/AraZharr/clover.git
cd clover

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env dengan values yang sesuai (lihat tabel di bawah)

# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_URL` | Yes | `https://arazhar.dev` | Base URL website |
| `NEXT_PUBLIC_WA_NUMBER` | No | — | WhatsApp number (format: `628xxx`) |
| `GEMINI_API_KEY` | Yes | — | Google Gemini API key |
| `GROQ_API_KEY` | Yes | — | Groq API key |
| `GEMINI_MODEL` | No | `gemini-2.0-flash` | Gemini model |
| `GROQ_MODEL` | No | `llama-3.3-70b-versatile` | Groq model |

### Build & Deploy (Cloudflare Workers)

```bash
# Login ke Cloudflare
npx wrangler login

# Buat D1 database
npx wrangler d1 create clover-db

# Jalankan migrasi
npx wrangler d1 execute clover-db --file=./migrations/0001_init.sql
npx wrangler d1 execute clover-db --file=./migrations/0002_social_link.sql

# Build
npm run build

# Deploy
npm run deploy
```

Atau gunakan `npm run preview` untuk local preview dengan Wrangler.

---

## Database Schema

### Tables

| Table | Deskripsi |
|-------|-----------|
| `User` | Admin users (id, email, password, name, role) |
| `Page` | Static pages (id, title, slug, content, published) |
| `BlogArticle` | Blog posts (id, title, slug, content, published, createdAt) |
| `SocialLink` | Social media links (id, platform, url, label, visible, sort_order) |

### Supported Social Platforms

Email, WhatsApp, Instagram, TikTok, Telegram, Discord, GitHub, Twitter/X, LinkedIn, YouTube, Custom.

---

## License

MIT

---

*Built with care by AraZhar.*
