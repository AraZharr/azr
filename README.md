# AraZharr — Portfolio

[![Vercel](https://img.shields.io/badge/deploy-vercel-black?logo=vercel)](https://clover.vercel.app)

Portfolio website multi-halaman, dibangun dengan Next.js 14 + Tailwind CSS.

## Pages

| Route | Konten |
|-------|--------|
| `/` | Hero, Projects, Contact |
| `/about` | About & pengalaman |
| `/skills` | Tech stack & keahlian |

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)

## Cara Jalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Build Production

```bash
npm run build
npm start
```

## Struktur

```
src/
├── app/
│   ├── layout.js        # layout global (Navbar + Footer)
│   ├── page.js          # home
│   ├── about/page.js    # about
│   ├── skills/page.js   # skills
│   └── globals.css
└── components/
    ├── Navbar.js
    ├── Hero.js
    ├── About.js
    ├── Skills.js
    ├── Projects.js
    ├── Contact.js
    └── Footer.js
```

## Deployment

Auto-deploy via [Vercel](https://vercel.com) — setiap push ke `main` langsung deploy.

**Live**: [clover.vercel.app](https://clover.vercel.app)
