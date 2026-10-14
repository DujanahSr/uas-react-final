import React from "react";
import {
  AiOutlineClose,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineCheckCircle,
  AiOutlineDollarCircle,
  AiOutlineFileText,
} from "react-icons/ai";
import { FaPlane, FaMapMarkerAlt, FaUserFriends } from "react-icons/fa";
import { formatPrice, formatDate, getStatusBadge } from "../data/mockData";

const BookingDetailModal = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all">
        {/* Header dengan gradient */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <AiOutlineFileText size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Detail Pemesanan</h2>
                <p className="text-blue-100 text-sm mt-1">
                  Kode Booking: {booking.bookingCode}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <AiOutlineClose size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <AiOutlineCheckCircle className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Status Booking
                  </p>
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 mt-1 text-sm font-semibold rounded-full ${getStatusBadge(
                      booking.status
                    )}`}
                  >
                    {booking.status === "Confirmed" && (
                      <AiOutlineCheckCircle size={14} />
                    )}
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <AiOutlineDollarCircle className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Status Pembayaran
                  </p>
                  <span className="inline-flex items-center gap-1 px-3 py-1 mt-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <AiOutlineCheckCircle size={14} />
                    Paid
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Flight Information */}
          <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaPlane className="text-blue-600" size={20} />
              Informasi Penerbangan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FaPlane size={16} className="text-blue-600" />
                  <span className="font-semibold">{booking.flightNumber}</span>
                  <span className="text-gray-500">•</span>
                  <span>{booking.airline}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FaMapMarkerAlt size={16} className="text-green-600" />
                  <span>{booking.route}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <AiOutlineCalendar size={16} className="text-purple-600" />
                  <span>{formatDate(booking.departureDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <AiOutlineClockCircle
                    size={16}
                    className="text-orange-600"
                  />
                  <span>
                    {booking.departureTime} - {booking.arrivalTime}
                  </span>
                </div>
                <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-medium">
                  {booking.class}
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Harga
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(booking.totalPrice)}
                  </p>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>Harga dasar: {formatPrice(booking.basePrice)}</span>
                    {booking.tax > 0 && (
                      <span> • Pajak: {formatPrice(booking.tax)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Passenger Information */}
          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AiOutlineUser className="text-purple-600" size={20} />
              Informasi Penumpang
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <AiOutlineUser size={16} className="text-purple-600" />
                  <span className="font-medium">{booking.passengerName}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FaUserFriends size={16} className="text-purple-600" />
                  <span>
                    {Array.isArray(booking.passengers)
                      ? booking.passengers.length
                      : booking.passengers || 0}{" "}
                    Penumpang
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <AiOutlineMail size={16} className="text-purple-600" />
                  <span>{booking.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <AiOutlinePhone size={16} className="text-purple-600" />
                  <span>{booking.phone}</span>
                </div>
              </div>

              {booking.passengers &&
                Array.isArray(booking.passengers) &&
                booking.passengers.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Detail Penumpang:
                    </p>
                    <div className="space-y-2">
                      {booking.passengers.map((passenger, index) => (
                        <div
                          key={index}
                          className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {passenger.title} {passenger.name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {passenger.idNumber} • DOB: {passenger.dob}
                              </p>
                            </div>
                            {passenger.seat && (
                              <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg text-sm font-medium">
                                Kursi {passenger.seat}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Booking Information */}
          <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl border border-indigo-200 dark:border-indigo-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AiOutlineFileText className="text-indigo-600" size={20} />
              Informasi Pemesanan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tanggal Pemesanan
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatDate(booking.bookingDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Metode Pembayaran
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {booking.paymentMethod || "Credit Card"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Booking ID
                </p>
                <p className="font-semibold text-gray-900 dark:text-white font-mono">
                  {booking.id}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;

