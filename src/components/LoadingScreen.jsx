import React from "react";
import { FaPlane } from "react-icons/fa";

const LoadingScreen = ({ message = "Memuat..." }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-500 via-gray-600 to-slate-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white opacity-10 rounded-full animate-pulse-slow"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white opacity-10 rounded-full animate-pulse-slow delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Plane Icon with Animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-white opacity-20 rounded-full animate-ping"></div>
          <div className="relative flex items-center justify-center w-32 h-32 bg-white bg-opacity-20 rounded-full backdrop-blur-sm">
            <FaPlane size={64} className="text-white animate-fly" />
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="mb-4 text-3xl font-bold text-white animate-fade-in">
          {message}
        </h2>

        {/* Loading Dots */}
        <div className="flex gap-2">
          <div
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-64 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
