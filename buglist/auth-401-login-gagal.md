# Bug: Admin Login HTTP 401 Unauthorized

## Status
✅ **Fixed** di commit `7968613`

## Gejala
- POST `/api/auth/callback/credentials` → `401 Unauthorized`
- Response: `{"url": "https://<deployment-url>"}`
- Tidak ada error di console browser

## Root Causes (5 masalah)

### 1. Dual NextAuth instance
`src/lib/auth.js` module-level `NextAuth(authOptions)` menciptakan instance saat build. `route.js` juga membuat instance sendiri. Build-time error: `handlers` undefined.

**Fix**: auth.js hanya export `authOptions` (plain object). `NextAuth()` tidak dipanggil di module-level.

### 2. Layout import module-level auth
`layout.js` import `{ auth }` dari `@/lib/auth` → trigger `NextAuth()` saat SSR.

**Fix**: File baru `src/lib/auth-helpers.js` — lazy singleton `NextAuth().auth` hanya dipanggil runtime.

### 3. Missing NEXTAUTH_SECRET
Tanpa secret tetap, Vercel cold start generate random secret setiap kali → CSRF token invalid → 401.

**Fix**: `.env` diisi value real + dokumentasi. User wajib set `NEXTAUTH_SECRET` di Vercel Dashboard.

### 4. Database connection error silent
`catch (err) { return null }` menyembunyikan error Prisma → kelihatan seperti "salah password".

**Fix**: `console.error('[auth] database error:', err.message)` muncul di Vercel Function Logs.

### 5. Error message generic
Semua error ditampilkan "Email atau password salah" tanpa bedakan jenis error.

**Fix**: Login page bedakan `CredentialsSignin` vs error server/network.

## File yang diubah
- `src/lib/auth.js` — hapus module-level NextAuth()
- `src/lib/auth-helpers.js` — file baru, lazy auth singleton
- `src/app/admin/(dashboard)/layout.js` — ganti import ke auth-helpers
- `src/app/admin/login/page.js` — tambah error handling spesifik
- `src/app/api/auth/[...nextauth]/route.js` — tetap pakai NextAuth() langsung
- `.env` — isi value real
- `.env.local` — dikosongkan

## Catatan
Kalau masih 401 setelah deploy Vercel, cek Vercel Dashboard > Function Logs cari log `[auth]`.

### Update 2026-07-12 — Root Cause Terakhir: IPv6 → Pooler

**Vercel Function Logs** menunjukkan:
```
Can't reach database server at db.rzfyitcytflrbbzpkhff.supabase.co:5432
```

Hostname Supabase **hanya punya IPv6** (no A record). Vercel di region `iad1` tidak bisa reach IPv6 ke Supabase APAC.

**Fix**: Ganti `DATABASE_URL` ke **Connection Pooler** (port 6543, support IPv4):
```
postgresql://postgres:Porto%40Azhar@rzfyitcytflrbbzpkhff.pooler.supabase.com:6543/postgres?pgbouncer=true
```

`?pgbouncer=true` diperlukan Prisma untuk koneksi via PgBouncer.

**Aksi**: Update `.env` + push. Juga update `Vercel Dashboard > Environment Variables` → `DATABASE_URL` harus pakai pooler URL.
