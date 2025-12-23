import React from "react";
import {
  AiOutlineClose,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineExclamationCircle,
  AiOutlineInfoCircle,
} from "react-icons/ai";

const AlertModal = ({
  isOpen,
  onClose,
  type = "info",
  title,
  message,
  icon,
}) => {
  if (!isOpen) return null;

  const typeConfig = {
    success: {
      bg: "from-green-500 to-emerald-600",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      icon: AiOutlineCheckCircle,
      button: "bg-green-600 hover:bg-green-700",
    },
    error: {
      bg: "from-red-500 to-rose-600",
      iconBg: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
      icon: AiOutlineCloseCircle,
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      bg: "from-yellow-500 to-orange-600",
      iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      icon: AiOutlineExclamationCircle,
      button: "bg-yellow-600 hover:bg-yellow-700",
    },
    info: {
      bg: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      icon: AiOutlineInfoCircle,
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const config = typeConfig[type] || typeConfig.info;
  const IconComponent = icon || config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all animate-slideUp">
        {/* Header dengan gradient */}
        <div
          className={`bg-gradient-to-r ${config.bg} text-white p-6 rounded-t-2xl`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 ${config.iconBg} rounded-xl backdrop-blur-sm`}
              >
                <IconComponent size={28} className={config.iconColor} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {title || "Pemberitahuan"}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <AiOutlineClose size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
          <button
            onClick={onClose}
            className={`w-full px-6 py-3 text-white rounded-lg font-semibold transition-colors ${config.button}`}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
