import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaPlane, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import {
  AiOutlineMail,
  AiOutlineLock,
  AiOutlineUser,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import {
  validateEmail,
  validatePhone,
  validateName,
  validatePassword,
  validateAddress,
} from "../utils/validation";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const { registerUser, users } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");

    // Validasi real-time per field
    let fieldError = "";
    switch (name) {
      case "name":
        fieldError = validateName(value);
        break;
      case "email":
        fieldError = validateEmail(value);
        break;
      case "password":
        fieldError = validatePassword(value);
        break;
      case "confirmPassword":
        if (value && value !== formData.password) {
          fieldError = "Password dan konfirmasi password tidak cocok";
        }
        break;
      case "phone":
        fieldError = validatePhone(value);
        break;
      case "address":
        fieldError = validateAddress(value);
        break;
      default:
        break;
    }

    setFieldErrors({ ...fieldErrors, [name]: fieldError });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validasi semua field
    const errors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword:
        formData.password !== formData.confirmPassword
          ? "Password dan konfirmasi password tidak cocok"
          : "",
      phone: validatePhone(formData.phone),
      address: validateAddress(formData.address),
    };

    setFieldErrors(errors);

    // Cek apakah ada error
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      setError("Mohon perbaiki error pada form");
      setLoading(false);
      return;
    }

    // Cek apakah email sudah terdaftar
    const existingUser = users.find((u) => u.email === formData.email);
    if (existingUser) {
      setError("Email sudah terdaftar. Silakan login.");
      setFieldErrors({ ...fieldErrors, email: "Email sudah terdaftar" });
      setLoading(false);
      return;
    }

    // Register user baru
    const newUser = {
      role: "user",
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address,
    };

    registerUser(newUser);
    setLoading(false);
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-indigo-200 rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-200 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="w-full max-w-md p-10 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-2xl dark:bg-gray-800/90 dark:border-gray-700 rounded-3xl relative z-10 transform transition-all duration-500 hover:scale-[1.02]">
        <div className="mb-8 text-center">
          <div className="relative flex items-center justify-center w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-ping opacity-20"></div>
            <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg">
              <FaPlane
                size={40}
                className="text-white animate-bounce"
                style={{ animationDuration: "2s" }}
              />
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            Daftar Akun Baru
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400 text-lg">
            Buat akun untuk memesan tiket pesawat
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 text-red-600 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-xl dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <AiOutlineUser
                size={16}
                className="text-blue-600 dark:text-blue-400"
              />
              Nama Lengkap
            </label>
            <div className="relative group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap (min. 3 karakter)"
                className={`w-full px-4 py-3 bg-white border rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 transition-transform duration-200 group-hover:scale-[0.99] group-focus-within:scale-[0.99] ${
                  fieldErrors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                required
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {fieldErrors.name}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <AiOutlineMail
                size={16}
                className="text-blue-600 dark:text-blue-400"
              />
              Email
            </label>
            <div className="relative group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@contoh.com"
                className={`w-full px-4 py-3 bg-white border rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 transition-transform duration-200 group-hover:scale-[0.99] group-focus-within:scale-[0.99] ${
                  fieldErrors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                required
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {fieldErrors.email}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <AiOutlineLock
                size={16}
                className="text-blue-600 dark:text-blue-400"
              />
              Password
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                className={`w-full px-4 py-3 pr-10 bg-white border rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 transition-transform duration-200 group-hover:scale-[0.99] group-focus-within:scale-[0.99] ${
                  fieldErrors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label={
                  showPassword ? "Sembunyikan password" : "Lihat password"
                }
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={18} />
                ) : (
                  <AiOutlineEye size={18} />
                )}
              </button>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {fieldErrors.password}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <AiOutlineLock
                size={16}
                className="text-blue-600 dark:text-blue-400"
              />
              Konfirmasi Password
            </label>
            <div className="relative group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Ulangi password"
                className={`w-full px-4 py-3 pr-10 bg-white border rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 transition-transform duration-200 group-hover:scale-[0.99] group-focus-within:scale-[0.99] ${
                  fieldErrors.confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label={
                  showConfirmPassword
                    ? "Sembunyikan konfirmasi password"
                    : "Lihat konfirmasi password"
                }
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible size={18} />
                ) : (
                  <AiOutlineEye size={18} />
                )}
              </button>
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FaPhone size={14} className="text-blue-600 dark:text-blue-400" />
              Nomor Telepon
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="081234567890"
                className={`w-full px-4 py-3 bg-white border rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 transition-transform duration-200 hover:scale-[0.99] focus:scale-[0.99] ${
                  fieldErrors.phone
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                required
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {fieldErrors.phone}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <FaMapMarkerAlt
                size={14}
                className="text-blue-600 dark:text-blue-400"
              />
              Alamat
            </label>
            <div className="relative">
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap (min. 10 karakter)"
                rows={3}
                className={`w-full px-4 py-3 bg-white border rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 resize-none transition-transform duration-200 hover:scale-[0.99] focus:scale-[0.99] ${
                  fieldErrors.address
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                required
              />
              {fieldErrors.address && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {fieldErrors.address}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 font-bold text-white transition-all shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:opacity-70 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Memproses...
              </>
            ) : (
              <>
                <FaPlane size={18} />
                Daftar Sekarang
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
