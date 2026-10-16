import React, { useState, useEffect } from "react";
import {
  AiOutlineClose,
  AiOutlineCheckCircle,
  AiOutlineCopy,
  AiOutlineClockCircle,
  AiOutlineCreditCard,
  AiOutlineQrcode,
  AiOutlineMobile,
  AiOutlineBank,
  AiOutlineSafety,
  AiOutlineInfoCircle,
} from "react-icons/ai";
import { formatPrice } from "../data/mockData";

export default function PaymentGatewayModal({
  isOpen,
  onClose,
  bookingData,
  totalAmount,
  onPaymentSuccess,
}) {
  const [activeTab, setActiveTab] = useState("va"); // 'va', 'qris', 'card', 'ewallet'
  const [selectedBank, setSelectedBank] = useState("BCA");
  const [selectedWallet, setSelectedWallet] = useState("GOPAY");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");

  // Credit Card Form State
  const [cardData, setCardData] = useState({
    number: "",
    name: bookingData?.passengerName || "",
    expiry: "",
    cvv: "",
  });

  // Countdown timer 15 mins
  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(900);
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  // Deterministic VA Number based on order/timestamp
  const vaNumbers = {
    BCA: `88012${Math.abs(
      (bookingData?.bookingCode || "FBK1234")
        .split("")
        .reduce((a, b) => a + b.charCodeAt(0), 100000000)
    )
      .toString()
      .substring(0, 11)}`,
    MANDIRI: `89508${Math.abs(
      (bookingData?.bookingCode || "FBK1234")
        .split("")
        .reduce((a, b) => a + b.charCodeAt(0), 200000000)
    )
      .toString()
      .substring(0, 11)}`,
    BNI: `98801${Math.abs(
      (bookingData?.bookingCode || "FBK1234")
        .split("")
        .reduce((a, b) => a + b.charCodeAt(0), 300000000)
    )
      .toString()
      .substring(0, 11)}`,
    BRI: `10234${Math.abs(
      (bookingData?.bookingCode || "FBK1234")
        .split("")
        .reduce((a, b) => a + b.charCodeAt(0), 400000000)
    )
      .toString()
      .substring(0, 11)}`,
  };

  const handleCopyVa = () => {
    const currentVa = vaNumbers[selectedBank];
    navigator.clipboard.writeText(currentVa);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = (methodName) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (onPaymentSuccess) {
        onPaymentSuccess({
          paymentMethod: methodName || activeTab.toUpperCase(),
          transactionId: `TRX-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
          paymentStatus: "Paid",
          paidAt: new Date().toISOString(),
        });
      }
    }, 1500);
  };

  const handleCardPaymentSubmit = (e) => {
    e.preventDefault();
    if (cardData.number.replace(/\s/g, "").length < 16) {
      alert("Masukkan 16 digit nomor kartu yang valid");
      return;
    }
    // Open 3D Secure simulation modal
    setShowOtpModal(true);
  };

  const handleVerifyOtp = () => {
    if (otpCode.length < 4) {
      setOtpError("Masukkan kode OTP 4-6 digit");
      return;
    }
    setShowOtpModal(false);
    handleSimulatePayment("CREDIT_CARD_3DS");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-gray-100 shadow-2xl rounded-2xl dark:bg-slate-900 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
              <AiOutlineSafety size={24} className="text-blue-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">FlyBook Secure Payment</h3>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-400 text-slate-950 rounded-full uppercase tracking-wider">
                  256-Bit SSL
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Kode Booking: <span className="font-mono font-bold text-white">{bookingData?.bookingCode}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 transition-colors rounded-lg hover:bg-white/10 hover:text-white"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        {/* Timer & Total Price Bar */}
        <div className="flex items-center justify-between px-6 py-3 bg-blue-50/70 border-b border-blue-100 dark:bg-slate-800/60 dark:border-slate-700/60">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <AiOutlineClockCircle className="text-amber-500 animate-pulse" size={18} />
            <span>Selesaikan dalam:</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{formattedTime}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 dark:text-gray-400 block">Total Tagihan</span>
            <span className="text-base font-bold text-blue-600 dark:text-blue-400">
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>

        {/* Payment Channels Tabs */}
        <div className="flex border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40">
          <button
            onClick={() => setActiveTab("va")}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === "va"
                ? "border-blue-600 text-blue-600 bg-white dark:bg-slate-900 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <AiOutlineBank size={18} />
            <span>Virtual Account</span>
          </button>
          <button
            onClick={() => setActiveTab("qris")}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === "qris"
                ? "border-blue-600 text-blue-600 bg-white dark:bg-slate-900 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <AiOutlineQrcode size={18} />
            <span>QRIS</span>
          </button>
          <button
            onClick={() => setActiveTab("card")}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === "card"
                ? "border-blue-600 text-blue-600 bg-white dark:bg-slate-900 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <AiOutlineCreditCard size={18} />
            <span>Kartu Kredit/Debit</span>
          </button>
          <button
            onClick={() => setActiveTab("ewallet")}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              activeTab === "ewallet"
                ? "border-blue-600 text-blue-600 bg-white dark:bg-slate-900 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <AiOutlineMobile size={18} />
            <span>E-Wallet</span>
          </button>
        </div>

        {/* Modal Body / Tab Contents */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* TAB 1: VIRTUAL ACCOUNT */}
          {activeTab === "va" && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
                  Pilih Bank Transfer
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {["BCA", "MANDIRI", "BNI", "BRI"].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`py-2.5 px-3 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all ${
                        selectedBank === bank
                          ? "border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300 ring-2 ring-blue-500/20"
                          : "border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600"
                      }`}
                    >
                      {bank} VA
                    </button>
                  ))}
                </div>
              </div>

              {/* VA Box Display */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl dark:bg-slate-800/80 dark:border-slate-700">
                <span className="text-xs text-gray-500 dark:text-gray-400 block">
                  Nomor Virtual Account ({selectedBank})
                </span>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xl sm:text-2xl font-mono font-bold tracking-wider text-gray-900 dark:text-white">
                    {vaNumbers[selectedBank]}
                  </span>
                  <button
                    onClick={handleCopyVa}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300 transition-all active:scale-95"
                  >
                    <AiOutlineCopy size={14} />
                    {copied ? "Tersalin!" : "Salin"}
                  </button>
                </div>
              </div>

              {/* Instructions Accordion */}
              <div className="p-3.5 bg-blue-50/40 border border-blue-100 rounded-xl dark:bg-slate-800/40 dark:border-slate-700/60 text-xs space-y-1.5 text-gray-600 dark:text-gray-400">
                <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  <AiOutlineInfoCircle className="text-blue-600" size={15} />
                  Cara Pembayaran via m-Banking:
                </div>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>Buka aplikasi m-Banking Anda ({selectedBank})</li>
                  <li>Pilih menu <strong>Transfer &gt; Virtual Account</strong></li>
                  <li>Masukkan nomor VA di atas dan pastikan nominal tepat <strong>{formatPrice(totalAmount)}</strong></li>
                  <li>Konfirmasi PIN transaksi Anda. Pembayaran akan terverifikasi otomatis.</li>
                </ol>
              </div>

              {/* Simulator Action Button */}
              <button
                onClick={() => handleSimulatePayment(`${selectedBank}_VA`)}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 font-bold text-sm text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-98 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memverifikasi Pembayaran...</span>
                  </>
                ) : (
                  <>
                    <AiOutlineCheckCircle size={18} />
                    <span>Simulasikan Pembayaran Berhasil</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 2: QRIS */}
          {activeTab === "qris" && (
            <div className="text-center space-y-4 animate-fadeIn">
              <div className="inline-block p-4 bg-white border border-gray-200 rounded-2xl shadow-md dark:bg-white">
                {/* Dynamic SVG QR Code */}
                <svg className="w-52 h-52 mx-auto" viewBox="0 0 200 200">
                  <rect width="200" height="200" fill="#ffffff" />
                  {/* Corner Targets */}
                  <rect x="15" y="15" width="40" height="40" fill="#000000" />
                  <rect x="23" y="23" width="24" height="24" fill="#ffffff" />
                  <rect x="29" y="29" width="12" height="12" fill="#000000" />

                  <rect x="145" y="15" width="40" height="40" fill="#000000" />
                  <rect x="153" y="23" width="24" height="24" fill="#ffffff" />
                  <rect x="159" y="29" width="12" height="12" fill="#000000" />

                  <rect x="15" y="145" width="40" height="40" fill="#000000" />
                  <rect x="23" y="153" width="24" height="24" fill="#ffffff" />
                  <rect x="29" y="159" width="12" height="12" fill="#000000" />

                  {/* QR Pattern Blocks */}
                  <rect x="70" y="20" width="10" height="30" fill="#000000" />
                  <rect x="90" y="15" width="20" height="10" fill="#000000" />
                  <rect x="120" y="25" width="15" height="15" fill="#000000" />
                  <rect x="70" y="60" width="60" height="10" fill="#000000" />
                  <rect x="20" y="70" width="30" height="10" fill="#000000" />
                  <rect x="150" y="70" width="30" height="10" fill="#000000" />
                  <rect x="65" y="80" width="15" height="35" fill="#000000" />
                  <rect x="120" y="80" width="20" height="20" fill="#000000" />
                  <rect x="90" y="110" width="20" height="20" fill="#000000" />
                  <rect x="70" y="140" width="25" height="10" fill="#000000" />
                  <rect x="130" y="140" width="55" height="15" fill="#000000" />
                  <rect x="70" y="165" width="50" height="15" fill="#000000" />
                  <rect x="140" y="170" width="30" height="15" fill="#000000" />

                  {/* Center QRIS Badge */}
                  <rect x="80" y="80" width="40" height="40" rx="6" fill="#0284c7" />
                  <text x="100" y="104" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                    QRIS
                  </text>
                </svg>
                <div className="mt-2 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
                  NMID: ID1029384756192
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Pindai kode QRIS menggunakan GoPay, OVO, Dana, BCA Mobile, atau aplikasi perbankan apa pun.
              </p>

              <button
                onClick={() => handleSimulatePayment("QRIS")}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 font-bold text-sm text-white bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform active:scale-98 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Mengecek Status Pembayaran...</span>
                  </>
                ) : (
                  <>
                    <AiOutlineCheckCircle size={18} />
                    <span>Simulasikan Scan &amp; Bayar Sukses</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* TAB 3: CREDIT / DEBIT CARD */}
          {activeTab === "card" && (
            <form onSubmit={handleCardPaymentSubmit} className="space-y-4 animate-fadeIn">
              {/* Card Preview */}
              <div className="p-5 text-white rounded-2xl shadow-xl bg-linear-to-tr from-slate-900 via-indigo-950 to-blue-900 border border-slate-700 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-mono font-bold tracking-widest text-blue-300 uppercase">
                    FLYBOOK PLATINUM
                  </span>
                  <div className="flex gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-red-500/80" />
                    <div className="w-6 h-6 -ml-3 rounded-full bg-amber-400/80" />
                  </div>
                </div>

                <div className="text-lg sm:text-xl font-mono tracking-widest mb-4">
                  {cardData.number || "•••• •••• •••• ••••"}
                </div>

                <div className="flex justify-between items-end text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-gray-400 block">NAMA PEMEGANG</span>
                    <span className="uppercase font-semibold tracking-wider">
                      {cardData.name || "NAMA PENUMPANG"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">EXPIRES</span>
                    <span>{cardData.expiry || "MM/YY"}</span>
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Nomor Kartu (16 Digit)
                </label>
                <input
                  type="text"
                  maxLength={19}
                  placeholder="4123 4567 8901 2345"
                  value={cardData.number}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").substring(0, 16);
                    const formatted = v.match(/.{1,4}/g)?.join(" ") || v;
                    setCardData({ ...cardData, number: formatted });
                  }}
                  className="w-full px-3.5 py-2.5 text-sm font-mono border border-gray-300 rounded-xl dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Berlaku Hingga (MM/YY)
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="12/28"
                    value={cardData.expiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "").substring(0, 4);
                      if (v.length > 2) v = `${v.substring(0, 2)}/${v.substring(2)}`;
                      setCardData({ ...cardData, expiry: v });
                    }}
                    className="w-full px-3.5 py-2.5 text-sm font-mono border border-gray-300 rounded-xl dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    CVV (3 Digit)
                  </label>
                  <input
                    type="password"
                    maxLength={3}
                    placeholder="888"
                    value={cardData.cvv}
                    onChange={(e) =>
                      setCardData({
                        ...cardData,
                        cvv: e.target.value.replace(/\D/g, "").substring(0, 3),
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-sm font-mono border border-gray-300 rounded-xl dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 font-bold text-sm text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-98 flex items-center justify-center gap-2"
              >
                <AiOutlineSafety size={18} />
                <span>Bayar {formatPrice(totalAmount)} (3D Secure)</span>
              </button>
            </form>
          )}

          {/* TAB 4: E-WALLET */}
          {activeTab === "ewallet" && (
            <div className="space-y-4 animate-fadeIn">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
                Pilih Dompet Digital
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {["GOPAY", "OVO", "SHOPEEPAY", "DANA"].map((wallet) => (
                  <button
                    key={wallet}
                    type="button"
                    onClick={() => setSelectedWallet(wallet)}
                    className={`py-3 px-2 rounded-xl border text-center font-bold text-xs sm:text-sm transition-all ${
                      selectedWallet === wallet
                        ? "border-blue-600 bg-blue-50/50 text-blue-700 dark:bg-blue-900/30 dark:border-blue-500 dark:text-blue-300 ring-2 ring-blue-500/20"
                        : "border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-slate-600"
                    }`}
                  >
                    {wallet}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                  Nomor HP Terdaftar ({selectedWallet})
                </label>
                <input
                  type="tel"
                  defaultValue="081234567890"
                  className="w-full px-3.5 py-2.5 text-sm font-mono border border-gray-300 rounded-xl dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl dark:bg-amber-900/20 dark:border-amber-700 text-xs text-amber-800 dark:text-amber-300">
                Notifikasi persetujuan pembayaran akan otomatis dikirim ke aplikasi <strong>{selectedWallet}</strong> Anda.
              </div>

              <button
                onClick={() => handleSimulatePayment(selectedWallet)}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 font-bold text-sm text-white bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-98 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Menghubungkan ke {selectedWallet}...</span>
                  </>
                ) : (
                  <>
                    <AiOutlineCheckCircle size={18} />
                    <span>Simulasikan Konfirmasi {selectedWallet}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* 3D SECURE OTP SIMULATION SUB-MODAL */}
        {showOtpModal && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-2xl dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-center">
              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                <AiOutlineSafety size={28} />
              </div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">
                Verifikasi 3D Secure OTP
              </h4>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Simulasi kode OTP SMS telah dikirim ke nomor HP Anda. Masukkan kode <strong>123456</strong> di bawah:
              </p>

              <div className="my-4">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value);
                    setOtpError("");
                  }}
                  className="w-full text-center text-2xl font-mono tracking-widest py-2 px-3 border border-gray-300 rounded-xl dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                {otpError && (
                  <span className="text-xs text-red-500 mt-1 block">{otpError}</span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 dark:bg-slate-800 dark:text-gray-300"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md"
                >
                  Verifikasi &amp; Bayar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
