# PRD: Site Settings Admin Dashboard

## Latar Belakang
Saat ini banyak konfigurasi branding & SEO terhardcode di source code (logo, title, tagline, OG image, footer, canonical URL). Setiap perubahan harus edit file → commit → deploy. Tidak efisien.

## Tujuan
Admin bisa mengubah branding & SEO langsung dari dashboard tanpa deploy ulang.

## Scope (3 Section)

| Section | Field | Storage | Frontend Impact |
|---------|-------|---------|-----------------|
| **Brand** | Logo (R2 image URL), Site title, Tagline | D1 key-value | Navbar logo/text + homepage hero |
| **SEO** | OG image URL, OG title, Meta desc, Keywords, Canonical URL | D1 key-value | `<meta>` tags, OG graph, Twitter card |
| **Footer** | Copyright text | D1 key-value | Footer component |

## Arsitektur

### Storage
- Table `SiteSetting` (key TEXT PK, value TEXT, updatedAt TEXT)
- Image logo via R2 (upload via existing Media Library)

### API
- `GET /api/admin/settings` → return all settings as JSON object
- `PUT /api/admin/settings` → upsert settings (admin only)
- `GET /api/settings` → public (cacheable, for frontend rendering)

### Alur
1. Admin buka `/admin/settings` → form dengan current values
2. Edit → Save → `PUT /api/admin/settings`
3. Frontend panggil `GET /api/settings` → render dinamis
4. Navbar, Footer, layout.js ganti hardcode jadi async fetch

## UI Mock

```
/settings
[ Brand ]
  Logo:      [Preview] [Choose from Media] [Upload]
  Site Title: [____________________________]
  Tagline:   [____________________________]

[ SEO ]
  OG Image:  [Preview] [Choose from Media]
  OG Title:  [____________________________]
  Meta Desc: [____________________________]
  Keywords:  [____________________________]
  Canonical: [____________________________]

[ Footer ]
  Copyright: [© 2026 AraZhar. All rights reserved.]

[ 💾 Save Settings ]
```

## Out of Scope
- Theme color / font customization
- Custom CSS/JS injection
- Multi-language
- Analytics code

## Files Affected

| File | Action |
|------|--------|
| `migrations/0006_site_settings.sql` | Create |
| `src/lib/d1.js` | + getSettings, upsertSettings |
| `src/app/api/admin/settings/route.js` | Create |
| `src/app/api/settings/route.js` | Create |
| `src/app/admin/(dashboard)/settings/page.js` | Create |
| `src/components/Navbar.js` | Edit (dynamic brand) |
| `src/components/Footer.js` | Edit (dynamic copyright) |
| `src/app/layout.js` | Edit (dynamic SEO meta) |
| `src/components/admin/Sidebar.js` | Add Settings link |
