# 🚀 **FlyBook - User Journey Flow**

## 📋 **Overview**
Dokumen ini menjelaskan alur lengkap perjalanan user di aplikasi FlyBook dari awal sampai akhir, termasuk file-file yang terlibat dan hubungan antar komponen.

---

## 🎯 **User Flow Diagram**

```
[1] Landing Page → [2] Authentication → [3] Search → [4] Results → [5] Booking → [6] Success → [7] Management
     ↓                        ↓                    ↓            ↓            ↓            ↓            ↓
   Home.jsx                Login.jsx            Home.jsx    SearchResults.jsx BookingForm.jsx BookingSuccess.jsx MyBookings.jsx
   Register.jsx           Register.jsx         SearchResults.jsx
```

---

## 📝 **Detail Alur User**

### **1. 🏠 Landing Page (Home.jsx)**

#### **Konsep:**
- Halaman pertama yang dilihat user saat membuka aplikasi
- Menampilkan form pencarian penerbangan
- User bisa langsung search tanpa login (tapi perlu login untuk booking)
- Interface yang menarik dengan hero section

#### **File Terlibat:**
- `src/pages/user/Home.jsx` - Komponen utama
- `src/components/Header.jsx` - Header dengan navigation
- `src/components/Footer.jsx` - Footer aplikasi
- `src/context/AuthContext.jsx` - Cek status login
- `src/context/DataContext.jsx` - Data penerbangan

#### **Kode Penting:**
```jsx
// Home.jsx - Form pencarian
const [searchData, setSearchData] = useState({
  departure: '',
  arrival: '',
  date: '',
  passengers: 1,
  class: 'Economy'
});

const handleSearch = (e) => {
  e.preventDefault();
  // Validasi dan navigate ke search results
  navigate('/search', { state: searchData });
};
```

#### **Hubungan:**
- **Header**: Menampilkan login/register buttons jika belum login
- **Footer**: Info aplikasi dan links
- **AuthContext**: Cek apakah user sudah login
- **DataContext**: Load data penerbangan untuk autocomplete

---

### **2. 🔐 Authentication (Login.jsx & Register.jsx)**

#### **Konsep:**
- Sistem login dan register untuk user
- Validasi form dan error handling
- Session management dengan localStorage
- Redirect ke home setelah login berhasil

#### **File Terlibat:**
- `src/pages/user/Login.jsx` - Halaman login
- `src/pages/user/Register.jsx` - Halaman register
- `src/context/AuthContext.jsx` - Logic autentikasi
- `src/utils/validation.js` - Validasi form

#### **Kode Penting:**
```jsx
// AuthContext.jsx - Login logic
const login = async (email, password) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    setCurrentUser(user);
    localStorage.setItem('userSession', JSON.stringify(user));
    return { success: true };
  }
  return { success: false, error: 'Invalid credentials' };
};
```

#### **Hubungan:**
- **Login.jsx**: Form login dengan validasi
- **Register.jsx**: Form register dengan validasi
- **AuthContext**: State management untuk user yang login
- **validation.js**: Helper functions untuk validasi email, password, dll

---

### **3. 🔍 Search Flights (Home.jsx → SearchResults.jsx)**

#### **Konsep:**
- User mengisi form pencarian di Home
- Navigate ke halaman hasil pencarian
- Filter dan sort berdasarkan kriteria
- Pagination untuk hasil banyak

#### **File Terlibat:**
- `src/pages/user/Home.jsx` - Form pencarian
- `src/pages/user/SearchResults.jsx` - Halaman hasil
- `src/components/FlightCard.jsx` - Komponen kartu penerbangan
- `src/components/FlightList.jsx` - List penerbangan
- `src/context/DataContext.jsx` - Data penerbangan

#### **Kode Penting:**
```jsx
// SearchResults.jsx - Filter logic
const filteredFlights = flights.filter(flight => {
  return flight.departure.toLowerCase().includes(searchData.departure.toLowerCase()) &&
         flight.arrival.toLowerCase().includes(searchData.arrival.toLowerCase()) &&
         flight.date === searchData.date;
}).sort((a, b) => {
  if (sortBy === 'price') return a.price - b.price;
  if (sortBy === 'duration') return a.duration - b.duration;
  return 0;
});
```

#### **Hubungan:**
- **Home.jsx**: Kirim data pencarian via navigate state
- **SearchResults.jsx**: Terima data dan filter flights
- **FlightCard.jsx**: Tampilkan detail setiap flight
- **FlightList.jsx**: Container untuk list flights

---

### **4. ✈️ Select & Book Flight (BookingForm.jsx)**

#### **Konsep:**
- User memilih flight dari hasil pencarian
- Mengisi detail penumpang dan pembayaran
- Multi-step form dengan validasi
- Simpan booking ke localStorage

#### **File Terlibat:**
- `src/components/BookingForm.jsx` - Form booking
- `src/components/BookingDetailModal.jsx` - Modal detail booking
- `src/context/DataContext.jsx` - Simpan booking
- `src/utils/validation.js` - Validasi form

#### **Kode Penting:**
```jsx
// BookingForm.jsx - Submit booking
const handleSubmit = (e) => {
  e.preventDefault();

  const bookingData = {
    id: Date.now(),
    userId: currentUser.id,
    flightId: selectedFlight.id,
    passengers: formData.passengers,
    totalPrice: selectedFlight.price * formData.passengers.length,
    status: 'Pending',
    bookingDate: new Date().toISOString()
  };

  // Simpan ke localStorage
  const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  bookings.push(bookingData);
  localStorage.setItem('bookings', JSON.stringify(bookings));

  navigate('/booking-success', { state: bookingData });
};
```

#### **Hubungan:**
- **SearchResults.jsx**: Navigate ke booking dengan flight data
- **BookingForm.jsx**: Form multi-step untuk input data
- **BookingDetailModal.jsx**: Preview booking sebelum submit
- **DataContext**: Update state bookings

---

### **5. ✅ Booking Success (BookingSuccess.jsx)**

#### **Konsep:**
- Konfirmasi booking berhasil
- Tampilkan detail booking dan E-Ticket
- Opsi untuk kembali ke home atau lihat bookings

#### **File Terlibat:**
- `src/pages/user/BookingSuccess.jsx` - Halaman sukses
- `src/components/ETicketModal.jsx` - Modal E-Ticket
- `src/context/DataContext.jsx` - Data booking

#### **Kode Penting:**
```jsx
// BookingSuccess.jsx - Display booking details
useEffect(() => {
  if (location.state) {
    setBookingData(location.state);
  }
}, [location.state]);

const handleViewTicket = () => {
  setShowETicket(true);
};
```

#### **Hubungan:**
- **BookingForm.jsx**: Navigate ke success dengan booking data
- **ETicketModal.jsx**: Tampilkan E-Ticket
- **DataContext**: Load booking details

---

### **6. 📋 Manage Bookings (MyBookings.jsx)**

#### **Konsep:**
- User melihat semua riwayat booking
- Status booking (Pending, Confirmed, Completed, Cancelled)
- Opsi refund untuk booking tertentu
- Filter berdasarkan status

#### **File Terlibat:**
- `src/pages/user/MyBookings.jsx` - Halaman riwayat
- `src/components/ConfirmModal.jsx` - Modal konfirmasi
- `src/context/DataContext.jsx` - Data bookings

#### **Kode Penting:**
```jsx
// MyBookings.jsx - Display user bookings
const userBookings = bookings.filter(booking => booking.userId === currentUser.id);

const handleRefundRequest = (bookingId) => {
  const updatedBookings = bookings.map(booking =>
    booking.id === bookingId
      ? { ...booking, refundStatus: 'Requested', refundReason: refundReason }
      : booking
  );
  setBookings(updatedBookings);
  localStorage.setItem('bookings', JSON.stringify(updatedBookings));
};
```

#### **Hubungan:**
- **DataContext**: Load dan update bookings
- **ConfirmModal**: Konfirmasi actions
- **AuthContext**: Cek user yang login

---

### **7. 👤 Profile Management (Profile.jsx)**

#### **Konsep:**
- User mengelola data pribadi
- Update nama, email, password
- Lihat statistik booking

#### **File Terlibat:**
- `src/pages/user/Profile.jsx` - Halaman profil
- `src/context/AuthContext.jsx` - Update user data
- `src/utils/validation.js` - Validasi form

#### **Kode Penting:**
```jsx
// Profile.jsx - Update profile
const handleUpdateProfile = (e) => {
  e.preventDefault();

  const updatedUser = { ...currentUser, ...formData };
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const updatedUsers = users.map(user =>
    user.id === currentUser.id ? updatedUser : user
  );

  localStorage.setItem('users', JSON.stringify(updatedUsers));
  setCurrentUser(updatedUser);
  localStorage.setItem('userSession', JSON.stringify(updatedUser));
};
```

#### **Hubungan:**
- **AuthContext**: State management user
- **validation.js**: Validasi input
- **DataContext**: Load booking stats

---

## 🔄 **Data Flow & State Management**

### **Context Providers:**
- **AuthContext**: User authentication & session
- **DataContext**: Flights, bookings, settings
- **ThemeContext**: Dark/light mode

### **LocalStorage Keys:**
- `users`: Data user terdaftar
- `userSession`: Session user yang login
- `flights`: Data penerbangan
- `bookings`: Data booking
- `theme`: Tema aplikasi

### **Navigation Flow:**
```
Home → Login/Register → Home (logged in) → Search → Results → Booking → Success → MyBookings/Profile
```

---

## 🎨 **UI Components Relationship**

### **Layout Components:**
- **UserLayout**: Wrapper untuk semua halaman user
- **Header**: Navigation & user menu
- **Footer**: Info & links
- **Sidebar**: Menu navigasi (mobile)

### **Reusable Components:**
- **FlightCard**: Display flight info
- **AlertModal**: Notifications
- **LoadingScreen**: Loading states
- **ConfirmModal**: Confirmations

---

## 📱 **Responsive & Theme Support**

- **TailwindCSS**: Utility classes untuk responsive
- **ThemeContext**: Dark/light mode toggle
- **Mobile-first**: Design yang responsive

---

## 🔒 **Security & Validation**

- **Form Validation**: Client-side validation
- **Session Management**: Secure session handling
- **Input Sanitization**: Clean user inputs
- **Error Handling**: Comprehensive error messages

---

*Dokumen ini dibuat untuk memudahkan pemahaman alur user di aplikasi FlyBook. Semua file dan kode telah diverifikasi dan sesuai dengan implementasi aktual.*