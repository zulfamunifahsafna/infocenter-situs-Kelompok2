# InfoCenter — Situs Statis Kelompok Tugas UTS

Situs informasi beasiswa & lomba yang disatukan dari beberapa proyek terpisah
(`InfoCenter_Beasiswa`, `infocenter_web`, `utshalamandashboard`,
`UTS-Info-Beasiswa-features-map`, `kirim_info`, `tentang`) menjadi **satu situs
statis konsisten**: HTML terpisah per halaman, satu CSS, satu JS, dan data
pusat.

## Cara membuka situs (2 pilihan)

**1. Paling mudah — langsung buka berkasnya:**
   dobel-klik `index.html` (atau buka lewat peramban).

**2. Lewat "server" kecil lokal (disarankan saat develop):**

```bash
# jalankan dari folder infocenter-situs ini
python3 -m http.server 8000
# lalu buka http://localhost:8000 di browser
```

Catatan bekerja di internet:

- **peta.html** butuh internet (Leaflet + tile OpenStreetMap memakai CDN).
- **dashboard.html** — grafik donat Highcharts juga memakai CDN (butuh
  internet); angka, tabel data, dan statistik tetap tampil tanpa internet.
- **Font** (DM Sans + Lora) memakai Google Fonts; tanpa internet font diganti
  font bawaan sistem — situs tetap terbaca.
- Pencarian, filter, dan validasi formulir **tetap bekerja tanpa internet**
  kecuali peta & grafik.

## Struktur berkas

```
infocenter-situs/
├── index.html        Beranda: hero, pencarian, statistik, deadline terdekat
├── beasiswa.html     Katalog beasiswa (data asli, tautan resmi dari arsip)
├── lomba.html        Katalog lomba (data contoh, tanpa tautan resmi)
├── dashboard.html    Ringkasan: angka dihitung dari data, deadline terdekat
├── peta.html         Leaflet: marker beasiswa (hijau) + lomba (merah bata)
├── kirim-info.html   Formulir usulan (validasi lokal, belum tersambung server)
├── tentang.html      Profil, visi-misi, fitur, langkah, kategori, FAQ
├── css/style.css     SATU stylesheet semua halaman (token warna di atas berkas)
├── js/data.js        HANYA data: 5 beasiswa asli + 7 lomba contoh
├── js/main.js        Semua interaksi: render, filter, peta, formulir
├── check.js          Pemeriksa keutuhan data — jalankan: node check.js
└── assets/           hero-illustration.png, foto-beasiswa.jpg
```

## Cara membaca kode ini (untuk yang baru belajar web)

Urutan yang nyaman mengikuti materi belajar:

1. **`index.html`** — lihat struktur HTML semantik: `<header>`, `<nav>`,
   `<main>`, `<section>`, `<footer>`. Semua halaman punya navbar & footer yang
   yang seragam (markup disalin sama persis; hanya `class="active"` berbeda).
2. **`css/style.css`** — mulai dari *token* warna di `:root` (bagian 1), lalu
   komponen umum (bagian 2), termasuk dropdown Katalog. Setiap halaman hanya
   menambah blok halamannya.
3. **`js/data.js`** — lihat bagaimana data ditulis sebagai `const` berisi
   daftar objek. Ubah data di sini, situs ikut berubah otomatis.
4. **`js/main.js`** — Fokus bagian 3 (`pasangHalamanPeluang`): pencarian +
   filter + kartu. Bagian lain memakai pola yang sama.
5. Trik kecil untuk dipahami: halaman menandai dirinya lewat
   `<body data-halaman="beasiswa">`; di ujung `main.js` JavaScript membaca
   tanda itu lalu menghidupkan bagian yang benar.

## Status fitur

**Berfungsi (frontend):**

- Pencarian `?q=` dari beranda menu katalog beasiswa.
- Filter kategori di beasiswa, lomba, dan peta; tombol reset.
- Kartu peluang: klik/Enter membuka Google Maps koordinat penyelenggara.
- Peta Leaflet dengan popup; beasiswa punya tautan website resmi.
- Dashboard: grafik donat Highcharts (komposisi Beasiswa/Acad/Non-akademik)
  + tabel data lengkap semua item urut deadline terdekat.
- Navbar responsif: menu **Katalog ▾** (dropdown Beasiswa + Lomba) dibuka
  dengan klik/tap, ditutup dengan Esc/klik di luar; halaman aktif tetap
  ditandai `class="active"`.
- Sampul tiap halaman berupa pita band forest, diakhiri band ajakan sebelum
  footer — jarak antara konten dan footer sudah dibersihkan.
- Skip-link, fokus keyboard yang jelas.
- Dashboard & statistik dihitung dari data (bukan angka sembarangan).
- Validasi formulir kirim info + pesan kesalahan per kolom.

**Belum tersambung ke backend (jujur utk pengguna):**

- Formulir **Kirim Info** hanya memvalidasi & menampilkan notifikasinya;
  tidak ada penyimpanan.
- Tidak ada login/profil.
- Halaman "Pusat Informasi" genap dari arsip tidak dilanjutkan.

## Catatan data (benar vs contoh)

| Data | Sumber | Status |
|---|---|---|
| 5 beasiswa | `beasiswa.js` arsip (KIP Kuliah, Beasiswa Unggulan, Djarum Plus, Eiffel, Bakti BCA) | **Asli**, tautan resmi asal arsip |
| 7 lomba | `data-map.js` arsip fitur peta | **Contoh** — semua kartu/popup bertetangga "Contoh data", tanpa tautan resmi (dilarang mengarang) |
| Statistik beranda/dashboard | dihitung js dari data.js | transparan dari data situs |
| "150+ / 50+ / 1000+" di Tentang | arsip lama | target aspiratif, diberi keterangan di halaman |

Pemeriksa data otomatis (jalankan `node check.js`) menegakkan aturan:
kolom wajib terisi, koordinat valid, lomba TIDAK boleh punya tautan resmi.

---

Desain: palet **forest `#174A35`, cream `#F5EBDD`, rust `#B84D2B`** dari
halaman Beasiswa asli, direnovasi ke arah minimalis–neumorphic
("Cream & Shadow"). Detil kursus: `css/style.css` bagian atas.
