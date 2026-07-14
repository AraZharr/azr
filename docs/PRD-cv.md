# PRD: Multi-CV dengan Slide (Curriculum Vitae)

## Latar Belakang
Portfolio saat ini gak punya section CV/resume. Pengunjung gak bisa liat riwayat kerja, skill, dan pendidikan secara terstruktur. User punya multiple peran (developer, waiter, freelancer, dll) yang perlu diakomodasi dalam CV berbeda.

## Tujuan
- Admin bisa buat banyak CV (masing-masing untuk peran berbeda)
- CV bisa di-slide/swipe di halaman utama
- Tampil antara Projects dan Kontak
- Data kelola via admin panel — tamu cuma lihat

## Data Model — Table `CV`

| Kolom | Type | Keterangan |
|-------|------|------------|
| `id` | TEXT UUID | Primary key |
| `title` | TEXT | Nama CV — misal "Web Developer", "Waiter" |
| `slug` | TEXT UNIQUE | Slug unik — misal `web-dev`, `waiter` |
| `data` | TEXT | JSON blob — isi CV (lihat di bawah) |
| `published` | INTEGER | 0/1 |
| `sort_order` | INTEGER | Urutan tampil |
| `createdAt` | TEXT | |
| `updatedAt` | TEXT | |

### JSON Shape (`data` column)

```json
{
  "photo": "/api/admin/media/xxx",
  "location": "Solo, Indonesia",
  "email": "rizalrahmadi36@gmail.com",
  "bio": "Singkat tentang diri...",
  "skills": [
    { "name": "JavaScript", "level": 85 },
    { "name": "Tailwind CSS", "level": 80 }
  ],
  "experience": [
    { "position": "Web Developer", "company": "Freelance", "period": "2023-sekarang", "desc": "..." }
  ],
  "education": [
    { "school": "SMK N 1 Surakarta", "degree": "Rekayasa Perangkat Lunak", "year": "2023" }
  ],
  "contact_links": [
    { "label": "WhatsApp", "url": "https://wa.me/628xxx" }
  ]
}
```

### Kenapa JSON blob, bukan relasional?
- Jumlah skill/experience/education per CV dinamis
- Gak perlu query JOIN — cukup 1 SELECT
- Simpel di-update (PUT seluruh data)
- Semua platform (CF D1) handle JSON native

## API

| Method | Route | Auth | Fungsi |
|--------|-------|------|--------|
| `GET` | `/api/admin/cv` | Admin | Semua CV (sort by sort_order) |
| `POST` | `/api/admin/cv` | Admin | Tambah CV baru |
| `GET` | `/api/admin/cv/:id` | Admin | Satu CV detail |
| `PUT` | `/api/admin/cv/:id` | Admin | Update CV |
| `DELETE` | `/api/admin/cv/:id` | Admin | Hapus CV |
| `PATCH` | `/api/admin/cv/reorder` | Admin | Update sort_order batch |
| `GET` | `/api/cv` | Publik | Semua CV yang published |

### Response Format

```json
// GET /api/cv
[
  {
    "id": "uuid",
    "title": "Web Developer",
    "slug": "web-dev",
    "data": { "bio": "...", "skills": [...], ... },
    "sort_order": 0
  }
]
```

## Admin Page — `/admin/(dashboard)/cv/`

### List View
- Card list (responsive — mobile: card, desktop: table)
- Tiap card: title, slug, status badge, Edit/Delete buttons
- Drag reorder via sort_order

### Form View
Form sections (semua di 1 page vertikal):

| Section | Field | Type |
|---------|-------|------|
| **Identity** | Title | Text input — "Web Developer" |
| | Slug | Text input — auto dari title |
| | Photo | ImagePicker + Upload |
| | Location | Text input |
| | Email | Text input |
| | Bio | Textarea |
| **Skills** | Name + Level (0-100) | Add/remove — list item |
| **Experience** | Position, Company, Period, Desc | Add/remove — list item |
| **Education** | School, Degree, Year | Add/remove — list item |
| | Published | Toggle |
| | Sort Order | Number |

### Download PDF
- Tombol **Download PDF** di admin page doang
- Panggil `/api/admin/cv/:id/pdf` → render CV ke PDF ➝ download
- PDF gak perlu fancy — cukup HTML-to-PDF via `puppeteer` atau service gratis

## Public Component — `CVSection.js`

### Letak
Antara `<Projects />` dan `<Contact />` di `src/app/page.js`.

### Layout (Mobile-first single card)

```
┌────────────────────────────────┐
│  [Web Developer] [Waiter] [+2] │  ← pill tabs
├────────────────────────────────┤
│  ┌──────┐                       │
│  │  🖼️  │  AraZhar              │
│  │ foto │  Web Developer         │
│  └──────┘  📍 Solo, Indonesia    │
│            ✉️ rizalrahmadi36...  │
├────────────────────────────────┤
│  Tentang Saya                   │
│  Bio text...                    │
├────────────────────────────────┤
│  Keahlian                       │
│  JS ████████████░░░ 85%         │
│  React █████████░░░░░ 75%       │
├────────────────────────────────┤
│  Pengalaman                     │
│  2023 - sekarang                │
│  Web Developer — Freelance     │
│  • deskripsi...                 │
├────────────────────────────────┤
│  Pendidikan                     │
│  2023 — SMK N 1 Surakarta      │
│  Rekayasa Perangkat Lunak      │
├────────────────────────────────┤
│  📱 WhatsApp                    │
│  📧 Email                       │
└────────────────────────────────┘
    ● ○ ○  ← dots / swipe indicator
```

### Pill Tabs
- Setiap CV jadi satu tab/pill di atas card
- Aktif: background hitam, teks putih
- Non-aktif: outline abu-abu
- Kalo >3 CV, overflow horizontal dengan scroll
- Swipe kiri/kanan di area card ganti CV (touch)

### Animasi
- Framer Motion buat fade/slide pas ganti CV
- Progress bar animasi ke lebar target

## Migration — `migrations/0005_cv.sql`

```sql
CREATE TABLE IF NOT EXISTS CV (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  data TEXT NOT NULL DEFAULT '{}',
  published INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Files Affected

| File | Action |
|------|--------|
| `migrations/0005_cv.sql` | Create |
| `src/lib/d1.js` | + getCV, createCV, updateCV, deleteCV, reorderCV, getVisibleCV |
| `src/app/api/admin/cv/route.js` | Create — GET (list) + POST |
| `src/app/api/admin/cv/[id]/route.js` | Create — GET + PUT + DELETE |
| `src/app/api/cv/route.js` | Create — public GET |
| `src/app/admin/(dashboard)/cv/page.js` | Create — list + form page |
| `src/components/CVSection.js` | Create — public component with tabs + swipe |
| `src/app/page.js` | Edit — tambah `<CVSection />` antara Projects & Contact |
| `src/components/admin/Sidebar.js` | Edit — tambah link "CV" |

## Out of Scope
- Dark mode
- Download PDF dari public
- Multi-language CV
- Template/warna CV custom
- Statistik view CV

## Urutan Build

1. Migration SQL
2. `d1.js` — fungsi CRUD CV
3. API routes (admin + public)
4. Admin page — list + form
5. Public `CVSection.js` component + tab/swipe
6. Integrasi ke `page.js`
7. Sidebar admin — link CV

## Testing
- Buat 2-3 CV beda role via admin
- Cek public — pill tabs muncul, swipe ganti CV
- Cek responsive — HP card layout rapi
- Reorder di admin, cek urutan
- Unpublish satu CV — hilang dari public
