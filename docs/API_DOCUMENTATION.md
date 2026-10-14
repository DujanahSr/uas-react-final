# 🛫 FlyBook Enterprise API Documentation (v1.0.0)

Dokumentasi lengkap REST API Backend **FlyBook**, dibangun dengan arsitektur berstandar industri menggunakan **Golang (Gin)**, **PostgreSQL** (ACID Transaction), **MongoDB** (Aircraft Cabin Layouts), dan **Redis** (15-Minute Distributed Seat Locking & Idempotency Key Caching).

---

## 📌 Base URL & Konvensi

* **Local Development**: `http://localhost:8080/api/v1`
* **Format Response**: Semua response menggunakan struktur JSON seragam:
  ```json
  {
    "status": "success | error",
    "message": "Pesan deskriptif dalam Bahasa Indonesia",
    "data": { ... },
    "error": null
  }
  ```

---

## 🛡️ Header Penting

| Header | Wajib | Keterangan |
|---|---|---|
| `Content-Type` | Ya | `application/json` |
| `Authorization` | Untuk Protected Route | `Bearer <JWT_TOKEN>` |
| `X-Idempotency-Key` | Ya (Pemesanan & Lock) | UUID Unik v4 mencegah double submit kartu kredit / kursi ganda |

---

## 1. Authentication Endpoints

### 1.1 Register User
* **Method**: `POST`
* **Path**: `/auth/register`
* **Request Body**:
  ```json
  {
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "password": "Password123",
    "phone": "081234567890"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "Pendaftaran akun berhasil",
    "data": {
      "token": "eyJhbGciOi...",
      "user": {
        "id": "11111111-2222-3333-4444-555555555555",
        "name": "Budi Santoso",
        "email": "budi@example.com",
        "phone": "081234567890",
        "role": "CUSTOMER"
      }
    }
  }
  ```

### 1.2 Login
* **Method**: `POST`
* **Path**: `/auth/login`
* **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "user123"
  }
  ```
* **Akun Bawaan (Seeded)**:
  * **Customer**: `user@example.com` / `user123`
  * **Super Admin**: `admin@gmail.com` / `admin123`

### 1.3 Get Me (Profile)
* **Method**: `GET`
* **Path**: `/auth/me`
* **Headers**: `Authorization: Bearer <token>`

---

## 2. Flight & Dynamic Seat Map Endpoints

### 2.1 Search Flights
* **Method**: `GET`
* **Path**: `/flights?from=CGK&to=DPS&date=2026-10-16&sort_by=price_asc`
* **Query Params**:
  * `from`: Kode bandara asal (contoh: `CGK`)
  * `to`: Kode bandara tujuan (contoh: `DPS`)
  * `date`: Tanggal penerbangan `YYYY-MM-DD`
  * `airline`: Filter nama maskapai
  * `min_price` & `max_price`: Range harga
  * `sort_by`: `price_asc`, `price_desc`, `departure_asc`, `duration_asc`

### 2.2 Get Dynamic Seat Map
* **Method**: `GET`
* **Path**: `/flights/:id/seats`
* **Deskripsi**: Menggabungkan data denah kabin pesawat dari MongoDB dengan ketersediaan kursi real-time (PostgreSQL & Redis Lock).
* **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "layout": {
        "aircraft_model": "Boeing 737-800",
        "total_rows": 27,
        "columns": ["A", "B", "C", "D", "E", "F"],
        "aisle_indices": [3]
      },
      "seats": [
        {
          "seat_number": "1A",
          "class_type": "BUSINESS",
          "calculated_price": 2537500,
          "status": "AVAILABLE",
          "is_locked": false
        }
      ]
    }
  }
  ```

### 2.3 Lock Seat (15-Minute Redis Distributed Lock)
* **Method**: `POST`
* **Path**: `/flights/:id/seats/lock`
* **Headers**: `X-Idempotency-Key: <uuid>`
* **Request Body**:
  ```json
  {
    "seat_number": "10A",
    "user_id": "11111111-2222-3333-4444-555555555555"
  }
  ```
* **Mekanisme**:
  * Redis `SET NX EX 900` mengunci kursi secara instan di level cache.
  * Baris kursi di PostgreSQL diperbarui menjadi status `LOCKED`.
  * Jika kursi berhasil dikunci oleh user lain, otomatis mengembalikan `409 Conflict`.

### 2.4 Unlock Seat
* **Method**: `POST`
* **Path**: `/flights/:id/seats/unlock`
* **Request Body**:
  ```json
  {
    "seat_number": "10A",
    "user_id": "11111111-2222-3333-4444-555555555555"
  }
  ```

---

## 3. Booking & Checkout Endpoints

### 3.1 Create Booking
* **Method**: `POST`
* **Path**: `/bookings`
* **Headers**: 
  * `Authorization: Bearer <token>`
  * `X-Idempotency-Key: <uuid>`
* **Request Body**:
  ```json
  {
    "flight_id": "e9f3189b-17b5-459c-a050-1af21a4cd694",
    "payment_method": "CREDIT_CARD",
    "passengers": [
      {
        "seat_number": "10A",
        "passenger_name": "Budi Santoso",
        "id_type": "KTP",
        "id_number": "3171012345678901",
        "date_of_birth": "1995-08-17"
      }
    ]
  }
  ```
* **Response (201 Created)**:
  * Menghasilkan kode booking unik (contoh: `FBK7A8B9C0D`).
  * Status awal: `PENDING_PAYMENT`.
  * `expires_at`: 15 menit dari pembuatan.
  * Menghasilkan e-ticket individual dengan QR hash.

### 3.2 My Bookings
* **Method**: `GET`
* **Path**: `/bookings/my`
* **Headers**: `Authorization: Bearer <token>`
* **Response**: Daftar riwayat pemesanan pengguna login beserta tiket & kode QR.

### 3.3 Payment Gateway Webhook
* **Method**: `POST`
* **Path**: `/payments/webhook`
* **Request Body**:
  ```json
  {
    "order_id": "FBK7A8B9C0D",
    "transaction_id": "TRX-998877",
    "transaction_status": "settlement"
  }
  ```
* **Efek**: Mengubah status booking menjadi `CONFIRMED` dan kursi pesawat menjadi `BOOKED`.

---

## 4. Observability & Monitoring

### 4.1 Health Check
* **Method**: `GET`
* **Path**: `/health`
* **Response**:
  ```json
  {
    "databases": {
      "mongodb": "healthy",
      "postgres": "healthy",
      "redis": "healthy"
    },
    "message": "FlyBook Enterprise API is running",
    "status": "success",
    "version": "1.0.0"
  }
  ```

### 4.2 Prometheus Metrics
* **Method**: `GET`
* **Path**: `/metrics`
* **Format**: Prometheus Exposition Text Format (untuk scraping Grafana).
