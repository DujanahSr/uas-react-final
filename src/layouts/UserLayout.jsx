import React, { useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import {
  AiOutlineSearch,
  AiOutlineCalendar,
  AiOutlineUser,
  AiOutlineQuestionCircle,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { FaPlane } from "react-icons/fa";

const UserLayout = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  // Determine header content based on current route
  const headerConfig = useMemo(() => {
    const path = location.pathname;

    // Home page
    if (path === "/") {
      return {
        title: "FlyBook",
        subtitle: `Halo, ${user?.name || user?.email || "Pengguna"}`,
        icon: <FaPlane size={18} />,
      };
    }

    // Search results page
    if (path === "/search") {
      return {
        title: "Hasil Pencarian",
        subtitle: "Temukan penerbangan yang sesuai dengan kebutuhan Anda",
        icon: <AiOutlineSearch size={18} />,
      };
    }

    // My bookings page
    if (path === "/my-bookings") {
      return {
        title: "Riwayat Pemesanan",
        subtitle: "Kelola dan lihat detail semua pemesanan Anda",
        icon: <AiOutlineCalendar size={18} />,
      };
    }

    // Profile page
    if (path === "/profile") {
      return {
        title: "Profil Saya",
        subtitle: "Kelola informasi profil Anda",
        icon: <AiOutlineUser size={18} />,
      };
    }

    // Help/FAQ page
    if (path === "/help") {
      return {
        title: "Pusat Bantuan",
        subtitle: "Temukan jawaban untuk pertanyaan Anda",
        icon: <AiOutlineQuestionCircle size={18} />,
      };
    }

    // Flight detail page (dynamic route)
    if (path.startsWith("/flight/")) {
      return {
        title: "Detail Penerbangan",
        subtitle: "Pilih kelas dan lengkapi data penumpang",
        icon: <FaPlane size={18} />,
      };
    }

    // Booking success page
    if (path === "/booking-success") {
      return {
        title: "Pemesanan Berhasil",
        subtitle: "Terima kasih telah memesan tiket dengan kami",
        icon: <AiOutlineCheckCircle size={18} />,
      };
    }

    // Default fallback
    return {
      title: "FlyBook",
      subtitle: `Halo, ${user?.name || user?.email || "Pengguna"}`,
      icon: <FaPlane size={18} />,
    };
  }, [location.pathname, user]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar User */}
      <Sidebar role="user" onLogout={logout} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header - Dynamic based on route */}
        <Header
          title={headerConfig.title}
          subtitle={headerConfig.subtitle}
          icon={headerConfig.icon}
          showHomeButton={location.pathname !== "/"}
        />

        {/* Page Content - Add key to force re-render on route change */}
        <main
          key={location.pathname}
          className="flex-1 p-4 overflow-y-auto md:p-6 lg:p-8"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
