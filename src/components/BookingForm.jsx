import React, { useState } from "react";
import AlertModal from "./AlertModal";
import {
  AiOutlineCalendar,
  AiOutlineSwap,
  AiOutlineSearch,
  AiOutlineEnvironment,
} from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FaPlaneDeparture, FaPlaneArrival } from "react-icons/fa";

const BookingForm = ({ onSearch }) => {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    passengers: 1,
    tripType: "one-way",
    class: "economy",
  });
  const [alert, setAlert] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwap = () => {
    setFormData((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi form
    if (!formData.from || !formData.to || !formData.departureDate) {
      setAlert({
        isOpen: true,
        type: "warning",
        title: "Form Belum Lengkap",
        message: "Mohon lengkapi semua field yang wajib diisi!",
      });
      return;
    }

    if (formData.from === formData.to) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Kota Tidak Valid",
        message: "Kota asal dan tujuan tidak boleh sama!",
      });
      return;
    }

    // Validasi untuk round trip
    if (formData.tripType === "round-trip" && !formData.returnDate) {
      setAlert({
        isOpen: true,
        type: "warning",
        title: "Tanggal Kembali Belum Dipilih",
        message: "Mohon pilih tanggal kembali untuk perjalanan pulang pergi!",
      });
      return;
    }

    if (
      formData.tripType === "round-trip" &&
      formData.returnDate &&
      formData.departureDate
    ) {
      if (new Date(formData.returnDate) <= new Date(formData.departureDate)) {
        setAlert({
          isOpen: true,
          type: "error",
          title: "Tanggal Tidak Valid",
          message: "Tanggal kembali harus lebih besar dari tanggal berangkat!",
        });
        return;
      }
    }

    // Panggil callback untuk search
    // Untuk round trip, kita hanya mencari penerbangan pergi dulu
    // Penerbangan kembali akan dicari nanti saat booking
    if (onSearch) {
      onSearch(formData);
    }
  };

  const cities = [
    "Jakarta (CGK)",
    "Denpasar (DPS)",
    "Surabaya (SUB)",
    "Medan (KNO)",
    "Makassar (UPG)",
    "Yogyakarta (YIA)",
    "Singapore (SIN)",
    "Kuala Lumpur (KUL)",
  ];

  return (
    <div className="p-6 mb-6 transition-colors bg-white border border-gray-200 shadow-lg dark:bg-gray-800 rounded-xl dark:border-gray-700">
      <h2 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">
        Cari Penerbangan
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Trip Type */}
          <div className="flex space-x-2">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg transition-colors ${
                formData.tripType === "one-way"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              onClick={() => setFormData({ ...formData, tripType: "one-way" })}
            >
              Sekali Jalan
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg transition-colors ${
                formData.tripType === "round-trip"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              onClick={() =>
                setFormData({ ...formData, tripType: "round-trip" })
              }
            >
              Pulang Pergi
            </button>
          </div>

          {/* Class */}
          <select
            name="class"
            value={formData.class}
            onChange={handleChange}
            className="px-4 py-2 text-gray-800 transition-colors bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="economy">Ekonomi</option>
            <option value="business">Bisnis</option>
            <option value="first">First Class</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* From */}
          <div className="relative">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Dari
            </label>
            <div className="relative">
              <FaPlaneDeparture
                className="absolute text-gray-400 left-3 top-3 dark:text-gray-500"
                size={18}
              />
              <select
                name="from"
                value={formData.from}
                onChange={handleChange}
                className="w-full py-2 pl-10 pr-4 text-gray-800 transition-colors bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Pilih kota</option>
                {cities.map((city) => (
                  <option key={city} value={city.split(" ")[0]}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleSwap}
              className="p-2 mb-1 transition-colors bg-gray-100 rounded-lg dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Tukar kota asal dan tujuan"
            >
              <AiOutlineSwap
                size={20}
                className="text-gray-600 dark:text-gray-300"
              />
            </button>
          </div>

          {/* To */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Ke
            </label>
            <div className="relative">
              <FaPlaneArrival
                className="absolute text-gray-400 left-3 top-3 dark:text-gray-500"
                size={18}
              />
              <select
                name="to"
                value={formData.to}
                onChange={handleChange}
                className="w-full py-2 pl-10 pr-4 text-gray-800 transition-colors bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Pilih kota</option>
                {cities.map((city) => (
                  <option key={city} value={city.split(" ")[0]}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Passengers */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Penumpang
            </label>
            <div className="relative">
              <HiOutlineUserGroup className="absolute text-gray-400 left-3 top-3 dark:text-gray-500" />
              <select
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                className="w-full py-2 pl-10 pr-4 text-gray-800 transition-colors bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} Penumpang
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Departure Date */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Tanggal Berangkat
            </label>
            <div className="relative">
              <AiOutlineCalendar className="absolute text-gray-400 left-3 top-3 dark:text-gray-500" />
              <input
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="w-full py-2 pl-10 pr-4 text-gray-800 transition-colors bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Return Date */}
          {formData.tripType === "round-trip" && (
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Tanggal Kembali
              </label>
              <div className="relative">
                <AiOutlineCalendar className="absolute text-gray-400 left-3 top-3 dark:text-gray-500" />
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleChange}
                  min={
                    formData.departureDate ||
                    new Date().toISOString().split("T")[0]
                  }
                  className="w-full py-2 pl-10 pr-4 text-gray-800 transition-colors bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <AiOutlineSearch size={20} />
            Cari Penerbangan
          </button>
        </div>
      </form>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
    </div>
  );
};

export default BookingForm;
