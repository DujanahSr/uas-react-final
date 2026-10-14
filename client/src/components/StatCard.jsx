import React from "react";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

const StatCard = ({ title, value, change, icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
  };

  return (
    <div className="p-4 transition-all duration-300 bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-lg dark:bg-slate-800/90 dark:border-slate-700/50 rounded-xl card-3d hover:shadow-xl sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <p className="mb-1 text-xs text-gray-500 sm:text-sm dark:text-gray-400">
            {title}
          </p>
          <h3 className="text-xl font-bold text-gray-800 sm:text-2xl dark:text-white">
            {value}
          </h3>
          <div className="flex flex-wrap items-center mt-2 gap-1">
            {change >= 0 ? (
              <AiOutlineArrowUp className="text-green-500" size={14} />
            ) : (
              <AiOutlineArrowDown className="text-red-500" size={14} />
            )}
            <span
              className={`text-xs font-medium sm:text-sm ${
                change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {change >= 0 ? "+" : ""}
              {change}%
            </span>
            <span className="text-xs text-gray-500 sm:text-sm dark:text-gray-400">
              dari bulan lalu
            </span>
          </div>
        </div>
        <div
          className={`${colorClasses[color]} p-3 rounded-lg shadow-lg transform hover:scale-110 transition-transform`}
        >
          {React.cloneElement(icon, { size: 24, className: "text-white" })}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
