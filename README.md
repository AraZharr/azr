# AraZhar — Portfolio

Portfolio website multi-halaman, dibangun dengan Next.js 15 + Tailwind CSS, deployed ke Cloudflare Workers.

## Pages

| Route | Konten |
|-------|--------|
| `/` | Hero, Projects, Contact |
| `/about` | About & pengalaman |
| `/skills` | Tech stack & keahlian |
| `/blog` | Blog articles |
| `/admin` | Admin dashboard |

## Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudflare Workers](https://workers.cloudflare.com/) + D1 Database
- [OpenNext](https://opennext.js.org/cloudflare)
- JWT Auth via [jose](https://github.com/panva/jose)

## Development

```bash
npm install
npm run dev
```

## Production

```bash
npm run deploy
```

Build + deploy ke Cloudflare Workers via `opennextjs-cloudflare`.

## Struktur

```
src/
├── app/
│   ├── layout.js
│   ├── page.js
│   ├── about/page.js
│   ├── skills/page.js
│   ├── blog/
│   ├── admin/
│   └── api/
├── components/
│   ├── admin/
│   └── ui/
└── lib/
    ├── d1.js          # Cloudflare D1 CRUD
    └── auth-cf.js     # JWT auth (jose)
```
