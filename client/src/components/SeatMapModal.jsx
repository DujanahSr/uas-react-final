import React, { useState, useEffect, useMemo } from "react";
import { flightApi } from "../api/endpoints";
import { FaPlane, FaTimes, FaCheck, FaLock, FaUser } from "react-icons/fa";

const SeatMapModal = ({
  isOpen,
  onClose,
  flight,
  passengerIndex = 0,
  passengerName = "Penumpang",
  currentSeat = "",
  onSelectSeat,
  userId = "demo-user",
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seatMapData, setSeatMapData] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(currentSeat);
  const [locking, setLocking] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(null);

  // Check if flight ID is backend UUID
  const isBackendFlight = useMemo(() => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      flight?.id
    );
  }, [flight?.id]);

  useEffect(() => {
    if (!isOpen) return;

    setSelectedSeat(currentSeat);
    setError("");

    if (isBackendFlight) {
      setLoading(true);
      flightApi
        .getSeatMap(flight.id)
        .then((res) => {
          if (res?.data) {
            setSeatMapData(res.data);
          }
        })
        .catch((err) => {
          console.warn("Failed fetching backend seat map:", err.message);
          // Fallback to local layout
          setSeatMapData(null);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, flight?.id, currentSeat, isBackendFlight]);

  // Fallback layout if offline or mock flight
  const fallbackSeats = useMemo(() => {
    const columns = ["A", "B", "C", "D", "E", "F"];
    const rows = [];
    for (let r = 1; r <= 18; r++) {
      const rowSeats = columns.map((col) => {
        const seatNo = `${r}${col}`;
        // Mark some seats as already booked for realism
        const isBooked = [2, 7, 11, 15].includes(r) && ["B", "E"].includes(col);
        return {
          seat_number: seatNo,
          class: r <= 3 ? "BUSINESS" : "ECONOMY",
          status: isBooked ? "BOOKED" : "AVAILABLE",
        };
      });
      rows.push({ rowNumber: r, seats: rowSeats });
    }
    return rows;
  }, []);

  // Compute actual rows and seats to display
  const displayRows = useMemo(() => {
    if (seatMapData?.seats && seatMapData?.layout) {
      const { columns, total_rows } = seatMapData.layout;
      const seatLookup = new Map();
      seatMapData.seats.forEach((s) => seatLookup.set(s.seat_number, s));

      const rows = [];
      for (let r = 1; r <= total_rows; r++) {
        const rowSeats = columns.map((col) => {
          const seatNo = `${r}${col}`;
          const seatObj = seatLookup.get(seatNo);
          return (
            seatObj || {
              seat_number: seatNo,
              seat_class: r <= 3 ? "BUSINESS" : "ECONOMY",
              status: "AVAILABLE",
            }
          );
        });
        rows.push({ rowNumber: r, seats: rowSeats });
      }
      return rows;
    }
    return fallbackSeats;
  }, [seatMapData, fallbackSeats]);

  const handleSeatClick = async (seat) => {
    if (seat.status === "BOOKED") return;
    if (locking) return;

    const seatNumber = seat.seat_number;
    setError("");

    // If clicking same seat, deselect
    if (selectedSeat === seatNumber) {
      if (isBackendFlight) {
        try {
          await flightApi.unlockSeat(flight.id, seatNumber, userId);
        } catch (e) {
          console.warn("Unlock seat warning:", e.message);
        }
      }
      setSelectedSeat("");
      setLockCountdown(null);
      return;
    }

    // Attempt Redis Distributed Lock if backed by Go API
    if (isBackendFlight) {
      setLocking(true);
      try {
        // Unlock old seat if exists
        if (selectedSeat) {
          try {
            await flightApi.unlockSeat(flight.id, selectedSeat, userId);
          } catch {
            // ignore
          }
        }

        // Lock new seat
        const lockRes = await flightApi.lockSeat(flight.id, seatNumber, userId);
        setSelectedSeat(seatNumber);
        setLockCountdown(900); // 15 minutes
      } catch (lockErr) {
        setError(
          lockErr.message ||
            "Kursi ini baru saja dikunci oleh pengguna lain. Silakan pilih kursi lain."
        );
      } finally {
        setLocking(false);
      }
    } else {
      setSelectedSeat(seatNumber);
    }
  };

  const handleConfirm = () => {
    if (selectedSeat) {
      onSelectSeat(selectedSeat);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative flex flex-col w-full max-w-3xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-slate-800 bg-linear-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl">
              <FaPlane className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold sm:text-xl">
                Pilih Kursi: {flight.airline} ({flight.flightNumber})
              </h3>
              <p className="text-xs text-blue-100 sm:text-sm">
                Penumpang #{passengerIndex + 1}:{" "}
                <span className="font-semibold text-white">{passengerName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 transition-colors rounded-full hover:bg-white/20 hover:text-white"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Status / Notice Bar */}
        <div className="px-6 py-3 bg-blue-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs sm:text-sm gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <span className="w-3.5 h-3.5 rounded-sm bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-500"></span>
              Tersedia
            </span>
            <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-300">
              <span className="w-3.5 h-3.5 rounded-sm bg-blue-600 border border-blue-600"></span>
              Dipilih
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
              <span className="w-3.5 h-3.5 rounded-sm bg-amber-400 border border-amber-500"></span>
              Terkunci (15m)
            </span>
            <span className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
              <span className="w-3.5 h-3.5 rounded-sm bg-gray-300 dark:bg-slate-700 opacity-60"></span>
              Terisi
            </span>
          </div>

          {selectedSeat && (
            <div className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
              <FaLock size={12} />
              Kursi: {selectedSeat}
              {lockCountdown && (
                <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full ml-1">
                  Kunci aktif 15 mnt
                </span>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="px-6 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs sm:text-sm border-b border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {/* Aircraft Cabin Map */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <div className="w-10 h-10 border-4 border-blue-600 rounded-full border-t-transparent animate-spin mb-3"></div>
              <p className="text-sm">Memuat denah kabin pesawat & status kursi live...</p>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              {/* Cockpit Indicator */}
              <div className="relative mb-6 text-center">
                <div className="inline-block px-8 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase rounded-t-full bg-gray-100 dark:bg-slate-800 border-t border-x border-gray-300 dark:border-slate-700">
                  ✈️ Depan (Cockpit)
                </div>
              </div>

              {/* Seat Matrix */}
              <div className="space-y-2.5">
                {displayRows.map((row) => (
                  <div key={row.rowNumber} className="flex items-center justify-between gap-1 sm:gap-2">
                    {/* Left 3 seats (A, B, C) */}
                    <div className="flex items-center gap-1 sm:gap-1.5 flex-1 justify-end">
                      {row.seats.slice(0, 3).map((seat) => {
                        const isSelected = selectedSeat === seat.seat_number;
                        const isLocked = seat.status === "LOCKED" && !isSelected;
                        const isBooked = seat.status === "BOOKED";

                        return (
                          <button
                            key={seat.seat_number}
                            type="button"
                            disabled={isBooked || isLocked || locking}
                            onClick={() => handleSeatClick(seat)}
                            className={`w-9 h-10 sm:w-11 sm:h-12 rounded-lg font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition-all transform active:scale-90 ${
                              isSelected
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 ring-2 ring-blue-400 scale-105"
                                : isLocked
                                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 cursor-not-allowed"
                                : isBooked
                                ? "bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed opacity-50"
                                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700"
                            }`}
                          >
                            <span>{seat.seat_number}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Aisle with Row Number */}
                    <div className="w-8 sm:w-10 text-center font-bold text-xs text-gray-400 dark:text-gray-500">
                      {row.rowNumber}
                    </div>

                    {/* Right 3 seats (D, E, F) */}
                    <div className="flex items-center gap-1 sm:gap-1.5 flex-1 justify-start">
                      {row.seats.slice(3, 6).map((seat) => {
                        const isSelected = selectedSeat === seat.seat_number;
                        const isLocked = seat.status === "LOCKED" && !isSelected;
                        const isBooked = seat.status === "BOOKED";

                        return (
                          <button
                            key={seat.seat_number}
                            type="button"
                            disabled={isBooked || isLocked || locking}
                            onClick={() => handleSeatClick(seat)}
                            className={`w-9 h-10 sm:w-11 sm:h-12 rounded-lg font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition-all transform active:scale-90 ${
                              isSelected
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 ring-2 ring-blue-400 scale-105"
                                : isLocked
                                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 cursor-not-allowed"
                                : isBooked
                                ? "bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed opacity-50"
                                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700"
                            }`}
                          >
                            <span>{seat.seat_number}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedSeat ? (
              <span>
                Kursi terpilih:{" "}
                <strong className="text-blue-600 dark:text-blue-400 font-bold text-base">
                  {selectedSeat}
                </strong>
              </span>
            ) : (
              "Klik salah satu kursi untuk memilih"
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              Batal
            </button>
            <button
              type="button"
              disabled={!selectedSeat || locking}
              onClick={handleConfirm}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-md active:scale-95"
            >
              <FaCheck />
              Konfirmasi Kursi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatMapModal;
