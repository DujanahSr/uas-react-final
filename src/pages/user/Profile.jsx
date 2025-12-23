/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AlertModal from "../../components/AlertModal";
import Footer from "../../components/Footer";
import {
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineEdit,
  AiOutlineSave,
  AiOutlineClose,
  AiOutlineHome,
} from "react-icons/ai";
import {
  validateEmail,
  validatePhone,
  validateName,
  validateAddress,
} from "../../utils/validation";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [alert, setAlert] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  // Update formData ketika user berubah
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleSave = () => {
    // Validasi semua field
    const errors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      address: validateAddress(formData.address),
    };

    setFieldErrors(errors);

    // Cek apakah ada error
    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      setAlert({
        isOpen: true,
        type: "warning",
        title: "Form Belum Valid",
        message: "Mohon perbaiki error pada form!",
      });
      return;
    }

    // Update user data menggunakan updateUser dari context
    updateUser(formData);
    setIsEditing(false);
    setFieldErrors({});
    setAlert({
      isOpen: true,
      type: "success",
      title: "Berhasil!",
      message: "Profile berhasil diperbarui!",
    });
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/20 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <main className="max-w-4xl px-4 py-6 mx-auto sm:px-6 lg:px-8">
        <div
          className="p-4 border shadow-lg bg-white/90 backdrop-blur-sm border-gray-200/50 rounded-xl dark:bg-slate-800/90 dark:border-slate-700/50 card-3d animate-slideInUp sm:p-6 lg:p-8"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between sm:mb-8">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
              Informasi Profil
            </h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-white transition-all duration-300 transform rounded-lg shadow-lg bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:scale-95 hover:shadow-xl sm:text-base"
              >
                <AiOutlineEdit size={16} className="sm:w-4.5 sm:h-4.5" />
                Edit Profil
              </button>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 transition-all transform bg-gray-100 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600 hover:bg-gray-200 dark:hover:bg-slate-600 hover:scale-105 active:scale-95 sm:px-4"
                >
                  <AiOutlineClose
                    size={16}
                    className="sm:w-4.5 sm:h-4.5"
                  />
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-white transition-all duration-300 transform rounded-lg shadow-lg bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:scale-105 active:scale-95 hover:shadow-xl sm:px-4"
                >
                  <AiOutlineSave
                    size={16}
                    className="sm:w-4.5 sm:h-4.5"
                  />
                  Simpan
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <AiOutlineUser size={16} />
                Nama Lengkap
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    setFieldErrors({
                      ...fieldErrors,
                      name: validateName(e.target.value),
                    });
                  }}
                  className={`w-full px-4 py-3 border rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-slate-600"
                  }`}
                />
              ) : null}
              {fieldErrors.name && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {fieldErrors.name}
                </p>
              )}
              {!isEditing && (
                <div className="px-4 py-3 text-gray-900 rounded-lg bg-gray-50 dark:bg-slate-700/50 dark:text-white">
                  {user?.name || "-"}
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <AiOutlineMail size={16} />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setFieldErrors({
                      ...fieldErrors,
                      email: validateEmail(e.target.value),
                    });
                  }}
                  className={`w-full px-4 py-3 border rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-slate-600"
                  }`}
                />
              ) : null}
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {fieldErrors.email}
                </p>
              )}
              {!isEditing && (
                <div className="px-4 py-3 text-gray-900 rounded-lg bg-gray-50 dark:bg-slate-700/50 dark:text-white">
                  {user?.email || "-"}
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <AiOutlinePhone size={16} />
                Nomor Telepon
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    setFieldErrors({
                      ...fieldErrors,
                      phone: validatePhone(e.target.value),
                    });
                  }}
                  placeholder="081234567890"
                  className={`w-full px-4 py-3 border rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-slate-600"
                  }`}
                />
              ) : null}
              {fieldErrors.phone && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {fieldErrors.phone}
                </p>
              )}
              {!isEditing && (
                <div className="px-4 py-3 text-gray-900 rounded-lg bg-gray-50 dark:bg-slate-700/50 dark:text-white">
                  {user?.phone || "-"}
                </div>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Alamat
              </label>
              {isEditing ? (
                <textarea
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    setFieldErrors({
                      ...fieldErrors,
                      address: validateAddress(e.target.value),
                    });
                  }}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 ${
                    fieldErrors.address
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 dark:border-slate-600"
                  }`}
                />
              ) : null}
              {fieldErrors.address && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {fieldErrors.address}
                </p>
              )}
              {!isEditing && (
                <div className="px-4 py-3 text-gray-900 rounded-lg bg-gray-50 dark:bg-slate-700/50 dark:text-white">
                  {user?.address || "-"}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Profile;
