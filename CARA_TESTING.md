# 🧪 CARA TESTING SISTEM PEMESANAN TIKET

## 📋 Daftar Isi
1. [Persiapan Testing](#persiapan-testing)
2. [Testing Data Persistence](#testing-data-persistence)
3. [Testing Login Bersamaan](#testing-login-bersamaan)
4. [Testing Flow Lengkap](#testing-flow-lengkap)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 Persiapan Testing

### 1. Clear Data (Opsional - untuk testing dari awal)
Jika ingin memulai dari awal, buka **Browser Console** (F12) dan jalankan:
```javascript
// Clear semua data
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### 2. Credentials untuk Testing

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**User:**
- Daftar dulu di halaman Register
- Atau gunakan user yang sudah terdaftar

---

## 💾 Testing Data Persistence

### Test 1: Data Tidak Hilang Saat Refresh

1. **Login sebagai User**
   - Login dengan akun user
   - Lakukan booking tiket
   - Refresh halaman (F5)
   - ✅ **Expected:** Data booking masih ada di "Riwayat Pemesanan"

2. **Login sebagai Admin**
   - Login sebagai admin
   - Lihat data pemesanan di "Kelola Pemesanan"
   - Refresh halaman (F5)
   - ✅ **Expected:** Data pemesanan masih ada

### Test 2: Data Tersimpan di localStorage

1. Buka **Browser Console** (F12)
2. Jalankan:
```javascript
// Cek data bookings
const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
console.log('Bookings:', bookings);

// Cek data flights
const flights = JSON.parse(localStorage.getItem('flights') || '[]');
console.log('Flights:', flights);

// Cek user session
const user = JSON.parse(localStorage.getItem('user') || 'null');
console.log('User:', user);

// Cek admin session
const admin = JSON.parse(sessionStorage.getItem('adminSession') || 'null');
console.log('Admin:', admin);
```

3. ✅ **Expected:** Data bookings dan flights tersimpan dengan benar

---

## 👥 Testing Login Bersamaan

### Test 3: Login User dan Admin Bersamaan

**Metode 1: Menggunakan Tab Berbeda (Recommended)**

1. **Tab 1 - Login User:**
   - Buka aplikasi di Tab 1
   - Login sebagai user
   - Lakukan booking tiket
   - ✅ **Expected:** Booking berhasil dan muncul di "Riwayat Pemesanan"

2. **Tab 2 - Login Admin:**
   - Buka aplikasi di Tab 2 (atau window baru)
   - Login sebagai admin
   - Buka halaman "Kelola Pemesanan"
   - ✅ **Expected:** Data booking dari user di Tab 1 muncul di admin

3. **Test Update Status:**
   - Di Tab 2 (Admin), ubah status booking menjadi "Confirmed"
   - Kembali ke Tab 1 (User), refresh halaman
   - ✅ **Expected:** Status booking di user berubah menjadi "Confirmed"

**Metode 2: Menggunakan Incognito/Private Window**

1. Buka aplikasi di window normal (login sebagai user)
2. Buka aplikasi di incognito window (login sebagai admin)
3. Test flow yang sama seperti di atas

### Test 4: Sync Antar Tab

1. Login user di Tab 1, lakukan booking
2. Login admin di Tab 2, lihat booking
3. Di Tab 2 (Admin), ubah status booking
4. Di Tab 1 (User), refresh halaman
5. ✅ **Expected:** Status terupdate otomatis (dengan refresh)

---

## 🔄 Testing Flow Lengkap

### Test 5: Flow User Booking → Admin Konfirmasi

1. **User Side:**
   - Login sebagai user
   - Cari tiket (misal: Jakarta → Denpasar)
   - Pilih tiket dan lakukan booking
   - Isi data penumpang dan kontak
   - Selesaikan booking
   - ✅ **Expected:** Status booking = "Pending"

2. **Admin Side:**
   - Login sebagai admin (di tab/window lain)
   - Buka "Kelola Pemesanan"
   - ✅ **Expected:** Booking dari user muncul dengan status "Pending"
   - Ubah status menjadi "Confirmed"
   - ✅ **Expected:** Status berubah menjadi "Confirmed"

3. **Kembali ke User:**
   - Refresh halaman "Riwayat Pemesanan"
   - ✅ **Expected:** Status booking berubah menjadi "Confirmed"

### Test 6: Multiple Bookings

1. Login sebagai user
2. Lakukan 3-5 booking berbeda
3. Login sebagai admin (di tab lain)
4. ✅ **Expected:** Semua booking muncul di admin
5. Ubah status beberapa booking
6. Kembali ke user, refresh
7. ✅ **Expected:** Semua perubahan status terlihat

---

## 🔧 Troubleshooting

### Masalah: Data Hilang Saat Refresh

**Solusi:**
1. Cek Browser Console untuk error
2. Pastikan localStorage tidak di-block oleh browser
3. Cek apakah ada extension yang menghapus localStorage
4. Coba clear dan reload:
```javascript
localStorage.clear();
location.reload();
```

### Masalah: Data Tidak Sync Antar Tab

**Solusi:**
1. Pastikan kedua tab menggunakan domain yang sama
2. Refresh kedua tab
3. Cek Browser Console untuk error
4. Pastikan storage event listener berfungsi

### Masalah: Tidak Bisa Login Bersamaan

**Solusi:**
1. Pastikan user login di localStorage (tab 1)
2. Pastikan admin login di sessionStorage (tab 2)
3. Gunakan tab/window yang berbeda
4. Jangan logout salah satu sebelum test selesai

### Masalah: Booking Tidak Muncul di Admin

**Solusi:**
1. Pastikan booking sudah tersimpan:
```javascript
const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
console.log('Total bookings:', bookings.length);
```
2. Refresh halaman admin
3. Pastikan filter/search tidak menyembunyikan data
4. Cek apakah email user sesuai

---

## 📝 Catatan Penting

1. **localStorage vs sessionStorage:**
   - `localStorage`: Data persisten, tidak hilang saat tutup browser (untuk user dan bookings)
   - `sessionStorage`: Data hilang saat tutup tab/window (untuk admin session)

2. **Data Sharing:**
   - Bookings dan flights disimpan di `localStorage` yang **shared** antar tab
   - User session di `localStorage` (persisten)
   - Admin session di `sessionStorage` (per tab)

3. **Testing Best Practice:**
   - Gunakan 2 tab/window untuk testing login bersamaan
   - Refresh halaman setelah perubahan untuk melihat update
   - Gunakan Browser Console untuk debugging

4. **Clear Data:**
   - Jika ingin reset semua data: `localStorage.clear()`
   - Jika ingin reset hanya bookings: `localStorage.removeItem('bookings')`
   - Jika ingin reset hanya user: `localStorage.removeItem('user')`

---

## ✅ Checklist Testing

- [ ] Data tidak hilang saat refresh (user)
- [ ] Data tidak hilang saat refresh (admin)
- [ ] Booking user muncul di admin
- [ ] Update status di admin terlihat di user
- [ ] Login bersamaan user dan admin berfungsi
- [ ] Data sync antar tab (dengan refresh)
- [ ] Multiple bookings berfungsi
- [ ] Filter dan search berfungsi
- [ ] Delete booking berfungsi

---

**Selamat Testing! 🎉**

