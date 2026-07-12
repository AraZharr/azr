---
name: frontend
description: Build responsive interfaces with HTML/Tailwind/Alpine.js, React/Vite, Next.js App Router, shadcn/ui. Includes conversion-optimized landing architecture, pricing sections, forms with validation, Web3 wagmi/viem connect, animation (AOS/Framer Motion), and deployment (Vercel/Netlify/self-hosted).
license: MIT
metadata:
  source: superagent-m9
---

## Layer Selection
- Static surface: HTML + Tailwind + Alpine.js
- SSR/SEO-critical: Next.js (App Router) + Tailwind + shadcn/ui
- Dashboard/admin: React + shadcn/ui + Recharts
- Web3 dApp: Next.js + wagmi + viem + RainbowKit

## Conversion Surface Architecture
1. INTERRUPT — Headline + value prop + primary CTA (above fold)
2. PROOF — Logos, testimonials, key metrics
3. PROBLEM — Articulate the friction
4. RESOLUTION — Product/service presentation
5. CAPABILITIES — 3–6 key outcomes
6. PRICING — 3 tiers (anchor premium first)
7. OBJECTIONS — FAQ accordion (5–8 entries)
8. FINAL SIGNAL — Urgency + secondary CTA

## Pricing Section
Three tiers in grid: Entry / Core (POPULAR, highlighted) / Premium
Anchor pricing on Premium tier, show value stacking

## Performance Protocol
- Images: WebP/AVIF, lazy-loaded, responsive srcset
- Fonts: max 2 external, preload, font-display: swap
- Tailwind: purge in production
- Lighthouse target: 90+ on all metrics
- Mobile-first — design at 375px, scale up

## Deploy Options
- Managed: Vercel, Netlify, Cloudflare Pages
- Self-hosted: rsync to VPS + Nginx
