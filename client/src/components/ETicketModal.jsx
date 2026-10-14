import React, { useRef } from "react";
import {
  AiOutlineClose,
  AiOutlineDownload,
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { FaPlane, FaMapMarkerAlt, FaQrcode } from "react-icons/fa";
import { formatPrice, formatDate } from "../data/mockData";

const ETicketModal = ({ booking, isOpen, onClose }) => {
  const printContentRef = useRef(null);
  const downloadLinkRef = useRef(null);

  if (!isOpen || !booking) return null;

  const handleDownload = () => {
    // Unduh E-Ticket sebagai file HTML (bisa dibuka/print / save as PDF di mana saja)
    if (!printContentRef.current) return;

    const passengerRows =
      booking.passengers && Array.isArray(booking.passengers)
        ? booking.passengers
            .map(
              (p, i) => `
          <div class="row">
            <span class="label">Penumpang ${i + 1}:</span>
            <span class="value">${p.title} ${p.name}${
                p.seat ? ` • Kursi ${p.seat}` : ""
              }</span>
          </div>
        `
            )
            .join("")
        : "";

    const ticketHTML = `
      <div class="ticket">
        <div class="header">
          <div class="header-left">
            <div class="logo-circle">✈️</div>
            <div>
              <h1>E-Ticket</h1>
              <p>${booking.airline} • ${booking.flightNumber}</p>
            </div>
          </div>
          <div class="header-right">
            <div class="label">Kode Booking</div>
            <div class="code">${booking.bookingCode}</div>
            <div class="status">CONFIRMED</div>
          </div>
        </div>

        <div class="section section-grid">
          <div>
            <h2>Detail Penerbangan</h2>
            <div class="row">
              <span class="label">Dari</span>
              <span class="value">${booking.from}</span>
            </div>
            <div class="row">
              <span class="label">Ke</span>
              <span class="value">${booking.to}</span>
            </div>
            <div class="row">
              <span class="label">Tanggal</span>
              <span class="value">${formatDate(booking.departureDate)}</span>
            </div>
            <div class="row">
              <span class="label">Waktu</span>
              <span class="value">${booking.departureTime} - ${
      booking.arrivalTime
    }</span>
            </div>
          </div>
          <div>
            <h2>Informasi Tambahan</h2>
            <div class="row">
              <span class="label">Kelas</span>
              <span class="value">${booking.class}</span>
            </div>
            <div class="row">
              <span class="label">Metode Pembayaran</span>
              <span class="value">${
                booking.paymentMethod || "Credit Card"
              }</span>
            </div>
            <div class="row">
              <span class="label">Tanggal Booking</span>
              <span class="value">${formatDate(booking.bookingDate)}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Penumpang</h2>
          ${
            passengerRows ||
            `<p class="value">Data penumpang tidak tersedia</p>`
          }
        </div>

        <div class="section section-grid">
          <div>
            <h2>Pembayaran</h2>
            <div class="row">
              <span class="label">Total</span>
              <span class="value total">${formatPrice(
                booking.totalPrice
              )}</span>
            </div>
            <div class="row">
              <span class="label">Status Pembayaran</span>
              <span class="value">${booking.paymentStatus || "Paid"}</span>
            </div>
          </div>
          <div class="qr-box">
            <div class="qr-placeholder">QR CODE</div>
            <p class="qr-text">Tunjukkan e-ticket ini saat check-in</p>
          </div>
        </div>

        <div class="footer">
          <p>E-ticket ini diterbitkan oleh FlyBook. Simpan file ini dan tunjukkan saat proses check-in.</p>
        </div>
      </div>
    `;

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>E-Ticket - ${booking.bookingCode}</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 16px; background: #e5e7eb; }
            .ticket {
              border-radius: 16px;
              padding: 24px;
              max-width: 900px;
              margin: 0 auto;
              background: #ffffff;
              box-shadow: 0 15px 30px rgba(15, 23, 42, 0.15);
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 16px;
              padding: 16px 20px;
              border-radius: 12px;
              background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
              color: white;
              margin-bottom: 20px;
            }
            .header-left { display: flex; align-items: center; gap: 12px; }
            .logo-circle {
              width: 40px;
              height: 40px;
              border-radius: 999px;
              background: rgba(255,255,255,0.15);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 20px;
            }
            .header-left h1 { margin: 0; font-size: 22px; }
            .header-left p { margin: 2px 0 0; font-size: 13px; opacity: 0.9; }
            .header-right { text-align: right; }
            .header-right .label { font-size: 11px; opacity: 0.85; }
            .header-right .code { font-size: 20px; font-weight: 700; letter-spacing: 1px; }
            .header-right .status {
              display: inline-block;
              margin-top: 4px;
              padding: 4px 10px;
              border-radius: 999px;
              background: rgba(22, 163, 74, 0.2);
              color: #bbf7d0;
              font-size: 11px;
              font-weight: 600;
            }
            .section {
              margin: 18px 0;
              padding: 16px 18px;
              border-radius: 12px;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
            }
            .section h2 {
              margin: 0 0 10px;
              font-size: 15px;
              color: #111827;
            }
            .row {
              display: flex;
              justify-content: space-between;
              gap: 12px;
              margin: 6px 0;
              font-size: 13px;
            }
            .row .label {
              font-weight: 600;
              color: #6b7280;
              min-width: 120px;
            }
            .row .value {
              color: #111827;
              text-align: right;
              flex: 1;
            }
            .row .value.total {
              font-size: 18px;
              font-weight: 700;
              color: #16a34a;
            }
            .section-grid {
              display: grid;
              grid-template-columns: 1.5fr 1.2fr;
              gap: 16px;
            }
            .qr-box {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 8px;
            }
            .qr-placeholder {
              width: 110px;
              height: 110px;
              border-radius: 12px;
              border: 2px dashed #9ca3af;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 11px;
              color: #6b7280;
            }
            .qr-text {
              margin: 0;
              font-size: 11px;
              color: #6b7280;
              text-align: center;
            }
            .footer {
              margin-top: 16px;
              font-size: 11px;
              color: #6b7280;
              text-align: center;
            }
            @media (max-width: 640px) {
              body { padding: 8px; }
              .ticket { padding: 16px; }
              .header { flex-direction: column; align-items: flex-start; }
              .header-right { text-align: left; }
              .section-grid { grid-template-columns: 1fr; }
              .row { flex-direction: column; align-items: flex-start; }
              .row .value { text-align: left; }
            }
          </style>
        </head>
        <body>
          ${ticketHTML}
        </body>
      </html>
    `;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    if (downloadLinkRef.current) {
      downloadLinkRef.current.href = url;
      downloadLinkRef.current.download = `e-ticket-${booking.bookingCode}.html`;
      downloadLinkRef.current.click();

      // Cleanup URL setelah sedikit delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    } else {
      console.error("Download link ref not available");
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all">
        {/* Header dengan gradient */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <FaPlane size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">E-Ticket</h2>
                <p className="text-blue-100 text-sm mt-1">
                  {booking.airline} - {booking.flightNumber}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors flex items-center gap-2"
                title="Download/Print"
              >
                <AiOutlineDownload size={20} />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <AiOutlineClose size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* E-Ticket Content */}
        <div
          ref={printContentRef}
          id="e-ticket-content"
          className="p-6 space-y-6"
        >
          {/* Ticket Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Kode Booking</p>
                <p className="text-3xl font-bold mt-1">{booking.bookingCode}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Status</p>
                <div className="flex items-center gap-2 mt-1">
                  <AiOutlineCheckCircle size={20} />
                  <span className="text-xl font-bold">Confirmed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Flight Details */}
          <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border-2 border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FaPlane className="text-blue-600" size={24} />
                Detail Penerbangan
              </h3>
              <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg font-semibold">
                {booking.class}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg mb-2">
                  <FaMapMarkerAlt
                    className="mx-auto text-green-600 mb-2"
                    size={32}
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Dari
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {booking.from}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <AiOutlineCalendar size={16} />
                  <span className="text-sm">
                    {formatDate(booking.departureDate)}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 mt-1">
                  <AiOutlineClockCircle size={16} />
                  <span className="text-sm font-semibold">
                    {booking.departureTime}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-dashed border-gray-300 dark:border-gray-600"></div>
                  </div>
                  <div className="relative bg-white dark:bg-gray-800 p-3 rounded-full border-2 border-blue-600">
                    <FaPlane className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg mb-2">
                  <FaMapMarkerAlt
                    className="mx-auto text-red-600 mb-2"
                    size={32}
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ke</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                    {booking.to}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <AiOutlineCalendar size={16} />
                  <span className="text-sm">
                    {formatDate(booking.departureDate)}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 mt-1">
                  <AiOutlineClockCircle size={16} />
                  <span className="text-sm font-semibold">
                    {booking.arrivalTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Maskapai
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {booking.airline}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Nomor Penerbangan
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {booking.flightNumber}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Passengers */}
          {booking.passengers &&
            Array.isArray(booking.passengers) &&
            booking.passengers.length > 0 && (
              <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border-2 border-purple-200 dark:border-purple-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Penumpang
                </h3>
                <div className="space-y-3">
                  {booking.passengers.map((passenger, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {passenger.title} {passenger.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {passenger.idNumber}
                          </p>
                        </div>
                        {passenger.seat && (
                          <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-lg font-bold text-lg">
                            {passenger.seat}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Payment & Booking Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border-2 border-green-200 dark:border-green-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Informasi Pembayaran
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Total Harga
                  </span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatPrice(booking.totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Status
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full font-semibold">
                    Paid
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Metode
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {booking.paymentMethod || "Credit Card"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl border-2 border-indigo-200 dark:border-indigo-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Informasi Pemesanan
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Tanggal Booking
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(booking.bookingDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Booking ID
                  </span>
                  <span className="font-mono text-sm text-gray-900 dark:text-white">
                    {booking.id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-center">
            <FaQrcode className="mx-auto text-gray-400 mb-2" size={64} />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tunjukkan QR code ini saat check-in
            </p>
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg inline-block">
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                <span className="text-xs text-gray-500">QR Code</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <AiOutlineDownload size={20} />
              Download
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>

        {/* Hidden link untuk proses download tanpa DOM methods langsung */}
        <a
          ref={downloadLinkRef}
          style={{ display: "none" }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default ETicketModal;
