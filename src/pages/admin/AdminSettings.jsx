import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import AlertModal from "../../components/AlertModal";
import ConfirmModal from "../../components/ConfirmModal";
import Footer from "../../components/Footer";
import {
  AiOutlineSetting,
  AiOutlineLock,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineSave,
  AiOutlineDollarCircle,
  AiOutlineCalendar,
  AiOutlineDownload,
  AiOutlineUpload,
  AiOutlineReload,
  AiOutlineFileText,
  AiOutlineDatabase,
} from "react-icons/ai";
import { AiFillInfoCircle } from "react-icons/ai";
import { FaPlane, FaUsers, FaFileAlt } from "react-icons/fa";

const AdminSettings = () => {
  const { admin } = useAuth();
  const { flights, bookings } = useData();
  const [activeTab, setActiveTab] = useState("password");
  const downloadLinkRef = useRef(null);

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Display Settings
  const [displaySettings, setDisplaySettings] = useState({
    itemsPerPage: 5,
    autoRefresh: false,
    refreshInterval: 30,
  });

  // Format Settings
  const [formatSettings, setFormatSettings] = useState({
    currency: "IDR",
    dateFormat: "DD/MM/YYYY",
  });

  // Alert & Confirm Modals
  const [alert, setAlert] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });
  const [confirm, setConfirm] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedDisplaySettings = localStorage.getItem("adminDisplaySettings");
    const savedFormatSettings = localStorage.getItem("adminFormatSettings");

    if (savedDisplaySettings) {
      try {
        setDisplaySettings(JSON.parse(savedDisplaySettings));
      } catch (e) {
        console.error("Error loading display settings:", e);
      }
    }

    if (savedFormatSettings) {
      try {
        setFormatSettings(JSON.parse(savedFormatSettings));
      } catch (e) {
        console.error("Error loading format settings:", e);
      }
    }
  }, []);

  // Handle Password Change
  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = () => {
    // Validation
    if (!passwordData.currentPassword) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Masukkan password saat ini",
      });
      return;
    }

    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Password baru minimal 6 karakter",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Password baru dan konfirmasi tidak cocok",
      });
      return;
    }

    // Check current password (simplified - in real app, verify with backend)
    const storedAdmin = sessionStorage.getItem("adminSession");
    if (storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        // In real app, verify current password with backend
        // For now, we'll just save the new password
        const updatedAdmin = {
          ...adminData,
          password: passwordData.newPassword,
        };
        sessionStorage.setItem("adminSession", JSON.stringify(updatedAdmin));

        setAlert({
          isOpen: true,
          type: "success",
          title: "Berhasil!",
          message: "Password berhasil diubah",
        });

        // Reset form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (e) {
        setAlert({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "Gagal mengubah password",
        });
      }
    }
  };

  // Handle Display Settings
  const handleDisplaySettingsChange = (field, value) => {
    setDisplaySettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDisplaySettings = () => {
    localStorage.setItem(
      "adminDisplaySettings",
      JSON.stringify(displaySettings)
    );
    setAlert({
      isOpen: true,
      type: "success",
      title: "Berhasil!",
      message: "Pengaturan tampilan berhasil disimpan",
    });
  };

  // Handle Format Settings
  const handleFormatSettingsChange = (field, value) => {
    setFormatSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveFormatSettings = () => {
    localStorage.setItem("adminFormatSettings", JSON.stringify(formatSettings));
    setAlert({
      isOpen: true,
      type: "success",
      title: "Berhasil!",
      message: "Pengaturan format berhasil disimpan",
    });
  };

  // Backup & Restore
  const handleExportData = () => {
    const dataToExport = {
      flights: flights,
      bookings: bookings,
      exportDate: new Date().toISOString(),
      version: "1.0.0",
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    
    // Gunakan ref untuk trigger download tanpa DOM methods
    if (downloadLinkRef.current) {
      downloadLinkRef.current.href = url;
      downloadLinkRef.current.download = `flybook_backup_${
        new Date().toISOString().split("T")[0]
      }.json`;
      downloadLinkRef.current.click();
      // Cleanup URL setelah delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    }

    setAlert({
      isOpen: true,
      type: "success",
      title: "Berhasil!",
      message: "Data berhasil diekspor",
    });
  };

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".json")) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "File harus berformat JSON",
      });
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        // Validate data structure
        if (!importedData || typeof importedData !== "object") {
          throw new Error("Format data tidak valid");
        }

        setConfirm({
          isOpen: true,
          title: "Konfirmasi Import",
          message:
            "Import data akan mengganti data yang ada. Apakah Anda yakin?",
          onConfirm: () => {
            try {
              if (importedData.flights && Array.isArray(importedData.flights)) {
                localStorage.setItem(
                  "flights",
                  JSON.stringify(importedData.flights)
                );
              }
              if (
                importedData.bookings &&
                Array.isArray(importedData.bookings)
              ) {
                localStorage.setItem(
                  "bookings",
                  JSON.stringify(importedData.bookings)
                );
              }

              // Update last backup date
              localStorage.setItem(
                "lastBackupDate",
                new Date().toLocaleDateString("id-ID")
              );

              setAlert({
                isOpen: true,
                type: "success",
                title: "Berhasil!",
                message:
                  "Data berhasil diimpor. Silakan refresh halaman untuk melihat perubahan.",
              });

              // Reset file input
              event.target.value = "";
            } catch (saveError) {
              setAlert({
                isOpen: true,
                type: "error",
                title: "Error",
                message: "Gagal menyimpan data: " + saveError.message,
              });
            }
          },
        });
      } catch (error) {
        setAlert({
          isOpen: true,
          type: "error",
          title: "Error",
          message: "File tidak valid atau rusak: " + error.message,
        });
        event.target.value = "";
      }
    };

    reader.onerror = () => {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Gagal membaca file",
      });
      event.target.value = "";
    };

    reader.readAsText(file);
  };

  const handleResetData = () => {
    setConfirm({
      isOpen: true,
      title: "Konfirmasi Reset",
      message:
        "Reset data akan menghapus semua data dan mengembalikan ke default. Apakah Anda yakin?",
      onConfirm: () => {
        localStorage.removeItem("flights");
        localStorage.removeItem("bookings");
        setAlert({
          isOpen: true,
          type: "success",
          title: "Berhasil!",
          message: "Data berhasil direset. Silakan refresh halaman.",
        });
      },
    });
  };

  const tabs = [
    { id: "password", label: "Ganti Password", icon: AiOutlineLock },
    { id: "display", label: "Tampilan", icon: AiOutlineSetting },
    { id: "format", label: "Format Data", icon: AiOutlineFileText },
    { id: "backup", label: "Backup & Restore", icon: AiOutlineDatabase },
    { id: "info", label: "Informasi Sistem", icon: AiFillInfoCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/20 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
      <Header
        title="Pengaturan"
        subtitle="Kelola preferensi dan pengaturan sistem"
        onSearch={null}
      />

      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-slate-800/90 dark:border-slate-700/50">
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                Menu Pengaturan
              </h3>
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Ganti Password */}
            {activeTab === "password" && (
              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-slate-800/90 dark:border-slate-700/50">
                <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <AiOutlineLock size={20} />
                  Ganti Password Admin
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password Saat Ini
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          handlePasswordChange(
                            "currentPassword",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan password saat ini"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            current: !prev.current,
                          }))
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                      >
                        {showPasswords.current ? (
                          <AiOutlineEyeInvisible size={20} />
                        ) : (
                          <AiOutlineEye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          handlePasswordChange("newPassword", e.target.value)
                        }
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Masukkan password baru (min. 6 karakter)"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            new: !prev.new,
                          }))
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                      >
                        {showPasswords.new ? (
                          <AiOutlineEyeInvisible size={20} />
                        ) : (
                          <AiOutlineEye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Konfirmasi Password Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          handlePasswordChange(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                        placeholder="Konfirmasi password baru"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                      >
                        {showPasswords.confirm ? (
                          <AiOutlineEyeInvisible size={20} />
                        ) : (
                          <AiOutlineEye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <AiOutlineSave size={18} />
                    Ubah Password
                  </button>
                </div>
              </div>
            )}

            {/* Pengaturan Tampilan */}
            {activeTab === "display" && (
              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-slate-800/90 dark:border-slate-700/50">
                <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <AiOutlineSetting size={20} />
                  Pengaturan Tampilan
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Items per Page
                    </label>
                    <select
                      value={displaySettings.itemsPerPage}
                      onChange={(e) =>
                        handleDisplaySettingsChange(
                          "itemsPerPage",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={5}>5 items</option>
                      <option value={10}>10 items</option>
                      <option value={20}>20 items</option>
                      <option value={50}>50 items</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Jumlah item yang ditampilkan per halaman
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Auto Refresh Dashboard
                      </label>
                      <button
                        onClick={() =>
                          handleDisplaySettingsChange(
                            "autoRefresh",
                            !displaySettings.autoRefresh
                          )
                        }
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          displaySettings.autoRefresh
                            ? "bg-blue-600"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            displaySettings.autoRefresh
                              ? "translate-x-6"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Refresh otomatis data dashboard secara berkala
                    </p>
                  </div>

                  {displaySettings.autoRefresh && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Interval Refresh (detik)
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="300"
                        value={displaySettings.refreshInterval}
                        onChange={(e) =>
                          handleDisplaySettingsChange(
                            "refreshInterval",
                            parseInt(e.target.value) || 30
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Interval refresh dalam detik (10-300 detik)
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleSaveDisplaySettings}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <AiOutlineSave size={18} />
                    Simpan Pengaturan Tampilan
                  </button>
                </div>
              </div>
            )}

            {/* Format Data */}
            {activeTab === "format" && (
              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-slate-800/90 dark:border-slate-700/50">
                <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <AiOutlineFileText size={20} />
                  Pengaturan Format Data
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <AiOutlineDollarCircle size={16} />
                      Mata Uang
                    </label>
                    <select
                      value={formatSettings.currency}
                      onChange={(e) =>
                        handleFormatSettingsChange("currency", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="IDR">IDR - Rupiah Indonesia</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="SGD">SGD - Singapore Dollar</option>
                      <option value="MYR">MYR - Malaysian Ringgit</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Format mata uang untuk menampilkan harga
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <AiOutlineCalendar size={16} />
                      Format Tanggal
                    </label>
                    <select
                      value={formatSettings.dateFormat}
                      onChange={(e) =>
                        handleFormatSettingsChange("dateFormat", e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      <option value="DD MMMM YYYY">DD MMMM YYYY</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Format tanggal untuk menampilkan data
                    </p>
                  </div>

                  <button
                    onClick={handleSaveFormatSettings}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <AiOutlineSave size={18} />
                    Simpan Pengaturan Format
                  </button>
                </div>
              </div>
            )}

            {/* Backup & Restore */}
            {activeTab === "backup" && (
              <div className="space-y-6">
                <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-slate-800/90 dark:border-slate-700/50">
                  <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <AiOutlineDatabase size={20} />
                    Backup & Restore Data
                  </h3>

                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg dark:border-slate-700/50">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <AiOutlineDownload size={18} />
                        Export Data
                      </h4>
                      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        Ekspor semua data (penerbangan dan pemesanan) ke file
                        JSON
                      </p>
                      <button
                        onClick={handleExportData}
                        className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <AiOutlineDownload size={18} />
                        Export Data
                      </button>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg dark:border-slate-700/50">
                      <h4 className="mb-2 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <AiOutlineUpload size={18} />
                        Import Data
                      </h4>
                      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        Impor data dari file JSON (akan mengganti data yang ada)
                      </p>
                      <label className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                        <AiOutlineUpload size={18} />
                        Pilih File JSON
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportData}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="p-4 border border-red-200 rounded-lg dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                      <h4 className="mb-2 font-semibold text-red-900 dark:text-red-300 flex items-center gap-2">
                        <AiOutlineReload size={18} />
                        Reset Data
                      </h4>
                      <p className="mb-4 text-sm text-red-700 dark:text-red-400">
                        Reset semua data ke default (tidak dapat dibatalkan)
                      </p>
                      <button
                        onClick={handleResetData}
                        className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <AiOutlineReload size={18} />
                        Reset Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Informasi Sistem */}
            {activeTab === "info" && (
              <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-slate-800/90 dark:border-slate-700/50">
                <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <AiFillInfoCircle size={20} />
                  Informasi Sistem
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <FaPlane
                        size={24}
                        className="text-blue-600 dark:text-blue-400"
                      />
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Total Penerbangan
                      </h4>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {flights.length}
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <FaFileAlt
                        size={24}
                        className="text-green-600 dark:text-green-400"
                      />
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Total Pemesanan
                      </h4>
                    </div>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {bookings.length}
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <FaUsers
                        size={24}
                        className="text-purple-600 dark:text-purple-400"
                      />
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Email Admin
                      </h4>
                    </div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {admin?.email || "admin@flybook.com"}
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <AiFillInfoCircle
                        size={24}
                        className="text-orange-600 dark:text-orange-400"
                      />
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        Versi Aplikasi
                      </h4>
                    </div>
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                      v1.0.0
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                  <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
                    Detail Sistem
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex justify-between">
                      <span>Platform:</span>
                      <span className="font-medium">React + Vite</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage:</span>
                      <span className="font-medium">LocalStorage</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Backup:</span>
                      <span className="font-medium">
                        {localStorage.getItem("lastBackupDate") ||
                          "Belum pernah"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirm.isOpen}
        onClose={() => setConfirm({ ...confirm, isOpen: false })}
        onConfirm={() => {
          if (confirm.onConfirm) confirm.onConfirm();
          setConfirm({ ...confirm, isOpen: false });
        }}
        title={confirm.title}
        message={confirm.message}
        type="danger"
      />

      {/* Hidden download link untuk export data */}
      <a
        ref={downloadLinkRef}
        style={{ display: "none" }}
        aria-hidden="true"
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminSettings;
