import React, { useState } from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import WebCheckInModal from "../../components/WebCheckInModal";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  AiOutlineSearch,
  AiOutlineCheckCircle,
  AiOutlineWarning,
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineSafety,
} from "react-icons/ai";
import { FaPlane, FaSuitcase } from "react-icons/fa";
import { formatDate } from "../../data/mockData";

export default function WebCheckIn() {
  const { bookings } = useData();
  const { user } = useAuth();
  const [bookingCodeInput, setBookingCodeInput] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Confirmed bookings eligible for check-in
  const eligibleBookings = bookings.filter(
    (b) =>
      (!user?.email || b.email === user?.email || b.isBackend) &&
      (b.status === "Confirmed" || b.status === "Paid" || b.paymentStatus === "Paid")
  );

  const handleSearchCode = (e) => {
    e.preventDefault();
    setSearchError("");
    const found = bookings.find(
      (b) =>
        b.bookingCode?.toUpperCase() === bookingCodeInput.trim().toUpperCase()
    );

    if (found) {
      setSelectedBooking(found);
      setShowModal(true);
    } else {
      setSearchError(
        "Kode booking tidak ditemukan atau status tiket belum lunas / confirmed."
      );
    }
  };

  const handleOpenCheckIn = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col">
      <Header
        title="Online Web Check-In"
        subtitle="Check-in mandiri 24 jam sebelum keberangkatan & dapatkan Boarding Pass digital"
        icon={<FaPlane size={20} />}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Banner Announcement */}
        <div className="p-6 mb-8 text-white bg-linear-to-r from-blue-700 via-indigo-700 to-sky-700 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/20 rounded-full inline-block">
              Terbuka 24 Jam Sebelum Terbang
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Lewati Antrean Konter di Bandara
            </h2>
            <p className="text-sm text-blue-100 max-w-xl">
              Pilih tempat duduk, konfirmasi deklarasi keselamatan penerbangan, dan simpan Boarding Pass langsung di smartphone Anda.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm shrink-0 border border-white/20">
            <FaSuitcase size={28} className="text-yellow-300" />
            <div className="text-xs">
              <span className="font-bold block">Bagasi Kabin 7 KG</span>
              <span className="text-blue-100">Langsung ke Security Check</span>
            </div>
          </div>
        </div>

        {/* Search by Booking Code Card */}
        <div className="p-6 mb-8 bg-white border border-gray-200 rounded-2xl shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <AiOutlineSearch size={20} className="text-blue-600" />
            Cari Tiket Berdasarkan Kode Booking
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Masukkan 6–10 digit kode booking (contoh: FBK89271) yang tercantum pada E-Tiket Anda.
          </p>

          <form onSubmit={handleSearchCode} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Contoh: FBK12345"
              value={bookingCodeInput}
              onChange={(e) => setBookingCodeInput(e.target.value)}
              className="flex-1 px-4 py-3 text-sm font-mono tracking-wider uppercase border border-gray-300 rounded-xl dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all active:scale-95 shrink-0"
            >
              Cari &amp; Check-In
            </button>
          </form>

          {searchError && (
            <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 dark:bg-rose-950/30 dark:border-rose-900 flex items-center gap-2">
              <AiOutlineWarning size={16} />
              <span>{searchError}</span>
            </div>
          )}
        </div>

        {/* Active Eligible Bookings List */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Penerbangan Anda yang Siap Check-In ({eligibleBookings.length})
          </h3>

          {eligibleBookings.length === 0 ? (
            <div className="p-8 text-center bg-white border border-dashed border-gray-300 rounded-2xl dark:bg-slate-900 dark:border-slate-800">
              <AiOutlineCalendar size={36} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Belum ada tiket berstatus lunas yang memerlukan check-in.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Lakukan pemesanan tiket penerbangan terlebih dahulu untuk menggunakan fitur ini.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {eligibleBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-base text-blue-600 dark:text-blue-400">
                        {b.bookingCode}
                      </span>
                      <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 rounded-full">
                        Siap Check-in
                      </span>
                    </div>
                    <div className="text-base font-bold text-gray-900 dark:text-white">
                      {b.airline} • {b.flightNumber}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex flex-wrap items-center gap-3">
                      <span>{b.route || `${b.from} → ${b.to}`}</span>
                      <span>•</span>
                      <span>{formatDate(b.departureDate)}</span>
                      <span>•</span>
                      <span>{b.departureTime} WIB</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenCheckIn(b)}
                    className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md transition-all transform active:scale-95 shrink-0 flex items-center justify-center gap-2"
                  >
                    <AiOutlineCheckCircle size={16} />
                    <span>Check-In Sekarang</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Web Check-In Modal */}
      <WebCheckInModal
        isOpen={showModal}
        booking={selectedBooking}
        onClose={() => {
          setShowModal(false);
          setSelectedBooking(null);
        }}
      />
    </div>
  );
}
