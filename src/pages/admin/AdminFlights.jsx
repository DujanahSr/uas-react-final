/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import FlightCard from "../../components/FlightCard";
import BookingForm from "../../components/BookingForm";
import AlertModal from "../../components/AlertModal";
import ConfirmModal from "../../components/ConfirmModal";
import { useData } from "../../context/DataContext";
import {
  searchFlights,
  sortFlights,
  formatPrice,
  airlines,
  airports,
  getStatusBadge,
} from "../../data/mockData";
import Footer from "../../components/Footer";
import {
  validateFlightNumber,
  validateTime,
  validatePrice,
  validateSeats,
} from "../../utils/validation";
import {
  AiOutlinePlus,
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineSearch,
  AiOutlineFilter,
  AiOutlineSortAscending,
  AiOutlineReload,
  AiOutlineClose,
  AiOutlineSave,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineUser,
  AiOutlineDollarCircle,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import {
  FaPlane,
  FaPlaneDeparture,
  FaPlaneArrival,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";

const AdminFlights = () => {
  const { flights, addFlight, updateFlight, deleteFlight } = useData();
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState("price-asc");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchFilters, setSearchFilters] = useState({
    flightNumber: "",
    airline: "",
    from: "",
    to: "",
    departureDate: "",
  });
  const [headerSearch, setHeaderSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showForm, setShowForm] = useState(false);
  const [editingFlight, setEditingFlight] = useState(null);
  const [alert, setAlert] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    flightId: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    flightNumber: "",
    airline: "Garuda Indonesia",
    airlineCode: "GA",
    from: "",
    fromCode: "",
    to: "",
    toCode: "",
    departureTime: "",
    arrivalTime: "",
    departureDate: new Date().toISOString().split("T")[0], // Default hari ini
    duration: "",
    durationMinutes: 0,
    price: 0,
    prices: {
      economy: 0,
      business: 0,
      first: 0,
    },
    availableSeats: 0,
    totalSeats: 180,
    status: "Tersedia",
    aircraft: "Boeing 737-800",
    terminal: "Terminal 3",
    gate: "",
    baggageAllowance: 20,
    amenities: [],
    transit: false,
    stops: 0,
  });

  useEffect(() => {
    setFilteredFlights(flights);
    setCurrentPage(1); // Reset ke halaman 1 ketika flights berubah
  }, [flights]);

  const applySearchFilters = (filters) => {
    let results = [...flights];

    // Filter by header search (flight number, airline, or route)
    if (headerSearch) {
      results = results.filter(
        (f) =>
          f.flightNumber.toLowerCase().includes(headerSearch.toLowerCase()) ||
          f.airline.toLowerCase().includes(headerSearch.toLowerCase()) ||
          f.from.toLowerCase().includes(headerSearch.toLowerCase()) ||
          f.to.toLowerCase().includes(headerSearch.toLowerCase()) ||
          f.route?.toLowerCase().includes(headerSearch.toLowerCase())
      );
    }

    // Filter by flight number
    if (filters.flightNumber) {
      results = results.filter((f) =>
        f.flightNumber
          .toLowerCase()
          .includes(filters.flightNumber.toLowerCase())
      );
    }

    // Filter by airline
    if (filters.airline) {
      results = results.filter(
        (f) =>
          f.airlineCode === filters.airline ||
          f.airline.toLowerCase().includes(filters.airline.toLowerCase())
      );
    }

    // Filter by from
    if (filters.from) {
      results = results.filter(
        (f) => f.fromCode === filters.from || f.from.includes(filters.from)
      );
    }

    // Filter by to
    if (filters.to) {
      results = results.filter(
        (f) => f.toCode === filters.to || f.to.includes(filters.to)
      );
    }

    // Filter by departure date
    if (filters.departureDate) {
      results = results.filter(
        (f) => f.departureDate === filters.departureDate
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      results = results.filter(
        (flight) => flight.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Apply sorting
    results = sortFlights(results, sortBy);
    setFilteredFlights(results);
    setCurrentPage(1); // Reset ke halaman 1 ketika filter berubah
  };

  const handleHeaderSearch = (value) => {
    setHeaderSearch(value);
  };

  // Apply filters whenever dependencies change
  useEffect(() => {
    let results = [...flights];

    // Filter by header search (flight number, airline, or route)
    if (headerSearch) {
      results = results.filter(
        (f) =>
          f.flightNumber.toLowerCase().includes(headerSearch.toLowerCase()) ||
          f.airline.toLowerCase().includes(headerSearch.toLowerCase()) ||
          f.from.toLowerCase().includes(headerSearch.toLowerCase()) ||
          f.to.toLowerCase().includes(headerSearch.toLowerCase()) ||
          f.route?.toLowerCase().includes(headerSearch.toLowerCase())
      );
    }

    // Filter by flight number
    if (searchFilters.flightNumber) {
      results = results.filter((f) =>
        f.flightNumber
          .toLowerCase()
          .includes(searchFilters.flightNumber.toLowerCase())
      );
    }

    // Filter by airline
    if (searchFilters.airline) {
      results = results.filter(
        (f) =>
          f.airlineCode === searchFilters.airline ||
          f.airline.toLowerCase().includes(searchFilters.airline.toLowerCase())
      );
    }

    // Filter by from
    if (searchFilters.from) {
      results = results.filter(
        (f) =>
          f.fromCode === searchFilters.from ||
          f.from.includes(searchFilters.from)
      );
    }

    // Filter by to
    if (searchFilters.to) {
      results = results.filter(
        (f) => f.toCode === searchFilters.to || f.to.includes(searchFilters.to)
      );
    }

    // Filter by departure date
    if (searchFilters.departureDate) {
      results = results.filter(
        (f) => f.departureDate === searchFilters.departureDate
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      results = results.filter(
        (flight) => flight.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Apply sorting
    results = sortFlights(results, sortBy);
    setFilteredFlights(results);
    setCurrentPage(1);
  }, [headerSearch, searchFilters, filterStatus, sortBy, flights]);

  const handleSearch = (filters) => {
    setIsSearching(true);
    setTimeout(() => {
      // Gunakan flights dari DataContext untuk konsistensi
      let results = searchFlights(filters, flights);

      if (filterStatus !== "all") {
        results = results.filter(
          (flight) => flight.status.toLowerCase() === filterStatus.toLowerCase()
        );
      }

      results = sortFlights(results, sortBy);
      setFilteredFlights(results);
      setIsSearching(false);
    }, 500);
  };

  const handleSort = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset ke halaman 1 ketika sorting berubah
    const sorted = sortFlights([...filteredFlights], newSortBy);
    setFilteredFlights(sorted);
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset ke halaman 1
    applySearchFilters({ ...searchFilters });
  };

  const handleAddFlight = () => {
    setEditingFlight(null);
    const today = new Date().toISOString().split("T")[0];
    setFormData({
      flightNumber: "",
      airline: "Garuda Indonesia",
      airlineCode: "GA",
      from: "",
      fromCode: "",
      to: "",
      toCode: "",
      departureTime: "",
      arrivalTime: "",
      departureDate: today, // Set default ke hari ini
      duration: "",
      durationMinutes: 0,
      price: 0,
      prices: {
        economy: 0,
        business: 0,
        first: 0,
      },
      availableSeats: 0,
      totalSeats: 180,
      status: "Tersedia",
      aircraft: "Boeing 737-800",
      terminal: "Terminal 3",
      gate: "",
      baggageAllowance: 20,
      amenities: [],
      transit: false,
      stops: 0,
    });
    setShowForm(true);
  };

  const handleEditFlight = (flight) => {
    setEditingFlight(flight);
    setFormData({
      ...flight,
      prices: flight.prices || {
        economy: flight.price || 0,
        business: (flight.price || 0) * 2,
        first: (flight.price || 0) * 4,
      },
    });
    setShowForm(true);
  };

  const handleDeleteFlight = (id) => {
    setConfirmDelete({ isOpen: true, flightId: id });
  };

  const confirmDeleteFlight = () => {
    if (confirmDelete.flightId) {
      deleteFlight(confirmDelete.flightId);
      setConfirmDelete({ isOpen: false, flightId: null });
      setAlert({
        isOpen: true,
        type: "success",
        title: "Berhasil!",
        message: "Penerbangan berhasil dihapus",
      });
    }
  };

  const handleSaveFlight = () => {
    // Validasi semua field
    const errors = {};
    let hasErrors = false;

    // Validasi nomor penerbangan
    if (!formData.flightNumber) {
      errors.flightNumber = "Nomor penerbangan wajib diisi";
      hasErrors = true;
    } else {
      const flightNumError = validateFlightNumber(formData.flightNumber);
      if (flightNumError) {
        errors.flightNumber = flightNumError;
        hasErrors = true;
      }
    }

    // Validasi waktu
    if (!formData.departureTime) {
      errors.departureTime = "Waktu keberangkatan wajib diisi";
      hasErrors = true;
    } else {
      const timeError = validateTime(formData.departureTime);
      if (timeError) {
        errors.departureTime = timeError;
        hasErrors = true;
      }
    }

    if (!formData.arrivalTime) {
      errors.arrivalTime = "Waktu kedatangan wajib diisi";
      hasErrors = true;
    } else {
      const timeError = validateTime(formData.arrivalTime);
      if (timeError) {
        errors.arrivalTime = timeError;
        hasErrors = true;
      }
    }

    // Validasi rute
    if (!formData.from || !formData.to) {
      if (!formData.from) errors.from = "Kota keberangkatan wajib diisi";
      if (!formData.to) errors.to = "Kota tujuan wajib diisi";
      hasErrors = true;
    }

    // Validation: Kota berangkat tidak boleh sama dengan kota tujuan
    if (formData.fromCode === formData.toCode) {
      errors.to = "Kota berangkat tidak boleh sama dengan kota tujuan!";
      hasErrors = true;
    }

    // Validation: Tanggal berangkat minimal hari ini
    if (!formData.departureDate) {
      errors.departureDate = "Tanggal keberangkatan wajib diisi";
      hasErrors = true;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const departureDate = new Date(formData.departureDate);
      departureDate.setHours(0, 0, 0, 0);

      if (departureDate < today) {
        errors.departureDate =
          "Tanggal berangkat tidak boleh kurang dari hari ini!";
        hasErrors = true;
      }
    }

    // Validation: Semua harga class harus diisi
    const priceErrors = {};
    if (!formData.prices?.economy || formData.prices.economy <= 0) {
      priceErrors.economy = validatePrice(formData.prices?.economy || 0);
      if (priceErrors.economy) hasErrors = true;
    }
    if (!formData.prices?.business || formData.prices.business <= 0) {
      priceErrors.business = validatePrice(formData.prices?.business || 0);
      if (priceErrors.business) hasErrors = true;
    }
    if (!formData.prices?.first || formData.prices.first <= 0) {
      priceErrors.first = validatePrice(formData.prices?.first || 0);
      if (priceErrors.first) hasErrors = true;
    }

    // Validasi kursi
    if (!formData.availableSeats && formData.availableSeats !== 0) {
      errors.availableSeats = "Jumlah kursi tersedia wajib diisi";
      hasErrors = true;
    } else {
      const seatsError = validateSeats(formData.availableSeats);
      if (seatsError) {
        errors.availableSeats = seatsError;
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setFormErrors({ ...errors, ...priceErrors });
      setAlert({
        isOpen: true,
        type: "warning",
        title: "Form Belum Valid",
        message: "Mohon perbaiki error pada form!",
      });
      return;
    }

    setFormErrors({});

    const flightData = {
      ...formData,
      price: formData.prices?.economy || formData.price, // Default price adalah economy
      prices: {
        economy: formData.prices?.economy || 0,
        business: formData.prices?.business || 0,
        first: formData.prices?.first || 0,
      },
      arrivalDate: formData.departureDate, // Set arrival date same as departure for now
      // Hapus field class karena semua class tersedia
      id:
        editingFlight?.id ||
        "FL" + (flights.length + 1).toString().padStart(3, "0"),
    };
    // Hapus field class dari flightData jika ada
    delete flightData.class;

    if (editingFlight) {
      updateFlight(editingFlight.id, flightData);
      setAlert({
        isOpen: true,
        type: "success",
        title: "Berhasil!",
        message: "Penerbangan berhasil diperbarui",
      });
    } else {
      addFlight(flightData);
      setAlert({
        isOpen: true,
        type: "success",
        title: "Berhasil!",
        message: "Penerbangan berhasil ditambahkan",
      });
    }

    setShowForm(false);
    setEditingFlight(null);
  };

  const clearFilters = () => {
    setFilteredFlights(flights);
    setFilterStatus("all");
    setSortBy("price-asc");
    setCurrentPage(1);
    setSearchFilters({
      flightNumber: "",
      airline: "",
      from: "",
      to: "",
      departureDate: "",
    });
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFlights = filteredFlights.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full top-20 left-10 w-72 h-72 bg-blue-200/20 dark:bg-blue-500/10 blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute rounded-full bottom-20 right-10 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-500/10 blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <Header
        title="Kelola Penerbangan"
        subtitle="Kelola dan pantau semua penerbangan yang tersedia"
        onSearch={handleHeaderSearch}
        searchPlaceholder="Cari nomor penerbangan, maskapai, atau rute..."
      />

      <div className="relative z-10 p-4 md:p-6">
        {/* Actions */}
        <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between sm:mb-6 animate-slideInUp">
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl dark:text-white">
            Daftar Penerbangan ({filteredFlights.length})
          </h2>
          <button
            onClick={handleAddFlight}
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl sm:px-6 sm:py-3"
          >
            <AiOutlinePlus size={18} />
            <span className="hidden sm:inline">Tambah Penerbangan</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </div>

        {/* Search Form - Admin Specific */}
        <div
          className="mb-4 sm:mb-6 animate-slideInUp"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="p-4 border shadow-lg bg-white/90 backdrop-blur-sm border-gray-200/50 rounded-xl dark:bg-slate-800/90 dark:border-slate-700/50 card-3d sm:p-6">
            <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-900 dark:text-white">
              <AiOutlineSearch size={20} />
              Cari Penerbangan (Admin)
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Pencarian dapat dilakukan berdasarkan: Nomor Penerbangan,
              Maskapai, Rute, atau Tanggal Keberangkatan
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nomor Penerbangan
                </label>
                <input
                  type="text"
                  placeholder="GA-123"
                  value={searchFilters.flightNumber}
                  onChange={(e) => {
                    setSearchFilters({
                      ...searchFilters,
                      flightNumber: e.target.value,
                    });
                    applySearchFilters({
                      ...searchFilters,
                      flightNumber: e.target.value,
                    });
                  }}
                  className="w-full px-3 py-2 text-sm transition-all border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 sm:px-4"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Maskapai
                </label>
                <select
                  value={searchFilters.airline}
                  onChange={(e) => {
                    setSearchFilters({
                      ...searchFilters,
                      airline: e.target.value,
                    });
                    applySearchFilters({
                      ...searchFilters,
                      airline: e.target.value,
                    });
                  }}
                  className="w-full px-3 py-2 text-sm transition-all border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 sm:px-4"
                >
                  <option value="">Semua Maskapai</option>
                  {airlines.map((airline) => (
                    <option key={airline.code} value={airline.code}>
                      {airline.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Dari
                </label>
                <select
                  value={searchFilters.from}
                  onChange={(e) => {
                    setSearchFilters({
                      ...searchFilters,
                      from: e.target.value,
                    });
                    applySearchFilters({
                      ...searchFilters,
                      from: e.target.value,
                    });
                  }}
                  className="w-full px-3 py-2 text-sm transition-all border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 sm:px-4"
                >
                  <option value="">Semua Kota</option>
                  {airports.map((airport) => (
                    <option key={airport.code} value={airport.code}>
                      {airport.city} ({airport.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ke
                </label>
                <select
                  value={searchFilters.to}
                  onChange={(e) => {
                    setSearchFilters({ ...searchFilters, to: e.target.value });
                    applySearchFilters({
                      ...searchFilters,
                      to: e.target.value,
                    });
                  }}
                  className="w-full px-3 py-2 text-sm transition-all border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 sm:px-4"
                >
                  <option value="">Semua Kota</option>
                  {airports.map((airport) => (
                    <option key={airport.code} value={airport.code}>
                      {airport.city} ({airport.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tanggal Berangkat
                </label>
                <input
                  type="date"
                  value={searchFilters.departureDate}
                  onChange={(e) => {
                    setSearchFilters({
                      ...searchFilters,
                      departureDate: e.target.value,
                    });
                    applySearchFilters({
                      ...searchFilters,
                      departureDate: e.target.value,
                    });
                  }}
                  className="w-full px-3 py-2 text-sm transition-all border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 sm:px-4"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => {
                  setSearchFilters({
                    flightNumber: "",
                    airline: "",
                    from: "",
                    to: "",
                    departureDate: "",
                  });
                  setFilteredFlights(flights);
                  setFilterStatus("all");
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600"
              >
                <AiOutlineReload size={16} />
                Reset
              </button>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Menampilkan:{" "}
                <strong className="text-gray-900 dark:text-white">
                  {filteredFlights.length}
                </strong>{" "}
                dari{" "}
                <strong className="text-gray-900 dark:text-white">
                  {flights.length}
                </strong>{" "}
                penerbangan
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div
          className="p-4 mb-4 transition-all duration-300 border shadow-lg sm:mb-6 bg-white/90 backdrop-blur-sm border-gray-200/50 dark:bg-slate-800/90 rounded-xl dark:border-slate-700/50 card-3d animate-slideInUp sm:p-6"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                <AiOutlineFilter size={18} />
                Filter Status:
              </span>
              <div className="flex space-x-2">
                {[
                  { key: "all", label: "Semua" },
                  { key: "tersedia", label: "Tersedia" },
                  { key: "hampir penuh", label: "Hampir Penuh" },
                  { key: "penuh", label: "Penuh" },
                ].map((status) => (
                  <button
                    key={status.key}
                    onClick={() => handleStatusFilter(status.key)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      filterStatus === status.key
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-300">
                <AiOutlineSortAscending size={18} />
                Urutkan:
              </span>
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="px-4 py-2 text-gray-800 transition-colors bg-white border border-gray-300 rounded-lg dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
              >
                <option value="price-asc">Harga Terendah</option>
                <option value="price-desc">Harga Tertinggi</option>
                <option value="duration-asc">Durasi Terpendek</option>
                <option value="departure-asc">Waktu Berangkat</option>
              </select>

              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 transition-colors border border-gray-300 rounded-lg dark:text-gray-300 hover:text-gray-800 dark:hover:text-white dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <AiOutlineReload size={16} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Search Indicator */}
        {headerSearch && (
          <div className="p-3 mb-4 text-sm border-b rounded-lg bg-gray-100/80 backdrop-blur-sm border-gray-200/50 dark:bg-slate-700/50 dark:border-slate-600/50 animate-slideInUp">
            Menampilkan hasil untuk:{" "}
            <strong className="text-gray-900 dark:text-white">
              "{headerSearch}"
            </strong>
          </div>
        )}

        {/* Flight List */}
        {isSearching ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <span className="ml-4 text-gray-600 dark:text-gray-300">
              Mencari penerbangan...
            </span>
          </div>
        ) : filteredFlights.length > 0 ? (
          <>
            <div className="grid gap-4 sm:gap-6">
              {paginatedFlights.map((flight, index) => (
                <div
                  key={flight.id}
                  className="p-4 transition-all duration-300 border shadow-lg bg-white/90 backdrop-blur-sm border-gray-200/50 dark:bg-slate-800/90 rounded-xl dark:border-slate-700/50 hover:shadow-xl card-3d animate-slideInUp sm:p-6"
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  {/* Header with Airline and Actions */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center flex-1 space-x-3">
                      <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full dark:bg-blue-900/30">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {flight.flightNumber.split("-")[0]}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 dark:text-white">
                          {flight.airline}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {flight.flightNumber}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                          flight.status
                        )}`}
                      >
                        {flight.status}
                      </span>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditFlight(flight)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                          title="Edit Penerbangan"
                        >
                          <AiOutlineEdit size={16} />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteFlight(flight.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all shadow-sm hover:shadow-md"
                          title="Hapus Penerbangan"
                        >
                          <AiOutlineDelete size={16} />
                          <span className="hidden sm:inline">Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Flight Details */}
                  <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3">
                    {/* Departure */}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800 dark:text-white">
                        {flight.departureTime}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {flight.from}
                      </div>
                      <div className="flex items-center justify-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <AiOutlineCalendar size={12} className="mr-1" />
                        {flight.departureDate}
                      </div>
                    </div>

                    {/* Flight Info */}
                    <div className="text-center">
                      <div className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                        {flight.duration}
                      </div>
                      <div className="relative">
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                        <div className="relative z-10 flex items-center justify-center w-8 h-8 mx-auto bg-blue-600 rounded-full">
                          <FaPlane size={14} className="text-white" />
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Semua Kelas Tersedia
                      </div>
                    </div>

                    {/* Arrival */}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800 dark:text-white">
                        {flight.arrivalTime}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {flight.to}
                      </div>
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <AiOutlineClockCircle
                          size={12}
                          className="inline mr-1"
                        />
                        Estimasi
                      </div>
                    </div>
                  </div>

                  {/* Footer with Price and Seats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700/50">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <AiOutlineUser size={16} className="mr-1" />
                        {flight.availableSeats} kursi tersedia
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(flight.prices?.economy || flight.price)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Mulai dari (Ekonomi)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 mt-8 bg-white border border-gray-200 rounded-xl dark:bg-slate-800/90 dark:border-slate-700/50">
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
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-700 dark:text-gray-600"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 dark:hover:bg-slate-600"
                    }`}
                  >
                    <AiOutlineLeft size={16} />
                    Sebelumnya
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
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
                                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 dark:hover:bg-slate-600"
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
                      }
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1 px-4 py-2 text-sm rounded-lg transition-colors ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-700 dark:text-gray-600"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 dark:hover:bg-slate-600"
                    }`}
                  >
                    Selanjutnya
                    <AiOutlineRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-20 text-center">
            <FaPlane
              size={80}
              className="mx-auto mb-6 text-gray-300 dark:text-gray-600"
            />
            <h3 className="mb-2 text-xl font-medium text-gray-900 dark:text-white">
              Tidak ada penerbangan ditemukan
            </h3>
            <p className="mb-6 text-gray-500 dark:text-gray-400">
              Coba ubah kriteria pencarian atau filter Anda
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Tampilkan Semua Penerbangan
            </button>
          </div>
        )}

        {/* Add/Edit Flight Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl dark:bg-slate-800/90 border border-gray-200 dark:border-slate-700/50">
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/20">
                    <FaPlaneDeparture size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {editingFlight
                        ? "Edit Penerbangan"
                        : "Tambah Penerbangan Baru"}
                    </h2>
                    <p className="text-sm text-blue-100">
                      {editingFlight
                        ? "Ubah informasi penerbangan"
                        : "Tambahkan penerbangan baru ke sistem"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-white transition-colors rounded-lg hover:bg-white/20"
                  title="Tutup"
                >
                  <AiOutlineClose size={24} />
                </button>
              </div>

              {/* Form Sections */}
              <div className="space-y-8">
                {/* Basic Information */}
                <div className="p-6 border border-gray-200 bg-gray-50 dark:bg-slate-700/30 rounded-xl dark:border-slate-600">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-900 dark:text-white">
                    <AiOutlineInfoCircle
                      size={20}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    Informasi Dasar
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="flex items-center block gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <FaPlane size={14} />
                        Nomor Penerbangan *
                      </label>
                      <input
                        type="text"
                        value={formData.flightNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            flightNumber: e.target.value,
                          })
                        }
                        placeholder="GA-123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="flex items-center block gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <FaPlaneDeparture size={14} />
                        Maskapai *
                      </label>
                      <select
                        value={formData.airlineCode}
                        onChange={(e) => {
                          const airline = airlines.find(
                            (a) => a.code === e.target.value
                          );
                          setFormData({
                            ...formData,
                            airlineCode: e.target.value,
                            airline: airline?.name || formData.airline,
                          });
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {airlines.map((airline) => (
                          <option key={airline.code} value={airline.code}>
                            {airline.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Route Information */}
                <div className="p-6 border border-gray-200 bg-gray-50 dark:bg-slate-700/30 rounded-xl dark:border-slate-600">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-900 dark:text-white">
                    <FaMapMarkerAlt
                      size={20}
                      className="text-green-600 dark:text-green-400"
                    />
                    Informasi Rute
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="flex items-center block gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <FaPlaneDeparture size={14} />
                        Dari *
                      </label>
                      <select
                        value={formData.fromCode}
                        onChange={(e) => {
                          const airport = airports.find(
                            (a) => a.code === e.target.value
                          );
                          setFormData({
                            ...formData,
                            fromCode: e.target.value,
                            from: airport
                              ? `${airport.city} (${airport.code})`
                              : formData.from,
                          });
                        }}
                        className={`w-full px-4 py-3 border rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formData.fromCode === formData.toCode &&
                          formData.fromCode
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Pilih kota berangkat</option>
                        {airports
                          .filter((airport) => airport.code !== formData.toCode)
                          .map((airport) => (
                            <option key={airport.code} value={airport.code}>
                              {airport.city} ({airport.code})
                            </option>
                          ))}
                      </select>
                      {formData.fromCode === formData.toCode &&
                        formData.fromCode && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                            Kota berangkat tidak boleh sama dengan kota tujuan
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="flex items-center block gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <FaPlaneArrival size={14} />
                        Ke *
                      </label>
                      <select
                        value={formData.toCode}
                        onChange={(e) => {
                          const airport = airports.find(
                            (a) => a.code === e.target.value
                          );
                          setFormData({
                            ...formData,
                            toCode: e.target.value,
                            to: airport
                              ? `${airport.city} (${airport.code})`
                              : formData.to,
                          });
                        }}
                        className={`w-full px-4 py-3 border rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formData.fromCode === formData.toCode &&
                          formData.toCode
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Pilih kota tujuan</option>
                        {airports
                          .filter(
                            (airport) => airport.code !== formData.fromCode
                          )
                          .map((airport) => (
                            <option key={airport.code} value={airport.code}>
                              {airport.city} ({airport.code})
                            </option>
                          ))}
                      </select>
                      {formData.fromCode === formData.toCode &&
                        formData.toCode && (
                          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                            Kota tujuan tidak boleh sama dengan kota berangkat
                          </p>
                        )}
                    </div>
                  </div>
                </div>

                {/* Schedule Information */}
                <div className="p-6 border border-gray-200 bg-gray-50 dark:bg-slate-700/30 rounded-xl dark:border-slate-600">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-900 dark:text-white">
                    <AiOutlineCalendar
                      size={20}
                      className="text-purple-600 dark:text-purple-400"
                    />
                    Jadwal Penerbangan
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="flex items-center block gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <AiOutlineCalendar size={14} />
                        Tanggal Keberangkatan *
                      </label>
                      <input
                        type="date"
                        value={formData.departureDate}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            departureDate: e.target.value,
                          });
                          setFormErrors({ ...formErrors, departureDate: "" });
                        }}
                        min={new Date().toISOString().split("T")[0]}
                        className={`w-full px-4 py-3 border rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.departureDate
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-slate-600"
                        }`}
                        required
                      />
                      {formErrors.departureDate ? (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {formErrors.departureDate}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Minimal tanggal hari ini
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center block gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <AiOutlineClockCircle size={14} />
                        Waktu Keberangkatan *
                      </label>
                      <input
                        type="time"
                        value={formData.departureTime}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            departureTime: e.target.value,
                          });
                          setFormErrors({
                            ...formErrors,
                            departureTime: validateTime(e.target.value),
                          });
                        }}
                        className={`w-full px-4 py-3 border rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.departureTime
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-slate-600"
                        }`}
                        required
                      />
                      {formErrors.departureTime && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {formErrors.departureTime}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center block gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <AiOutlineClockCircle size={14} />
                        Waktu Kedatangan *
                      </label>
                      <input
                        type="time"
                        value={formData.arrivalTime}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            arrivalTime: e.target.value,
                          });
                          setFormErrors({
                            ...formErrors,
                            arrivalTime: validateTime(e.target.value),
                          });
                        }}
                        className={`w-full px-4 py-3 border rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.arrivalTime
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-slate-600"
                        }`}
                        required
                      />
                      {formErrors.arrivalTime && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {formErrors.arrivalTime}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center block gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <FaPlane size={14} />
                        Durasi (contoh: 3j 30m)
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData({ ...formData, duration: e.target.value })
                        }
                        placeholder="3j 30m"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Price & Availability - All Classes */}
                <div className="p-6 border border-gray-200 bg-gray-50 dark:bg-slate-700/30 rounded-xl dark:border-slate-600">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-900 dark:text-white">
                    <AiOutlineDollarCircle
                      size={20}
                      className="text-yellow-600 dark:text-yellow-400"
                    />
                    Harga Semua Kelas
                  </h3>
                  <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                    Setiap penerbangan memiliki semua kelas. Isi harga untuk
                    semua kelas.
                  </p>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Harga Ekonomi */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-slate-800/90 dark:border-slate-700/50">
                      <label className="flex items-center block gap-2 mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded dark:bg-green-900/30 dark:text-green-300">
                          Ekonomi
                        </span>
                        Harga *
                      </label>
                      <div className="relative">
                        <span className="absolute text-gray-500 -translate-y-1/2 left-3 top-1/2 dark:text-gray-400">
                          Rp
                        </span>
                        <input
                          type="number"
                          value={formData.prices?.economy || 0}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setFormData({
                              ...formData,
                              price: value, // Set default price ke economy
                              prices: {
                                ...formData.prices,
                                economy: value,
                              },
                            });
                            setFormErrors({
                              ...formErrors,
                              economy: validatePrice(value),
                            });
                          }}
                          placeholder="1200000"
                          min="0"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                            formErrors.economy
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 dark:border-slate-600"
                          }`}
                          required
                        />
                      </div>
                      {formErrors.economy && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {formErrors.economy}
                        </p>
                      )}
                    </div>

                    {/* Harga Bisnis */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-slate-800/90 dark:border-slate-700/50">
                      <label className="flex items-center block gap-2 mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded dark:bg-blue-900/30 dark:text-blue-300">
                          Bisnis
                        </span>
                        Harga *
                      </label>
                      <div className="relative">
                        <span className="absolute text-gray-500 -translate-y-1/2 left-3 top-1/2 dark:text-gray-400">
                          Rp
                        </span>
                        <input
                          type="number"
                          value={formData.prices?.business || 0}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setFormData({
                              ...formData,
                              prices: {
                                ...formData.prices,
                                business: value,
                              },
                            });
                            setFormErrors({
                              ...formErrors,
                              business: validatePrice(value),
                            });
                          }}
                          placeholder="2500000"
                          min="0"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            formErrors.business
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 dark:border-slate-600"
                          }`}
                          required
                        />
                      </div>
                      {formErrors.business && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {formErrors.business}
                        </p>
                      )}
                    </div>

                    {/* Harga First Class */}
                    <div className="p-4 bg-white border border-gray-200 rounded-lg dark:bg-slate-800/90 dark:border-slate-700/50">
                      <label className="flex items-center block gap-2 mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <span className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded dark:bg-purple-900/30 dark:text-purple-300">
                          First Class
                        </span>
                        Harga *
                      </label>
                      <div className="relative">
                        <span className="absolute text-gray-500 -translate-y-1/2 left-3 top-1/2 dark:text-gray-400">
                          Rp
                        </span>
                        <input
                          type="number"
                          value={formData.prices?.first || 0}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setFormData({
                              ...formData,
                              prices: {
                                ...formData.prices,
                                first: value,
                              },
                            });
                            setFormErrors({
                              ...formErrors,
                              first: validatePrice(value),
                            });
                          }}
                          placeholder="5000000"
                          min="0"
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${
                            formErrors.first
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 dark:border-slate-600"
                          }`}
                          required
                        />
                      </div>
                      {formErrors.first && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {formErrors.first}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Availability */}
                <div className="p-6 border border-gray-200 bg-gray-50 dark:bg-slate-700/30 rounded-xl dark:border-slate-600">
                  <h3 className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-900 dark:text-white">
                    <HiOutlineUserGroup
                      size={20}
                      className="text-indigo-600 dark:text-indigo-400"
                    />
                    Ketersediaan Kursi
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="flex items-center block gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <HiOutlineUserGroup size={14} />
                        Total Kursi Tersedia *
                      </label>
                      <input
                        type="number"
                        value={formData.availableSeats}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          setFormData({
                            ...formData,
                            availableSeats: value,
                          });
                          setFormErrors({
                            ...formErrors,
                            availableSeats: validateSeats(value),
                          });
                        }}
                        placeholder="180"
                        min="0"
                        className={`w-full px-4 py-3 border rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.availableSeats
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 dark:border-slate-600"
                        }`}
                        required
                      />
                      {formErrors.availableSeats ? (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {formErrors.availableSeats}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Total kursi tersedia untuk semua kelas (1-500)
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="flex items-center block gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <AiOutlineInfoCircle size={14} />
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Tersedia">Tersedia</option>
                        <option value="Hampir Penuh">Hampir Penuh</option>
                        <option value="Penuh">Penuh</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 flex items-center justify-end gap-4 p-6 bg-white border-t border-gray-200 dark:bg-slate-800/90 dark:border-slate-700/50 rounded-b-2xl">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex items-center gap-2 px-6 py-3 font-medium text-gray-700 transition-colors bg-gray-100 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600"
                >
                  <AiOutlineClose size={18} />
                  Batal
                </button>
                <button
                  onClick={handleSaveFlight}
                  className="flex items-center gap-2 px-6 py-3 font-medium text-white transition-all rounded-lg shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                >
                  <AiOutlineSave size={18} />
                  {editingFlight ? "Simpan Perubahan" : "Tambah Penerbangan"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alert Modal */}
        <AlertModal
          isOpen={alert.isOpen}
          onClose={() => setAlert({ ...alert, isOpen: false })}
          type={alert.type}
          title={alert.title}
          message={alert.message}
        />

        {/* Confirm Delete Modal */}
        <ConfirmModal
          isOpen={confirmDelete.isOpen}
          onClose={() => setConfirmDelete({ isOpen: false, flightId: null })}
          onConfirm={confirmDeleteFlight}
          type="danger"
          title="Hapus Penerbangan"
          message="Apakah Anda yakin ingin menghapus penerbangan ini? Tindakan ini tidak dapat dibatalkan."
          confirmText="Ya, Hapus"
          cancelText="Batal"
        />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminFlights;
