import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AiOutlineBell,
  AiOutlineSearch,
  AiOutlineSun,
  AiOutlineMoon,
  AiOutlineHome,
  AiOutlineDashboard,
} from "react-icons/ai";
import { useTheme } from "../context/ThemeContext";

const Header = ({
  title,
  subtitle,
  onSearch,
  searchPlaceholder = "Cari...",
  showHomeButton = false,
  icon,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");

  // Determine if we should show home/dashboard button
  const shouldShowButton =
    showHomeButton ||
    (location.pathname !== "/" && location.pathname !== "/admin");
  const isAdminPage = location.pathname.startsWith("/admin");
  const homePath = isAdminPage ? "/admin" : "/";

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  return (
    <header className="w-full px-4 py-4 transition-colors bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700 md:px-6">
      <div className="flex flex-col justify-between w-full max-w-full lg:flex-row lg:items-center">
        <div className="flex items-center flex-1 min-w-0 gap-3">
          {icon && (
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300 shrink-0">
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-gray-800 truncate md:text-2xl dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600 truncate md:text-base dark:text-gray-300">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center shrink-0 mt-4 space-x-2 md:space-x-4 lg:mt-0">
          {/* Home/Dashboard Button */}
          {shouldShowButton && (
            <button
              onClick={() => navigate(homePath)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
              title={isAdminPage ? "Ke Dashboard" : "Ke Home"}
            >
              {isAdminPage ? (
                <>
                  <AiOutlineDashboard size={18} />
                  <span className="hidden sm:inline">Dashboard</span>
                </>
              ) : (
                <>
                  <AiOutlineHome size={18} />
                  <span className="hidden sm:inline">Home</span>
                </>
              )}
            </button>
          )}

          {/* Search Bar */}
          {onSearch && (
            <form
              onSubmit={handleSearchSubmit}
              className="relative hidden sm:block"
            >
              <AiOutlineSearch
                className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2 dark:text-gray-500"
                size={20}
              />
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="w-32 py-2 pl-10 pr-4 text-gray-800 transition-colors bg-white border border-gray-300 rounded-lg dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white md:w-48 lg:w-64"
              />
            </form>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative shrink-0 p-2 text-gray-600 transition-colors duration-200 rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label="Toggle dark mode"
          >
            <div className="relative w-5 h-5">
              {isDark ? (
                <AiOutlineSun
                  size={20}
                  className="absolute inset-0 text-yellow-400"
                />
              ) : (
                <AiOutlineMoon
                  size={20}
                  className="absolute inset-0 text-gray-600"
                />
              )}
            </div>
          </button>

          {/* Notification */}
          <button className="relative shrink-0 p-2 text-gray-600 transition-colors rounded-lg dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            <AiOutlineBell size={20} />
            <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1"></span>
          </button>

          {/* Date */}
          <div className="hidden text-sm text-gray-600 lg:block dark:text-gray-300 whitespace-nowrap">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
