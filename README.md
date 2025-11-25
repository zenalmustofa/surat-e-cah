# Pemrograman Website - Vibe Coding
| Nama Lengkap | NRP |
| :--- | :--- |
| Zaenal Mustofa | 5027241018 |

# 🇮🇩 Surat-E Cah: Sistem Persuratan Desa Digital

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![MERN Stack](https://img.shields.io/badge/Stack-MERN-success)

**Surat-E Cah** adalah aplikasi web modern yang dirancang untuk mendigitalisasi proses administrasi surat pengantar di tingkat desa/kelurahan. Aplikasi ini memangkas birokrasi manual menjadi sistem yang transparan, cepat, dan *paperless*.

---

## 🚩 Masalah yang Diselesaikan (Problem Statement)

Dalam sistem pelayanan desa konvensional, sering ditemukan kendala berikut:
* **Antrian Manual:** Warga harus datang dan antri hanya untuk mengajukan surat sederhana.
* **Kurangnya Transparansi:** Warga tidak tahu sampai mana proses surat mereka (apakah sudah diproses atau belum).
* **Beban Administrasi:** Perangkat desa harus mengetik ulang data yang sama berulang kali ke dalam format surat.
* **Arsip Berantakan:** Data pemohon sering kali hanya dicatat di buku tulis yang rawan hilang atau rusak.

## 💡 Solusi Kami (Solution Overview)

Surat-E Cah hadir dengan pendekatan **"Guest Mode"** untuk warga dan **"Centralized Dashboard"** untuk admin:

1.  **Akses Warga Tanpa Login:** Memudahkan warga (terutama lansia/gaptek) untuk mengajukan surat tanpa perlu mendaftar akun email yang rumit. Cukup isi NIK dan Upload KTP.
2.  **Sistem Pelacakan (Tracking ID):** Mengadopsi sistem resi ekspedisi. Warga mendapat Kode Unik untuk mengecek status surat secara mandiri dari rumah.
3.  **Otomatisasi Admin:** Admin dapat mencetak surat resmi (PDF) dan laporan bulanan (Excel) hanya dengan satu klik.

---

## 🛠️ Tech Stack

Aplikasi ini dibangun menggunakan **MERN Stack**:

* **Frontend:** React.js, CSS3 (Custom Responsive Grid & Flexbox).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (Mongoose ODM).
* **Authentication:** JWT (JSON Web Token) untuk keamanan Admin.
* **Libraries Utama:**
    * `jspdf`: Generator Surat Pengantar otomatis.
    * `xlsx`: Export data rekapitulasi ke Excel.
    * `multer`: Manajemen upload file (KTP/KK).
    * `axios`: Integrasi API.

---

## ✨ Fitur Utama

### 🏠 Sisi Warga (Public)
- [x] **Pengajuan Surat Online:** Form responsif untuk berbagai jenis surat (SKCK, Domisili, Usaha, dll).
- [x] **Upload Dokumen:** Dukungan upload foto KTP/KK (Validasi tipe & ukuran file).
- [x] **Cek Status (Tracking):** Melacak progres surat menggunakan Kode Lacak unik.
- [x] **Notifikasi Status:** Menampilkan pesan khusus dari admin (misal: "Ditolak karena foto buram" atau "Silakan ambil di kantor").

### 🔐 Sisi Admin (Dashboard)
- [x] **Real-time Analytics:** Dashboard visual untuk memantau jumlah surat masuk, diproses, dan selesai.
- [x] **Manajemen Status:** Update status surat (Diajukan -> Diproses -> Siap Diambil -> Selesai).
- [x] **Cetak Otomatis (PDF):** Generate surat resmi siap print dengan format standar desa.
- [x] **Export Laporan (Excel):** Unduh rekapitulasi data untuk laporan bulanan.
- [x] **Validasi Berkas:** Melihat lampiran KTP/KK pemohon langsung dari dashboard.

---

## 🚀 Cara Menjalankan Project (Setup Instructions)

Ikuti langkah ini untuk menjalankan proyek di komputer lokal (Localhost).

### Prasyarat
* Node.js & NPM terinstal.
* MongoDB terinstal dan berjalan (atau gunakan MongoDB Atlas).

### 1. Clone Repository
```bash
git clone [https://github.com/username-anda/surat-e-cah.git](https://github.com/username-anda/surat-e-cah.git)
cd surat-e-cah
````

### 2\. Setup Backend

```bash
cd backend
npm install

# Buat file .env
# Isi .env dengan:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/persuratan_desa
# JWT_SECRET=rahasia_anda_bebas

# Jalankan Server
node server.js
```

*Server akan berjalan di http://localhost:5000*

### 3\. Setup Frontend

Buka terminal baru (jangan matikan terminal backend).

```bash
cd frontend
npm install

# Jalankan React
npm start
```

*Aplikasi akan terbuka otomatis di http://localhost:3000*

-----

## 📸 Dokumentasi

