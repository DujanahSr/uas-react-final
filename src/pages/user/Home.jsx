import React, { useMemo } from "react";
import BookingForm from "../../components/BookingForm";
import { useNavigate } from "react-router-dom";
import { FaPlane, FaMapMarkerAlt } from "react-icons/fa";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useData } from "../../context/DataContext";
import Footer from "../../components/Footer";

const Home = () => {
  const navigate = useNavigate();
  const { bookings, flights } = useData();

  const handleSearch = (filters) => {
    navigate("/search", { state: { filters } });
  };

  // Get popular routes from today's bookings
  const popularRoutes = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];

    // Get bookings from today
    const todayBookings = bookings.filter((booking) => {
      const bookingDate = booking.bookingDate || booking.createdAt;
      return bookingDate && bookingDate.split("T")[0] === today;
    });

    // If there are bookings today, get popular routes from bookings
    if (todayBookings.length > 0) {
      // Group by route and count
      const routeCounts = {};
      todayBookings.forEach((booking) => {
        const flight = flights.find((f) => f.id === booking.flightId);
        if (flight) {
          const routeKey = `${flight.from}|${flight.to}`;
          if (!routeCounts[routeKey]) {
            routeCounts[routeKey] = {
              from: flight.from,
              fromCode: flight.fromCode,
              to: flight.to,
              toCode: flight.toCode,
              count: 0,
              minPrice: flight.prices?.economy || flight.price,
            };
          }
          routeCounts[routeKey].count++;
          const routePrice = flight.prices?.economy || flight.price;
          if (routePrice < routeCounts[routeKey].minPrice) {
            routeCounts[routeKey].minPrice = routePrice;
          }
        }
      });

      // Convert to array and sort by count, take top 3
      const routes = Object.values(routeCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map((route) => ({
          from: route.from,
          to: route.to,
          price: `Rp ${route.minPrice.toLocaleString("id-ID")}`,
          fromCode: route.fromCode,
          toCode: route.toCode,
        }));

      return routes;
    }

    // If no bookings today, return 3 default flights
    const defaultFlights = flights
      .filter((f) => f.status === "Tersedia")
      .slice(0, 3)
      .map((flight) => ({
        from: flight.from,
        to: flight.to,
        price: `Rp ${(flight.prices?.economy || flight.price).toLocaleString(
          "id-ID"
        )}`,
        fromCode: flight.fromCode,
        toCode: flight.toCode,
      }));

    return defaultFlights;
  }, [bookings, flights]);

  const handleRouteClick = (route) => {
    // Find the nearest available flight date for this route
    const availableFlights = flights.filter((flight) => {
      const fromMatch =
        flight.from === route.from ||
        flight.fromCode === route.fromCode ||
        flight.from
          .toLowerCase()
          .includes(route.from.toLowerCase().split(" ")[0]);
      const toMatch =
        flight.to === route.to ||
        flight.toCode === route.toCode ||
        flight.to.toLowerCase().includes(route.to.toLowerCase().split(" ")[0]);
      return fromMatch && toMatch && flight.status === "Tersedia";
    });

    // Get the nearest departure date (today or future)
    let departureDate = new Date().toISOString().split("T")[0];
    if (availableFlights.length > 0) {
      // Sort by departure date and get the nearest one
      const sortedFlights = availableFlights.sort(
        (a, b) => new Date(a.departureDate) - new Date(b.departureDate)
      );
      const nearestFlight =
        sortedFlights.find((f) => new Date(f.departureDate) >= new Date()) ||
        sortedFlights[0];
      if (nearestFlight) {
        departureDate = nearestFlight.departureDate;
      }
    }

    navigate("/search", {
      state: {
        filters: {
          from: route.from,
          to: route.to,
          tripType: "one-way",
          passengers: 1,
          departureDate: departureDate,
        },
      },
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full top-20 left-10 w-72 h-72 bg-blue-200/20 dark:bg-blue-500/10 blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute rounded-full bottom-20 right-10 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-500/10 blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 w-125 h-125 bg-purple-200/10 dark:bg-purple-500/5 blur-3xl animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <main className="relative z-10 px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8 text-center sm:mb-12 animate-slideInUp">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl dark:text-white animate-scaleIn">
            <span className="block mb-2 text-transparent bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
              Terbang Lebih Murah,
            </span>
            <span className="block">Lebih Nyaman</span>
          </h1>
          <p
            className="max-w-4xl mx-auto text-base text-gray-700 sm:text-lg md:text-xl lg:text-2xl dark:text-gray-300 animate-slideInUp"
            style={{ animationDelay: "0.2s" }}
          >
            Bandingkan harga dari ratusan maskapai, dapatkan promo eksklusif,
            dan pesan tiket dalam hitungan detik.
          </p>
        </div>

        {/* Booking Form */}
        <div className="max-w-6xl mx-auto mb-12 sm:mb-16 lg:mb-20">
          <div
            className="p-6 border shadow-2xl bg-white/90 backdrop-blur-sm border-gray-200/50 dark:bg-slate-800/90 dark:border-slate-700/50 rounded-3xl sm:p-8 md:p-12 card-3d animate-slideInUp"
            style={{ animationDelay: "0.3s" }}
          >
            <h2 className="mb-6 text-xl font-bold text-center text-gray-900 sm:text-2xl dark:text-white">
              Cari Penerbangan Terbaik Anda
            </h2>
            <BookingForm onSearch={handleSearch} />
          </div>
        </div>

        {/* Popular Routes */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <h2 className="mb-8 text-3xl font-bold text-center text-gray-900 sm:text-4xl dark:text-white animate-slideInUp">
            Rute Populer Hari Ini
          </h2>
          {popularRoutes.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {popularRoutes.map((route, i) => (
                <div
                  key={i}
                  onClick={() => handleRouteClick(route)}
                  className="overflow-hidden transition-all duration-500 border shadow-xl cursor-pointer bg-white/90 backdrop-blur-sm border-gray-200/50 dark:bg-slate-800/90 dark:border-slate-700/50 rounded-2xl hover:shadow-2xl card-3d animate-slideInUp"
                  style={{
                    animationDelay: `${0.4 + i * 0.1}s`,
                    transform: `perspective(1000px) rotateY(${
                      i % 2 === 0 ? "2deg" : "-2deg"
                    })`,
                  }}
                >
                  <div className="relative flex items-center justify-center h-40 overflow-hidden sm:h-48 bg-linear-to-br from-blue-500 via-indigo-600 to-purple-600">
                    <div
                      className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                      style={{ backgroundSize: "200% 100%" }}
                    ></div>
                    <FaPlane
                      size={48}
                      className="relative z-10 text-white animate-float3D"
                      style={{ animationDelay: `${i * 0.5}s` }}
                    />
                    <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
                  </div>
                  <div className="p-6 text-center sm:p-8">
                    <p className="flex items-center justify-center gap-2 mb-2 text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                      <FaMapMarkerAlt
                        size={18}
                        className="text-blue-600 dark:text-blue-400"
                      />
                      <span className="truncate">{route.from}</span>
                    </p>
                    <p className="my-2 text-base text-gray-600 sm:text-lg dark:text-gray-400">
                      <AiOutlineArrowRight className="inline animate-pulse" />
                    </p>
                    <p className="flex items-center justify-center gap-2 mb-4 text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                      <FaMapMarkerAlt
                        size={18}
                        className="text-blue-600 dark:text-blue-400"
                      />
                      <span className="truncate">{route.to}</span>
                    </p>
                    <p className="mb-4 text-2xl font-bold text-blue-600 sm:text-3xl dark:text-blue-400">
                      {route.price}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRouteClick(route);
                      }}
                      className="flex items-center justify-center w-full gap-2 px-6 py-3 mx-auto font-medium text-white transition-all duration-300 transform shadow-lg bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:scale-95 hover:shadow-xl"
                    >
                      Cari Sekarang
                      <AiOutlineArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center animate-slideInUp">
              <FaPlane
                size={64}
                className="mx-auto mb-4 text-gray-300 dark:text-slate-600 animate-float3D"
              />
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Belum ada rute populer hari ini
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
