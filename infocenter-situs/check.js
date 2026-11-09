/* =============================================================
   CHECK.JS — Pemeriksa keutuhan data (bukan halaman web)
   Dijalankan lewat terminal:  node check.js

   Kenapa file ini ada? Data situs ditulis manual di js/data.js,
   jadi kalau ada nama/kolom yang kelewat, halaman tidak ikut bilang.
   Skrip ini mencetak pesan jelas kalau ada data yang kurang lengkap.
   ============================================================= */

const { beasiswa, lomba } = require("./js/data.js");

let adaMasalah = false; // jadi true kalau ditemukan data yang bermasalah

/* Nama bulan harus sama persis dengan yang dipakai js/main.js
   untuk mengubah teks deadline menjadi tanggal (tujuan urutan). */
const NAMA_BULAN = {
  Januari: 1,
  Februari: 2,
  Maret: 3,
  April: 4,
  Mei: 5,
  Juni: 6,
  Juli: 7,
  Agustus: 8,
  September: 9,
  Oktober: 10,
  November: 11,
  Desember: 12,
};

/* Fungsi kecil: kumpulkan masalah dan cetak sekali saja */
function tandai(daftar, namaDaftar, namaItem, pesan) {
  adaMasalah = true;
  console.log(`MASALAH di ${namaDaftar} "${namaItem}": ${pesan}`);
}

/* Data yang WAJIB ada untuk semua peluang (beasiswa maupun lomba) */
const KOLOM_WAJIB = [
  "nama",
  "penyelenggara",
  "kategori",
  "kategoris",
  "lokasi",
  "deadline",
];

function periksa(daftar, namaDaftar) {
  for (const item of daftar) {
    // 1. Kolom wajib tidak boleh kosong
    for (const kolom of KOLOM_WAJIB) {
      const isi = item[kolom];
      if (isi === undefined || isi === null || isi === "" || isi.length === 0) {
        tandai(daftar, namaDaftar, item.nama, `kolom "${kolom}" kosong`);
      }
    }

    // 2. Koordinat harus angka dan masuk rentang yang masuk akal (peta rusak kalau tidak)
    if (
      typeof item.latitude !== "number" ||
      item.latitude < -90 ||
      item.latitude > 90
    ) {
      tandai(
        daftar,
        namaDaftar,
        item.nama,
        "latitude bukan angka atau di luar rentang -90..90",
      );
    }
    if (
      typeof item.longitude !== "number" ||
      item.longitude < -180 ||
      item.longitude > 180
    ) {
      tandai(
        daftar,
        namaDaftar,
        item.nama,
        "longitude bukan angka atau di luar rentang -180..180",
      );
    }

    // 3. Deadline harus bisa dibaca: "Tanggal Bulan Tahun", contoh "31 Oktober 2026"
    const bagian = item.deadline.split(" (")[0].split(" ");
    if (
      bagian.length !== 3 ||
      isNaN(Number(bagian[0])) ||
      !NAMA_BULAN[bagian[1]] ||
      isNaN(Number(bagian[2]))
    ) {
      tandai(
        daftar,
        namaDaftar,
        item.nama,
        `"deadline" tidak sesuai pola "Tanggal Bulan Tahun"`,
      );
    }

    // 4. Lomba = contoh data: TIDAK BOLEH punya tautan resmi (jangan mengarang)
    if (namaDaftar === "lomba" && item.situs) {
      tandai(
        daftar,
        namaDaftar,
        item.nama,
        "data contoh tidak boleh punya situs/pautan resmi",
      );
    }

    // 5. Data asli (beasiswa) harus punya tautan resmi dari arsip
    if (namaDaftar === "beasiswa" && !item.situs) {
      tandai(
        daftar,
        namaDaftar,
        item.nama,
        "beasiswa asli seharusnya memiliki tautan situs resmi",
      );
    }
  }
}

periksa(beasiswa, "beasiswa");
periksa(lomba, "lomba");

/* Laporan ringkas di akhir */
if (adaMasalah) {
  console.log(
    "\n✗ ADA MASALAH. Perbaiki js/data.js lalu jalankan lagi: node check.js",
  );
  process.exit(1); // angka selain 0 = keluar dengan status gagal (dipahami Node)
} else {
  console.log("Semua data lengkap dan siap dipakai:");
  console.log(`  • ${beasiswa.length} beasiswa (asli, dengan tautan resmi)`);
  console.log(`  • ${lomba.length} lomba (contoh data, tanpa tautan resmi)`);
  console.log("✓ Data siap dipakai situs.");
}
