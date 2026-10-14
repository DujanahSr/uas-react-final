/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import {
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlineQuestionCircle,
  AiOutlineFileText,
  AiOutlineCreditCard,
  AiOutlineCalendar,
  AiOutlineUser,
  AiOutlinePhone,
  AiOutlineMail,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineDown,
  AiOutlineUp,
} from "react-icons/ai";
import {
  FaPlane,
  FaTicketAlt,
  FaShieldAlt,
  FaInfoCircle,
} from "react-icons/fa";

const Help = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState(new Set());

  const categories = [
    { id: "all", name: "Semua", icon: AiOutlineFileText },
    { id: "booking", name: "Pemesanan", icon: FaTicketAlt },
    { id: "payment", name: "Pembayaran", icon: AiOutlineCreditCard },
    { id: "flight", name: "Penerbangan", icon: FaPlane },
    { id: "account", name: "Akun", icon: AiOutlineUser },
    { id: "other", name: "Lainnya", icon: FaInfoCircle },
  ];

  const faqData = [
    // Booking
    {
      id: 1,
      category: "booking",
      question: "Bagaimana cara memesan tiket pesawat?",
      answer:
        "Untuk memesan tiket pesawat, ikuti langkah berikut:\n1. Masuk ke halaman Home dan isi form pencarian penerbangan\n2. Pilih penerbangan yang diinginkan dari hasil pencarian\n3. Isi data penumpang dan informasi kontak\n4. Pilih kelas penerbangan (Ekonomi, Bisnis, atau First Class)\n5. Lakukan pembayaran\n6. Anda akan menerima konfirmasi booking dan E-Ticket",
    },
    {
      id: 2,
      category: "booking",
      question: "Apakah bisa memesan tiket untuk beberapa penumpang sekaligus?",
      answer:
        "Ya, Anda bisa memesan tiket untuk beberapa penumpang dalam satu transaksi. Saat mengisi form booking, Anda dapat menambahkan jumlah penumpang dan mengisi data masing-masing penumpang.",
    },
    {
      id: 3,
      category: "booking",
      question: "Bagaimana cara melihat riwayat pemesanan saya?",
      answer:
        "Anda dapat melihat semua riwayat pemesanan di halaman 'Riwayat Pemesanan' (My Bookings). Di halaman tersebut, Anda dapat melihat detail pemesanan, mengunduh E-Ticket, dan melihat status pemesanan.",
    },
    {
      id: 4,
      category: "booking",
      question: "Bisakah saya membatalkan pemesanan?",
      answer:
        "Ya, Anda dapat membatalkan pemesanan melalui halaman 'Riwayat Pemesanan'. Pilih pemesanan yang ingin dibatalkan dan klik tombol 'Batalkan'. Harap dicatat bahwa kebijakan pembatalan dan pengembalian dana mengikuti ketentuan maskapai penerbangan.",
    },
    {
      id: 5,
      category: "booking",
      question: "Bagaimana cara mengunduh E-Ticket?",
      answer:
        "Setelah pemesanan berhasil, Anda dapat mengunduh E-Ticket dengan cara:\n1. Buka halaman 'Riwayat Pemesanan'\n2. Pilih pemesanan yang ingin dilihat\n3. Klik tombol 'Lihat Detail' atau 'E-Ticket'\n4. Klik tombol 'Download/Print' untuk mengunduh atau mencetak E-Ticket",
    },
    // Payment
    {
      id: 6,
      category: "payment",
      question: "Metode pembayaran apa saja yang tersedia?",
      answer:
        "Saat ini kami menerima pembayaran melalui:\n- Kartu Kredit/Debit\n- Transfer Bank\n- E-Wallet (OVO, GoPay, DANA)\n- Virtual Account\n\nMetode pembayaran yang tersedia akan ditampilkan saat proses checkout.",
    },
    {
      id: 7,
      category: "payment",
      question: "Apakah pembayaran aman?",
      answer:
        "Ya, semua transaksi pembayaran di FlyBook dilindungi dengan enkripsi SSL dan sistem keamanan tingkat tinggi. Data kartu kredit Anda tidak disimpan di sistem kami dan diproses melalui payment gateway yang terpercaya.",
    },
    {
      id: 8,
      category: "payment",
      question: "Berapa lama waktu untuk verifikasi pembayaran?",
      answer:
        "Verifikasi pembayaran biasanya memakan waktu 1-5 menit untuk transaksi kartu kredit/debit. Untuk transfer bank dan virtual account, verifikasi dapat memakan waktu hingga 1x24 jam tergantung bank yang digunakan.",
    },
    {
      id: 9,
      category: "payment",
      question: "Bagaimana jika pembayaran saya gagal?",
      answer:
        "Jika pembayaran gagal, silakan coba lagi dengan:\n1. Memastikan saldo/kredit limit mencukupi\n2. Memeriksa data kartu/akun yang digunakan\n3. Menghubungi bank/penyedia layanan pembayaran Anda\n\nJika masalah berlanjut, hubungi customer service kami.",
    },
    // Flight
    {
      id: 10,
      category: "flight",
      question: "Bagaimana cara mencari penerbangan?",
      answer:
        "Untuk mencari penerbangan:\n1. Di halaman Home, isi form pencarian dengan:\n   - Kota asal dan tujuan\n   - Tanggal keberangkatan (dan pulang jika round trip)\n   - Jumlah penumpang\n2. Klik tombol 'Cari Penerbangan'\n3. Gunakan filter dan sorting untuk menyempitkan hasil pencarian",
    },
    {
      id: 11,
      category: "flight",
      question: "Apa perbedaan kelas Ekonomi, Bisnis, dan First Class?",
      answer:
        "Perbedaan utama ketiga kelas penerbangan:\n\n• Ekonomi: Kursi standar dengan fasilitas dasar, bagasi 20kg, makanan ringan\n• Bisnis: Kursi lebih luas dan nyaman, bagasi 30kg, makanan lengkap, prioritas boarding\n• First Class: Kursi sangat luas dan dapat direbahkan, bagasi 40kg, makanan premium, lounge access, layanan eksklusif",
    },
    {
      id: 12,
      category: "flight",
      question: "Apakah bisa mencari penerbangan pulang-pergi?",
      answer:
        "Ya, Anda dapat mencari penerbangan pulang-pergi dengan memilih opsi 'Pulang Pergi' di form pencarian. Isi tanggal keberangkatan dan tanggal kembali, kemudian sistem akan menampilkan opsi penerbangan yang sesuai.",
    },
    {
      id: 13,
      category: "flight",
      question: "Bagaimana cara melihat detail penerbangan?",
      answer:
        "Setelah mencari penerbangan, klik pada kartu penerbangan yang diinginkan untuk melihat detail lengkap termasuk:\n- Jadwal lengkap\n- Informasi maskapai\n- Fasilitas dan amenities\n- Harga untuk setiap kelas\n- Kursi tersedia",
    },
    // Account
    {
      id: 14,
      category: "account",
      question: "Bagaimana cara mendaftar akun?",
      answer:
        "Untuk mendaftar akun baru:\n1. Klik tombol 'Register' di halaman login\n2. Isi formulir pendaftaran dengan data lengkap:\n   - Nama lengkap\n   - Email\n   - Password\n   - Nomor telepon\n   - Alamat\n3. Klik 'Daftar' untuk menyelesaikan pendaftaran",
    },
    {
      id: 15,
      category: "account",
      question: "Bagaimana cara mengubah profil saya?",
      answer:
        "Untuk mengubah profil:\n1. Buka halaman 'Profil Saya'\n2. Klik tombol 'Edit Profil'\n3. Ubah informasi yang diinginkan\n4. Klik 'Simpan' untuk menyimpan perubahan\n\nPastikan semua data yang diisi valid sebelum menyimpan.",
    },
    {
      id: 16,
      category: "account",
      question: "Apa yang harus dilakukan jika lupa password?",
      answer:
        "Jika Anda lupa password:\n1. Di halaman login, klik 'Lupa Password?'\n2. Masukkan email yang terdaftar\n3. Anda akan menerima email dengan link reset password\n4. Ikuti instruksi di email untuk membuat password baru\n\nJika tidak menerima email, periksa folder spam atau hubungi customer service.",
    },
    // Other
    {
      id: 17,
      category: "other",
      question: "Bagaimana cara menghubungi customer service?",
      answer:
        "Anda dapat menghubungi customer service FlyBook melalui:\n\n• Email: support@flybook.com\n• Telepon: 0800-1234-5678 (Gratis)\n• WhatsApp: +62 812-3456-7890\n• Live Chat: Tersedia di website (Jam 08:00 - 22:00 WIB)\n\nCustomer service kami siap membantu 24/7 untuk pertanyaan dan bantuan.",
    },
    {
      id: 18,
      category: "other",
      question: "Apakah ada biaya tambahan untuk booking?",
      answer:
        "Harga yang ditampilkan sudah termasuk:\n- Harga tiket dasar\n- Pajak bandara\n- Biaya layanan\n\nTidak ada biaya tersembunyi. Harga final akan ditampilkan sebelum Anda melakukan pembayaran.",
    },
    {
      id: 19,
      category: "other",
      question: "Bagaimana kebijakan refund dan perubahan jadwal?",
      answer:
        "Kebijakan refund dan perubahan jadwal mengikuti ketentuan maskapai penerbangan:\n\n• Refund: Tergantung tipe tiket yang dibeli (refundable/non-refundable)\n• Perubahan jadwal: Dikenakan biaya perubahan sesuai kebijakan maskapai\n• Pembatalan: Dapat dilakukan melalui halaman 'Riwayat Pemesanan'\n\nUntuk detail lebih lanjut, hubungi customer service kami.",
    },
    {
      id: 20,
      category: "other",
      question: "Apakah aplikasi ini aman digunakan?",
      answer:
        "Ya, FlyBook menggunakan teknologi keamanan tingkat tinggi:\n- Enkripsi SSL untuk semua transaksi\n- Sistem autentikasi yang aman\n- Perlindungan data pribadi sesuai standar internasional\n- Payment gateway terpercaya\n\nKami berkomitmen menjaga keamanan dan privasi data pengguna.",
    },
  ];

  const filteredFAQs = useMemo(() => {
    let filtered = faqData;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((faq) => faq.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchLower) ||
          faq.answer.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [selectedCategory, searchTerm]);

  const toggleItem = (id) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/20 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <main className="max-w-6xl px-4 py-6 mx-auto sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div
          className="mb-6 animate-slideInUp"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="relative">
            <AiOutlineSearch
              className="absolute text-gray-400 transform -translate-y-1/2 left-4 top-1/2 dark:text-gray-500"
              size={20}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari pertanyaan atau kata kunci..."
              className="w-full px-4 py-4 pl-12 text-gray-800 transition-all bg-white border border-gray-300 shadow-sm rounded-xl dark:bg-slate-800 dark:text-white dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories */}
        <div
          className="mb-6 animate-slideInUp"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all transform hover:scale-105 active:scale-95 ${
                    selectedCategory === category.id
                      ? "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : "bg-white text-gray-700 border border-gray-300 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm sm:text-base">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Results Count */}
        {filteredFAQs.length > 0 && (
          <div
            className="mb-4 text-sm text-gray-600 dark:text-gray-400 animate-slideInUp"
            style={{ animationDelay: "0.3s" }}
          >
            Menampilkan {filteredFAQs.length} dari {faqData.length} pertanyaan
          </div>
        )}

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => {
              const isExpanded = expandedItems.has(faq.id);
              const categoryInfo = categories.find(
                (cat) => cat.id === faq.category
              );
              const CategoryIcon = categoryInfo?.icon || AiOutlineFileText;

              return (
                <div
                  key={faq.id}
                  className="overflow-hidden transition-all border shadow-lg bg-white/90 backdrop-blur-sm border-gray-200/50 rounded-xl dark:bg-slate-800/90 dark:border-slate-700/50 card-3d animate-slideInUp hover:shadow-xl"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-6 py-5 text-left transition-colors hover:bg-gray-50/50 dark:hover:bg-slate-700/50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start flex-1 gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg shrink-0 dark:bg-blue-900/30">
                          <CategoryIcon
                            size={20}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                            {faq.question}
                          </h3>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {isExpanded ? (
                          <AiOutlineUp
                            size={20}
                            className="text-gray-500 dark:text-gray-400"
                          />
                        ) : (
                          <AiOutlineDown
                            size={20}
                            className="text-gray-500 dark:text-gray-400"
                          />
                        )}
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pt-0 pb-5 border-t border-gray-200/50 dark:border-slate-700/50 animate-slideDown">
                      <div className="pt-4 pl-12">
                        <div className="prose-sm prose max-w-none dark:prose-invert">
                          <p className="leading-relaxed text-gray-700 whitespace-pre-line dark:text-gray-300">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div
              className="p-12 text-center border shadow-lg bg-white/90 backdrop-blur-sm border-gray-200/50 rounded-xl dark:bg-slate-800/90 dark:border-slate-700/50 card-3d animate-slideInUp"
              style={{ animationDelay: "0.3s" }}
            >
              <AiOutlineSearch
                size={64}
                className="mx-auto mb-4 text-gray-400 dark:text-gray-500"
              />
              <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Tidak ada hasil ditemukan
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Coba gunakan kata kunci lain atau pilih kategori yang berbeda
              </p>
            </div>
          )}
        </div>

        {/* Contact Support Section */}
        <div
          className="p-6 mt-8 shadow-lg bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl animate-slideInUp card-3d"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
              <FaShieldAlt size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-xl font-bold text-white">
                Masih butuh bantuan?
              </h3>
              <p className="text-blue-100">
                Tim customer service kami siap membantu Anda 24/7
              </p>
            </div>
            <div className="flex flex-wrap gap-3 sm:flex-nowrap">
              <a
                href="mailto:support@flybook.com"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all transform rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 hover:scale-105"
              >
                <AiOutlineMail size={18} />
                <span className="hidden sm:inline">Email</span>
              </a>
              <a
                href="tel:+6281234567890"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all transform rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 hover:scale-105"
              >
                <AiOutlinePhone size={18} />
                <span className="hidden sm:inline">Telepon</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Help;

