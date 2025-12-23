/* eslint-disable no-unused-vars */
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatPrice, formatDate } from '../../data/mockData';
import Footer from '../../components/Footer';
import {
  AiOutlineCheckCircle,
  AiOutlineDownload,
  AiOutlineHome,
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineMail,
  AiOutlinePhone
} from 'react-icons/ai';
import { FaPlane, FaMapMarkerAlt } from 'react-icons/fa';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, flight } = location.state || {};

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Data booking tidak ditemukan
          </h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Kembali ke Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-4xl px-4 py-12 mx-auto">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full dark:bg-green-900/30">
            <AiOutlineCheckCircle size={48} className="text-green-600 dark:text-green-400" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Pemesanan Berhasil!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Terima kasih telah melakukan pemesanan. Detail tiket telah dikirim ke email Anda.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="p-8 mb-6 bg-white border border-gray-200 shadow-lg rounded-xl dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Kode Booking: {booking.bookingCode}
              </h2>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Booking ID: {booking.id}
              </p>
            </div>
            <div className="text-right">
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                booking.status === 'Confirmed'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}>
                {booking.status}
              </div>
            </div>
          </div>

          {/* Flight Info */}
          <div className="p-6 mb-6 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-900 dark:text-white">
              <FaPlane size={18} />
              Detail Penerbangan
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Maskapai</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {booking.airline} - {booking.flightNumber}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <FaMapMarkerAlt size={12} />
                  Rute
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">{booking.route}</div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <AiOutlineCalendar size={12} />
                  Tanggal Keberangkatan
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {formatDate(booking.departureDate)}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <AiOutlineClockCircle size={12} />
                  Waktu
                </div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {booking.departureTime} - {booking.arrivalTime}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Kelas</div>
                <div className="font-semibold text-gray-900 dark:text-white">{booking.class}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Penumpang</div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {booking.passengers?.length || booking.passengers} orang
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="p-6 mb-6 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Informasi Kontak</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <AiOutlineMail size={16} />
                {booking.email}
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <AiOutlinePhone size={16} />
                {booking.phone}
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Ringkasan Pembayaran</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatPrice(booking.basePrice || booking.totalPrice)}
                </span>
              </div>
              {booking.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Pajak & Fee</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatPrice(booking.tax)}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-blue-200 dark:border-blue-800">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {formatPrice(booking.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => navigate('/my-bookings')}
            className="flex items-center justify-center flex-1 gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <AiOutlineDownload size={18} />
            Lihat Semua Booking
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center flex-1 gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <AiOutlineHome size={18} />
            Kembali ke Home
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BookingSuccess;
