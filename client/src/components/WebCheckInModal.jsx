import React, { useState } from "react";
import {
  AiOutlineClose,
  AiOutlineCheckCircle,
  AiOutlinePrinter,
  AiOutlineWarning,
  AiOutlineSafety,
  AiOutlineArrowRight,
} from "react-icons/ai";
import { FaPlane, FaSuitcase, FaQrcode } from "react-icons/fa";
import { formatDate } from "../data/mockData";

export default function WebCheckInModal({ isOpen, onClose, booking }) {
  const [step, setStep] = useState(1); // 1: Declaration, 2: Seat confirmation, 3: Boarding Pass
  const [declared, setDeclared] = useState(false);

  if (!isOpen || !booking) return null;

  const passengers = booking.passengers || [
    {
      name: booking.passengerName || "Penumpang",
      seat: booking.seats?.[0] || "12A",
      idNumber: "3171012345678901",
    },
  ];

  // Calculate boarding time (45 mins before departure)
  const departureTime = booking.departureTime || "08:00";
  const [depHour, depMin] = departureTime.split(":").map(Number);
  const totalDepMins = depHour * 60 + depMin;
  const boardingMins = Math.max(0, totalDepMins - 45);
  const boardingTime = `${String(Math.floor(boardingMins / 60)).padStart(
    2,
    "0"
  )}:${String(boardingMins % 60).padStart(2, "0")}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-gray-100 shadow-2xl rounded-2xl dark:bg-slate-900 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header (Hidden on print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-linear-to-r from-blue-700 via-indigo-700 to-sky-700 text-white print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <FaPlane size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Online Web Check-In</h3>
              <p className="text-xs text-blue-100">
                Penerbangan {booking.flightNumber} • {booking.from} → {booking.to}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 transition-colors rounded-lg hover:bg-white/10 hover:text-white"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* STEP 1: SAFETY & DANGEROUS GOODS DECLARATION */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl dark:bg-amber-950/30 dark:border-amber-800/60">
                <AiOutlineWarning size={32} className="text-amber-600 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                    Pemberitahuan Keselamatan Penerbangan (ICAO / IATA)
                  </h4>
                  <p className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-0.5">
                    Demi keselamatan penerbangan, penumpang dilarang membawa barang berbahaya (Dangerous Goods) di bagasi kabin maupun bagasi terdaftar.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl dark:bg-slate-800 dark:border-slate-700">
                  <div className="text-xl mb-1">🔋</div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Powerbank &gt; 160Wh</span>
                  <span className="block text-[10px] text-red-500 font-bold mt-0.5">DILARANG</span>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl dark:bg-slate-800 dark:border-slate-700">
                  <div className="text-xl mb-1">🔥</div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Zat Mudah Terbakar</span>
                  <span className="block text-[10px] text-red-500 font-bold mt-0.5">DILARANG</span>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl dark:bg-slate-800 dark:border-slate-700">
                  <div className="text-xl mb-1">🔪</div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Benda Tajam di Kabin</span>
                  <span className="block text-[10px] text-red-500 font-bold mt-0.5">DILARANG</span>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl dark:bg-slate-800 dark:border-slate-700">
                  <div className="text-xl mb-1">🧯</div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Gas &amp; Aerosol</span>
                  <span className="block text-[10px] text-red-500 font-bold mt-0.5">DILARANG</span>
                </div>
              </div>

              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl dark:border-slate-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                <input
                  type="checkbox"
                  checked={declared}
                  onChange={(e) => setDeclared(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  Saya menyatakan bahwa saya memahami ketentuan barang berbahaya, tidak membawa barang terlarang, serta dalam kondisi sehat untuk melakukan perjalanan udara.
                </span>
              </label>

              <button
                disabled={!declared}
                onClick={() => setStep(2)}
                className={`w-full py-3.5 px-4 font-bold text-sm text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                  declared
                    ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25 active:scale-98"
                    : "bg-gray-400 cursor-not-allowed opacity-60"
                }`}
              >
                <span>Lanjut Konfirmasi Penumpang</span>
                <AiOutlineArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 2: PASSENGERS & SEAT CONFIRMATION */}
          {step === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                Konfirmasi Penumpang &amp; Kursi
              </h4>

              <div className="space-y-3">
                {passengers.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl dark:bg-slate-800 dark:border-slate-700"
                  >
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Penumpang {idx + 1}
                      </div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white uppercase">
                        {p.name || p.passenger_name || booking.passengerName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        No. Identitas: {p.idNumber || p.id_number || "3171012345678901"}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 dark:text-gray-400 block">Nomor Kursi</span>
                      <span className="inline-block px-3 py-1 mt-1 text-sm font-mono font-bold text-blue-700 bg-blue-100 rounded-lg dark:bg-blue-900/40 dark:text-blue-300">
                        {p.seat || p.seat_number || `${12 + idx}A`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl dark:bg-blue-950/30 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300 flex items-center gap-2">
                <AiOutlineSafety size={18} className="shrink-0 text-blue-600" />
                <span>Setelah diterbitkan, kursi penerbangan Anda terkonfirmasi dan boarding pass resmi akan diterbitkan.</span>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="py-3 px-4 text-xs font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 px-4 font-bold text-sm text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform active:scale-98 flex items-center justify-center gap-2"
                >
                  <AiOutlineCheckCircle size={18} />
                  <span>Terbitkan Digital Boarding Pass</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: AIRLINE BOARDING PASS (PRINTABLE) */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Success Badge */}
              <div className="text-center print:hidden">
                <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-full dark:bg-emerald-900/40 dark:text-emerald-400">
                  <AiOutlineCheckCircle size={28} />
                </div>
                <h4 className="text-base font-bold text-gray-900 dark:text-white">
                  Check-in Berhasil!
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tunjukkan boarding pass ini di pintu keberangkatan (Security &amp; Gate).
                </p>
              </div>

              {/* Realistic Airline Boarding Pass UI Card */}
              {passengers.map((p, idx) => (
                <div
                  key={idx}
                  className="border-2 border-gray-300 rounded-2xl shadow-xl overflow-hidden bg-white dark:bg-slate-900 dark:border-slate-700 print:shadow-none print:border-black"
                >
                  {/* Top Airline Banner */}
                  <div className="px-6 py-3.5 bg-linear-to-r from-blue-700 to-indigo-800 text-white flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FaPlane size={18} />
                      <span className="font-bold tracking-wider text-sm uppercase">
                        {booking.airline || "FlyBook Airways"}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold tracking-widest uppercase bg-white/20 px-2.5 py-0.5 rounded-full">
                      BOARDING PASS
                    </span>
                  </div>

                  {/* Flight Info Grid */}
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-dashed border-gray-300 dark:border-slate-700">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">Penumpang</span>
                        <div className="text-sm font-bold text-gray-900 dark:text-white uppercase truncate">
                          {p.name || p.passenger_name || booking.passengerName}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">Penerbangan</span>
                        <div className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono">
                          {booking.flightNumber}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">Tanggal</span>
                        <div className="text-xs font-bold text-gray-900 dark:text-white">
                          {formatDate(booking.departureDate)}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">Kelas</span>
                        <div className="text-xs font-bold text-gray-900 dark:text-white">
                          {booking.class || "Economy Class"}
                        </div>
                      </div>
                    </div>

                    {/* Route Details */}
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                          {booking.from?.split("(")[1]?.replace(")", "") || "CGK"}
                        </span>
                        <span className="block text-xs text-gray-500">{booking.from || "Jakarta"}</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center px-4">
                        <span className="text-[10px] text-gray-400 mb-1">Non-Stop</span>
                        <div className="w-full flex items-center">
                          <div className="w-2 h-2 rounded-full bg-blue-600" />
                          <div className="flex-1 border-t-2 border-dashed border-blue-400 dark:border-blue-600 mx-1" />
                          <FaPlane className="text-blue-600 transform rotate-90 mx-1" size={14} />
                          <div className="flex-1 border-t-2 border-dashed border-blue-400 dark:border-blue-600 mx-1" />
                          <div className="w-2 h-2 rounded-full bg-blue-600" />
                        </div>
                        <span className="text-[10px] font-mono text-gray-500 mt-1">
                          {booking.departureTime} - {booking.arrivalTime}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                          {booking.to?.split("(")[1]?.replace(")", "") || "DPS"}
                        </span>
                        <span className="block text-xs text-gray-500">{booking.to || "Bali"}</span>
                      </div>
                    </div>

                    {/* Gate, Terminal, Boarding Time & Seat highlight */}
                    <div className="grid grid-cols-4 gap-2 p-3 bg-gray-50 dark:bg-slate-800/80 rounded-xl text-center border border-gray-200 dark:border-slate-700">
                      <div>
                        <span className="text-[10px] text-gray-500 font-semibold uppercase">Terminal</span>
                        <div className="text-base font-bold text-gray-900 dark:text-white">T3</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-semibold uppercase">Gate</span>
                        <div className="text-base font-bold text-blue-600 dark:text-blue-400">4B</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-semibold uppercase">Boarding</span>
                        <div className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono">
                          {boardingTime}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-semibold uppercase">Kursi</span>
                        <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                          {p.seat || p.seat_number || `${12 + idx}A`}
                        </div>
                      </div>
                    </div>

                    {/* Barcode & Sequence info */}
                    <div className="pt-2 flex items-center justify-between text-xs text-gray-500">
                      <div>
                        <div className="font-mono text-gray-400 text-[10px]">
                          SEQ: 0{42 + idx} • ZONE 2 • CABIN: 7KG
                        </div>
                        <div className="font-mono text-gray-700 dark:text-gray-300 font-bold mt-0.5">
                          E-TKT: {booking.bookingCode}-{idx + 1}
                        </div>
                      </div>
                      {/* Barcode representation */}
                      <div className="flex items-center gap-2">
                        <div className="font-mono text-[9px] tracking-widest text-right">
                          <span className="block font-bold">BOARDING READY</span>
                          <span className="text-emerald-600">VERIFIED</span>
                        </div>
                        <FaQrcode size={36} className="text-gray-800 dark:text-gray-200" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Print and Close buttons */}
              <div className="flex gap-3 print:hidden">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 text-xs font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300"
                >
                  Selesai
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-3 px-4 font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <AiOutlinePrinter size={18} />
                  <span>Cetak / Simpan Boarding Pass</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
