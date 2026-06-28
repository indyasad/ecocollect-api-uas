# EcoCollect - Web API Bank Sampah Digital

EcoCollect adalah project Web API dan frontend sederhana untuk tugas UTS. Tema aplikasi adalah **Bank Sampah Digital**, yaitu sistem yang membantu nasabah mencatat setoran sampah, melihat saldo, menarik saldo, dan melihat ringkasan transaksi.

Project ini dibuat sebagai backend endpoint/API untuk aplikasi mobile dan sudah dilengkapi dengan frontend web berbasis JavaScript agar dapat ditampilkan lewat browser.

## Pemenuhan Ketentuan Tugas

| No | Ketentuan | Status |
|---|---|---|
| 1 | Project web sesuai judul dan tidak sama | Judul: EcoCollect - Web API Bank Sampah Digital |
| 2 | Backend endpoints/API untuk aplikasi mobile | Tersedia REST API dan route list |
| 3 | Postman collection | Tersedia file `postman_collection.json` |
| 4 | Source code siap upload ke GitHub public | Semua source code sudah dalam satu folder project |
| 5 | Frontend web Laravel/JS | Tersedia frontend JS di route `/web` |
| 6 | Dokumentasi PDF dan panduan video | Tersedia di folder `docs/` |

## Teknologi

- Node.js native HTTP server
- JavaScript
- JSON file database (`data/db.json`)
- Token authentication berbasis JWT sederhana
- Postman collection
- Frontend HTML, CSS, dan JavaScript

Project ini tidak membutuhkan dependency eksternal sehingga bisa langsung dijalankan setelah Node.js terpasang.

## Cara Menjalankan

```bash
npm start
```

Server berjalan di:

```bash
http://localhost:3000
```

## Konfigurasi Path Database

Secara default aplikasi menyimpan data ke `data/db.json`. Jika folder project berada di OneDrive atau mengandung karakter non-ASCII yang membuat penulisan file gagal, Anda dapat mengatur path database alternatif dengan variabel lingkungan:

```bash
set ECOCOLLECT_DB_PATH=C:\Users\acera\AppData\Local\ecocollect-api-uas\data\db.json
npm start
```

Atau di PowerShell:

```powershell
$env:ECOCOLLECT_DB_PATH = 'C:\Users\acera\AppData\Local\ecocollect-api-uas\data\db.json'
npm start
```

Variabel ini memaksa aplikasi menggunakan path database yang lebih aman.

## Route Penting

| Route | Fungsi |
|---|---|
| `GET /` | Menampilkan informasi API dan route list |
| `GET /api/routes` | Menampilkan daftar endpoint API |
| `GET /web` | Menampilkan frontend web EcoCollect |

## Daftar Endpoint API

Public endpoint:

1. `POST /api/auth/register` - Registrasi user baru
2. `POST /api/auth/login` - Login dan mendapatkan token

Protected endpoint, wajib header `Authorization: Bearer <token>`:

3. `GET /api/profile` - Melihat profil user login
4. `PUT /api/profile` - Mengubah profil user login
5. `GET /api/categories` - Melihat daftar kategori sampah
6. `POST /api/categories` - Menambah kategori sampah
7. `GET /api/deposits` - Melihat riwayat setoran sampah
8. `POST /api/deposits` - Membuat transaksi setoran sampah
9. `GET /api/withdrawals` - Melihat riwayat penarikan saldo
10. `POST /api/withdrawals` - Membuat transaksi penarikan saldo
11. `GET /api/balance` - Melihat saldo user
12. `GET /api/dashboard` - Melihat ringkasan dashboard

## Cara Testing Otomatis

Pastikan server berjalan, lalu jalankan terminal kedua:

```bash
npm run test:endpoints
```

Hasil pengujian akan tersimpan di:

```bash
docs/endpoint-test-results.txt
```

## Cara Testing di Postman

1. Buka Postman.
2. Import file `postman_collection.json`.
3. Jalankan request `0. Route List API`.
4. Jalankan request `1. Register`.
5. Jalankan request `2. Login`.
6. Token otomatis tersimpan ke variable collection `token`.
7. Jalankan endpoint protected lain secara berurutan.
8. Buka `13. Frontend Web` atau akses langsung `http://localhost:3000/web`.

## Struktur Folder

```text
ecocollect-api-uts/
├── data/
│   └── db.json
├── docs/
│   ├── endpoint-test-results.txt
│   ├── laporan_final_ecocollect_uts.pdf
│   └── naskah_video_penjelasan_5_menit.md
├── public/
│   ├── index.html
│   └── app.js
├── scripts/
│   └── test-endpoints.sh
├── src/
│   ├── config.js
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   ├── router.js
│   └── utils/
├── postman_collection.json
├── package.json
└── server.js
```

## Upload ke GitHub

```bash
git init
git add .
git commit -m "UTS EcoCollect Web API"
git branch -M main
git remote add origin https://github.com/USERNAME/ecocollect-api-uts.git
git push -u origin main
```

Pastikan repository GitHub dibuat dengan status **Public**.

## Catatan Pengumpulan

Yang dikumpulkan ke myswu dalam PDF:

- Judul project
- Link GitHub public
- Link video penjelasan minimal 5 menit
- Link/penjelasan frontend web
- Bukti route list/API dan Postman collection
- Ringkasan fitur dan endpoint
