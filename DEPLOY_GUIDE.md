# Project SME - Panduan Deploy GitHub Pages

Aplikasi ini dibuat menggunakan **React + Vite + TypeScript**.
Karena menggunakan React & TypeScript, browser membutuhkan file hasil **build (HTML + JS bundle)** yang ada di dalam folder `dist/`, bukan file mentah `.tsx`.

---

## 🚀 Cara 1: Menggunakan GitHub Actions (Paling Direkomendasikan & Otomatis)

1. Pastikan file `.github/workflows/deploy.yml` ada di repository Anda (sudah kami sediakan).
2. Buka repository Anda di browser: **GitHub** ➡️ **Settings** ➡️ **Pages**.
3. Di bagian **Build and deployment** ➡️ **Source**, pilih **GitHub Actions**.
4. Klik tab **Actions** di atas, Anda akan melihat workflow **Deploy to GitHub Pages** berjalan otomatis me-build file dan melakukan publish.
5. Tunggu sampai ada centang hijau (selesai ~1 menit), klik URL yang diberikan.

---

## 📦 Cara 2: Build Manual di Laptop / Komputer Anda

Jika Anda ingin mengupload langsung tanpa GitHub Actions:

1. Jalankan perintah ini di terminal:
   ```bash
   npm install
   npm run build
   ```
2. Anda akan mendapatkan folder baru bernama `dist`.
3. Folder `dist` itulah yang berisi website siap pakai. Anda bisa upload isi folder `dist` tersebut ke branch `gh-pages` atau hosting manapun.
