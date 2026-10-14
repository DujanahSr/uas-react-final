// Validation helper functions

// Validasi email format
export const validateEmail = (email) => {
  if (!email) return "Email wajib diisi";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Format email tidak valid (contoh: email@domain.com)";
  }
  return "";
};

// Validasi nomor telepon Indonesia
export const validatePhone = (phone) => {
  if (!phone) return "Nomor telepon wajib diisi";
  // Format: 08xxxxxxxxxx (10-13 digit, mulai dari 08)
  const phoneRegex = /^08\d{9,12}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
    return "Format nomor telepon tidak valid (contoh: 081234567890)";
  }
  return "";
};

// Validasi nomor KTP Indonesia (16 digit)
export const validateKTP = (ktp) => {
  if (!ktp) return "Nomor KTP wajib diisi";
  // Hanya angka, 16 digit
  const ktpRegex = /^\d{16}$/;
  if (!ktpRegex.test(ktp.replace(/\s/g, ""))) {
    return "Nomor KTP harus 16 digit angka";
  }
  return "";
};

// Validasi nomor Passport (format umum: huruf + angka, 6-9 karakter)
export const validatePassport = (passport) => {
  if (!passport) return "Nomor Passport wajib diisi";
  // Format: huruf dan angka, 6-9 karakter
  const passportRegex = /^[A-Z0-9]{6,9}$/i;
  if (!passportRegex.test(passport.replace(/\s/g, ""))) {
    return "Format nomor Passport tidak valid (6-9 karakter, huruf dan angka)";
  }
  return "";
};

// Validasi nomor identitas (KTP atau Passport)
export const validateIdNumber = (idNumber, idType = "KTP") => {
  if (!idNumber) return "Nomor identitas wajib diisi";
  const cleanId = idNumber.replace(/\s/g, "");
  
  if (idType === "KTP" || !idType) {
    return validateKTP(cleanId);
  } else if (idType === "Passport") {
    return validatePassport(cleanId);
  }
  return "";
};

// Validasi nama lengkap (minimal 3 karakter, hanya huruf dan spasi)
export const validateName = (name) => {
  if (!name) return "Nama lengkap wajib diisi";
  if (name.length < 3) {
    return "Nama lengkap minimal 3 karakter";
  }
  const nameRegex = /^[a-zA-Z\s.'-]+$/;
  if (!nameRegex.test(name)) {
    return "Nama hanya boleh mengandung huruf, spasi, titik, dan tanda hubung";
  }
  return "";
};

// Validasi password (minimal 6 karakter, harus ada huruf dan angka)
export const validatePassword = (password) => {
  if (!password) return "Password wajib diisi";
  if (password.length < 6) {
    return "Password minimal 6 karakter";
  }
  if (password.length > 50) {
    return "Password maksimal 50 karakter";
  }
  return "";
};

// Validasi alamat (minimal 10 karakter)
export const validateAddress = (address) => {
  if (!address) return "Alamat wajib diisi";
  if (address.length < 10) {
    return "Alamat minimal 10 karakter";
  }
  if (address.length > 200) {
    return "Alamat maksimal 200 karakter";
  }
  return "";
};

// Validasi nomor penerbangan (format: XX-123 atau XX123)
export const validateFlightNumber = (flightNumber) => {
  if (!flightNumber) return "Nomor penerbangan wajib diisi";
  const flightRegex = /^[A-Z]{2}[-]?\d{1,4}$/i;
  if (!flightRegex.test(flightNumber.replace(/\s/g, ""))) {
    return "Format nomor penerbangan tidak valid (contoh: GA-123 atau GA123)";
  }
  return "";
};

// Validasi waktu (format HH:MM)
export const validateTime = (time) => {
  if (!time) return "Waktu wajib diisi";
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    return "Format waktu tidak valid (contoh: 08:30 atau 14:45)";
  }
  return "";
};

// Validasi harga (harus angka positif)
export const validatePrice = (price) => {
  if (!price && price !== 0) return "Harga wajib diisi";
  const numPrice = Number(price);
  if (isNaN(numPrice) || numPrice < 0) {
    return "Harga harus berupa angka positif";
  }
  if (numPrice < 10000) {
    return "Harga minimal Rp 10.000";
  }
  return "";
};

// Validasi jumlah kursi (harus angka positif, maksimal 500)
export const validateSeats = (seats) => {
  if (!seats && seats !== 0) return "Jumlah kursi wajib diisi";
  const numSeats = Number(seats);
  if (isNaN(numSeats) || numSeats < 1) {
    return "Jumlah kursi harus minimal 1";
  }
  if (numSeats > 500) {
    return "Jumlah kursi maksimal 500";
  }
  return "";
};

// Validasi tanggal lahir (minimal 7 hari sebelum tanggal keberangkatan)
export const validateDateOfBirth = (dob, departureDate) => {
  if (!dob) return "Tanggal lahir wajib diisi";
  
  const dobDate = new Date(dob);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Cek apakah tanggal lahir tidak di masa depan
  if (dobDate > today) {
    return "Tanggal lahir tidak boleh di masa depan";
  }
  
  // Jika ada departure date, cek minimal 7 hari sebelum keberangkatan
  if (departureDate) {
    const departure = new Date(departureDate);
    const minDate = new Date(departure);
    minDate.setDate(minDate.getDate() - 7);
    minDate.setHours(0, 0, 0, 0);
    
    if (dobDate > minDate) {
      return "Tanggal lahir minimal 7 hari sebelum tanggal keberangkatan";
    }
  }
  
  return "";
};

