import React from "react";
import {
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineGlobal,
  AiOutlineFacebook,
  AiOutlineInstagram,
  AiOutlineTwitter,
} from "react-icons/ai";
import { FaPlane } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-8 bg-white border-t border-gray-200 dark:bg-slate-800 dark:border-slate-700 animate-slideInUp">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FaPlane className="text-blue-600 dark:text-blue-400" size={24} />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                FlyBook
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Platform booking tiket pesawat terpercaya untuk perjalanan Anda.
              Kami menyediakan pengalaman pemesanan yang mudah dan aman.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 transition-colors duration-200 transform hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110"
                aria-label="Facebook"
              >
                <AiOutlineFacebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors duration-200 transform hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110"
                aria-label="Instagram"
              >
                <AiOutlineInstagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 transition-colors duration-200 transform hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110"
                aria-label="Twitter"
              >
                <AiOutlineTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Layanan
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Pencarian Penerbangan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Riwayat Booking
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Kelola Profil
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Bantuan & FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Dukungan
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <AiOutlineMail size={16} />
                <span>support@flybook.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <AiOutlinePhone size={16} />
                <span>+62 21 1234 5678</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <AiOutlineGlobal size={16} />
                <span>24/7 Customer Service</span>
              </li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Informasi
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Kebijakan Pengembalian
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors duration-200 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Tentang Kami
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="pt-6 mt-8 border-t border-gray-200 dark:border-slate-700">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 md:text-left">
              © {new Date().getFullYear()} FlyBook. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <span>Committed to excellence in air travel solutions</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;