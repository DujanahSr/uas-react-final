import React, { useState, useEffect, useMemo } from "react";
import { useData } from "../../context/DataContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  AiOutlineSearch,
  AiOutlineClockCircle,
  AiOutlineWarning,
  AiOutlineCheckCircle,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { FaPlaneDeparture, FaPlaneArrival, FaPlane } from "react-icons/fa";

export default function FlightStatus() {
  const { flights } = useData();
  const [boardType, setBoardType] = useState("departures"); // 'departures' or 'arrivals'
  const [selectedAirport, setSelectedAirport] = useState("CGK");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live airport clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const airports = [
    { code: "CGK", name: "Jakarta (Soekarno-Hatta T3)", city: "Jakarta" },
    { code: "DPS", name: "Bali (I Gusti Ngurah Rai)", city: "Denpasar" },
    { code: "SUB", name: "Surabaya (Juanda T1)", city: "Surabaya" },
    { code: "SIN", name: "Singapore (Changi Airport T4)", city: "Singapore" },
  ];

  // Enhanced flight statuses for realistic FIDS board
  const fidsData = useMemo(() => {
    return flights.map((f, idx) => {
      // Deterministic realistic status variations
      let status = "ON TIME";
      let statusColor = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300";
      let remark = "Tepat Waktu";
      let gate = `Gate ${3 + (idx % 8)}B`;
      let terminal = idx % 2 === 0 ? "Terminal 3" : "Terminal 2";

      if (f.status === "DELAYED" || idx === 2) {
        status = "DELAYED";
        statusColor = "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 animate-pulse";
        remark = "Estimasi +45 Mnt (Cuaca)";
      } else if (idx === 1) {
        status = "BOARDING";
        statusColor = "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300";
        remark = "Pintu Terbuka (Panggilan Akhir)";
      } else if (idx === 4) {
        status = "DEPARTED";
        statusColor = "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300";
        remark = "Telah Mengudara";
      }

      const fromCode = f.fromCode || f.from?.match(/\(([^)]+)\)/)?.[1] || "CGK";
      const toCode = f.toCode || f.to?.match(/\(([^)]+)\)/)?.[1] || "DPS";

      return {
        ...f,
        fromCode,
        toCode,
        fidsStatus: status,
        statusColor,
        remark,
        gate,
        terminal,
      };
    });
  }, [flights]);

  // Filter based on Departure vs Arrival and Search Query
  const filteredFlights = fidsData.filter((f) => {
    const matchesAirport =
      boardType === "departures"
        ? f.fromCode === selectedAirport
        : f.toCode === selectedAirport;

    const matchesQuery =
      searchQuery === "" ||
      f.flightNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.airline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.to?.toLowerCase().includes(searchQuery.toLowerCase());

    return (matchesAirport || searchQuery !== "") && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
      {/* Top Airport Header Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/25">
              <FaPlane size={22} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-yellow-400 font-mono flex items-center gap-2">
                FLIGHT INFORMATION DISPLAY SYSTEM (FIDS)
              </h1>
              <p className="text-xs text-slate-400">
                Papan Jadwal Penerbangan Bandara Internasional Real-Time
              </p>
            </div>
          </div>

          {/* Airport Live Clock */}
          <div className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
            <AiOutlineClockCircle className="text-yellow-400" size={20} />
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-mono">
                WAKTU LOKAL BANDARA (WIB)
              </span>
              <span className="text-lg font-mono font-bold text-white tracking-widest">
                {currentTime.toLocaleTimeString("id-ID")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel: Airport Switcher, Departures/Arrivals Tab, Search */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
          {/* Departures vs Arrivals Tabs */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setBoardType("departures")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold tracking-wider uppercase transition-all ${
                boardType === "departures"
                  ? "bg-yellow-400 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FaPlaneDeparture size={16} />
              <span>Keberangkatan (Departures)</span>
            </button>
            <button
              onClick={() => setBoardType("arrivals")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold tracking-wider uppercase transition-all ${
                boardType === "arrivals"
                  ? "bg-yellow-400 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FaPlaneArrival size={16} />
              <span>Kedatangan (Arrivals)</span>
            </button>
          </div>

          {/* Airport Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            {airports.map((airport) => (
              <button
                key={airport.code}
                onClick={() => setSelectedAirport(airport.code)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedAirport === airport.code
                    ? "border-yellow-400 bg-yellow-400/10 text-yellow-400 ring-2 ring-yellow-400/20"
                    : "border-slate-800 bg-slate-800/60 text-slate-400 hover:border-slate-700 hover:text-white"
                }`}
              >
                {airport.code} - {airport.city}
              </button>
            ))}
          </div>

          {/* Flight Search Input */}
          <div className="relative min-w-[240px]">
            <AiOutlineSearch
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari No Penerbangan / Maskapai..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        {/* Airport Flight Board (Split-Flap / LED Style) */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90 text-yellow-400 font-mono text-xs tracking-widest uppercase">
                  <th className="py-4 px-4 font-bold">Waktu</th>
                  <th className="py-4 px-4 font-bold">Penerbangan</th>
                  <th className="py-4 px-4 font-bold">Maskapai</th>
                  <th className="py-4 px-4 font-bold">
                    {boardType === "departures" ? "Tujuan (Destination)" : "Asal (Origin)"}
                  </th>
                  <th className="py-4 px-4 font-bold">Terminal / Gate</th>
                  <th className="py-4 px-4 font-bold">Status</th>
                  <th className="py-4 px-4 font-bold">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs sm:text-sm">
                {filteredFlights.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500 font-sans">
                      <AiOutlineInfoCircle size={32} className="mx-auto mb-2 text-slate-600" />
                      Tidak ada penerbangan yang sesuai dengan filter saat ini.
                    </td>
                  </tr>
                ) : (
                  filteredFlights.map((flight) => (
                    <tr
                      key={flight.id}
                      className="hover:bg-slate-900/60 transition-colors"
                    >
                      {/* Time */}
                      <td className="py-4 px-4 font-bold text-white tracking-widest">
                        {boardType === "departures" ? flight.departureTime : flight.arrivalTime}
                      </td>

                      {/* Flight Number */}
                      <td className="py-4 px-4 font-black text-yellow-300 tracking-wider">
                        {flight.flightNumber}
                      </td>

                      {/* Airline */}
                      <td className="py-4 px-4 font-semibold text-slate-200">
                        {flight.airline}
                      </td>

                      {/* Destination / Origin */}
                      <td className="py-4 px-4 font-bold text-white uppercase tracking-wider">
                        {boardType === "departures" ? flight.to : flight.from}
                      </td>

                      {/* Terminal & Gate */}
                      <td className="py-4 px-4 text-slate-300">
                        <span className="text-yellow-400/90 font-bold">{flight.terminal}</span> • {flight.gate}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-md text-[11px] font-bold border tracking-wider uppercase ${flight.statusColor}`}
                        >
                          {flight.fidsStatus}
                        </span>
                      </td>

                      {/* Remarks */}
                      <td className="py-4 px-4 text-xs text-slate-400 font-sans">
                        {flight.remark}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend / Info Footer */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-950 border border-slate-800/80 rounded-xl text-xs text-slate-400 font-sans">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-white">Status Indikator:</span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Tepat Waktu
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Boarding / Panggilan
            </span>
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-400" /> Terlambat (Delayed)
            </span>
          </div>
          <div>
            Data tersinkronisasi otomatis dengan radar navigasi udara &amp; sistem operasi penerbangan FlyBook.
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
