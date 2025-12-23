/* eslint-disable no-case-declarations */
// Data mock untuk aplikasi booking tiket pesawat - Opsi 3 (Struktur Siap API)
// Format data konsisten dan siap untuk upgrade ke API nanti

// Helper untuk generate dates
const getDate = (daysFromNow) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

// Data Penerbangan Lengkap (25-30 penerbangan)
export const flightsData = [
  // Jakarta - Denpasar
  {
    id: 'FL001',
    flightNumber: 'GA-123',
    airline: 'Garuda Indonesia',
    airlineCode: 'GA',
    from: 'Jakarta (CGK)',
    fromCode: 'CGK',
    to: 'Denpasar (DPS)',
    toCode: 'DPS',
    departureTime: '08:00',
    arrivalTime: '11:30',
    departureDate: getDate(5),
    arrivalDate: getDate(5),
    duration: '3j 30m',
    durationMinutes: 210,
    price: 1200000,
    prices: {
      economy: 1200000,
      business: 2500000,
      first: 5000000
    },
    availableSeats: 24,
    totalSeats: 180,
    status: 'Tersedia',
    aircraft: 'Boeing 737-800',
    terminal: 'Terminal 3',
    gate: 'A12',
    baggageAllowance: 20,
    amenities: ['WiFi', 'Entertainment', 'Meal'],
    transit: false,
    stops: 0
  },
  {
    id: 'FL002',
    flightNumber: 'ID-456',
    airline: 'Lion Air',
    airlineCode: 'ID',
    from: 'Jakarta (CGK)',
    fromCode: 'CGK',
    to: 'Denpasar (DPS)',
    toCode: 'DPS',
    departureTime: '10:15',
    arrivalTime: '13:45',
    departureDate: getDate(5),
    arrivalDate: getDate(5),
    duration: '3j 30m',
    durationMinutes: 210,
    price: 950000,
    prices: {
      economy: 950000,
      business: 2000000,
      first: 4000000
    },
    availableSeats: 45,
    totalSeats: 215,
    status: 'Tersedia',
    aircraft: 'Airbus A320',
    terminal: 'Terminal 1',
    gate: 'B5',
    baggageAllowance: 15,
    amenities: ['Entertainment'],
    transit: false,
    stops: 0
  },
  {
    id: 'FL003',
    flightNumber: 'QZ-789',
    airline: 'Citilink',
    airlineCode: 'QZ',
    from: 'Jakarta (CGK)',
    fromCode: 'CGK',
    to: 'Denpasar (DPS)',
    toCode: 'DPS',
    departureTime: '14:20',
    arrivalTime: '17:50',
    departureDate: getDate(5),
    arrivalDate: getDate(5),
    duration: '3j 30m',
    durationMinutes: 210,
    price: 850000,
    prices: {
      economy: 850000,
      business: 1800000,
      first: 3500000
    },
    availableSeats: 12,
    totalSeats: 180,
    status: 'Hampir Penuh',
    aircraft: 'Airbus A320',
    terminal: 'Terminal 2',
    gate: 'C8',
    baggageAllowance: 15,
    amenities: ['Entertainment'],
    transit: false,
    stops: 0
  },
  // Jakarta - Surabaya
  {
    id: 'FL004',
    flightNumber: 'ID-234',
    airline: 'Lion Air',
    airlineCode: 'ID',
    from: 'Jakarta (CGK)',
    fromCode: 'CGK',
    to: 'Surabaya (SUB)',
    toCode: 'SUB',
    departureTime: '09:15',
    arrivalTime: '10:45',
    departureDate: getDate(3),
    arrivalDate: getDate(3),
    duration: '1j 30m',
    durationMinutes: 90,
    price: 650000,
    prices: {
      economy: 650000,
      business: 1500000,
      first: 3000000
    },
    availableSeats: 45,
    totalSeats: 215,
    status: 'Tersedia',
    aircraft: 'Airbus A320',
    terminal: 'Terminal 1',
    gate: 'B3',
    baggageAllowance: 15,
    amenities: ['Entertainment'],
    transit: false,
    stops: 0
  },
  {
    id: 'FL005',
    flightNumber: 'GA-567',
    airline: 'Garuda Indonesia',
    airlineCode: 'GA',
    from: 'Jakarta (CGK)',
    fromCode: 'CGK',
    to: 'Surabaya (SUB)',
    toCode: 'SUB',
    departureTime: '11:30',
    arrivalTime: '13:00',
    departureDate: getDate(3),
    arrivalDate: getDate(3),
    duration: '1j 30m',
    durationMinutes: 90,
    price: 750000,
    prices: {
      economy: 750000,
      business: 1800000,
      first: 3500000
    },
    availableSeats: 38,
    totalSeats: 180,
    status: 'Tersedia',
    aircraft: 'Boeing 737-800',
    terminal: 'Terminal 3',
    gate: 'A8',
    baggageAllowance: 20,
    amenities: ['WiFi', 'Entertainment', 'Meal'],
    transit: false,
    stops: 0
  },
  // Jakarta - Singapore
  {
    id: 'FL006',
    flightNumber: 'AK-789',
    airline: 'AirAsia',
    airlineCode: 'AK',
    from: 'Jakarta (CGK)',
    fromCode: 'CGK',
    to: 'Singapore (SIN)',
    toCode: 'SIN',
    departureTime: '14:20',
    arrivalTime: '16:10',
    departureDate: getDate(7),
    arrivalDate: getDate(7),
    duration: '1j 50m',
    durationMinutes: 110,
    price: 850000,
    prices: {
      economy: 850000,
      business: 2000000,
      first: 4000000
    },
    availableSeats: 12,
    totalSeats: 180,
    status: 'Hampir Penuh',
    aircraft: 'Airbus A320',
    terminal: 'Terminal 2',
    gate: 'D12',
    baggageAllowance: 20,
    amenities: ['Entertainment', 'Meal'],
    transit: false,
    stops: 0
  },
  {
    id: 'FL007',
    flightNumber: 'GA-890',
    airline: 'Garuda Indonesia',
    airlineCode: 'GA',
    from: 'Jakarta (CGK)',
    fromCode: 'CGK',
    to: 'Singapore (SIN)',
    toCode: 'SIN',
    departureTime: '16:45',
    arrivalTime: '18:35',
    departureDate: getDate(7),
    arrivalDate: getDate(7),
    duration: '1j 50m',
    durationMinutes: 110,
    price: 1200000,
    prices: {
      economy: 1200000,
      business: 2800000,
      first: 5500000
    },
    availableSeats: 28,
    totalSeats: 180,
    status: 'Tersedia',
    aircraft: 'Boeing 737-800',
    terminal: 'Terminal 3',
    gate: 'A15',
    baggageAllowance: 30,
    amenities: ['WiFi', 'Entertainment', 'Meal'],
    transit: false,
    stops: 0
  },
  // Surabaya - Jakarta
  {
    id: 'FL008',
    flightNumber: 'GA-456',
    airline: 'Garuda Indonesia',
    airlineCode: 'GA',
    from: 'Surabaya (SUB)',
    fromCode: 'SUB',
    to: 'Jakarta (CGK)',
    toCode: 'CGK',
    departureTime: '12:30',
    arrivalTime: '14:00',
    departureDate: getDate(4),
    arrivalDate: getDate(4),
    duration: '1j 30m',
    durationMinutes: 90,
    price: 700000,
    prices: {
      economy: 700000,
      business: 1700000,
      first: 3200000
    },
    availableSeats: 38,
    totalSeats: 180,
    status: 'Tersedia',
    aircraft: 'Boeing 737-800',
    terminal: 'Terminal 1',
    gate: 'A5',
    baggageAllowance: 20,
    amenities: ['WiFi', 'Entertainment', 'Meal'],
    transit: false,
    stops: 0
  },
  // Denpasar - Jakarta
  {
    id: 'FL009',
    flightNumber: 'ID-789',
    airline: 'Lion Air',
    airlineCode: 'ID',
    from: 'Denpasar (DPS)',
    fromCode: 'DPS',
    to: 'Jakarta (CGK)',
    toCode: 'CGK',
    departureTime: '16:45',
    arrivalTime: '18:15',
    departureDate: getDate(6),
    arrivalDate: getDate(6),
    duration: '1j 30m',
    durationMinutes: 90,
    price: 1100000,
    prices: {
      economy: 1100000,
      business: 2300000,
      first: 4500000
    },
    availableSeats: 52,
    totalSeats: 215,
    status: 'Tersedia',
    aircraft: 'Airbus A320',
    terminal: 'Terminal 1',
    gate: 'B8',
    baggageAllowance: 15,
    amenities: ['Entertainment'],
    transit: false,
    stops: 0
  },
  // Medan - Jakarta
  {
    id: 'FL010',
    flightNumber: 'AK-123',
    airline: 'AirAsia',
    airlineCode: 'AK',
    from: 'Medan (KNO)',
    fromCode: 'KNO',
    to: 'Jakarta (CGK)',
    toCode: 'CGK',
    departureTime: '07:30',
    arrivalTime: '10:00',
    departureDate: getDate(8),
    arrivalDate: getDate(8),
    duration: '2j 30m',
    durationMinutes: 150,
    price: 950000,
    prices: {
      economy: 950000,
      business: 2100000,
      first: 4200000
    },
    availableSeats: 28,
    totalSeats: 180,
    status: 'Tersedia',
    aircraft: 'Airbus A320',
    terminal: 'Terminal 2',
    gate: 'C5',
    baggageAllowance: 20,
    amenities: ['Entertainment', 'Meal'],
    transit: false,
    stops: 0
  },
  // Jakarta - Yogyakarta
  {
    id: 'FL011',
    flightNumber: 'ID-321',
    airline: 'Lion Air',
    airlineCode: 'ID',
    from: 'Jakarta (CGK)',
    fromCode: 'CGK',
    to: 'Yogyakarta (YIA)',
    toCode: 'YIA',
    departureTime: '13:20',
    arrivalTime: '14:50',
    departureDate: getDate(10),
    arrivalDate: getDate(10),
    duration: '1j 30m',
    durationMinutes: 90,
    price: 600000,
    prices: {
      economy: 600000,
      business: 1400000,
      first: 2800000
    },
    availableSeats: 35,
    totalSeats: 215,
    status: 'Tersedia',
    aircraft: 'Airbus A320',
    terminal: 'Terminal 1',
    gate: 'B10',
    baggageAllowance: 15,
    amenities: ['Entertainment'],
    transit: false,
    stops: 0
  },
  // Jakarta - Makassar
  {
    id: 'FL012',
    flightNumber: 'GA-654',
    airline: 'Garuda Indonesia',
    airlineCode: 'GA',
    from: 'Jakarta (CGK)',
    fromCode: 'CGK',
    to: 'Makassar (UPG)',
    toCode: 'UPG',
    departureTime: '09:00',
    arrivalTime: '12:30',
    departureDate: getDate(12),
    arrivalDate: getDate(12),
    duration: '3j 30m',
    durationMinutes: 210,
    price: 1300000,
    prices: {
      economy: 1300000,
      business: 2700000,
      first: 5200000
    },
    availableSeats: 22,
    totalSeats: 180,
    status: 'Tersedia',
    aircraft: 'Boeing 737-800',
    terminal: 'Terminal 3',
    gate: 'A18',
    baggageAllowance: 20,
    amenities: ['WiFi', 'Entertainment', 'Meal'],
    transit: false,
    stops: 0
  },
  // More flights untuk variasi
  {
    id: 'FL013',
    flightNumber: 'QZ-147',
    airline: 'Citilink',
    airlineCode: 'QZ',
    from: 'Jakarta (CGK)',
    fromCode: 'CGK',
    to: 'Surabaya (SUB)',
    toCode: 'SUB',
    departureTime: '06:00',
    arrivalTime: '07:30',
    departureDate: getDate(2),
    arrivalDate: getDate(2),
    duration: '1j 30m',
    durationMinutes: 90,
    price: 580000,
    prices: {
      economy: 580000,
      business: 1300000,
      first: 2600000
    },
    availableSeats: 48,
    totalSeats: 180,
    status: 'Tersedia',
    aircraft: 'Airbus A320',
    terminal: 'Terminal 2',
    gate: 'C3',
    baggageAllowance: 15,
    amenities: ['Entertainment'],
    transit: false,
    stops: 0
  },
  {
    id: 'FL014',
    flightNumber: 'GA-258',
    airline: 'Garuda Indonesia',
    airlineCode: 'GA',
    from: 'Denpasar (DPS)',
    fromCode: 'DPS',
    to: 'Jakarta (CGK)',
    toCode: 'CGK',
    departureTime: '08:30',
    arrivalTime: '10:00',
    departureDate: getDate(6),
    arrivalDate: getDate(6),
    duration: '1j 30m',
    durationMinutes: 90,
    price: 1250000,
    prices: {
      economy: 1250000,
      business: 2600000,
      first: 5100000
    },
    availableSeats: 18,
    totalSeats: 180,
    status: 'Hampir Penuh',
    aircraft: 'Boeing 737-800',
    terminal: 'Terminal 1',
    gate: 'A3',
    baggageAllowance: 20,
    amenities: ['WiFi', 'Entertainment', 'Meal'],
    transit: false,
    stops: 0
  },
  {
    id: 'FL015',
    flightNumber: 'ID-369',
    airline: 'Lion Air',
    airlineCode: 'ID',
    from: 'Surabaya (SUB)',
    fromCode: 'SUB',
    to: 'Denpasar (DPS)',
    toCode: 'DPS',
    departureTime: '15:20',
    arrivalTime: '16:50',
    departureDate: getDate(9),
    arrivalDate: getDate(9),
    duration: '1j 30m',
    durationMinutes: 90,
    price: 720000,
    prices: {
      economy: 720000,
      business: 1600000,
      first: 3100000
    },
    availableSeats: 42,
    totalSeats: 215,
    status: 'Tersedia',
    aircraft: 'Airbus A320',
    terminal: 'Terminal 1',
    gate: 'B12',
    baggageAllowance: 15,
    amenities: ['Entertainment'],
    transit: false,
    stops: 0
  },
  {
    id: 'FL016',
    flightNumber: 'AK-741',
    airline: 'AirAsia',
    airlineCode: 'AK',
    from: 'Jakarta (CGK)',
    fromCode: 'CGK',
    to: 'Kuala Lumpur (KUL)',
    toCode: 'KUL',
    departureTime: '11:15',
    arrivalTime: '13:45',
    departureDate: getDate(14),
    arrivalDate: getDate(14),
    duration: '2j 30m',
    durationMinutes: 150,
    price: 1100000,
    prices: {
      economy: 1100000,
      business: 2400000,
      first: 4700000
    },
    availableSeats: 31,
    totalSeats: 180,
    status: 'Tersedia',
    aircraft: 'Airbus A320',
    terminal: 'Terminal 2',
    gate: 'D8',
    baggageAllowance: 20,
    amenities: ['Entertainment', 'Meal'],
    transit: false,
    stops: 0
  },
  {
    id: 'FL017',
    flightNumber: 'GA-852',
    airline: 'Garuda Indonesia',
    airlineCode: 'GA',
    from: 'Jakarta (CGK)',
    fromCode: 'CGK',
    to: 'Medan (KNO)',
    toCode: 'KNO',
    departureTime: '10:45',
    arrivalTime: '13:15',
    departureDate: getDate(11),
    arrivalDate: getDate(11),
    duration: '2j 30m',
    durationMinutes: 150,
    price: 1400000,
    prices: {
      economy: 1400000,
      business: 2900000,
      first: 5600000
    },
    availableSeats: 26,
    totalSeats: 180,
    status: 'Tersedia',
    aircraft: 'Boeing 737-800',
    terminal: 'Terminal 3',
    gate: 'A22',
    baggageAllowance: 20,
    amenities: ['WiFi', 'Entertainment', 'Meal'],
    transit: false,
    stops: 0
  },
  {
    id: 'FL018',
    flightNumber: 'QZ-963',
    airline: 'Citilink',
    airlineCode: 'QZ',
    from: 'Jakarta (CGK)',
    fromCode: 'CGK',
    to: 'Yogyakarta (YIA)',
    toCode: 'YIA',
    departureTime: '17:30',
    arrivalTime: '19:00',
    departureDate: getDate(13),
    arrivalDate: getDate(13),
    duration: '1j 30m',
    durationMinutes: 90,
    price: 620000,
    prices: {
      economy: 620000,
      business: 1450000,
      first: 2900000
    },
    availableSeats: 39,
    totalSeats: 180,
    status: 'Tersedia',
    aircraft: 'Airbus A320',
    terminal: 'Terminal 2',
    gate: 'C15',
    baggageAllowance: 15,
    amenities: ['Entertainment'],
    transit: false,
    stops: 0
  },
  {
    id: 'FL019',
    flightNumber: 'ID-159',
    airline: 'Lion Air',
    airlineCode: 'ID',
    from: 'Makassar (UPG)',
    fromCode: 'UPG',
    to: 'Jakarta (CGK)',
    toCode: 'CGK',
    departureTime: '13:45',
    arrivalTime: '17:15',
    departureDate: getDate(15),
    arrivalDate: getDate(15),
    duration: '3j 30m',
    durationMinutes: 210,
    price: 1350000,
    prices: {
      economy: 1350000,
      business: 2800000,
      first: 5400000
    },
    availableSeats: 33,
    totalSeats: 215,
    status: 'Tersedia',
    aircraft: 'Airbus A320',
    terminal: 'Terminal 1',
    gate: 'B18',
    baggageAllowance: 15,
    amenities: ['Entertainment'],
    transit: false,
    stops: 0
  },
  {
    id: 'FL020',
    flightNumber: 'GA-357',
    airline: 'Garuda Indonesia',
    airlineCode: 'GA',
    from: 'Jakarta (CGK)',
    fromCode: 'CGK',
    to: 'Denpasar (DPS)',
    toCode: 'DPS',
    departureTime: '19:00',
    arrivalTime: '22:30',
    departureDate: getDate(5),
    arrivalDate: getDate(5),
    duration: '3j 30m',
    durationMinutes: 210,
    price: 1150000,
    prices: {
      economy: 1150000,
      business: 2400000,
      first: 4800000
    },
    availableSeats: 15,
    totalSeats: 180,
    status: 'Hampir Penuh',
    aircraft: 'Boeing 737-800',
    terminal: 'Terminal 3',
    gate: 'A25',
    baggageAllowance: 20,
    amenities: ['WiFi', 'Entertainment', 'Meal'],
    transit: false,
    stops: 0
  },
  {
    id: 'FL021',
    flightNumber: 'AK-468',
    airline: 'AirAsia',
    airlineCode: 'AK',
    from: 'Singapore (SIN)',
    fromCode: 'SIN',
    to: 'Jakarta (CGK)',
    toCode: 'CGK',
    departureTime: '10:30',
    arrivalTime: '12:20',
    departureDate: getDate(7),
    arrivalDate: getDate(7),
    duration: '1j 50m',
    durationMinutes: 110,
    price: 880000,
    prices: {
      economy: 880000,
      business: 2100000,
      first: 4100000
    },
    availableSeats: 25,
    totalSeats: 180,
    status: 'Tersedia',
    aircraft: 'Airbus A320',
    terminal: 'Terminal 2',
    gate: 'D18',
    baggageAllowance: 20,
    amenities: ['Entertainment', 'Meal'],
    transit: false,
    stops: 0
  },
  {
    id: 'FL022',
    flightNumber: 'ID-579',
    airline: 'Lion Air',
    airlineCode: 'ID',
    from: 'Jakarta (CGK)',
    fromCode: 'CGK',
    to: 'Surabaya (SUB)',
    toCode: 'SUB',
    departureTime: '15:45',
    arrivalTime: '17:15',
    departureDate: getDate(3),
    arrivalDate: getDate(3),
    duration: '1j 30m',
    durationMinutes: 90,
    price: 680000,
    prices: {
      economy: 680000,
      business: 1550000,
      first: 3100000
    },
    availableSeats: 41,
    totalSeats: 215,
    status: 'Tersedia',
    aircraft: 'Airbus A320',
    terminal: 'Terminal 1',
    gate: 'B7',
    baggageAllowance: 15,
    amenities: ['Entertainment'],
    transit: false,
    stops: 0
  },
  {
    id: 'FL023',
    flightNumber: 'QZ-680',
    airline: 'Citilink',
    airlineCode: 'QZ',
    from: 'Yogyakarta (YIA)',
    fromCode: 'YIA',
    to: 'Jakarta (CGK)',
    toCode: 'CGK',
    departureTime: '08:15',
    arrivalTime: '09:45',
    departureDate: getDate(10),
    arrivalDate: getDate(10),
    duration: '1j 30m',
    durationMinutes: 90,
    price: 590000,
    prices: {
      economy: 590000,
      business: 1350000,
      first: 2700000
    },
    availableSeats: 37,
    totalSeats: 180,
    status: 'Tersedia',
    aircraft: 'Airbus A320',
    terminal: 'Terminal 2',
    gate: 'C12',
    baggageAllowance: 15,
    amenities: ['Entertainment'],
    transit: false,
    stops: 0
  },
  {
    id: 'FL024',
    flightNumber: 'GA-791',
    airline: 'Garuda Indonesia',
    airlineCode: 'GA',
    from: 'Jakarta (CGK)',
    fromCode: 'CGK',
    to: 'Makassar (UPG)',
    toCode: 'UPG',
    departureTime: '13:20',
    arrivalTime: '16:50',
    departureDate: getDate(12),
    arrivalDate: getDate(12),
    duration: '3j 30m',
    durationMinutes: 210,
    price: 1280000,
    prices: {
      economy: 1280000,
      business: 2650000,
      first: 5100000
    },
    availableSeats: 29,
    totalSeats: 180,
    status: 'Tersedia',
    aircraft: 'Boeing 737-800',
    terminal: 'Terminal 3',
    gate: 'A20',
    baggageAllowance: 20,
    amenities: ['WiFi', 'Entertainment', 'Meal'],
    transit: false,
    stops: 0
  },
  {
    id: 'FL025',
    flightNumber: 'AK-802',
    airline: 'AirAsia',
    airlineCode: 'AK',
    from: 'Jakarta (CGK)',
    fromCode: 'CGK',
    to: 'Denpasar (DPS)',
    toCode: 'DPS',
    departureTime: '06:30',
    arrivalTime: '10:00',
    departureDate: getDate(5),
    arrivalDate: getDate(5),
    duration: '3j 30m',
    durationMinutes: 210,
    price: 920000,
    prices: {
      economy: 920000,
      business: 1950000,
      first: 3900000
    },
    availableSeats: 19,
    totalSeats: 180,
    status: 'Hampir Penuh',
    aircraft: 'Airbus A320',
    terminal: 'Terminal 2',
    gate: 'D5',
    baggageAllowance: 20,
    amenities: ['Entertainment', 'Meal'],
    transit: false,
    stops: 0
  }
];

// Data Booking Lengkap
export const bookingsData = [
  {
    id: 'BK001',
    bookingCode: 'FBK12345',
    passengerName: 'John Doe',
    passengers: [
      {
        name: 'John Doe',
        idNumber: '3201012345678901',
        dob: '1990-05-15',
        seat: '12A',
        title: 'Mr'
      }
    ],
    email: 'john@example.com',
    phone: '081234567890',
    flightId: 'FL001',
    flightNumber: 'GA-123',
    airline: 'Garuda Indonesia',
    route: 'Jakarta → Denpasar',
    from: 'Jakarta (CGK)',
    to: 'Denpasar (DPS)',
    departureDate: getDate(5),
    departureTime: '08:00',
    arrivalTime: '11:30',
    totalPrice: 1200000,
    basePrice: 1200000,
    tax: 0,
    addons: [],
    status: 'Confirmed',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card',
    bookingDate: getDate(-10),
    class: 'Ekonomi',
    seats: ['12A']
  },
  {
    id: 'BK002',
    bookingCode: 'FBK67890',
    passengerName: 'Jane Smith',
    passengers: [
      {
        name: 'Jane Smith',
        idNumber: '3201012345678902',
        dob: '1992-08-20',
        seat: '15B',
        title: 'Mrs'
      }
    ],
    email: 'jane@example.com',
    phone: '081234567891',
    flightId: 'FL004',
    flightNumber: 'ID-456',
    airline: 'Lion Air',
    route: 'Jakarta → Surabaya',
    from: 'Jakarta (CGK)',
    to: 'Surabaya (SUB)',
    departureDate: getDate(3),
    departureTime: '09:15',
    arrivalTime: '10:45',
    totalPrice: 650000,
    basePrice: 650000,
    tax: 0,
    addons: [],
    status: 'Confirmed',
    paymentStatus: 'Paid',
    paymentMethod: 'E-Wallet',
    bookingDate: getDate(-8),
    class: 'Ekonomi',
    seats: ['15B']
  },
  {
    id: 'BK003',
    bookingCode: 'FBK13579',
    passengerName: 'Michael Johnson',
    passengers: [
      {
        name: 'Michael Johnson',
        idNumber: '3201012345678903',
        dob: '1988-12-10',
        seat: '8C',
        title: 'Mr'
      },
      {
        name: 'Sarah Johnson',
        idNumber: '3201012345678904',
        dob: '1990-03-25',
        seat: '8D',
        title: 'Mrs'
      },
      {
        name: 'Emma Johnson',
        idNumber: '3201012345678905',
        dob: '2015-07-15',
        seat: '8E',
        title: 'Ms'
      }
    ],
    email: 'michael@example.com',
    phone: '081234567892',
    flightId: 'FL006',
    flightNumber: 'AK-789',
    airline: 'AirAsia',
    route: 'Jakarta → Singapore',
    from: 'Jakarta (CGK)',
    to: 'Singapore (SIN)',
    departureDate: getDate(7),
    departureTime: '14:20',
    arrivalTime: '16:10',
    totalPrice: 2550000,
    basePrice: 2550000,
    tax: 0,
    addons: [],
    status: 'Pending',
    paymentStatus: 'Pending',
    paymentMethod: null,
    bookingDate: getDate(-5),
    class: 'Ekonomi',
    seats: ['8C', '8D', '8E']
  }
];

// Data Master - Airlines
export const airlines = [
  { code: 'GA', name: 'Garuda Indonesia', logo: 'GA' },
  { code: 'ID', name: 'Lion Air', logo: 'ID' },
  { code: 'AK', name: 'AirAsia', logo: 'AK' },
  { code: 'QZ', name: 'Citilink', logo: 'QZ' }
];

// Data Master - Airports
export const airports = [
  { code: 'CGK', name: 'Soekarno-Hatta', city: 'Jakarta' },
  { code: 'DPS', name: 'Ngurah Rai', city: 'Denpasar' },
  { code: 'SUB', name: 'Juanda', city: 'Surabaya' },
  { code: 'KNO', name: 'Kualanamu', city: 'Medan' },
  { code: 'UPG', name: 'Hasanuddin', city: 'Makassar' },
  { code: 'YIA', name: 'Yogyakarta International', city: 'Yogyakarta' },
  { code: 'SIN', name: 'Changi', city: 'Singapore' },
  { code: 'KUL', name: 'KLIA', city: 'Kuala Lumpur' }
];

// Statistik Maskapai
export const airlineStats = [
  { name: 'Garuda Indonesia', sales: 245, color: 'bg-blue-500', percentage: 100 },
  { name: 'Lion Air', sales: 198, color: 'bg-red-500', percentage: 80.8 },
  { name: 'AirAsia', sales: 156, color: 'bg-yellow-500', percentage: 63.7 },
  { name: 'Citilink', sales: 132, color: 'bg-green-500', percentage: 53.9 },
];

// Rute Populer
export const popularRoutes = [
  {
    route: 'Jakarta - Denpasar',
    from: 'CGK',
    to: 'DPS',
    bookings: 125,
    revenue: 150000000
  },
  {
    route: 'Jakarta - Surabaya',
    from: 'CGK',
    to: 'SUB',
    bookings: 98,
    revenue: 63700000
  },
  {
    route: 'Jakarta - Singapore',
    from: 'CGK',
    to: 'SIN',
    bookings: 87,
    revenue: 73950000
  },
  {
    route: 'Jakarta - Medan',
    from: 'CGK',
    to: 'KNO',
    bookings: 76,
    revenue: 72200000
  }
];

// Fungsi helper untuk filtering flights
// Menerima flights array sebagai parameter untuk konsistensi dengan DataContext
export const searchFlights = (filters, flightsArray = null) => {
  // Gunakan flightsArray jika disediakan (dari DataContext), jika tidak gunakan flightsData
  const sourceFlights = flightsArray || flightsData;
  let filtered = [...sourceFlights];
  
  if (filters.from) {
    const fromFilter = filters.from.toLowerCase().trim();
    filtered = filtered.filter(flight => {
      // Match dengan berbagai format: "Jakarta", "Jakarta (CGK)", "CGK"
      const fromMatch = 
        flight.from.toLowerCase().includes(fromFilter) || 
        flight.fromCode.toLowerCase() === fromFilter ||
        flight.from.toLowerCase().startsWith(fromFilter) ||
        flight.from.toLowerCase().split(' ')[0] === fromFilter;
      return fromMatch;
    });
  }
  
  if (filters.to) {
    const toFilter = filters.to.toLowerCase().trim();
    filtered = filtered.filter(flight => {
      // Match dengan berbagai format: "Denpasar", "Denpasar (DPS)", "DPS"
      const toMatch = 
        flight.to.toLowerCase().includes(toFilter) || 
        flight.toCode.toLowerCase() === toFilter ||
        flight.to.toLowerCase().startsWith(toFilter) ||
        flight.to.toLowerCase().split(' ')[0] === toFilter;
      return toMatch;
    });
  }
  
  if (filters.departureDate) {
    // Normalize date format untuk memastikan matching
    const filterDate = filters.departureDate.trim();
    filtered = filtered.filter(flight => {
      // Match exact date
      const match = flight.departureDate === filterDate;
      // Debug logging untuk troubleshooting
      if (!match && filters.from && filters.to) {
        console.log('Date mismatch:', {
          filterDate,
          flightDate: flight.departureDate,
          flight: `${flight.from} → ${flight.to}`
        });
      }
      return match;
    });
  }
  
  // NOTE:
  // Saat ini data flight tidak menyimpan properti "class" (Ekonomi/Bisnis/First) secara langsung.
  // User memilih kelas saat di halaman detail penerbangan, bukan di level pencarian.
  // Untuk mencegah error dan hasil kosong, filter berdasarkan class diabaikan dulu di sini.
  // Jika nanti flight punya field class, bagian ini bisa diaktifkan kembali dengan aman.
  //
  // if (filters.class) { ... }

  if (filters.passengers) {
    filtered = filtered.filter(flight => flight.availableSeats >= parseInt(filters.passengers));
  }
  
  if (filters.airline) {
    filtered = filtered.filter(flight => 
      flight.airline.toLowerCase().includes(filters.airline.toLowerCase()) ||
      flight.airlineCode === filters.airline
    );
  }
  
  if (filters.maxPrice) {
    filtered = filtered.filter(flight => flight.price <= parseInt(filters.maxPrice));
  }
  
  if (filters.minPrice) {
    filtered = filtered.filter(flight => flight.price >= parseInt(filters.minPrice));
  }
  
  return filtered;
};

// Fungsi helper untuk format harga - DINAMIS berdasarkan pengaturan admin
export const formatPrice = (price) => {
  // Baca pengaturan admin dari localStorage
  const adminFormatSettings = localStorage.getItem("adminFormatSettings");
  let currency = "IDR"; // default
  
  if (adminFormatSettings) {
    try {
      const settings = JSON.parse(adminFormatSettings);
      currency = settings.currency || "IDR";
    } catch (e) {
      console.error("Error reading admin format settings:", e);
    }
  }

  // Format berdasarkan mata uang yang dipilih
  switch (currency) {
    case "USD":
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price / 15000); // Konversi kasar IDR ke USD
      
    case "SGD":
      return new Intl.NumberFormat('en-SG', {
        style: 'currency',
        currency: 'SGD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price / 10000); // Konversi kasar IDR ke SGD
      
    case "MYR":
      return new Intl.NumberFormat('ms-MY', {
        style: 'currency',
        currency: 'MYR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price / 3000); // Konversi kasar IDR ke MYR
      
    case "IDR":
    default:
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
      // Replace "Rp" with smaller "Rp." and remove spaces
      return formatted.replace('Rp', 'Rp.').replace(/\s/g, '');
  }
};

// Fungsi helper untuk format tanggal - DINAMIS berdasarkan pengaturan admin
export const formatDate = (dateString) => {
  // Baca pengaturan admin dari localStorage
  const adminFormatSettings = localStorage.getItem("adminFormatSettings");
  let dateFormat = "DD/MM/YYYY"; // default
  
  if (adminFormatSettings) {
    try {
      const settings = JSON.parse(adminFormatSettings);
      dateFormat = settings.dateFormat || "DD/MM/YYYY";
    } catch (e) {
      console.error("Error reading admin format settings:", e);
    }
  }

  // Parse date string
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString; // Return as-is if invalid
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Format berdasarkan pilihan admin
  switch (dateFormat) {
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
      
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
      
    case "DD MMMM YYYY":
      return `${day} ${monthNames[date.getMonth()]} ${year}`;
      
    case "DD/MM/YYYY":
    default:
      return `${day}/${month}/${year}`;
  }
};

// Fungsi helper untuk format waktu
export const formatTime = (timeString) => {
  return timeString || '';
};

// Fungsi helper untuk mendapatkan status badge
export const getStatusBadge = (status) => {
  const statusClasses = {
    'Tersedia': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'Hampir Penuh': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Penuh': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'Confirmed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'Paid': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'Unpaid': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    'Failed': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };
  
  return statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
};

// Fungsi helper untuk mendapatkan durasi dalam menit
export const getDurationMinutes = (durationString) => {
  const match = durationString.match(/(\d+)j\s*(\d+)m/);
  if (match) {
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  }
  return 0;
};

// Fungsi helper untuk sort flights
export const sortFlights = (flights, sortBy) => {
  const sorted = [...flights];
  
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'duration-asc':
      return sorted.sort((a, b) => a.durationMinutes - b.durationMinutes);
    case 'duration-desc':
      return sorted.sort((a, b) => b.durationMinutes - a.durationMinutes);
    case 'departure-asc':
      return sorted.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    case 'departure-desc':
      return sorted.sort((a, b) => b.departureTime.localeCompare(a.departureTime));
    default:
      return sorted;
  }
};
