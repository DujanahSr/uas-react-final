# 🛫 FlyBook - Sistem Pemesanan Tiket Pesawat

Aplikasi web untuk pemesanan tiket pesawat dengan role User dan Admin, dibangun menggunakan React + Vite.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 atau lebih baru)
- **pnpm** (atau npm/yarn)

### Installation

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd uas-react-abu
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # atau
   npm install
   # atau
   yarn install
   ```

3. **Run development server**

   ```bash
   pnpm dev
   # atau
   npm run dev
   # atau
   yarn dev
   ```

4. **Buka browser**
   - Buka `http://localhost:5173` (atau port yang ditampilkan di terminal)

## 📋 Fitur Utama

### 👤 User Features

- ✅ Registrasi & Login
- ✅ Pencarian Penerbangan (Sekali Jalan & Pulang Pergi)
- ✅ Booking Tiket (Multi-step Form)
- ✅ Riwayat Pemesanan
- ✅ Profil User (Edit Data)
- ✅ E-Ticket

### 👨‍💼 Admin Features

- ✅ Dashboard dengan Statistik Real-time
- ✅ Kelola Penerbangan (CRUD)
- ✅ Kelola Pemesanan
- ✅ Analytics & Laporan
- ✅ Settings (Password, Display, Format, Backup)

## 🔐 Login Credentials

### Admin

- **Email:** `admin@example.com`
- **Password:** `admin123`

### User

- Daftar melalui halaman Register
- Atau gunakan akun yang sudah terdaftar

## 📁 Struktur Project

```
uas-react-abu/
├── src/
│   ├── components/       # Komponen reusable
│   ├── context/         # Context API (Auth, Data, Theme)
│   ├── data/            # Mock data & helper functions
│   ├── layouts/         # Layout components
│   ├── pages/           # Halaman aplikasi
│   │   ├── admin/       # Halaman admin
│   │   └── user/        # Halaman user
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static files
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

## 💾 Data Storage

Aplikasi menggunakan **localStorage** dan **sessionStorage** untuk menyimpan data:

- **localStorage:**

  - `flights` - Data penerbangan
  - `bookings` - Data pemesanan
  - `users` - Data user terdaftar
  - `user` - Session user yang login
  - `adminDisplaySettings` - Pengaturan tampilan admin
  - `adminFormatSettings` - Pengaturan format admin

- **sessionStorage:**
  - `adminSession` - Session admin yang login

## 🔄 Data Initialization

Saat pertama kali aplikasi dibuka:

1. Jika `localStorage.flights` kosong → Load dari `flightsData` (mockData.js) → Save ke localStorage
2. Jika `localStorage.bookings` kosong → Initialize dengan array kosong
3. Data akan otomatis tersedia untuk digunakan

## ✅ Compatibility

### Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)

### OS Support

- ✅ Windows
- ✅ macOS
- ✅ Linux

## 🛠️ Build untuk Production

```bash
pnpm build
# atau
npm run build
```

File hasil build akan ada di folder `dist/`

## 📝 Notes

1. **Data Persistence:**

   - Data tersimpan di browser localStorage
   - Data akan hilang jika clear browser data
   - Gunakan fitur Backup & Restore di Settings untuk backup data

2. **Portability:**

   - ✅ Semua dependencies sudah di `package.json`
   - ✅ Tidak ada hardcoded paths
   - ✅ Tidak ada environment variables
   - ✅ Semua import menggunakan relative paths
   - ✅ Data initialization otomatis dari mockData

3. **Cross-Platform:**
   - ✅ Aplikasi akan bekerja di laptop/OS manapun
   - ✅ Hanya perlu install Node.js dan dependencies
   - ✅ Tidak ada konfigurasi khusus yang diperlukan

## 🐛 Troubleshooting

### Data tidak muncul setelah git clone

**Solusi:**

- Data akan otomatis di-initialize dari `mockData.js` saat pertama kali buka
- Refresh halaman jika data belum muncul

### Error saat install dependencies

**Solusi:**

- Pastikan Node.js versi 18 atau lebih baru
- Hapus `node_modules` dan `pnpm-lock.yaml` (atau `package-lock.json`)
- Jalankan `pnpm install` lagi

### Port sudah digunakan

**Solusi:**

- Vite akan otomatis menggunakan port lain
- Atau stop aplikasi yang menggunakan port tersebut

## 📚 Dokumentasi

- `FLOWCHART_SISTEM.md` - Flowchart lengkap sistem
- `ALUR_SISTEM.md` - Dokumentasi alur sistem
- `CARA_TESTING.md` - Panduan testing

## 🎯 Tech Stack

- **React 19** - UI Framework
- **Vite** - Build Tool
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **React Icons** - Icons
- **localStorage/sessionStorage** - Data Persistence

---

**Dibuat dengan ❤️ untuk UAS React**
