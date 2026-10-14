import React from "react";
import {
  AiOutlineClockCircle,
  AiOutlineCalendar,
  AiOutlineUser,
} from "react-icons/ai";
import { FaPlane } from "react-icons/fa";
import { formatPrice, getStatusBadge } from "../data/mockData";

const FlightCard = ({ flight, onSelect }) => {
  return (
    <div className="p-4 transition-all duration-500 bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg dark:bg-slate-800/90 rounded-xl dark:border-slate-700/50 hover:shadow-2xl card-3d sm:p-6">
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg transform hover:scale-110 transition-transform sm:w-12 sm:h-12">
            <span className="text-xs font-bold text-white sm:text-sm">
              {flight.flightNumber.split("-")[0]}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 sm:text-base dark:text-white">
              {flight.airline}
            </h3>
            <p className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
              {flight.flightNumber}
            </p>
          </div>
        </div>

        <span
          className={`self-start px-3 py-1 rounded-full text-xs font-medium transition-all transform hover:scale-105 ${getStatusBadge(
            flight.status
          )}`}
        >
          {flight.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-3">
        {/* Departure */}
        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-lg transition-all hover:scale-105">
          <div className="text-xl font-bold text-gray-800 sm:text-2xl dark:text-white">
            {flight.departureTime}
          </div>
          <div className="text-xs text-gray-600 sm:text-sm dark:text-gray-300">
            {flight.from}
          </div>
          <div className="flex items-center justify-center mt-1 text-xs text-gray-500 dark:text-gray-400">
            <AiOutlineCalendar size={12} className="mr-1" />
            {flight.departureDate}
          </div>
        </div>

        {/* Flight Info */}
        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-lg transition-all hover:scale-105">
          <div className="mb-2 text-xs text-gray-600 sm:text-sm dark:text-gray-300">
            {flight.duration}
          </div>
          <div className="relative">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 dark:from-blue-500 dark:to-indigo-500"></div>
            <div className="relative z-10 flex items-center justify-center w-8 h-8 mx-auto bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full shadow-lg transform hover:rotate-12 transition-transform">
              <FaPlane size={14} className="text-white" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Semua Kelas Tersedia
          </div>
        </div>

        {/* Arrival */}
        <div className="text-center p-3 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-slate-700/50 dark:to-slate-600/50 rounded-lg transition-all hover:scale-105">
          <div className="text-xl font-bold text-gray-800 sm:text-2xl dark:text-white">
            {flight.arrivalTime}
          </div>
          <div className="text-xs text-gray-600 sm:text-sm dark:text-gray-300">
            {flight.to}
          </div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            <AiOutlineClockCircle size={12} className="inline mr-1" />
            Estimasi
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-4 text-xs text-gray-600 sm:text-sm dark:text-gray-300">
          <div className="flex items-center">
            <AiOutlineUser size={14} className="mr-1 sm:w-4 sm:h-4" />
            {flight.availableSeats} kursi tersedia
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-4">
          <div className="text-left sm:text-right">
            <div className="text-xl font-bold text-blue-600 sm:text-2xl dark:text-blue-400">
              {formatPrice(flight.prices?.economy || flight.price)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Mulai dari (Ekonomi)
            </div>
          </div>

          <button
            onClick={() => onSelect && onSelect(flight)}
            className="w-full px-6 py-2.5 font-medium text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl sm:w-auto"
          >
            Pilih
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;
