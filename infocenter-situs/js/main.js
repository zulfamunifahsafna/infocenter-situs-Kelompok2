/* =============================================================
   MAIN.JS — satu berkas JavaScript untuk SEMUA halaman

   Prinsipnya: bagian kode hanya berjalan kalau halaman yang sedang
   dibuka memang membutuhkannya. Setiap halaman menandai dirinya
   lewat <body data-halaman="..."> dan di ujung berkas ini
   JavaScript "membaca" tanda itu lalu menghidupkan bagian yang sesuai.

   Susunan berkas (baca dari atas ke bawah — seperti lesson notes):
     1. Helper        : data gabungan, tanggal, kartu, baris info
     2. Navbar        : tombol menu (jalan di semua halaman)
     3. Halaman Beasiswa & Lomba : kartu + pencarian + filter
     4. Halaman Beranda
     5. Halaman Dashboard
     6. Halaman Peta
     7. Halaman Kirim Info
     8. Penghidup (init) : menjalankan bagian sesuai halaman
   ============================================================= */

/* ------------------------------------------------------------
   1. HELPER — fungsi kecil yang dipakai banyak tempat
   ------------------------------------------------------------ */

/* Gabungan beasiswa + lomba. Dipakai oleh peta, dashboard,
   dan hitungan statistik. Setiap item diberi ekstra "jenis"
   supaya tahu asalnya dari daftar yang mana. */
function semuaPeluang() {
  const gabungan = [];

  for (const item of beasiswa) {
    gabungan.push({ jenis: "beasiswa", ...item });
  }
  for (const item of lomba) {
    gabungan.push({ jenis: "lomba", ...item });
  }
  return gabungan;
}

/* Teks deadline ditulis "31 Oktober 2026" — manusia suka format itu,
   komputer belum. Fungsi ini mengubahnya menjadi objek Date
   supaya bisa dibandingkan dan diurutkan.
   (Kalau ada keterangan tambahan, contoh "6 Januari 2027 (pengajuan
   oleh institusi Prancis)", bagian dalam kurung ikut dibuang.) */
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

function bacaTanggal(teksDeadline) {
  const bagian = teksDeadline.split(" (")[0].split(" ");
  const tanggal = Number(bagian[0]); // "31"
  const bulan = NAMA_BULAN[bagian[1]]; // "Oktober" → 10
  const tahun = Number(bagian[2]); // "2026"
  return new Date(tahun, bulan - 1, tanggal); // bulan di Date mulai dari 0
}

/* Teks deadline tanpa keterangan tambahan, untuk ditampilkan pendek */
function teksDeadline(teksDeadline) {
  return teksDeadline.split(" (")[0];
}

/* Daftar peluang yang urut deadline-nya paling dekat duluan.
   Yang sudah lewat tidak dihitung "terdekat" (kalau semua sudah
   lewat, tampilkan saja semuanya sebagai cadangan). */
function peluangTerdekat(daftar, jumlah) {
  const sekarang = new Date();
  const mendatang = daftar.filter(
    (item) => bacaTanggal(item.deadline) >= sekarang,
  );
  const pilihan = mendatang.length > 0 ? mendatang : daftar;

  pilihan.sort(
    (itemA, itemB) => bacaTanggal(itemA.deadline) - bacaTanggal(itemB.deadline),
  );
  return pilihan.slice(0, jumlah); // ambil beberapa paling atas saja
}

/* ------------------------------------------------------------
   Satu KARTU PELUANG (kartu beasiswa / lomba).
   Halaman Beasiswa dan Lomba memakai kartu yang sama —
   yang beda hanya datanya. Kalau ada perbaikan tampilan,
   perbaiki di sini sekali saja.
   ------------------------------------------------------------ */
function buatKartu(item) {
  const kartu = document.createElement("article");
  kartu.className = "kartu peluang";
  kartu.setAttribute("tabindex", "0"); // kartu bisa fokus pakai tombol Tab

  /* Klik kartu = buka Google Maps sesuai koordinat penyelenggara
     (perilaku yang sama seperti situs Beasiswa asli). */
  const tautanPeta =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(item.latitude + "," + item.longitude);

  /* Lencana di bagian atas kartu:
     - beasiswa asli  → status pendaftaran
     - lomba contoh   → "Contoh data" (agar tidak disangka jujur resmi) */
  let lencanaAtas = "";
  if (item.contoh) {
    lencanaAtas = '<span class="lencana status-contoh">Contoh data</span>';
  } else if (item.status) {
    lencanaAtas = `<span class="lencana status-${item.statusKelas}">${item.status}</span>`;
  }

  /* Baris info kartu: dikumpulkan dari kolom yang memang terisi,
     supaya kartu lomba tidak menampilkan bagian kosong. */
  let barisInfo = "";
  if (item.jenjang) {
    barisInfo += `<div class="info-item"><span class="info-label">Jenjang</span><span class="info-value">${item.jenjang}</span></div>`;
  }
  barisInfo += `<div class="info-item"><span class="info-label">Deadline</span><span class="info-value">${teksDeadline(item.deadline)}</span></div>`;
  if (item.kuota) {
    barisInfo += `<div class="info-item"><span class="info-label">Kuota</span><span class="info-value">${item.kuota}</span></div>`;
  }
  barisInfo += `<div class="info-item"><span class="info-label">Lokasi</span><span class="info-value">${item.lokasi}</span></div>`;
  if (item.alamat) {
    barisInfo += `<div class="info-item info-alamat"><span class="info-label">Alamat penyelenggara</span><span class="info-value">${item.alamat}</span></div>`;
  }

  /* Tombol bawah kartu:
     - beasiswa asli → tautan website resmi (jangan diubah!)
     - lomba contoh  → keterangan jujur bahwa tautannya belum ada */
  const bawahKartu = item.situs
    ? `<a class="tautan-situs" href="${item.situs}" target="_blank" rel="noopener noreferrer">Website resmi ↗</a>`
    : `<span class="catatan-tautan">Tautan resmi belum tersedia</span>`;

  kartu.innerHTML = `
    <div class="kepala-kartu">
      <span class="lencana kategori">${item.kategori}</span>
      ${lencanaAtas}
    </div>
    <h3 class="nama-peluang">${item.nama}</h3>
    <p class="penyelenggara">Penyelenggara: ${item.penyelenggara}</p>
    <div class="info-grid">${barisInfo}</div>
    <div class="kaki-kartu">${bawahKartu}</div>
    <p class="petunjuk-klik">Klik kartu untuk melihat lokasi di peta ↗</p>
  `;

  /* Dua kejadian (event) supaya kartu bisa dipakai tetikus DAN keyboard */
  kartu.addEventListener("click", (kejadian) => {
    if (kejadian.target.closest(".tautan-situs")) return; // biarkan tautan berperilaku normal
    window.open(tautanPeta, "_blank", "noopener");
  });
  kartu.addEventListener("keydown", (kejadian) => {
    if (kejadian.key === "Enter") window.open(tautanPeta, "_blank", "noopener");
  });

  return kartu;
}

/* Satu BARIS "Info Terdekat" (dipakai di Beranda dan Dashboard) */
function buatBarisInfo(item) {
  const baris = document.createElement("a");
  baris.className = "baris-info";
  baris.href = item.jenis === "beasiswa" ? "beasiswa.html" : "lomba.html";
  baris.innerHTML = `
    <span class="lencana ${item.jenis === "beasiswa" ? "tag-beasiswa" : "tag-lomba"}">
      ${item.jenis === "beasiswa" ? "Beasiswa" : "Lomba"}
    </span>
    <span class="nama-info">${item.nama}</span>
    <span class="tgl-info">${teksDeadline(item.deadline)}</span>
    <span class="panah-info">→</span>
  `;
  return baris;
}

/* ------------------------------------------------------------
   2. NAVBAR — tombol humberger layar kecil (semua halaman)
   ------------------------------------------------------------ */
function pasangTombolMenu() {
  const tombolMenu = document.getElementById("tombolMenu");
  const menu = document.getElementById("menu");

  tombolMenu.addEventListener("click", () => {
    const terbuka = menu.classList.toggle("terbuka");
    /* aria-expanded memberitahu pembaca layar apakah menunya terbuka */
    tombolMenu.setAttribute("aria-expanded", terbuka ? "true" : "false");
  });
}

/* ------------------------------------------------------------
   2b. MENU KATALOG — dropdown "Katalog ▾" (Beasiswa + Lomba)

   Kenapa dibuka lewat klik, bukan hover? Klik bekerja sama
   untuk tetikus, keyboard, dan layar sentuh — lebih andal.
   Menu ditutup dengan: klik tombol lagi, klik di luar, atau Esc.
   ------------------------------------------------------------ */
function pasangMenuKatalog() {
  const tombolKatalog = document.getElementById("tombolKatalog");
  const itemKatalog = tombolKatalog.closest(".item-katalog"); // wadahnya

  /* satu tempat untuk menyalakan/mematikan menu */
  function ubah(buka) {
    itemKatalog.classList.toggle("terbuka", buka);
    tombolKatalog.setAttribute("aria-expanded", buka ? "true" : "false");
  }

  tombolKatalog.addEventListener("click", () => {
    ubah(!itemKatalog.classList.contains("terbuka")); // balik kondisi
  });

  /* klik di luar area katalog menutup menu */
  document.addEventListener("click", (kejadian) => {
    if (!itemKatalog.contains(kejadian.target)) ubah(false);
  });

  /* tombol Esc menutup menu (nyaman bagi pengguna keyboard) */
  document.addEventListener("keydown", (kejadian) => {
    if (kejadian.key === "Escape") ubah(false);
  });
}

/* ------------------------------------------------------------
   3. HALAMAN BEASISWA & LOMBA — pencarian + filter + kartu

   Kedua halaman berbagi logika yang SAMA dan id elemen yang SAMA
   (kotakCari, pilihKategori, …). Yang berbeda hanya datanya.
   ------------------------------------------------------------ */
function pasangHalamanPeluang(daftar) {
  const kotakCari = document.getElementById("kotakCari");
  const pilihKategori = document.getElementById("pilihKategori");
  const tombolReset = document.getElementById("tombolReset");
  const kotakDaftar = document.getElementById("daftarPeluang");
  const pesanKosong = document.getElementById("pesanKosong");
  const angkaInfo = document.getElementById("jumlahPeluang");
  const angkaPeta = document.getElementById("jumlahPetaItem");

  /* Statistik: angka dihitung dari data, bukan tebak-tebakan */
  angkaInfo.textContent = String(daftar.length).padStart(2, "0");
  angkaPeta.textContent = String(semuaPeluang().length).padStart(2, "0");

  /* Menampilkan hasil pencarian ke daftar kartu */
  function tampilkan(hasil) {
    kotakDaftar.innerHTML = ""; // kosongkan dulu supaya tidak dobel
    pesanKosong.hidden = hasil.length > 0; // pesan muncul hanya kalau hasil kosong
    for (const item of hasil) {
      kotakDaftar.appendChild(buatKartu(item));
    }
  }

  /* Filter: cocokkan kata pencarian + kategori terpilih */
  function terapkanFilter() {
    const kata = kotakCari.value.toLowerCase().trim();
    const kategori = pilihKategori.value;

    const hasil = daftar.filter(
      (item) =>
        // cocok nama ATAU penyelenggara
        (item.nama.toLowerCase().includes(kata) ||
          item.penyelenggara.toLowerCase().includes(kata)) &&
        // dan cocok kategori ("semua" berarti lewati pengecekan)
        (kategori === "semua" || item.kategoris.includes(kategori)),
    );

    tampilkan(hasil);
  }

  /* Pengunjung datang dari pencarian di Beranda: situs dibuka
     dengan beasiswa.html?q=kata-kunci — kita baca parameter itu. */
  const kataDariBeranda = new URLSearchParams(window.location.search).get("q");
  if (kataDariBeranda) kotakCari.value = kataDariBeranda;

  /* Kejadian (event) pencarian & filter */
  kotakCari.addEventListener("input", terapkanFilter);
  pilihKategori.addEventListener("change", terapkanFilter);

  tombolReset.addEventListener("click", () => {
    kotakCari.value = "";
    pilihKategori.value = "semua";
    document
      .querySelectorAll(".kartu-kategori")
      .forEach((kartu) => kartu.classList.remove("terpilih"));
    terapkanFilter();
  });

  /* Klik kartu kategori besar (di atas daftar) = filter sekaligus */
  document.querySelectorAll(".kartu-kategori").forEach((kartu) => {
    kartu.addEventListener("click", () => {
      document
        .querySelectorAll(".kartu-kategori")
        .forEach((k) => k.classList.remove("terpilih"));
      kartu.classList.add("terpilih");
      pilihKategori.value = kartu.dataset.kategori;
      terapkanFilter();
      document.getElementById("daftar").scrollIntoView({ behavior: "smooth" });
    });
  });

  terapkanFilter(); // tampil pertama kali (sekaligus memproses ?q= kalau ada)
}

/* ------------------------------------------------------------
   4. HALAMAN BERANDA — statistik + daftar deadline terdekat
   ------------------------------------------------------------ */
function pasangBeranda() {
  const semua = semuaPeluang();

  document.getElementById("angkaTotal").textContent = String(
    semua.length,
  ).padStart(2, "0");
  document.getElementById("angkaBeasiswa").textContent = String(
    beasiswa.length,
  ).padStart(2, "0");
  document.getElementById("angkaLomba").textContent = String(
    lomba.length,
  ).padStart(2, "0");
  document.getElementById("angkaPeta").textContent = String(
    semua.length,
  ).padStart(2, "0");

  const daftarDeadline = document.getElementById("daftarDeadline");
  for (const item of peluangTerdekat(semua, 3)) {
    daftarDeadline.appendChild(buatBarisInfo(item));
  }
}

/* ------------------------------------------------------------
   5. HALAMAN DASHBOARD — angka ringkasan
   (grafik & tabel data lengkap dipisah: lihat bagian 5b)
   ------------------------------------------------------------ */
function pasangDashboard() {
  const semua = semuaPeluang();

  document.getElementById("angkaTotal").textContent = String(
    semua.length,
  ).padStart(2, "0");
  document.getElementById("angkaBeasiswa").textContent = String(
    beasiswa.length,
  ).padStart(2, "0");

  /* Lomba dihitung per kategorinya (data di situs ini, bukan data dunia nyata) */
  let jumlahAkademik = 0;
  let jumlahNonAkademik = 0;
  for (const item of lomba) {
    if (item.kategori === "Akademik") jumlahAkademik++;
    if (item.kategori === "Non-akademik") jumlahNonAkademik++;
  }
  document.getElementById("angkaLombaAkademik").textContent = String(
    jumlahAkademik,
  ).padStart(2, "0");
  document.getElementById("angkaLombaNon").textContent = String(
    jumlahNonAkademik,
  ).padStart(2, "0");
}

/* ------------------------------------------------------------
   5b. DASHBOARD — GRAFIK HIGHCHARTS & TABEL DATA

   Grafik donat: proporsi Beasiswa / Lomba Akademik / Non-akademik.
   Tabel data : semua item urut deadline terdekat di atas.
   Keduanya dihitung dari js/data.js — bukan angka ditulis manual.
   ------------------------------------------------------------ */

function pasangGrafik() {
  /* Kalau Highcharts gagal dimuat (tanpa internet), halaman jangan error:
     cukup kembalikan, wadah grafik dibiarkan kosong. */
  if (typeof Highcharts === "undefined") return;

  /* Hitung ulang jumlah per kelompok (sama seperti angka ringkasan) */
  let jumlahAkademik = 0;
  let jumlahNonAkademik = 0;
  for (const item of lomba) {
    if (item.kategori === "Akademik") jumlahAkademik++;
    if (item.kategori === "Non-akademik") jumlahNonAkademik++;
  }

  /* Warna harusnya ikut palet situs: forest, rust, dan krem tua */
  Highcharts.chart("wadahGrafik", {
    chart: { type: "pie", backgroundColor: "transparent" },
    title: { text: "" }, // judul sudah ada di panel HTML, jadi dikosongkan
    tooltip: { valueSuffix: " peluang" },
    credits: { enabled: false }, // tanda "Highcharts.com" di pojok dimatikan
    plotOptions: {
      pie: {
        innerSize: "5%", // lubang tengah → jadi diagram donat
        dataLabels: {
          enabled: true,
          format: "{point.name}: <b>{point.y}</b>",
          color: "#26372E", // label luar gelap supaya kontras di atas kartu
        },
      },
    },
    series: [{
      name: "Peluang",
      data: [
        { name: "Beasiswa",        y: beasiswa.length,      color: "#174A35" },
        { name: "Lomba Akademik",  y: jumlahAkademik,       color: "#B84D2B" },
        { name: "Lomba Non-akademik", y: jumlahNonAkademik, color: "#E9B69F" },
      ],
    }],
  });
}

function pasangTabelData() {
  const tubuhTabel = document.getElementById("tubuhTabel");

  /* Kita urutkan SALINAN daftar supaya data asli tidak keacak */
  const semua = [...semuaPeluang()].sort(
    (itemA, itemB) => bacaTanggal(itemA.deadline) - bacaTanggal(itemB.deadline)
  );

  for (const item of semua) {
    const baris = document.createElement("tr");

    /* Sel Jenis: lencana warna; lomba contoh ditandai tambahan */
    const jenis = `
      <span class="lencana ${item.jenis === "beasiswa" ? "tag-beasiswa" : "tag-lomba"}">
        ${item.jenis === "beasiswa" ? "Beasiswa" : "Lomba"}
      </span>
      ${item.contoh ? '<span class="lencana status-contoh">Contoh</span>' : ""}`;

    /* Sel Tautan: beasiswa asli → website resmi; lomba contoh → detail katalog */
    const tautan = item.situs
      ? `<a href="${item.situs}" target="_blank" rel="noopener noreferrer">Website resmi ↗</a>`
      : `<a href="${item.jenis === "beasiswa" ? "beasiswa.html" : "lomba.html"}">Lihat detail →</a>`;

    baris.innerHTML = `
      <td>${jenis}</td>
      <td><strong>${item.nama}</strong></td>
      <td>${item.penyelenggara}</td>
      <td>${item.kategori}</td>
      <td>${item.lokasi}</td>
      <td>${teksDeadline(item.deadline)}</td>
      <td>${tautan}</td>
    `;

    tubuhTabel.appendChild(baris);
  }
}

/* ------------------------------------------------------------
   6. HALAMAN PETA — Leaflet + OpenStreetMap
   Marker Beasiswa = hijau forest, Lomba = merah bata (rust),
   warna datang dari variabel CSS --forest dan --rust.
   ------------------------------------------------------------ */
function pasangPeta() {
  /* Buat peta dan tumpukan gambar (tile) OpenStreetMap */
  const peta = L.map("peta").setView([-2.5, 118], 5); // posisi awal: Indonesia
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(peta);

  const lapisanMarker = L.layerGroup().addTo(peta);

  /* Satu marker untuk satu peluang, lengkap dengan balon isinya (popup) */
  function tampilkanMarker(kategori) {
    lapisanMarker.clearLayers(); // bersihkan dulu, jangan menumpuk

    const semua = semuaPeluang();
    const hasil =
      kategori === "semua"
        ? semua
        : semua.filter((item) => item.jenis === kategori);

    for (const item of hasil) {
      const ikon = L.divIcon({
        className: "marker-peta",
        html: `<div class="bola-marker ${item.jenis}"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -12],
      });

      /* Isi popup: tautan resmi hanya untuk beasiswa asli;
         lomba contoh diberi catatan jujur. */
      let barisTautan = "";
      if (item.situs) {
        barisTautan = `<p><a href="${item.situs}" target="_blank" rel="noopener noreferrer">Website resmi ↗</a></p>`;
      } else if (item.contoh) {
        barisTautan = `<p class="popup-contoh">Contoh data — tautan resmi belum tersedia</p>`;
      }

      const marker = L.marker([item.latitude, item.longitude], { icon: ikon });
      marker.bindPopup(`
        <div class="isi-popup">
          <strong class="popup-nama">${item.nama}</strong>
          <p>Penyelenggara: ${item.penyelenggara}</p>
          <p>
            <span class="lencana ${item.jenis === "beasiswa" ? "tag-beasiswa" : "tag-lomba"}">
              ${item.jenis === "beasiswa" ? "Beasiswa" : "Lomba"}
            </span>
            ${item.contoh ? '<span class="lencana status-contoh">Contoh data</span>' : ""}
          </p>
          <p>Lokasi: ${item.lokasi} · Deadline: ${teksDeadline(item.deadline)}</p>
          ${barisTautan}
          <p><a href="${item.jenis === "beasiswa" ? "beasiswa.html" : "lomba.html"}">Lihat detail →</a></p>
        </div>
      `);

      lapisanMarker.addLayer(marker);
    }
  }

  /* Dropdown filter: Beasiswa / Lomba / Semua */
  const filterPeta = document.getElementById("filterPeta");
  filterPeta.addEventListener("change", (kejadian) => {
    tampilkanMarker(kejadian.target.value);
  });

  tampilkanMarker("semua");
}

/* ------------------------------------------------------------
   7. HALAMAN KIRIM INFO — validasi di sisi peramban (browser)

   PENTING (jujur ke pengunjung): situs ini belum punya server,
   jadi data yang dikirim TIDAK disimpan ke mana pun.
   Notifikasi sukses di bawah hanya memberi tahu bahwa
   formulir sukses diisi.
   ------------------------------------------------------------ */
function pasangKirimInfo() {
  const form = document.getElementById("formKirim");
  const judul = document.getElementById("judul");
  const isi = document.getElementById("isi");
  const kategori = document.getElementById("kategori");
  const lampiran = document.getElementById("lampiran");
  const namaLampiran = document.getElementById("namaLampiran");
  const hitungKarakter = document.getElementById("hitungKarakter");
  const toast = document.getElementById("toast");

  const MAKS_KARAKTER = 5000;
  const BATAS_UNGGAH = 10 * 1024 * 1024; // 10 MB dalam satuan byte
  const TIPE_BOLEH = ["image/jpeg", "image/png", "application/pdf"]; // JPG, PNG, PDF

  /* Penghitung karakter di bawah textarea */
  isi.addEventListener("input", () => {
    hitungKarakter.textContent = `${isi.value.length} / ${MAKS_KARAKTER} karakter`;
  });

  /* Nama file unggahan ditampilkan setelah dipilih */
  lampiran.addEventListener("change", () => {
    const file = lampiran.files[0];
    namaLampiran.textContent = file ? file.name : "";
  });

  /* Nyalakan/matikan pesan kesalahan satu kolom formulir */
  function tandaiSalah(idKolom, sah) {
    document.getElementById(idKolom).classList.toggle("salah", !sah);
    return sah;
  }

  /* Saat tombol Kirim ditekan */
  form.addEventListener("submit", (kejadian) => {
    kejadian.preventDefault(); // jangan kirim dan jangan muat ulang halaman

    /* Semua peraturan formulir — pola: semua kolom dicek di satu tempat */
    const file = lampiran.files[0];
    const fileSah =
      !file || // lampiran memang tidak wajib
      (TIPE_BOLEH.includes(file.type) && file.size <= BATAS_UNGGAH);

    const sahKeseluruhan =
      tandaiSalah("kolomJudul", judul.value.trim() !== "") &&
      tandaiSalah(
        "kolomIsi",
        isi.value.trim().length > 0 && isi.value.trim().length <= MAKS_KARAKTER,
      ) &&
      tandaiSalah("kolomKategori", kategori.value !== "") &&
      tandaiSalah("kolomLampiran", fileSah);

    if (!sahKeseluruhan) return;

    /* Lolos validasi → perlihatkan notifikasi; tidak ada data yang pergi
       ke mana pun (situs belum punya server). */
    toast.classList.add("tampil");
    setTimeout(() => toast.classList.remove("tampil"), 6000); // sembunyikan 6 detik lagi
  });

  /* Tombol Reset: kosongkan juga teks bantuan & penghitung */
  form.addEventListener("reset", () => {
    namaLampiran.textContent = "";
    hitungKarakter.textContent = `0 / ${MAKS_KARAKTER} karakter`;
    ["kolomJudul", "kolomIsi", "kolomKategori", "kolomLampiran"].forEach((id) =>
      document.getElementById(id).classList.remove("salah"),
    );
  });
}

/* ------------------------------------------------------------
   8. INISIALISASI — baca tanda halaman, jalankan bagian yang cocok

   document.body.dataset.halaman membaca atribut HTML:
   <body data-halaman="beasiswa">  →  dataset.halaman berisi "beasiswa"
   ------------------------------------------------------------ */
pasangTombolMenu(); // navbar ada di semua halaman
pasangMenuKatalog(); // dropdown "Katalog ▾" juga di semua halaman

if (document.body.dataset.halaman === "beasiswa") {
  pasangHalamanPeluang(beasiswa);
} else if (document.body.dataset.halaman === "lomba") {
  pasangHalamanPeluang(lomba);
} else if (document.body.dataset.halaman === "beranda") {
  pasangBeranda();
} else if (document.body.dataset.halaman === "dashboard") {
  pasangDashboard();   // angka ringkasan
  pasangGrafik();      // diagram donat Highcharts
  pasangTabelData();   // tabel data lengkap
} else if (document.body.dataset.halaman === "peta") {
  pasangPeta();
} else if (document.body.dataset.halaman === "kirim-info") {
  pasangKirimInfo();
}
/* Tentang halaman "tentang" tidak butuh JavaScript — navbar dan footer cukup */
