/* =============================================================
   DATA.JS — HANYA BERISI DATA (tanpa kode tampilan)
   Kelebihan: kalau data mau diubah, ubah hanya di sini —
   HTML dan tampilan tidak perlu disentuh.

   Setiap item punya bentuk (struktur) yang sama supaya mudah dipakai:

   beasiswa : nama, penyelenggara, kategori (label tampil),
              kategoris (daftar untuk filter, huruf kecil),
              jenjang, lokasi, alamat, latitude, longitude,
              deadline, status, statusKelas, kuota, situs
              → data asli dari proyek InfoCenter_Beasiswa,
                semua tautan "situs" adalah tautan resmi.

   lomba    : nama, penyelenggara, kategori ("Akademik"/"Non-akademik"),
              kategoris, lokasi, latitude, longitude, deadline, situs
              → CONT DATA dari proyek fitur peta (data-map.js).
                situs = "" karena tautan resminya belum ada,
                jadi jangan diisi sembarangan. Ditandai contoh: true.
   ============================================================= */

/* ---------- DATA BEASISWA (asli, tautan resmi dari arsip) ---------- */

const beasiswa = [
  {
    nama: "Kartu Indonesia Pintar Kuliah (KIP Kuliah)",
    penyelenggara: "Kementerian Pendidikan Tinggi, Sains, dan Teknologi",
    kategori: "Ekonomi",
    kategoris: ["ekonomi"],
    jenjang: "Calon mahasiswa D3, D4, dan S1",
    lokasi: "Puslapdik, Jakarta",
    alamat:
      "Gedung C, Kompleks Kemendikdasmen, Jl. Jenderal Sudirman, Senayan, Jakarta",
    latitude: -6.213,
    longitude: 106.801,
    deadline: "31 Oktober 2026",
    status: "Pendaftaran ditutup",
    statusKelas: "ditutup",
    kuota: "Mengikuti kuota dan ketentuan program",
    situs: "https://kip-kuliah.kemdiktisaintek.go.id/",
  },
  {
    nama: "Beasiswa Unggulan",
    penyelenggara: "Pusat Layanan Pembiayaan Pendidikan (Puslapdik)",
    kategori: "Prestasi dan Akademik",
    kategoris: ["prestasi", "akademik"],
    jenjang: "S1, S2, dan S3 sesuai persyaratan",
    lokasi: "Puslapdik, Jakarta",
    alamat:
      "Gedung C Lantai Dasar, Jl. Jenderal Sudirman, Senayan, Jakarta 10270",
    latitude: -6.213,
    longitude: 106.801,
    deadline: "24 Agustus 2026",
    status: "Pendaftaran ditutup",
    statusKelas: "ditutup",
    kuota: "Tidak diumumkan",
    situs: "https://beasiswaunggulan.kemendikdasmen.go.id/",
  },
  {
    nama: "Djarum Beasiswa Plus",
    penyelenggara: "Djarum Foundation",
    kategori: "Organisasi dan Kepemimpinan",
    kategoris: ["organisasi", "prestasi"],
    jenjang: "Mahasiswa S1/D4 di perguruan tinggi mitra",
    lokasi: "Kantor Djarum Foundation, Kudus",
    alamat: "Jl. A. Yani No. 19 A, Kudus, Jawa Tengah",
    latitude: -6.805,
    longitude: 110.84,
    deadline: "30 Juni 2026",
    status: "Pendaftaran ditutup",
    statusKelas: "ditutup",
    kuota: "Tidak diumumkan",
    situs: "https://djarumbeasiswaplus.org/",
  },
  {
    nama: "France Excellence Eiffel",
    penyelenggara: "Kementerian Eropa dan Luar Negeri Prancis",
    kategori: "Internasional",
    kategoris: ["internasional", "prestasi", "akademik"],
    jenjang: "Master dan Doktor",
    lokasi: "Campus France, Paris, Prancis",
    alamat: "28 Rue de la Grange-aux-Belles, 75010 Paris, France",
    latitude: 48.8766,
    longitude: 2.3691,
    deadline: "6 Januari 2027 (pengajuan oleh institusi Prancis)",
    status: "Call 2027 dibuka",
    statusKelas: "dibuka",
    kuota: "Tidak diumumkan",
    situs:
      "https://www.campusfrance.org/en/france-excellence-eiffel-scholarship-program",
  },
  {
    nama: "Beasiswa Bakti BCA",
    penyelenggara: "PT Bank Central Asia Tbk",
    kategori: "Perusahaan, Prestasi, dan Akademik",
    kategoris: ["perusahaan", "prestasi", "akademik"],
    jenjang: "Mahasiswa S1 PTN sesuai persyaratan",
    lokasi: "Kantor Pusat BCA, Menara BCA, Jakarta",
    alamat:
      "Menara BCA, Grand Indonesia, Jl. M.H. Thamrin No. 1, Jakarta 10310",
    latitude: -6.1952,
    longitude: 106.8218,
    deadline: "30 September 2026",
    status: "Seleksi berlangsung",
    statusKelas: "proses",
    kuota: "Tidak diumumkan untuk periode 2027",
    situs:
      "https://www.bca.co.id/id/tentang-bca/CSR/Bakti-BCA/bakti-pendidikan/beasiswa-bakti-bca",
  },
];

/* ---------- DATA LOMBA (CONT OH DATA — tautan resmi belum ada) ---------- */

const lomba = [
  {
    nama: "Essay Competition Nasional",
    penyelenggara: "Universitas Gadjah Mada",
    kategori: "Akademik",
    kategoris: ["akademik"],
    lokasi: "Yogyakarta",
    latitude: -7.765,
    longitude: 110.378,
    deadline: "25 November 2026",
    situs: "",
    contoh: true,
  },
  {
    nama: "UI/UX Design Competition",
    penyelenggara: "Institut Teknologi Bandung",
    kategori: "Non-akademik",
    kategoris: ["non-akademik"],
    lokasi: "Bandung, Jawa Barat",
    latitude: -6.891,
    longitude: 107.61,
    deadline: "30 November 2026",
    situs: "",
    contoh: true,
  },
  {
    nama: "Debat Konstitusi Mahasiswa",
    penyelenggara: "Universitas Hasanuddin",
    kategori: "Non-akademik",
    kategoris: ["non-akademik"],
    lokasi: "Makassar, Sulawesi Selatan",
    latitude: -5.133,
    longitude: 119.492,
    deadline: "28 November 2026",
    situs: "",
    contoh: true,
  },
  {
    nama: "Business Plan Competition",
    penyelenggara: "Universitas Diponegoro",
    kategori: "Akademik",
    kategoris: ["akademik"],
    lokasi: "Semarang, Jawa Tengah",
    latitude: -7.05,
    longitude: 110.44,
    deadline: "10 Desember 2026",
    situs: "",
    contoh: true,
  },
  {
    nama: "National Programming Contest",
    penyelenggara: "Institut Teknologi Sepuluh Nopember",
    kategori: "Akademik",
    kategoris: ["akademik"],
    lokasi: "Surabaya, Jawa Timur",
    latitude: -7.282,
    longitude: 112.794,
    deadline: "5 Desember 2026",
    situs: "",
    contoh: true,
  },
  {
    nama: "Olimpiade Statistika Nasional",
    penyelenggara: "Universitas Padjadjaran",
    kategori: "Akademik",
    kategoris: ["akademik"],
    lokasi: "Jatinangor, Sumedang",
    latitude: -6.927,
    longitude: 107.776,
    deadline: "18 Desember 2026",
    situs: "",
    contoh: true,
  },
  {
    nama: "Lomba Videografi Kreatif Mahasiswa",
    penyelenggara: "Universitas Brawijaya",
    kategori: "Non-akademik",
    kategoris: ["non-akademik"],
    lokasi: "Malang, Jawa Timur",
    latitude: -7.953,
    longitude: 112.613,
    deadline: "22 Desember 2026",
    situs: "",
    contoh: true,
  },
];

/*
  Bagian kecil ini HANYA untuk pemeriksa data (check.js yang dijalankan
  lewat Node). Di browser variabel "module" tidak ada, jadi baris ini
  dilewati dan tidak diganggu gugat.
*/
if (typeof module !== "undefined") {
  module.exports = { beasiswa, lomba };
}
