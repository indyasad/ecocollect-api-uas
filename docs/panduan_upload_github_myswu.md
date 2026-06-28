# Panduan Upload GitHub dan myswu

## 1. Upload Source Code ke GitHub Public

1. Login ke GitHub.
2. Buat repository baru, contoh nama: `ecocollect-api-uts`.
3. Pilih visibility: Public.
4. Buka terminal di folder project.
5. Jalankan perintah berikut:

```bash
git init
git add .
git commit -m "UTS EcoCollect Web API"
git branch -M main
git remote add origin https://github.com/USERNAME/ecocollect-api-uts.git
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub masing-masing.

## 2. Upload Postman Collection ke GitHub

File `postman_collection.json` sudah ada di folder utama project. Karena file tersebut ikut di-commit, maka otomatis akan tampil di GitHub.

## 3. Membuat Video Minimal 5 Menit

Isi video yang disarankan:

1. Perkenalan dan judul project.
2. Tunjukkan wajah dan suara asli.
3. Tunjukkan struktur folder project.
4. Jalankan server dengan `npm start`.
5. Tunjukkan route list `http://localhost:3000/api/routes`.
6. Test endpoint di Postman.
7. Tampilkan frontend web `http://localhost:3000/web`.
8. Jelaskan alur registrasi, login token, setoran, penarikan, saldo, dan dashboard.
9. Tunjukkan repository GitHub public.

## 4. Isi PDF untuk myswu

PDF yang diupload ke myswu sebaiknya memuat:

- Nama, NIM, kelas.
- Judul project.
- Deskripsi singkat aplikasi.
- Teknologi yang digunakan.
- Daftar endpoint.
- Cara menjalankan.
- Link GitHub public.
- Link video penjelasan.
- Bukti adanya Postman collection.
