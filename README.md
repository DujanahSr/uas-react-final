# ✈️ FlyBook - Aplikasi Booking Tiket Pesawat

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF.svg)](https://vitejs.dev/)
[![PNPM](https://img.shields.io/badge/PNPM-8.0.0-F69220.svg)](https://pnpm.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-38B2AC.svg)](https://tailwindcss.com/)

> Platform booking tiket pesawat modern dengan antarmuka yang intuitif dan fitur lengkap untuk pengguna dan administrator.

## 📋 Deskripsi

FlyBook adalah aplikasi web booking tiket pesawat yang dibangun dengan teknologi React dan Vite. Aplikasi ini menyediakan pengalaman booking yang mudah dan aman dengan fitur-fitur lengkap untuk pengguna biasa dan panel administrasi yang powerful.

### 🎯 Tujuan Aplikasi
- Memudahkan pengguna dalam mencari dan membooking tiket pesawat
- Menyediakan platform yang aman dan terpercaya untuk transaksi penerbangan
- Memberikan kontrol penuh kepada admin untuk mengelola sistem
- Menawarkan pengalaman user yang modern dan responsif

## 🚀 Fitur-Fitur Utama

### 👤 **Fitur untuk Pengguna (User)**

#### 🔍 **Pencarian & Booking**
- **Pencarian Penerbangan**: Cari penerbangan berdasarkan rute, tanggal, dan jumlah penumpang
- **Filter & Sorting**: Filter berdasarkan maskapai, harga, durasi, dan waktu keberangkatan
- **Detail Penerbangan**: Informasi lengkap tentang penerbangan termasuk fasilitas dan harga
- **Multi-Class Booking**: Pilih kelas Economy, Business, atau First Class

#### 📋 **Manajemen Booking**
- **Riwayat Pemesanan**: Lihat semua booking dengan status real-time
- **Detail Booking**: Informasi lengkap booking termasuk E-Ticket
- **Update Profil**: Kelola informasi pribadi dan preferensi
- **Refund System**: Ajukan refund dengan alasan yang jelas

#### 🔐 **Keamanan & Autentikasi**
- **Login/Register**: Sistem autentikasi yang aman
- **Session Management**: Manajemen sesi yang terproteksi
- **Password Recovery**: Fitur pemulihan password (simulasi)

### 👨‍💼 **Fitur untuk Administrator (Admin)**

#### 📊 **Dashboard & Analytics**
- **Dashboard Overview**: Statistik real-time pemesanan dan penerbangan
- **Revenue Analytics**: Analisis pendapatan dan performa
- **Booking Trends**: Tren pemesanan dan pola pengguna

#### ✈️ **Manajemen Penerbangan**
- **CRUD Penerbangan**: Tambah, edit, hapus, dan lihat penerbangan
- **Flight Details**: Informasi lengkap penerbangan dengan fasilitas
- **Bulk Operations**: Operasi massal untuk efisiensi

#### 📋 **Manajemen Booking**
- **Booking Oversight**: Pantau semua pemesanan
- **Status Management**: Update status booking (Pending → Confirmed → Completed)
- **Refund Processing**: Approve/reject permintaan refund dengan alasan
- **Customer Support**: Alat bantu layanan pelanggan

#### ⚙️ **Pengaturan Sistem**
- **Display Settings**: Konfigurasi tampilan dan pagination
- **Format Settings**: Pengaturan mata uang dan format tanggal
- **Password Management**: Ganti password admin
- **Data Backup/Restore**: Backup dan restore data sistem

### 🎨 **Fitur UI/UX**

#### 🌙 **Tema & Desain**
- **Dark/Light Mode**: Dukungan tema gelap dan terang
- **Responsive Design**: Optimal di desktop, tablet, dan mobile
- **Modern UI**: Antarmuka yang clean dan intuitif
- **Smooth Animations**: Animasi yang halus dan menarik

#### 🔧 **Teknis**
- **Real-time Updates**: Update data secara real-time
- **Persistent Settings**: Pengaturan tersimpan di localStorage
- **Error Handling**: Penanganan error yang comprehensive
- **Loading States**: Indikator loading untuk UX yang baik

## 🛠️ Teknologi & Tools

### **Frontend Stack**
- **React 18** - Library JavaScript untuk UI
- **Vite** - Build tool dan dev server yang cepat
- **TailwindCSS** - Framework CSS utility-first
- **React Router** - Routing untuk SPA
- **React Icons** - Icon library yang lengkap

### **State Management**
- **React Hooks**: useState, useEffect, useContext
- **Context API**: State management global
- **LocalStorage**: Persistent data storage

### **Development Tools**
- **PNPM**: Package manager yang efisien
- **ESLint**: Code linting dan formatting
- **Git**: Version control
- **VS Code**: IDE development


## 👥 Cara Penggunaan

### **Untuk Pengguna**
1. **Register/Login**: Buat akun atau login dengan kredensial yang ada
2. **Cari Penerbangan**: Gunakan form pencarian di halaman Home
3. **Pilih Penerbangan**: Klik detail untuk melihat informasi lengkap
4. **Booking**: Isi data penumpang dan lakukan pembayaran
5. **Kelola Booking**: Pantau status di halaman "Riwayat Pemesanan"

### **Untuk Admin**
1. **Login Admin**: Gunakan email `admin@gmail.com` dan password `admin123`
2. **Dashboard**: Pantau statistik dan aktivitas sistem
3. **Kelola Penerbangan**: Tambah/edit/hapus data penerbangan
4. **Proses Booking**: Approve booking dan handle refund
5. **Pengaturan**: Konfigurasi sistem sesuai kebutuhan


### **Admin Credentials (Default)**
- **Email**: admin@gmail.com
- **Password**: admin123

### **User Demo Account**
- **Email**: user@example.com
- **Password**: user123

## 📊 Fitur Data Management

### **LocalStorage Keys**
- `flights`: Data penerbangan
- `bookings`: Data pemesanan
- `adminDisplaySettings`: Pengaturan tampilan admin
- `adminFormatSettings`: Pengaturan format admin
- `adminSession`: Session admin
- `userSession`: Session user

### **Data Backup**
Admin dapat melakukan backup data melalui menu Settings → Backup & Restore

## 🐛 Troubleshooting

### **Common Issues**

**1. Data tidak muncul**
```bash
# Clear localStorage
localStorage.clear()
# Reload halaman
```

**2. Login gagal**
- Pastikan kredensial benar
- Cek sessionStorage untuk admin/user session

**3. Build error**
```bash
# Clear cache dan reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## 👨‍💻 Developer

**Abu** - *Full Stack Developer*
- GitHub: [@abu-dev](https://github.com/abu-dev)
- LinkedIn: [Abu Developer](https://linkedin.com/in/abu-dev)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Library
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework
- [React Icons](https://react-icons.github.io/react-icons/) - Icon Library
- [Vite](https://vitejs.dev/) - Build Tool

