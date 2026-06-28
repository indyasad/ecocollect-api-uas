# Naskah Video Penjelasan Minimal 5 Menit

Gunakan naskah ini sebagai panduan. Saat merekam, pastikan wajah terlihat, suara asli, dan layar project ikut ditampilkan.

## 0:00 - 0:30 Pembukaan

Assalamualaikum/selamat pagi. Perkenalkan nama saya .... Pada video ini saya akan menjelaskan project UTS saya yang berjudul EcoCollect - Web API Bank Sampah Digital. Project ini dibuat sebagai backend endpoint/API untuk aplikasi mobile dan juga memiliki frontend web sederhana menggunakan JavaScript.

## 0:30 - 1:15 Penjelasan Ide Aplikasi

EcoCollect adalah aplikasi Bank Sampah Digital. Fitur utamanya adalah registrasi nasabah, login menggunakan token, melihat profil, melihat kategori sampah, melakukan setoran sampah, melihat saldo, melakukan penarikan saldo, dan melihat dashboard ringkasan transaksi.

## 1:15 - 2:00 Struktur Project

Sekarang saya tunjukkan struktur foldernya. Ada folder src untuk source code backend, controllers untuk logika fitur, middleware untuk autentikasi token, database untuk membaca dan menulis file JSON, public untuk frontend web, scripts untuk testing endpoint otomatis, docs untuk dokumentasi, serta postman_collection.json untuk pengujian lewat Postman.

## 2:00 - 2:45 Menjalankan Server

Untuk menjalankan project, saya membuka terminal lalu mengetik npm start. Setelah itu server berjalan di localhost port 3000. Ketika membuka alamat http://localhost:3000 atau http://localhost:3000/api/routes, sistem menampilkan route list API yang berisi daftar endpoint.

## 2:45 - 3:45 Testing API di Postman

Selanjutnya saya membuka Postman dan meng-import file postman_collection.json. Pertama saya menjalankan endpoint Route List API. Setelah itu saya menjalankan endpoint Register untuk membuat user baru. Kemudian saya menjalankan endpoint Login untuk mendapatkan token. Token tersebut digunakan pada endpoint protected seperti profile, categories, deposits, withdrawals, balance, dan dashboard.

## 3:45 - 4:40 Menjelaskan Frontend Web

Sekarang saya membuka frontend web di http://localhost:3000/web. Pada halaman ini terdapat form registrasi, form login, dashboard saldo, tambah kategori sampah, setoran sampah, penarikan saldo, profil user, riwayat setoran, dan riwayat penarikan. Frontend ini menggunakan JavaScript fetch untuk memanggil backend API.

## 4:40 - 5:20 Penjelasan Alur Sistem

Alur sistemnya adalah user melakukan registrasi, kemudian login untuk mendapatkan token. Token disimpan di browser dan dipakai pada request berikutnya. Ketika user membuat setoran sampah, sistem menghitung total nilai berdasarkan berat dan harga per kilogram kategori sampah. Nilai tersebut menambah saldo user. Jika user melakukan penarikan, saldo akan berkurang sesuai nominal penarikan.

## 5:20 - 5:50 Penjelasan GitHub dan Dokumentasi

Source code project ini saya upload ke GitHub dengan repository public. Di dalam repository terdapat source code, route API, frontend, dokumentasi, hasil testing endpoint, dan Postman collection.

## 5:50 - 6:00 Penutup

Demikian penjelasan project EcoCollect - Web API Bank Sampah Digital. Terima kasih.
