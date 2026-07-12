# Setup Guide — AraZhar Portfolio

Panduan lengkap dari nol sampai live. Ikuti langkah demi langkah.

---

## Yang Perlu Disiapkan

Sebelum mulai, pastikan kamu punya:

1. **Akun Cloudflare** — Gratis di https://dash.cloudflare.com/sign-up
2. **Node.js 18+** — Download di https://nodejs.org (pilih LTS)
3. **Terminal / Command Prompt** — Bisa pakai VS Code Terminal, PowerShell, atau Terminal Mac/Linux
4. **Akun GitHub** — Untuk repository
5. **API Keys** (opsional, bisa nanti):
   - Gemini API Key — https://aistudio.google.com/apikey
   - Groq API Key — https://console.groq.com/keys
   - Nomor WhatsApp kamu

---

## STEP 1: Install Node.js

Buka terminal, ketik:

```bash
node --version
```

Kalau muncul `v18.x.x` atau `v20.x.x` atau `v22.x.x`, berarti sudah terinstall.
Kalau belum, download dari https://nodejs.org lalu install.

---

## STEP 2: Clone Repository

```bash
git clone https://github.com/AraZharr/clover.git
cd clover
```

---

## STEP 3: Install Dependencies

```bash
npm install
```

Tunggu sampai selesai. Akan muncul folder `node_modules/`.

---

## STEP 4: Install Wrangler CLI

Wrangler adalah tool Cloudflare untuk deploy.

```bash
npm install -g wrangler
```

Cek apakah terinstall:

```bash
wrangler --version
```

Kalau muncul versi, berarti berhasil.

---

## STEP 5: Login Cloudflare

```bash
wrangler login
```

Browser akan terbuka. Login ke akun Cloudflare kamu. Kalau diminta otorisasi, klik **Allow**.

Kalau browser tidak terbuka otomatis, copy URL yang muncul di terminal lalu buka manual di browser.

---

## STEP 6: Buat D1 Database

```bash
wrangler d1 create clover-db
```

Setelah dijalankan, akan muncul output seperti ini:

```
✅ Successfully created DB 'clover-db'
[[d1_databases]]
binding = "DB"
database_name = "clover-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**PENTING:** Copy `database_id` yang muncul (angka huruf panjang itu).

Buka file `wrangler.jsonc`, ganti bagian `database_id` yang kosong:

```jsonc
{
  // ... yang lain tetap
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "clover-db",
      "database_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  // <-- paste di sini
    }
  ]
}
```

**Simpan file.**

---

## STEP 7: Buat Tabel Database

Jalankan perintah ini satu per satu:

```bash
wrangler d1 execute clover-db --remote --file=./migrations/0001_init.sql
```

```bash
wrangler d1 execute clover-db --remote --file=./migrations/0002_social_link.sql
```

```bash
wrangler d1 execute clover-db --remote --file=./migrations/0003_skill_project.sql
```

Ini akan membuat tabel: User, Page, BlogArticle, SocialLink, Skill, Project.

---

## STEP 8: Buat Admin User

Jalankan perintah ini (ganti email dan password sesuai keinginan kamu):

```bash
wrangler d1 execute clover-db --remote --command="INSERT INTO User (id, email, password, name) VALUES (lower(hex(randomblob(16))), 'admin@arazhar.dev', 'password123', 'AraZhar')"
```

- Email: `admin@arazhar.dev` (atau ganti)
- Password: `password123` (atau ganti)
- Nama: `AraZhar`

**Catat email dan password ini** — akan dipakai untuk login admin.

---

## STEP 9: Setup Environment Variables

Buka file `.env`, isi semua variabel:

```env
# === CLOUDFLARE ===
CLOUDFLARE_DATABASE_NAME="clover-db"

# === JWT ===
JWT_SECRET="ganti-dengan-random-string"

# === AI CHATBOT ===
GEMINI_API_KEY="isi-api-key-gemini"
GEMINI_MODEL="gemini-2.0-flash"
GROQ_API_KEY="isi-api-key-groq"
GROQ_MODEL="llama-3.3-70b-versatile"

# === WHATSAPP ===
NEXT_PUBLIC_WA_NUMBER="628xxxxxxxxxx"

# === DOMAIN ===
NEXT_PUBLIC_URL="https://arazhar.dev"
```

### Penjelasan tiap variabel:

| Variabel | Isi | Dari mana |
|----------|-----|-----------|
| `JWT_SECRET` | Random string acak | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `GEMINI_API_KEY` | API key Google Gemini | https://aistudio.google.com/apikey (klik "Create API Key") |
| `GROQ_API_KEY` | API key Groq | https://console.groq.com/keys (daftar → buat key) |
| `NEXT_PUBLIC_WA_NUMBER` | Nomor WhatsApp tanpa + | Contoh: `6281234567890` (62 = kode Indonesia) |
| `NEXT_PUBLIC_URL` | Domain website kamu | Isi dulu dengan `https://arazhar.dev`, ganti nanti kalau domain berubah |

### Generate JWT_SECRET:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy hasilnya, paste ke `JWT_SECRET` di `.env`.

---

## STEP 10: Test di Lokal (Optional)

```bash
npm run dev
```

Buka browser: **http://localhost:3000**

Coba:
- Lihat halaman utama (Home, About, Skills)
- Buka chatbot (klik bubble kanan bawah)
- Buka admin: http://localhost:3000/admin/login
- Login dengan email + password dari Step 8

Tekan `Ctrl + C` untuk berhenti.

**Catatan:** Fitur D1/database tidak jalan di lokal kecuali pakai `wrangler dev`. Untuk test lengkap, langsung ke Step 11 (deploy).

---

## STEP 11: Deploy ke Cloudflare

```bash
npm run deploy
```

Perintah ini akan:
1. Build project (`opennextjs-cloudflare build`)
2. Deploy ke Cloudflare Workers

Kalau berhasil, akan muncul output seperti:

```
Worker deployed: https://clover.xxxxx.workers.dev
```

**Copy URL itu** — itu adalah website kamu yang sudah live!

---

## STEP 12: Set Environment Variables di Cloudflare

Beberapa variabel environment harus di-set langsung di Cloudflare (karena `.env` hanya untuk development).

### Cara 1: Via Dashboard (Mudah)

1. Buka https://dash.cloudflare.com
2. Pilih akun kamu
3. Klik **Workers & Pages** (menu kiri)
4. Klik nama worker kamu (`clover`)
5. Klik tab **Settings**
6. Klik **Environment variables**
7. Tambah variabel satu per satu:

| Name | Value | Type |
|------|-------|------|
| `JWT_SECRET` | (nilai dari .env) | Encrypted |
| `GEMINI_API_KEY` | (nilai dari .env) | Encrypted |
| `GROQ_API_KEY` | (nilai dari .env) | Encrypted |
| `NEXT_PUBLIC_WA_NUMBER` | (nilai dari .env) | Plaintext |
| `NEXT_PUBLIC_URL` | https://arazhar.dev | Plaintext |
| `GEMINI_MODEL` | gemini-2.0-flash | Plaintext |
| `GROQ_MODEL` | llama-3.3-70b-versatile | Plaintext |

8. Klik **Save**

### Cara 2: Via Terminal (Advanced)

```bash
wrangler secret put JWT_SECRET
```

Terminal akan minta isi value. Paste, tekan Enter. Ulangi untuk variabel lain:

```bash
wrangler secret put GEMINI_API_KEY
wrangler secret put GROQ_API_KEY
```

Variabel yang diawali `NEXT_PUBLIC_` harus di-set via dashboard (bukan secret).

---

## STEP 13: Deploy Ulang

Setelah set environment variables, deploy ulang agar terbaca:

```bash
npm run deploy
```

---

## STEP 14: Buka Website

Buka URL dari Step 11 di browser.

Kamu akan melihat:
- Halaman utama (Hero, Projects, Contact)
- Social media icons di Contact dan Footer
- Chatbot bubble di kanan bawah

---

## STEP 15: Setup Admin

1. Buka `https://URL-WEBSITE-LO/admin/login`
2. Login dengan email + password dari Step 8
3. Kamu akan masuk ke Dashboard

### Sekarang kamu bisa:

**Kelola Skills:**
1. Klik **Skills** di sidebar
2. Klik **Add Skill**
3. Isi nama skill dan level (0-100)
4. Atur urutan dan visibility
5. Simpan
6. Refresh halaman Skills — data akan muncul

**Kelola Projects:**
1. Klik **Projects** di sidebar
2. Klik **Add Project**
3. Isi judul, deskripsi, tech (koma-separated), link (opsional)
4. Atur urutan dan visibility
5. Simpan
6. Refresh halaman utama — project akan muncul di section Projects

**Kelola Social Links:**
1. Klik **Social Links** di sidebar
2. Klik **Add Link**
3. Pilih platform (Instagram, WhatsApp, dll)
4. Isi username atau URL
5. Klik **Tambah**
6. Refresh halaman utama — icons akan muncul

**Kelola Blog:**
1. Klik **Blog** di sidebar
2. Klik **New Article**
3. Isi judul, excerpt, konten (TipTap editor)
4. Toggle publish/draft
5. Simpan

**Kelola Pages:**
1. Klik **Pages** di sidebar
2. Klik **New Page**
3. Isi slug, title, content (TipTap editor)
4. Simpan — konten akan tampil di halaman yang sesuai (contoh: slug `about` untuk halaman About)

---

## STEP 16: Custom Domain (Opsional)

Kalau kamu punya domain sendiri (contoh: `arazhar.dev`):

1. Buka https://dash.cloudflare.com
2. Klik **Workers & Pages** → pilih worker `clover`
3. Klik tab **Triggers**
4. Klik **Add Custom Domain**
5. Isi domain (contoh: `arazhar.dev`)
6. Ikuti instruksi DNS yang diberikan

**Catatan:** Domain harus menggunakan Cloudflare sebagai DNS provider.

Kalau belum punya domain, website tetap bisa diakses via URL Cloudflare:
`https://clover.xxxxx.workers.dev`

---

## Troubleshooting

### "Database not configured" di Dashboard
- Pastikan `database_id` di `wrangler.jsonc` sudah terisi
- Pastikan sudah jalankan Step 7 (migrasi)

### Login gagal (401)
- Pastikan `JWT_SECRET` sudah di-set di Cloudflare
- Pastikan admin user sudah di-insert (Step 8)

### Chatbot tidak jalan
- Pastikan `GEMINI_API_KEY` sudah di-set
- Coba test pakai `GROQ_API_KEY` sebagai fallback
- Cek console browser (F12) untuk error

### Social links tidak muncul
- Pastikan tabel SocialLink sudah dibuat (Step 7)
- Login ke admin → Social Links → tambah link
- Toggle "Tampilkan di website" = ON

### Skills / Projects tidak muncul
- Pastikan tabel Skill dan Project sudah dibuat (jalankan migrasi `0003_skill_project.sql`)
- Login ke admin → Skills/Projects → tambah data
- Toggle "Tampilkan di website" = ON

### Deploy gagal
- Pastikan `wrangler login` sudah dilakukan
- Pastikan akun Cloudflare aktif
- Coba: `npm install` ulang lalu `npm run deploy`

---

## Ringkasan Perintah

```bash
# 1. Clone
git clone https://github.com/AraZharr/clover.git
cd clover

# 2. Install
npm install
npm install -g wrangler

# 3. Login Cloudflare
wrangler login

# 4. Buat database
wrangler d1 create clover-db
# → isi database_id di wrangler.jsonc

# 5. Migrasi tabel
wrangler d1 execute clover-db --remote --file=./migrations/0001_init.sql
wrangler d1 execute clover-db --remote --file=./migrations/0002_social_link.sql
wrangler d1 execute clover-db --remote --file=./migrations/0003_skill_project.sql

# 6. Buat admin user
wrangler d1 execute clover-db --remote --command="INSERT INTO User (id, email, password, name) VALUES (lower(hex(randomblob(16))), 'admin@arazhar.dev', 'password123', 'AraZhar')"

# 7. Isi .env
# JWT_SECRET, GEMINI_API_KEY, GROQ_API_KEY, NEXT_PUBLIC_WA_NUMBER, NEXT_PUBLIC_URL

# 8. Deploy
npm run deploy

# 9. Set env vars di Cloudflare dashboard atau via:
wrangler secret put JWT_SECRET
wrangler secret put GEMINI_API_KEY
wrangler secret put GROQ_API_KEY

# 10. Deploy ulang
npm run deploy
```

---

*Written by opencode for AraZhar.*
