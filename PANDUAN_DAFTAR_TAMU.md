# Cara Membuat Link Undangan Personal dari Google Sheets

Website ini menerima parameter `?to=Nama%20Tamu`. Teks pada cover otomatis menjadi nama penerima, **tanpa integrasi API atau Apps Script**.

## Cara paling mudah

1. Buat Google Sheets baru di https://sheets.google.com atau unggah `Template_Daftar_Tamu_Undangan.xlsx` ke Google Drive kemudian **Buka dengan Google Spreadsheet**.
2. Di tab **Daftar Tamu**, isi kolom **Nama Tamu** (kolom A) sesuai ejaan penerima; misalnya `Bapak Agus Sekeluarga`.
3. Kolom B otomatis membuat tautan yang bisa diklik, dan kolom C menghasilkan URL lengkap untuk disalin ke WhatsApp.
4. Salin URL kolom C per tamu. Jangan hapus rumus di kolom B dan C. Bila menambah lebih dari 200 tamu, tarik rumus ke baris bawah.
5. Untuk mengirim satu tautan: `https://nateq22.github.io/rachma-nateq-wedding/?to=Bapak%20Agus%20Sekeluarga`.

Nama tamu **tidak disimpan di database website**, hanya dibaca dari tautan `?to=...`. Google Sheets ini adalah *daftar/link generator*, bukan penyimpanan RSVP. RSVP masih butuh Apps Script dan endpoint di `config.js`.

## Upload pembaruan website

Ganti `index.html`, `style.css`, `script.js`, `config.js` pada root repository GitHub dengan file versi ini; folder `assets/` dan `.github/` tetap sesuai lokasi. **Penting:** Jika `config.js` online sudah memuat `googleScriptUrl`, salin nilainya dahulu ke file baru sebelum mengganti agar koneksi RSVP tidak terputus.

Cek deployment GitHub Actions, lalu refresh halaman website. Bagian Wedding Gift dan menu Hadiah sudah dihapus.
