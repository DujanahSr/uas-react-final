/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  AiOutlineDashboard,
  AiOutlineCalendar,
  AiOutlineBarChart,
  AiOutlineSetting,
  AiOutlineUser,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineLogout,
  AiOutlineLeft,
  AiOutlineRight,
  AiOutlineSearch,
  AiOutlineHome,
  AiOutlineQuestionCircle,
} from "react-icons/ai";
import { FaPlaneDeparture } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";

const Sidebar = ({ role = "admin", onLogout }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  const { isDark } = useTheme();
  const { admin, user } = useAuth();
  const { bookings, flights } = useData();

  const menuItems =
    role === "user"
      ? [
          { path: "/", icon: <AiOutlineHome size={22} />, label: "Home" },
          {
            path: "/search",
            icon: <AiOutlineSearch size={20} />,
            label: "Cari Tiket",
          },
          {
            path: "/my-bookings",
            icon: <AiOutlineCalendar size={20} />,
            label: "Riwayat Booking",
          },
          {
            path: "/profile",
            icon: <AiOutlineUser size={20} />,
            label: "Profil",
          },
          {
            path: "/help",
            icon: <AiOutlineQuestionCircle size={20} />,
            label: "Bantuan",
          },
        ]
      : [
          {
            path: "/admin",
            icon: <AiOutlineDashboard size={22} />,
            label: "Dashboard",
          },
          {
            path: "/admin/flights",
            icon: <FaPlaneDeparture size={20} />,
            label: "Penerbangan",
          },
          {
            path: "/admin/bookings",
            icon: <AiOutlineCalendar size={20} />,
            label: "Pemesanan",
          },
          {
            path: "/admin/analytics",
            icon: <AiOutlineBarChart size={20} />,
            label: "Analitik",
          },
          {
            path: "/admin/settings",
            icon: <AiOutlineSetting size={20} />,
            label: "Pengaturan",
          },
        ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMouseEnter = () => {
    if (isCollapsed) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (isCollapsed) {
      setIsHovered(false);
    }
  };

  const getSidebarWidth = () => {
    if (isCollapsed && !isHovered) return "w-20";
    if (isCollapsed && isHovered) return "w-64";
    return "w-64";
  };

  const getContentClasses = () => {
    if (isCollapsed && !isHovered) return "opacity-0 scale-95";
    if (isCollapsed && isHovered) return "opacity-100 scale-100";
    return "opacity-100 scale-100";
  };

  const adminData = role === "admin" ? admin : user;

  // Calculate real-time statistics for today
  const todayStats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    
    // Count bookings today
    const bookingsToday = bookings.filter((booking) => {
      const bookingDate = booking.bookingDate || booking.createdAt;
      return bookingDate && bookingDate.split("T")[0] === today;
    }).length;

    // Count active flights today
    const flightsToday = flights.filter((flight) => {
      return flight.departureDate === today && flight.status === "Tersedia";
    }).length;

    return {
      bookings: bookingsToday,
      flights: flightsToday,
    };
  }, [bookings, flights]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="fixed z-50 flex items-center gap-2 px-3 py-2 text-sm font-medium text-white transition-all duration-300 border rounded-full lg:hidden top-3 left-3 bg-linear-to-r from-blue-600 to-blue-500 shadow-lg/70 border-white/10 hover:shadow-xl hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
      >
        {isOpen ? (
          <AiOutlineClose size={18} className="animate-spin-in" />
        ) : (
          <AiOutlineMenu size={18} className="animate-pulse" />
        )}
        <span className="hidden xs:inline sm:inline">Menu</span>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 transition-opacity duration-300 bg-black bg-opacity-50 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40
          ${getSidebarWidth()}
          bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800
          shadow-2xl dark:shadow-gray-900/50
          transform transition-all duration-500 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col h-screen
          overflow-hidden
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Collapse Toggle Button - Desktop */}
        <button
          className="absolute z-50 hidden p-2 text-white transition-all duration-300 transform rounded-full shadow-lg lg:flex -right-3 top-8 bg-linear-to-r from-blue-500 to-blue-600 hover:shadow-xl hover:scale-110 hover:rotate-12"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <AiOutlineRight size={18} className="animate-bounce-in-right" />
          ) : (
            <AiOutlineLeft size={18} className="animate-bounce-in-left" />
          )}
        </button>

        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="relative p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="absolute inset-0 opacity-0 bg-linear-to-r from-blue-50/30 to-transparent dark:from-blue-900/10 animate-pulse-slow" />

            <div className="relative z-10 flex items-center space-x-3">
              <div className="relative">
                <FaPlaneDeparture
                  size={32}
                  className="text-blue-600 dark:text-blue-400 animate-float"
                />
                <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-sm animate-ping-slow" />
              </div>

              <div
                className={`overflow-hidden transition-all duration-500 ${getContentClasses()}`}
              >
                <h1 className="text-2xl font-bold text-transparent bg-linear-to-r from-blue-600 to-blue-500 bg-clip-text">
                  FlyBook
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  Booking Tiket Pesawat
                </p>
              </div>
            </div>

            {adminData && (
              <div
                className={`mt-4 p-3 bg-linear-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-100 dark:border-blue-800/30 transition-all duration-500 ${getContentClasses()}`}
              >
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  👋 Halo, <strong>{adminData.name || adminData.email}</strong>
                </p>
                <p className="mt-1 text-xs text-blue-600/80 dark:text-blue-400/80">
                  {adminData.role || role}
                </p>
              </div>
            )}
          </div>

          {/* Menu Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                // Check if current path matches the menu item path
                const isExactMatch =
                  item.path === "/" || item.path === "/admin";
                const isActive = isExactMatch
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);

                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={isExactMatch} // Use 'end' prop for exact match on root/admin paths
                      onClick={() => {
                        setIsOpen(false);
                        if (isCollapsed) setIsHovered(false);
                      }}
                      className={({ isActive: linkIsActive }) => {
                        const active = isExactMatch ? linkIsActive : isActive;
                        return `
                          flex items-center space-x-3 px-4 py-3.5 rounded-xl
                          transform transition-all duration-300 ease-out
                          ${
                            active
                              ? "bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-[1.02]"
                              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:scale-[1.02] hover:shadow-md"
                          }
                          group
                        `;
                      }}
                    >
                      <div
                        className={`transform transition-transform duration-300 ${
                          isCollapsed && !isHovered ? "translate-x-1" : ""
                        }`}
                      >
                        {item.icon}
                      </div>
                      <span
                        className={`font-medium whitespace-nowrap transition-all duration-500 ${getContentClasses()} ${
                          isActive
                            ? "font-semibold"
                            : "group-hover:translate-x-1"
                        }`}
                      >
                        {item.label}
                      </span>

                      {/* Active indicator - only show when actually active */}
                      {isActive && (
                        <div className="w-2 h-2 ml-auto bg-white rounded-full animate-pulse" />
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            {/* Quick Stats (only shown when expanded) */}
            <div
              className={`mt-8 p-4 bg-linear-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-500 ${getContentClasses()}`}
            >
              <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Statistik Hari Ini
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {role === "admin" ? "Pemesanan" : "Booking Saya"}
                  </span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    {role === "admin" 
                      ? todayStats.bookings 
                      : bookings.filter(b => b.userId === user?.email).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Penerbangan
                  </span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    {todayStats.flights}
                  </span>
                </div>
              </div>
            </div>
          </nav>

          {/* Footer Section */}
          <div className="p-4 space-y-4 border-t border-gray-200/50 dark:border-gray-700/50">
            {/* User Profile */}
            <div
              className={`
              flex items-center space-x-3 p-3 rounded-xl 
              bg-linear-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900
              hover:shadow-md transition-all duration-300
              ${getContentClasses()}
            `}
            >
              <div className="relative">
                <div className="flex items-center justify-center w-10 h-10 rounded-full shadow-md bg-linear-to-br from-blue-400 to-blue-600">
                  <AiOutlineUser size={20} className="text-white" />
                </div>
                <div className="absolute w-4 h-4 bg-green-400 border-2 border-white rounded-full -bottom-1 -right-1 dark:border-gray-800" />
              </div>

              <div className="overflow-hidden">
                <p className="font-semibold text-gray-800 truncate dark:text-white">
                  {adminData?.name || adminData?.email || "Admin User"}
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  {adminData?.role || role || "Administrator"}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className={`
                w-full flex items-center justify-center space-x-2 px-4 py-3 
                bg-linear-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20
                text-red-600 dark:text-red-400 
                rounded-xl hover:shadow-lg hover:scale-[1.02]
                transform transition-all duration-300
                group
                ${getContentClasses()}
              `}
            >
              <AiOutlineLogout
                size={18}
                className="transition-transform duration-300 group-hover:rotate-12"
              />
              <span className="font-semibold whitespace-nowrap">Keluar</span>
            </button>

            {/* Version Info */}
            <div
              className={`text-center transition-all duration-500 ${getContentClasses()}`}
            >
            </div>
          </div>
        </div>
      </aside>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes spin-in {
          from {
            transform: rotate(-180deg);
            opacity: 0;
          }
          to {
            transform: rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes bounce-in-left {
          0% {
            transform: translateX(-10px);
            opacity: 0;
          }
          60% {
            transform: translateX(2px);
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes bounce-in-right {
          0% {
            transform: translateX(10px);
            opacity: 0;
          }
          60% {
            transform: translateX(-2px);
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes ping-slow {
          75%,
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-spin-in {
          animation: spin-in 0.3s ease-out;
        }

        .animate-bounce-in-left {
          animation: bounce-in-left 0.5s ease-out;
        }

        .animate-bounce-in-right {
          animation: bounce-in-right 0.5s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
