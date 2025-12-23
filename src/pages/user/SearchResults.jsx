import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlightCard from "../../components/FlightCard";
import { useData } from "../../context/DataContext";
import { searchFlights, sortFlights, airlines } from "../../data/mockData";
import {
  AiOutlineFilter,
  AiOutlineSortAscending,
  AiOutlineClose,
  AiOutlineDollarCircle,
  AiOutlineClockCircle,
  AiOutlineLeft,
  AiOutlineRight,
} from "react-icons/ai";
import { FaPlane } from "react-icons/fa";
import Footer from "../../components/Footer";

const SearchResults = () => {
  const location = useLocation();
  const { flights } = useData();
  const navigate = useNavigate();

  const [showFilters, setShowFilters] = useState(false);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [sortBy, setSortBy] = useState("price-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [filters, setFilters] = useState({
    maxPrice: "",
    minPrice: "",
    airline: "",
    departureTime: "",
    duration: "",
  });

  // Update filters when location.state changes (when navigating from search form)
  useEffect(() => {
    const initialFilters = location.state?.filters || {};
    if (Object.keys(initialFilters).length > 0) {
      setFilters((prev) => ({
        ...prev,
        ...initialFilters,
      }));
    }
    // Cleanup: reset state when component unmounts or route changes
    return () => {
      setCurrentPage(1);
      setFilteredFlights([]);
    };
  }, [location.pathname, location.state]);

  useEffect(() => {
    const initialFilters = location.state?.filters || {};

    // Debug: log filters untuk troubleshooting
    console.log("Search Filters:", initialFilters);

    // Gunakan flights dari DataContext untuk konsistensi dengan FlightDetail
    let results = searchFlights(initialFilters, flights);

    // Debug: log hasil pencarian
    console.log("Search Results:", results.length, "flights found");
    if (results.length === 0 && initialFilters.from && initialFilters.to) {
      console.log("No flights found for:", initialFilters);
      // Coba cari tanpa filter tanggal untuk debug
      const debugFilters = { ...initialFilters };
      delete debugFilters.departureDate;
      const debugResults = searchFlights(debugFilters, flights);
      console.log(
        "Debug search (without date):",
        debugResults.length,
        "flights found"
      );
    }

    // Apply additional filters
    if (filters.maxPrice) {
      results = results.filter((f) => f.price <= parseInt(filters.maxPrice));
    }
    if (filters.minPrice) {
      results = results.filter((f) => f.price >= parseInt(filters.minPrice));
    }
    if (filters.airline) {
      results = results.filter(
        (f) =>
          f.airline.toLowerCase().includes(filters.airline.toLowerCase()) ||
          f.airlineCode === filters.airline
      );
    }
    if (filters.departureTime) {
      const [start, end] = filters.departureTime.split("-");
      results = results.filter((f) => {
        const time = parseInt(f.departureTime.split(":")[0]);
        return time >= parseInt(start) && time <= parseInt(end);
      });
    }
    if (filters.duration) {
      const maxDuration = parseInt(filters.duration);
      results = results.filter((f) => f.durationMinutes <= maxDuration);
    }

    // Apply sorting
    results = sortFlights(results, sortBy);
    setFilteredFlights(results);
    // Reset to page 1 when filters or sort change
    setCurrentPage(1);
  }, [location.state, filters, sortBy, flights]);

  const handleSelectFlight = (flight) => {
    navigate(`/flight/${flight.id}`);
  };

  const clearFilters = () => {
    setFilters({
      maxPrice: "",
      minPrice: "",
      airline: "",
      departureTime: "",
      duration: "",
    });
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFlights = filteredFlights.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const maxPrice = Math.max(...flights.map((f) => f.price), 0);
  const minPrice = Math.min(...flights.map((f) => f.price), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Actions */}
        <div className="flex flex-wrap gap-2 mb-6 sm:gap-3 sm:justify-end animate-slideInUp">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg dark:bg-slate-800 dark:text-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all transform hover:scale-105 active:scale-95 sm:px-4 lg:hidden"
            >
              <AiOutlineFilter size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg dark:bg-slate-800 dark:text-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all sm:flex-none sm:px-4"
            >
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
              <option value="duration-asc">Durasi Terpendek</option>
              <option value="departure-asc">Waktu Berangkat (Awal)</option>
              <option value="departure-desc">Waktu Berangkat (Akhir)</option>
            </select>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Filter Sidebar */}
          <div
            className={`lg:col-span-1 ${
              showFilters ? "block" : "hidden lg:block"
            } animate-slideInLeft`}
          >
            <div className="p-4 bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-lg dark:bg-slate-800/90 dark:border-slate-700/50 sticky top-4 card-3d sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <AiOutlineFilter size={20} />
                  Filter
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <AiOutlineClose size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Harga */}
                <div>
                  <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <AiOutlineDollarCircle size={16} />
                    Harga
                  </label>
                  <div className="space-y-3">
                    <div>
                      <label className="block mb-1 text-xs text-gray-600 dark:text-gray-400">
                        Min
                      </label>
                      <input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) =>
                          setFilters({ ...filters, minPrice: e.target.value })
                        }
                        placeholder={minPrice.toLocaleString("id-ID")}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-xs text-gray-600 dark:text-gray-400">
                        Max
                      </label>
                      <input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) =>
                          setFilters({ ...filters, maxPrice: e.target.value })
                        }
                        placeholder={maxPrice.toLocaleString("id-ID")}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Maskapai */}
                <div>
                  <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <FaPlane size={16} />
                    Maskapai
                  </label>
                  <select
                    value={filters.airline}
                    onChange={(e) =>
                      setFilters({ ...filters, airline: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Semua Maskapai</option>
                    {airlines.map((airline) => (
                      <option key={airline.code} value={airline.code}>
                        {airline.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Waktu Keberangkatan */}
                <div>
                  <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <AiOutlineClockCircle size={16} />
                    Waktu Keberangkatan
                  </label>
                  <select
                    value={filters.departureTime}
                    onChange={(e) =>
                      setFilters({ ...filters, departureTime: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Semua Waktu</option>
                    <option value="0-6">00:00 - 06:00</option>
                    <option value="6-12">06:00 - 12:00</option>
                    <option value="12-18">12:00 - 18:00</option>
                    <option value="18-24">18:00 - 24:00</option>
                  </select>
                </div>

                {/* Durasi */}
                <div>
                  <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <AiOutlineClockCircle size={16} />
                    Durasi Maksimal
                  </label>
                  <select
                    value={filters.duration}
                    onChange={(e) =>
                      setFilters({ ...filters, duration: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Semua Durasi</option>
                    <option value="90">≤ 1.5 jam</option>
                    <option value="180">≤ 3 jam</option>
                    <option value="300">≤ 5 jam</option>
                    <option value="9999">Semua</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 transition-all transform hover:scale-105 active:scale-95"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 animate-slideInRight">
            {filteredFlights.length === 0 ? (
              <div className="py-20 text-center sm:py-32 animate-scaleIn">
                <FaPlane
                  size={64}
                  className="mx-auto mb-6 text-gray-300 dark:text-slate-600 animate-float3D sm:w-20 sm:h-20"
                />
                <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
                  Tidak ada penerbangan
                </h2>
                <p className="mb-8 text-base text-gray-600 sm:text-xl dark:text-gray-400">
                  Coba ubah tanggal atau rute pencarian
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 text-base font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl sm:px-8 sm:py-4 sm:text-lg"
                >
                  Cari Lagi
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4 sm:space-y-6">
                  {paginatedFlights.map((flight, index) => (
                    <div
                      key={flight.id}
                      className="animate-slideInUp"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <FlightCard
                        flight={flight}
                        onSelect={handleSelectFlight}
                      />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 sm:flex-row">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Menampilkan{" "}
                      <strong className="text-gray-900 dark:text-white">
                        {startIndex + 1}
                      </strong>{" "}
                      -{" "}
                      <strong className="text-gray-900 dark:text-white">
                        {Math.min(endIndex, filteredFlights.length)}
                      </strong>{" "}
                      dari{" "}
                      <strong className="text-gray-900 dark:text-white">
                        {filteredFlights.length}
                      </strong>{" "}
                      penerbangan
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-1 px-4 py-2 text-sm rounded-lg transition-colors ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-600"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                        }`}
                      >
                        <AiOutlineLeft size={16} />
                        Sebelumnya
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => {
                          // Show first page, last page, current page, and pages around current
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                                  currentPage === page
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                                }`}
                              >
                                {page}
                              </button>
                            );
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <span
                                key={page}
                                className="px-2 text-gray-500 dark:text-gray-400"
                              >
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-1 px-4 py-2 text-sm rounded-lg transition-colors ${
                          currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-600"
                            : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                        }`}
                      >
                        Selanjutnya
                        <AiOutlineRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default SearchResults;
