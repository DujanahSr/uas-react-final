/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { formatPrice } from "../../data/mockData";
import AlertModal from "../../components/AlertModal";
import Footer from "../../components/Footer";
import {
  validateKTP,
  validatePassport,
  validateDateOfBirth,
  
} from "../../utils/validation";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineCheckCircle,
  AiOutlineArrowRight,
  AiOutlineArrowLeft,
  AiOutlineInfoCircle,
  AiOutlineHome,
} from "react-icons/ai";
import { FaPlane, FaUserFriends, FaMapMarkerAlt } from "react-icons/fa";
import { HiOutlineUserGroup } from "react-icons/hi";

const FlightDetail = () => {
  const { id } = useParams();
  const { flights, addBooking } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Cari penerbangan berdasarkan ID dari DataContext
  // Pastikan menggunakan flights dari DataContext yang sama dengan SearchResults
  const flight = flights.find((f) => f.id === id);
  if (!flight) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaPlane
            size={64}
            className="mx-auto mb-4 text-gray-400 dark:text-gray-600"
          />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Penerbangan tidak ditemukan
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">ID: {id}</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Total flights: {flights.length}
          </p>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 mx-auto mt-6 text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <AiOutlineHome size={18} />
            Kembali ke Home
          </button>
        </div>
      </div>
    );
  }

  const [currentStep, setCurrentStep] = useState(1);
  const [passengers, setPassengers] = useState(1);
  const [passengerData, setPassengerData] = useState([
    {
      title: "Mr",
      name: user?.name || "",
      idNumber: "",
      dob: "",
      seat: "",
      address: user?.address || "",
    },
  ]);
  // Auto-fill contact dari user data
  const [contact, setContact] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [selectedClass, setSelectedClass] = useState("economy");
  const [alert, setAlert] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });
  const [passengerErrors, setPassengerErrors] = useState({});
  const [contactErrors, setContactErrors] = useState({});

  // Update contact ketika user berubah (misalnya setelah edit profil)
  useEffect(() => {
    if (user) {
      setContact({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      // Update juga passengerData pertama dengan address dan name
      if (passengerData.length > 0) {
        setPassengerData((prev) => {
          const updated = [...prev];
          if (updated[0]) {
            updated[0] = {
              ...updated[0],
              name: user.name || updated[0].name,
              address: user.address || "",
            };
          }
          return updated;
        });
      }
    }
  }, [user]);

  const getPrice = () => {
    // Map selectedClass ke format yang benar
    const priceKey =
      selectedClass === "economy"
        ? "economy"
        : selectedClass === "business"
        ? "business"
        : "first";
    return flight.prices?.[priceKey] || flight.price;
  };

  const totalPrice = getPrice() * passengers;
  const tax = Math.round(totalPrice * 0.1); // 10% tax
  const finalTotal = totalPrice + tax;

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate passenger count
      if (passengers < 1 || passengers > 6) {
        setAlert({
          isOpen: true,
          type: "warning",
          title: "Jumlah Penumpang Tidak Valid",
          message: "Jumlah penumpang harus antara 1-6 orang",
        });
        return;
      }
      // Initialize passenger data
      const newPassengerData = Array(passengers)
        .fill(null)
        .map(
          (_, i) =>
            passengerData[i] || {
              title: "Mr",
              name: i === 0 ? user?.name || "" : "",
              idNumber: "",
              dob: "",
              seat: "",
              address: i === 0 ? user?.address || "" : "",
            }
        );
      setPassengerData(newPassengerData);
    }
    if (currentStep === 2) {
      // Validasi semua data penumpang
      const errors = {};
      let hasErrors = false;

      passengerData.forEach((p, index) => {
        if (!p.name) {
          errors[`passenger_${index}_name`] = "Nama lengkap wajib diisi";
          hasErrors = true;
        }

        if (!p.idNumber) {
          errors[`passenger_${index}_idNumber`] = "Nomor identitas wajib diisi";
          hasErrors = true;
        } else {
          const cleanId = p.idNumber.replace(/\s/g, "");
          let idError = "";
          if (/^\d{16}$/.test(cleanId)) {
            idError = validateKTP(cleanId);
          } else {
            idError = validatePassport(cleanId);
          }
          if (idError) {
            errors[`passenger_${index}_idNumber`] = idError;
            hasErrors = true;
          }
        }

        if (!p.dob) {
          errors[`passenger_${index}_dob`] = "Tanggal lahir wajib diisi";
          hasErrors = true;
        } else {
          const dobError = validateDateOfBirth(p.dob, flight.departureDate);
          if (dobError) {
            errors[`passenger_${index}_dob`] = dobError;
            hasErrors = true;
          }
        }
      });

      if (hasErrors) {
        setPassengerErrors(errors);
        setAlert({
          isOpen: true,
          type: "warning",
          title: "Data Belum Valid",
          message: "Mohon perbaiki error pada data penumpang!",
        });
        return;
      }
    }
    if (currentStep === 3) {
      // Step 3 tidak perlu validasi karena data sudah auto-fill dari user
      // Langsung lanjut ke step berikutnya
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleBooking = () => {
    const newBooking = {
      id: "BK" + Date.now(),
      bookingCode:
        "FBK" + Math.random().toString(36).substr(2, 8).toUpperCase(),
      passengerName: contact.name,
      passengers: passengerData.map((p, i) => ({
        ...p,
        seat:
          p.seat ||
          `${Math.floor(Math.random() * 30) + 1}${String.fromCharCode(
            65 + (i % 6)
          )}`,
      })),
      email: contact.email,
      phone: contact.phone,
      flightId: flight.id,
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      route: `${flight.from} → ${flight.to}`,
      from: flight.from,
      to: flight.to,
      departureDate: flight.departureDate,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      totalPrice: finalTotal,
      basePrice: totalPrice,
      tax: tax,
      addons: [],
      status: "Pending",
      paymentStatus: "Paid", // Otomatis Paid karena pembayaran sudah dilakukan saat booking
      paymentMethod: "Credit Card",
      bookingDate: new Date().toISOString().split("T")[0],
      class:
        selectedClass === "economy"
          ? "Ekonomi"
          : selectedClass === "business"
          ? "Bisnis"
          : "First Class",
      seats: passengerData.map((p) => p.seat || ""),
    };

    addBooking(newBooking);
    navigate("/booking-success", { state: { booking: newBooking, flight } });
  };

  const updatePassengerData = (index, field, value) => {
    const updated = [...passengerData];
    updated[index] = { ...updated[index], [field]: value };
    setPassengerData(updated);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/20 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Flight Info Header */}
        <div className="p-4 mb-6 border shadow-lg bg-white/90 backdrop-blur-sm border-gray-200/50 rounded-xl dark:bg-slate-800/90 dark:border-slate-700/50 card-3d animate-slideInUp sm:p-6">
          <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                {flight.airline} - {flight.flightNumber}
              </h1>
              <p className="mt-1 text-sm text-gray-600 sm:text-base dark:text-gray-400">
                {flight.from} → {flight.to}
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 transition-all transform bg-white border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 hover:scale-105 active:scale-95 sm:ml-4 sm:px-4"
            >
              <AiOutlineHome size={16} className="sm:w-4.5 sm:h-4.5" />
              <span className="hidden sm:inline">Ke Home</span>
            </button>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-xl font-bold text-blue-600 sm:text-2xl dark:text-blue-400">
              Mulai dari {formatPrice(flight.prices?.economy || flight.price)}
            </div>
            <div className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">
              Pilih kelas di bawah untuk melihat harga
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div
          className="mb-6 sm:mb-8 animate-slideInUp"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center justify-between pb-2 overflow-x-auto">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className="flex items-center shrink-0">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 sm:w-10 sm:h-10 ${
                      currentStep >= step
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg scale-110"
                        : "bg-white border-gray-300 text-gray-400 dark:bg-slate-800 dark:border-slate-600"
                    }`}
                  >
                    {currentStep > step ? (
                      <AiOutlineCheckCircle
                        size={18}
                        className="sm:w-5 sm:h-5"
                      />
                    ) : (
                      <span className="text-sm font-bold sm:text-base">
                        {step}
                      </span>
                    )}
                  </div>
                  <div className="hidden ml-2 sm:block">
                    <div
                      className={`text-xs font-medium sm:text-sm ${
                        currentStep >= step
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {step === 1 && "Jumlah Penumpang"}
                      {step === 2 && "Data Penumpang"}
                      {step === 3 && "Data Kontak"}
                      {step === 4 && "Review & Bayar"}
                    </div>
                  </div>
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 transition-all duration-300 sm:mx-4 ${
                      currentStep > step
                        ? "bg-blue-600"
                        : "bg-gray-300 dark:bg-slate-600"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div
              className="p-4 border shadow-lg bg-white/90 backdrop-blur-sm border-gray-200/50 rounded-xl dark:bg-slate-800/90 dark:border-slate-700/50 card-3d animate-slideInUp sm:p-6 lg:p-8"
              style={{ animationDelay: "0.3s" }}
            >
              {/* Step 1: Jumlah Penumpang & Kelas */}
              {currentStep === 1 && (
                <div>
                  <h2 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                    <HiOutlineUserGroup size={24} />
                    Jumlah Penumpang & Kelas
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Jumlah Penumpang
                      </label>
                      <select
                        value={passengers}
                        onChange={(e) => {
                          const newCount = parseInt(e.target.value);
                          setPassengers(newCount);
                          const newData = Array(newCount)
                            .fill(null)
                            .map(
                              (_, i) =>
                                passengerData[i] || {
                                  title: "Mr",
                                  name: i === 0 ? user?.name || "" : "",
                                  idNumber: "",
                                  dob: "",
                                  seat: "",
                                  address: i === 0 ? user?.address || "" : "",
                                }
                            );
                          setPassengerData(newData);
                        }}
                        className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n} Penumpang
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Pilih Kelas Penerbangan *
                      </label>
                      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                        Semua kelas tersedia untuk penerbangan ini. Pilih kelas
                        yang diinginkan.
                      </p>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {[
                          {
                            value: "economy",
                            label: "Ekonomi",
                            description:
                              "Kelas standar dengan fasilitas lengkap",
                            price: flight.prices?.economy || flight.price,
                            badgeColor:
                              "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
                            borderColor:
                              selectedClass === "economy"
                                ? "border-green-600"
                                : "border-gray-300 dark:border-gray-600",
                            bgColor:
                              selectedClass === "economy"
                                ? "bg-green-50 dark:bg-green-900/20"
                                : "bg-white dark:bg-gray-700",
                          },
                          {
                            value: "business",
                            label: "Bisnis",
                            description: "Lebih nyaman dengan layanan premium",
                            price: flight.prices?.business || flight.price * 2,
                            badgeColor:
                              "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
                            borderColor:
                              selectedClass === "business"
                                ? "border-blue-600"
                                : "border-gray-300 dark:border-gray-600",
                            bgColor:
                              selectedClass === "business"
                                ? "bg-blue-50 dark:bg-blue-900/20"
                                : "bg-white dark:bg-gray-700",
                          },
                          {
                            value: "first",
                            label: "First Class",
                            description: "Pengalaman premium terbaik",
                            price: flight.prices?.first || flight.price * 4,
                            badgeColor:
                              "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
                            borderColor:
                              selectedClass === "first"
                                ? "border-purple-600"
                                : "border-gray-300 dark:border-gray-600",
                            bgColor:
                              selectedClass === "first"
                                ? "bg-purple-50 dark:bg-purple-900/20"
                                : "bg-white dark:bg-gray-700",
                          },
                        ].map((cls) => {
                          const formatted = formatPrice(cls.price);
                          const currency = formatted.slice(0, 3);
                          const amount = formatted.slice(3);

                          // Ukuran tetap: Rp kecil, angka sedikit lebih besar, tetap muat satu baris
                          const currencySizeClass =
                            "text-[10px] sm:text-xs md:text-sm";
                          const amountSizeClass =
                            "text-sm sm:text-lg md:text-xl";

                          return (
                            <button
                              key={cls.value}
                              type="button"
                              onClick={() => setSelectedClass(cls.value)}
                              className={`p-5 border-2 rounded-xl transition-all text-left hover:shadow-md ${cls.borderColor} ${cls.bgColor}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded ${cls.badgeColor}`}
                                >
                                  {cls.label}
                                </span>
                                {selectedClass === cls.value && (
                                  <AiOutlineCheckCircle
                                    className="text-green-600 dark:text-green-400"
                                    size={20}
                                  />
                                )}
                              </div>
                              {/* Harga: Rp kecil, angka sedikit lebih besar, 1 baris */}
                              <div className="flex items-baseline gap-1 mb-1 text-gray-900 dark:text-white whitespace-nowrap">
                                <span
                                  className={`font-semibold opacity-80 ${currencySizeClass}`}
                                >
                                  {currency}
                                </span>
                                <span
                                  className={`font-bold leading-tight tracking-tight ${amountSizeClass}`}
                                >
                                  {amount}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {cls.description}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Data Penumpang */}
              {currentStep === 2 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
                      <AiOutlineUser size={24} />
                      Data Penumpang
                    </h2>
                    {passengerData.length > 0 &&
                      passengerData[0]?.name === user?.name && (
                        <div className="flex items-center gap-2 px-4 py-2 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
                          <AiOutlineInfoCircle
                            className="text-blue-600 dark:text-blue-400"
                            size={18}
                          />
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            Data dari akun Anda
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="space-y-6">
                    {passengerData.map((passenger, index) => (
                      <div
                        key={index}
                        className="p-6 border border-gray-200 rounded-lg dark:border-gray-700"
                      >
                        <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
                          Penumpang {index + 1}
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                              Title
                            </label>
                            <select
                              value={passenger.title}
                              onChange={(e) =>
                                updatePassengerData(
                                  index,
                                  "title",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="Mr">Mr</option>
                              <option value="Mrs">Mrs</option>
                              <option value="Ms">Ms</option>
                            </select>
                          </div>
                          <div>
                            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                              Nama Lengkap
                              {index === 0 && user?.name && (
                                <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                                  Dari akun
                                </span>
                              )}
                            </label>
                            <input
                              type="text"
                              value={passenger.name}
                              onChange={(e) =>
                                updatePassengerData(
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              placeholder="Sesuai KTP/Passport"
                              disabled={index === 0 && user?.name}
                              className={`w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                                index === 0 && user?.name
                                  ? "bg-gray-50 dark:bg-gray-700/50 cursor-not-allowed"
                                  : ""
                              }`}
                              required
                            />
                            {index === 0 && user?.name && (
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Nama dari data akun Anda
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                              Nomor Identitas
                            </label>
                            <input
                              type="text"
                              value={passenger.idNumber}
                              onChange={(e) =>
                                updatePassengerData(
                                  index,
                                  "idNumber",
                                  e.target.value
                                )
                              }
                              placeholder="KTP (16 digit) atau Passport (6-9 karakter)"
                              className={`w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                                passengerErrors[`passenger_${index}_idNumber`]
                                  ? "border-red-500 focus:ring-red-500"
                                  : "border-gray-300 dark:border-slate-600"
                              }`}
                              required
                            />
                            {passengerErrors[`passenger_${index}_idNumber`] && (
                              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                {passengerErrors[`passenger_${index}_idNumber`]}
                              </p>
                            )}
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              KTP: 16 digit angka | Passport: 6-9 karakter
                              (huruf & angka)
                            </p>
                          </div>
                          <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                              Tanggal Lahir
                            </label>
                            <input
                              type="date"
                              value={passenger.dob}
                              onChange={(e) =>
                                updatePassengerData(
                                  index,
                                  "dob",
                                  e.target.value
                                )
                              }
                              max={(() => {
                                // Maksimal tanggal: 7 hari sebelum departure
                                const departureDate = new Date(
                                  flight.departureDate
                                );
                                const maxDate = new Date(departureDate);
                                maxDate.setDate(maxDate.getDate() - 7);
                                return maxDate.toISOString().split("T")[0];
                              })()}
                              className={`w-full px-4 py-2 border rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                                passengerErrors[`passenger_${index}_dob`]
                                  ? "border-red-500 focus:ring-red-500"
                                  : "border-gray-300 dark:border-slate-600"
                              }`}
                              required
                            />
                            {passengerErrors[`passenger_${index}_dob`] && (
                              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                {passengerErrors[`passenger_${index}_dob`]}
                              </p>
                            )}
                            {!passengerErrors[`passenger_${index}_dob`] && (
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Minimal 7 hari sebelum tanggal keberangkatan
                              </p>
                            )}
                          </div>
                          <div className="md:col-span-2">
                            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                              Alamat
                              {index === 0 && user?.address && (
                                <span className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                                  Dari akun
                                </span>
                              )}
                            </label>
                            <textarea
                              value={passenger.address || ""}
                              onChange={(e) =>
                                updatePassengerData(
                                  index,
                                  "address",
                                  e.target.value
                                )
                              }
                              placeholder="Masukkan alamat lengkap"
                              rows={2}
                              disabled={index === 0 && user?.address}
                              className={`w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none ${
                                index === 0 && user?.address
                                  ? "bg-gray-50 dark:bg-gray-700/50 cursor-not-allowed"
                                  : ""
                              }`}
                            />
                            {index === 0 && user?.address && (
                              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                Alamat dari data akun Anda
                              </p>
                            )}
                          </div>
                          {index === 0 && user && (
                            <div className="pt-2 border-t border-gray-200 md:col-span-2 dark:border-gray-700">
                              <Link
                                to="/profile"
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 transition-colors border border-blue-200 rounded-lg dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                              >
                                <AiOutlineInfoCircle size={16} />
                                Edit Profil untuk mengubah nama dan alamat
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Data Kontak */}
              {currentStep === 3 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
                      <AiOutlineInfoCircle size={24} />
                      Data Kontak
                    </h2>
                    <div className="flex items-center gap-2 px-4 py-2 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700">
                      <AiOutlineInfoCircle
                        className="text-blue-600 dark:text-blue-400"
                        size={18}
                      />
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Data dari akun Anda
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <AiOutlineUser size={16} />
                        Nama Kontak
                      </label>
                      <input
                        type="text"
                        value={contact.name}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-not-allowed dark:border-slate-600 dark:bg-slate-700/50 dark:text-gray-400 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <AiOutlineMail size={16} />
                        Email
                      </label>
                      <input
                        type="email"
                        value={contact.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-not-allowed dark:border-slate-600 dark:bg-slate-700/50 dark:text-gray-400 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        <AiOutlinePhone size={16} />
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        value={contact.phone}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg cursor-not-allowed dark:border-slate-600 dark:bg-slate-700/50 dark:text-gray-400 bg-gray-50"
                      />
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        to="/profile"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 transition-colors border border-blue-200 rounded-lg dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                      >
                        <AiOutlineInfoCircle size={16} />
                        Edit Profil
                      </Link>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Untuk mengubah data kontak, silakan edit di halaman
                        Profil
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Payment */}
              {currentStep === 4 && (
                <div>
                  <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
                    Review & Pembayaran
                  </h2>

                  <div className="space-y-6">
                    {/* Flight Summary */}
                    <div className="p-6 rounded-lg bg-gray-50 dark:bg-slate-700/50">
                      <h3 className="flex items-center gap-2 mb-4 font-semibold text-gray-900 dark:text-white">
                        <FaPlane size={18} />
                        Detail Penerbangan
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600 dark:text-gray-400">
                            Maskapai
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {flight.airline}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 dark:text-gray-400">
                            Nomor Penerbangan
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {flight.flightNumber}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <FaMapMarkerAlt size={12} />
                            Dari
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {flight.from}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <FaMapMarkerAlt size={12} />
                            Ke
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {flight.to}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <AiOutlineCalendar size={12} />
                            Tanggal
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {flight.departureDate}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <AiOutlineClockCircle size={12} />
                            Waktu
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {flight.departureTime} - {flight.arrivalTime}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method - Simplified */}
                    <div>
                      <label className="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Metode Pembayaran
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                        defaultValue="credit-card"
                      >
                        <option value="credit-card">Credit/Debit Card</option>
                        <option value="bank-transfer">Bank Transfer</option>
                        <option value="e-wallet">E-Wallet</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    currentStep === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  <AiOutlineArrowLeft size={18} />
                  Sebelumnya
                </button>
                {currentStep < 4 ? (
                  <button
                    onClick={handleNextStep}
                    className="flex items-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Selanjutnya
                    <AiOutlineArrowRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={handleBooking}
                    className="flex items-center gap-2 px-8 py-3 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    <AiOutlineCheckCircle size={20} />
                    Bayar Sekarang
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Price Summary */}
          <div className="lg:col-span-1">
            <div className="sticky p-6 border shadow-lg bg-white/90 backdrop-blur-sm border-gray-200/50 rounded-xl dark:bg-slate-800/90 dark:border-slate-700/50 top-4 card-3d">
              <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
                Ringkasan Harga
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {passengers} x {formatPrice(getPrice())}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Pajak & Fee
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatPrice(tax)}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FlightDetail;
