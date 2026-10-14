import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { formatPrice, formatDate, getStatusBadge } from "../../data/mockData";
import BookingDetailModal from "../../components/BookingDetailModal";
import ETicketModal from "../../components/ETicketModal";
import ConfirmModal from "../../components/ConfirmModal";
import Footer from "../../components/Footer";
import {
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineDownload,
  AiOutlineEye,
  AiOutlineSearch,
} from "react-icons/ai";
import { FaPlane, FaMapMarkerAlt } from "react-icons/fa";

const MyBookings = () => {
  const { bookings, requestRefund } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showETicketModal, setShowETicketModal] = useState(false);
  const [refundConfirm, setRefundConfirm] = useState({
    isOpen: false,
    booking: null,
  });
  const [refundReason, setRefundReason] = useState("");

  const userBookings = bookings.filter((b) => b.email === user?.email);

  const filteredBookings = userBookings.filter((booking) => {
    // Tab filter
    if (activeTab === "upcoming") {
      const departureDate = new Date(booking.departureDate);
      const today = new Date();
      if (departureDate < today || booking.status === "Cancelled") return false;
    }
    if (activeTab === "completed") {
      const departureDate = new Date(booking.departureDate);
      const today = new Date();
      if (departureDate >= today || booking.status !== "Confirmed")
        return false;
    }
    if (activeTab === "cancelled") {
      if (booking.status !== "Cancelled") return false;
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        booking.bookingCode.toLowerCase().includes(search) ||
        booking.flightNumber.toLowerCase().includes(search) ||
        booking.airline.toLowerCase().includes(search) ||
        booking.route.toLowerCase().includes(search)
      );
    }

    return true;
  });

  const tabs = [
    { id: "all", label: "Semua", count: userBookings.length },
    {
      id: "upcoming",
      label: "Upcoming",
      count: userBookings.filter((b) => {
        const date = new Date(b.departureDate);
        return date >= new Date() && b.status !== "Cancelled";
      }).length,
    },
    {
      id: "completed",
      label: "Completed",
      count: userBookings.filter((b) => {
        const date = new Date(b.departureDate);
        return date < new Date() && b.status === "Confirmed";
      }).length,
    },
    {
      id: "cancelled",
      label: "Cancelled",
      count: userBookings.filter((b) => b.status === "Cancelled").length,
    },
  ];

  const isRefundAvailable = (booking) => {
    const today = new Date();
    const departureDate = new Date(booking.departureDate);

    return (
      booking.paymentStatus === "Paid" &&
      booking.status === "Confirmed" &&
      departureDate > today &&
      (!booking.refundStatus ||
        booking.refundStatus === "none" ||
        booking.refundStatus === "rejected")
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/20 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <main className="max-w-6xl px-4 py-6 mx-auto sm:px-6 lg:px-8">
        {/* Search */}
        <div
          className="mb-4 sm:mb-6 animate-slideInUp"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="relative">
            <AiOutlineSearch
              className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2 dark:text-slate-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari berdasarkan kode booking, nomor penerbangan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 text-sm bg-white/90 backdrop-blur-sm border border-gray-300/50 rounded-lg dark:bg-slate-800/90 dark:border-slate-600/50 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all sm:py-3"
            />
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex flex-wrap gap-2 pb-2 mb-4 overflow-x-auto border-b border-gray-200 dark:border-slate-700 sm:mb-6 animate-slideInUp"
          style={{ animationDelay: "0.3s" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-4 py-2.5 font-medium transition-all duration-300 border-b-2 transform hover:scale-105 active:scale-95 sm:px-6 sm:py-3 ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <span className="text-sm sm:text-base">{tab.label}</span>
              <span
                className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                  activeTab === tab.id
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="py-20 text-center sm:py-32 animate-scaleIn">
            <FaPlane
              size={64}
              className="mx-auto mb-6 text-gray-300 dark:text-slate-600 animate-float3D sm:w-20 sm:h-20"
            />
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
              {searchTerm ? "Tidak ada hasil ditemukan" : "Belum ada booking"}
            </h2>
            <p className="mb-8 text-base text-gray-600 sm:text-xl dark:text-gray-400">
              {searchTerm
                ? "Coba ubah kata kunci pencarian Anda"
                : "Mulai cari tiket dan pesan sekarang!"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 text-base font-bold text-white transition-all duration-300 transform shadow-lg bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:scale-95 hover:shadow-xl sm:px-10 sm:py-5 sm:text-xl"
              >
                Cari Tiket Pesawat
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredBookings.map((booking, index) => (
              <div
                key={booking.id}
                className="p-4 transition-all duration-300 border shadow-lg bg-white/90 backdrop-blur-sm border-gray-200/50 rounded-xl dark:bg-slate-800/90 dark:border-slate-700/50 hover:shadow-xl card-3d animate-slideInUp sm:p-6 lg:p-8"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  {/* Left Section */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {booking.bookingCode}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusBadge(
                            booking.status
                          )}`}
                        >
                          {booking.status === "Confirmed" && (
                            <AiOutlineCheckCircle size={14} />
                          )}
                          {booking.status === "Pending" && (
                            <AiOutlineClockCircle size={14} />
                          )}
                          {booking.status === "Cancelled" && (
                            <AiOutlineCloseCircle size={14} />
                          )}
                          {booking.status}
                        </span>
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold ${getStatusBadge(
                            booking.paymentStatus
                          )}`}
                        >
                          {booking.paymentStatus}
                        </span>
                        {booking.refundStatus &&
                          booking.refundStatus !== "none" && (
                            <div className="space-y-2">
                              <span
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                                  booking.refundStatus === "approved"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                    : booking.refundStatus === "requested"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                }`}
                              >
                                {booking.refundStatus === "approved"
                                  ? "Refund Disetujui"
                                  : booking.refundStatus === "requested"
                                  ? "Refund Diproses"
                                  : "Refund Ditolak"}
                              </span>
                              {booking.refundReason && (
                                <div className="p-2 text-xs text-gray-600 rounded dark:text-gray-400 bg-gray-50 dark:bg-slate-700/50">
                                  <strong>Alasan:</strong> {booking.refundReason}
                                </div>
                              )}
                              {booking.refundNote && (
                                <div className="p-2 text-xs text-gray-600 rounded dark:text-gray-400 bg-gray-50 dark:bg-slate-700/50">
                                  <strong>Catatan Admin:</strong> {booking.refundNote}
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    </div>

                    <h3 className="flex items-center gap-2 mb-3 text-xl font-bold text-gray-900 dark:text-white">
                      <FaPlane size={18} />
                      {booking.flightNumber} • {booking.airline}
                    </h3>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <FaMapMarkerAlt size={16} />
                        {booking.route}
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <AiOutlineCalendar size={16} />
                        {formatDate(booking.departureDate)}
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <AiOutlineClockCircle size={16} />
                        {booking.departureTime} - {booking.arrivalTime}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">
                        {booking.passengers?.length || booking.passengers}{" "}
                        penumpang • {booking.class}
                      </div>
                    </div>

                    {booking.passengers &&
                      Array.isArray(booking.passengers) &&
                      booking.passengers.length > 0 && (
                        <div className="p-4 mt-4 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                          <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Penumpang:
                          </div>
                          <div className="space-y-1">
                            {booking.passengers.map((p, i) => (
                              <div
                                key={i}
                                className="text-sm text-gray-600 dark:text-gray-400"
                              >
                                {p.title} {p.name}{" "}
                                {p.seat && `- Kursi ${p.seat}`}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Right Section */}
                  <div className="flex flex-col items-start gap-4 sm:items-end">
                    <div className="text-left sm:text-right">
                      <div className="text-xl font-bold text-blue-600 sm:text-2xl dark:text-blue-400">
                        {formatPrice(booking.totalPrice)}
                      </div>
                      <div className="mt-1 text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                        Dipesan pada {formatDate(booking.bookingDate)}
                      </div>
                    </div>

                    <div className="flex flex-wrap w-full gap-2 sm:w-auto">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowDetailModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-all transform bg-white border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 hover:scale-105 active:scale-95"
                      >
                        <AiOutlineEye size={16} />
                        Detail
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowETicketModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        <AiOutlineDownload size={16} />
                        E-Ticket
                      </button>
                      {isRefundAvailable(booking) && (
                        <button
                          onClick={() =>
                            setRefundConfirm({ isOpen: true, booking })
                          }
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 dark:bg-slate-700 dark:text-red-300 dark:border-red-400/60 dark:hover:bg-slate-600"
                        >
                          <AiOutlineCloseCircle size={16} />
                          Ajukan Refund
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <BookingDetailModal
        booking={selectedBooking}
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedBooking(null);
        }}
      />
      <ETicketModal
        booking={selectedBooking}
        isOpen={showETicketModal}
        onClose={() => {
          setShowETicketModal(false);
          setSelectedBooking(null);
        }}
      />
      <ConfirmModal
        isOpen={refundConfirm.isOpen}
        onClose={() => {
          setRefundConfirm({ isOpen: false, booking: null });
          setRefundReason("");
        }}
        onConfirm={() => {
          if (refundConfirm.booking && refundReason.trim()) {
            requestRefund(refundConfirm.booking.id, refundReason.trim());
            setRefundReason("");
          }
        }}
        type="info"
        title="Ajukan Refund"
        message={
          <div className="space-y-4">
            <p>Anda yakin ingin mengajukan refund untuk pemesanan ini? Admin akan meninjau permintaan Anda.</p>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Alasan Refund <span className="text-red-500">*</span>
              </label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Jelaskan alasan Anda mengajukan refund (minimal 10 karakter)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none dark:bg-slate-700 dark:text-white dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={500}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {refundReason.length}/500 karakter
              </p>
            </div>
          </div>
        }
        confirmText="Ajukan Refund"
        cancelText="Batal"
        confirmDisabled={!refundReason.trim() || refundReason.trim().length < 10}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MyBookings;
