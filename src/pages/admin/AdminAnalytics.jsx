import React, { useState, useMemo } from "react";
import Header from "../../components/Header";
import { useData } from "../../context/DataContext";
import { formatPrice, formatDate } from "../../data/mockData";
import Footer from "../../components/Footer";
import {
  AiOutlineDollarCircle,
  AiOutlineCalendar,
  AiOutlineRise,
  AiOutlineBarChart,
  AiOutlineLineChart,
  AiOutlineDownload,
} from "react-icons/ai";
import { FaPlane } from "react-icons/fa";

const AdminAnalytics = () => {
  const { bookings, flights } = useData();
  const [dateRange, setDateRange] = useState("month");

  // Calculate analytics
  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === "Paid")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(
    (b) => b.status === "Confirmed"
  ).length;
  const pendingBookings = bookings.filter((b) => b.status === "Pending").length;
  const cancelledBookings = bookings.filter(
    (b) => b.status === "Cancelled"
  ).length;

  const totalTickets = bookings.reduce(
    (sum, b) => sum + (b.passengers?.length || b.passengers || 1),
    0
  );

  const averageBookingValue =
    totalBookings > 0 ? totalRevenue / totalBookings : 0;

  // Calculate Revenue by Airline from real bookings data
  const revenueByAirline = useMemo(() => {
    if (!bookings || bookings.length === 0) return [];

    // Group bookings by airline
    const airlineMap = {};

    bookings.forEach((booking) => {
      if (!booking || !booking.airline) return;

      const airlineName = booking.airline;
      // Include all revenue, not just "Paid" (since default is "Paid" anyway)
      const revenue = booking.totalPrice || 0;

      if (!airlineMap[airlineName]) {
        airlineMap[airlineName] = {
          name: airlineName,
          revenue: 0,
          bookings: 0,
        };
      }

      airlineMap[airlineName].revenue += revenue;
      airlineMap[airlineName].bookings += 1;
    });

    // Convert to array and sort by revenue - DESCENDING (tertinggi ke terendah)
    const airlines = Object.values(airlineMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Top 5

    // If no airlines with revenue, return empty
    if (airlines.length === 0) return [];

    // Calculate percentage based on the highest revenue
    const maxRevenue = airlines[0].revenue > 0 ? airlines[0].revenue : 1;

    // Calculate percentage for each airline
    return airlines.map((airline, index) => {
      const percentage =
        maxRevenue > 0 ? (airline.revenue / maxRevenue) * 100 : 0;

      return {
        ...airline,
        percentage: percentage,
      };
    });
  }, [bookings]);

  // Bookings trend (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const bookingsTrend = last7Days.map((date) => ({
    date,
    count: bookings.filter((b) => b.bookingDate === date).length,
    revenue: bookings
      .filter((b) => b.bookingDate === date && b.paymentStatus === "Paid")
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
  }));

  const maxCount = Math.max(...bookingsTrend.map((t) => t.count), 1);
  const maxRevenue = Math.max(...bookingsTrend.map((t) => t.revenue), 1);

  // Calculate Popular Routes from real bookings data
  const popularRoutes = useMemo(() => {
    if (bookings.length === 0) return [];

    // Group bookings by route
    const routeMap = {};

    bookings.forEach((booking) => {
      if (!booking.route) return;

      const route = booking.route;
      const revenue =
        booking.paymentStatus === "Paid" ? booking.totalPrice || 0 : 0;
      const passengerCount = Array.isArray(booking.passengers)
        ? booking.passengers.length
        : booking.passengers || 1;

      if (!routeMap[route]) {
        routeMap[route] = {
          route: route,
          bookings: 0,
          revenue: 0,
          tickets: 0,
        };
      }

      routeMap[route].bookings += 1;
      routeMap[route].revenue += revenue;
      routeMap[route].tickets += passengerCount;
    });

    // Convert to array and sort by bookings count
    return Object.values(routeMap)
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 5); // Top 5
  }, [bookings]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
      <Header
        title="Analitik & Laporan"
        subtitle="Analisis data pemesanan dan pendapatan"
        onSearch={null}
      />

      <div className="p-4 md:p-6">
        {/* Date Range Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg dark:bg-slate-800/90 dark:border-slate-700/50">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Periode:
            </span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="today">Hari Ini</option>
              <option value="week">Minggu Ini</option>
              <option value="month">Bulan Ini</option>
              <option value="year">Tahun Ini</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-slate-800/90 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(totalRevenue)}
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Total Revenue
                </div>
              </div>
              <AiOutlineDollarCircle size={32} className="text-green-500" />
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-slate-800/90 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalBookings}
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Total Bookings
                </div>
              </div>
              <AiOutlineCalendar size={32} className="text-blue-500" />
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-slate-800/90 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalTickets}
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Tiket Terjual
                </div>
              </div>
              <FaPlane size={32} className="text-purple-500" />
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-slate-800/90 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(averageBookingValue)}
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Avg Booking Value
                </div>
              </div>
              <AiOutlineRise size={32} className="text-orange-500" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Bookings Trend */}
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-slate-800/90 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AiOutlineLineChart size={20} />
                Trend Pemesanan (7 Hari Terakhir)
              </h3>
            </div>
            <div className="space-y-4">
              {bookingsTrend.map((day, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(day.date)}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {day.count} booking
                    </span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full dark:bg-slate-700">
                    <div
                      className="h-4 bg-blue-600 rounded-full transition-all"
                      style={{ width: `${(day.count / maxCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Trend */}
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-slate-800/90 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AiOutlineBarChart size={20} />
                Trend Revenue (7 Hari Terakhir)
              </h3>
            </div>
            <div className="space-y-4">
              {bookingsTrend.map((day, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(day.date)}
                    </span>
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      {formatPrice(day.revenue)}
                    </span>
                  </div>
                  <div className="w-full h-4 bg-gray-200 rounded-full dark:bg-slate-700">
                    <div
                      className="h-4 bg-green-600 rounded-full transition-all"
                      style={{ width: `${(day.revenue / maxRevenue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue by Airline */}
        <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-slate-800/90 dark:border-slate-700/50">
            <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FaPlane size={20} />
              Revenue by Airline
            </h3>
            {revenueByAirline && revenueByAirline.length > 0 ? (
              <div className="relative">
                {/* Trend Arrow - Above bars */}
                {revenueByAirline.length > 1 && (
                  <div className="relative h-12 mb-1 -mt-2">
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 400 50"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient
                          id="arrowGradientRevenue"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#3b82f6"
                            stopOpacity="0.6"
                          />
                          <stop
                            offset="100%"
                            stopColor="#22c55e"
                            stopOpacity="0.9"
                          />
                        </linearGradient>
                      </defs>
                      {/* Path: Y kecil = tinggi, Y besar = rendah */}
                      {/* Bar tertinggi (kiri) = Y kecil (tinggi), bar lebih rendah (kanan) = Y besar (rendah) */}
                      <path
                        d={`M 30 10 Q 100 20, 170 30 T 310 45 T 370 50`}
                        stroke="url(#arrowGradientRevenue)"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polygon
                        points="365,50 375,50 370,55"
                        fill="#22c55e"
                        opacity="0.9"
                      />
                    </svg>
                  </div>
                )}

                {/* Bar Chart Container */}
                {/* Urutan: Index 0 = revenue TERBANYAK = bar TERTINGGI, Index selanjutnya = revenue lebih sedikit = bar lebih rendah */}
                <div className="flex items-end justify-between gap-4 h-34 mb-4 pb-4 border-b border-gray-200 dark:border-slate-700/50">
                  {revenueByAirline.map((airline, index) => {
                    // heightPercentage adalah persentase dari revenue tertinggi
                    // Index 0 = revenue tertinggi = 100% = bar tertinggi
                    // Index 1 = revenue lebih rendah = persentase lebih kecil = bar lebih rendah
                    const heightPercentage = airline.percentage;

                    // Warna sesuai gambar: Biru, Teal/Cyan, Hijau
                    const barColors = [
                      { from: "#3b82f6", to: "#2563eb" }, // Biru (Blue)
                      { from: "#14b8a6", to: "#0d9488" }, // Teal/Cyan
                      { from: "#22c55e", to: "#16a34a" }, // Hijau (Green)
                      { from: "#8b5cf6", to: "#7c3aed" }, // Purple (fallback)
                      { from: "#f59e0b", to: "#d97706" }, // Orange (fallback)
                    ];

                    const colors = barColors[index] || barColors[0];

                    // Bar height: percentage dari max height (100%)
                    // Maskapai dengan revenue tertinggi (index 0) akan dapat height tertinggi
                    const barHeight = Math.max(heightPercentage * 2.2, 15);

                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center group"
                      >
                        {/* Bar */}
                        <div className="relative w-full flex flex-col items-center justify-end">
                          <div
                            className="w-full rounded-t-lg transition-all duration-500 hover:shadow-xl hover:scale-105"
                            style={{
                              height: `${barHeight}%`,
                              background: `linear-gradient(to top, ${colors.to}, ${colors.from})`,
                              boxShadow: `0 4px 12px -2px rgba(0, 0, 0, 0.15), 0 2px 6px -1px rgba(0, 0, 0, 0.1), inset 0 -3px 6px rgba(255, 255, 255, 0.15)`,
                              transform: "perspective(600px) rotateX(8deg)",
                            }}
                          >
                            {/* Glass effect overlay */}
                            <div
                              className="absolute inset-0 rounded-t-lg opacity-40"
                              style={{
                                background:
                                  "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)",
                              }}
                            />
                          </div>
                        </div>
                        {/* Airline Name and Revenue */}
                        <div className="mt-4 text-center">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight mb-1">
                            {airline.name.length > 18
                              ? airline.name.substring(0, 18) + "..."
                              : airline.name}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                            {formatPrice(airline.revenue)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-slate-700/50">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Total Revenue
                    </p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatPrice(
                        revenueByAirline.reduce((sum, a) => sum + a.revenue, 0)
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Total Bookings
                    </p>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      {revenueByAirline.reduce((sum, a) => sum + a.bookings, 0)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <FaPlane
                  size={48}
                  className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
                />
                <p className="text-gray-500 dark:text-gray-400">
                  {bookings && bookings.length > 0
                    ? "Belum ada data revenue per maskapai"
                    : "Belum ada data booking"}
                </p>
                <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                  {bookings && bookings.length > 0
                    ? "Pastikan booking memiliki data maskapai dan total harga"
                    : "Data akan muncul setelah ada pemesanan"}
                </p>
              </div>
            )}
          </div>

          {/* Booking Status Distribution */}
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-slate-800/90 dark:border-slate-700/50">
            <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
              Distribusi Status Booking
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    Confirmed
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {confirmedBookings}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full dark:bg-slate-700">
                  <div
                    className="h-3 bg-green-500 rounded-full"
                    style={{
                      width: `${
                        totalBookings > 0
                          ? (confirmedBookings / totalBookings) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    Pending
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {pendingBookings}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full dark:bg-slate-700">
                  <div
                    className="h-3 bg-yellow-500 rounded-full"
                    style={{
                      width: `${
                        totalBookings > 0
                          ? (pendingBookings / totalBookings) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300">
                    Cancelled
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {cancelledBookings}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full dark:bg-slate-700">
                  <div
                    className="h-3 bg-red-500 rounded-full"
                    style={{
                      width: `${
                        totalBookings > 0
                          ? (cancelledBookings / totalBookings) * 100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Routes */}
        <div className="p-6 mt-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-slate-800/90 dark:border-slate-700/50">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AiOutlineRise size={20} />
              Top Routes
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase dark:text-gray-300">
                    Rute
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase dark:text-gray-300">
                    Bookings
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase dark:text-gray-300">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {popularRoutes.map((route, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      {route.route}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {route.bookings}
                    </td>
                    <td className="px-4 py-3 font-semibold text-green-600 dark:text-green-400">
                      {formatPrice(route.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminAnalytics;
