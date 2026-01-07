/** @format */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContexts";
import {
  FileText,
  ShoppingCart,
  Menu,
  X,
  Wallet,
  Coins,
  Megaphone,
  MonitorPlayIcon,
  MapIcon,
  Settings2Icon,
  CoinsIcon,
  User2Icon,
  ChevronRight,
  Key,
  Trash2,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  EyeClosed,
  EyeOff,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  changePassword,
  getPasswordStrength,
} from "@/lib/api/account-settings";
import { deleteAccount } from "@/lib/api/account-settings";
import { DeleteAccountData } from "@/types/account-settings";

export default function DeleteAccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  //GANTI PASSWORD HANDLES

  const [confirmationText, setConfirmationText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (confirmationText.toUpperCase() !== "HAPUS") {
      setError("Konfirmasi tidak sesuai. Ketik 'HAPUS' untuk melanjutkan.");
      return;
    }

    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan!"
    );

    if (!confirmed) return;

    setIsLoading(true);
    setError("");

    try {
      const data: DeleteAccountData = {
        confirmationText: confirmationText,
      };

      const result = await deleteAccount(data);

      if (result.success) {
        alert(
          result.message ||
            "Akun berhasil dihapus. Terima kasih telah menggunakan layanan kami."
        );
        logout();
        router.push("/");
      } else {
        setError(result.error || "Gagal menghapus akun");
      }
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  //MENU HANDLERS STATE
  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleMenuClick = (href: string) => {
    router.push(href);
    setShowMobileMenu(false);
  };

  if (!user?.isLoggedIn) {
    return null;
  }

  const menuItems = [
    {
      icon: FileText,
      label: "Profile",
      href: "/dashboard/profil",
      color: "text-pink-500",
    },
    {
      icon: Coins,
      label: "Poin MYOLA",
      href: "/dashboard/poin-myola",
      color: "text-pink-500",
    },
    {
      icon: ShoppingCart,
      label: "Pesanan Saya",
      href: "/dashboard/pesanan",
      color: "text-pink-500",
    },
    {
      icon: MonitorPlayIcon,
      label: "Kelas Saya",
      href: "/dashboard/kelas",
      color: "text-pink-500",
    },
    {
      icon: Megaphone,
      label: "Event Saya",
      href: "/dashboard/event",
      color: "text-pink-500",
    },
    {
      icon: MapIcon,
      label: "Alamat Pengiriman",
      href: "/dashboard/alamat",
      color: "text-pink-500",
    },
    {
      icon: Settings2Icon,
      label: "Pengaturan Akun",
      href: "/dashboard/pengaturan-akun-akun",
      color: "text-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex justify-between items-center h-16 px-4">
          <h1 className="text-lg font-bold text-gray-900">Akun</h1>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu - Dropdown Style */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-b border-gray-200">
          {/* Saldo Card */}
          <div className="px-4 py-3 flex items-center gap-3 border-b bg-blue-50">
            <Wallet className="w-5 h-5 text-pink-600" />
            <div>
              <p className="text-xs text-gray-600">Poin </p>
              <p className="font-bold text-gray-900">10.000</p>
            </div>
          </div>

          {/* Menu Items */}
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleMenuClick(item.href)}
              className="w-full flex items-center gap-3 px-4 py-3 border-b hover:bg-gray-50 transition-colors text-left"
            >
              <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0`} />
              <span className="flex-1 font-medium text-gray-800 text-sm">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden md:block md:col-span-1">
            <div className="bg-pink-50 rounded-2xl p-6 sticky top-32">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">
                    {user.name}
                  </h3>
                  <span className="inline-block bg-pink-500 text-white text-xs px-3 py-1 rounded-full mt-1">
                    {user.points?.toLocaleString() || "10,000"} poin
                  </span>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="space-y-2">
                <Link
                  href="/dashboard/profil"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-white hover:text-pink-600 font-medium transition-colors"
                >
                  <User2Icon className="w-5 h-5 flex-shrink-0" />
                  <span>Profil</span>
                </Link>
                <Link
                  href="/dashboard/poin-myola"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-white hover:text-pink-600 font-medium transition-colors"
                >
                  <CoinsIcon className="w-5 h-5 flex-shrink-0" />
                  <span>Poin MOLA</span>
                </Link>

                <Link
                  href="/dashboard/pesanan"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-white hover:text-pink-600 font-medium transition-colors"
                >
                  <ShoppingCart className="w-5 h-5 flex-shrink-0" />
                  <span>Pesanan Saya</span>
                </Link>

                <Link
                  href="/dashboard/kelas"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-white hover:text-pink-600 font-medium transition-colors"
                >
                  <MonitorPlayIcon className="w-5 h-5 flex-shrink-0" />
                  <span>Kelas Saya</span>
                </Link>

                <Link
                  href="/dashboard/event"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-white hover:text-pink-600 font-medium transition-colors"
                >
                  <Megaphone className="w-5 h-5 flex-shrink-0" />
                  <span>Event Saya</span>
                </Link>

                <Link
                  href="/dashboard/alamat"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-white hover:text-pink-600 font-medium transition-colors"
                >
                  <MapIcon className="w-5 h-5 flex-shrink-0" />
                  <span>Alamat Pengiriman</span>
                </Link>

                <button
                  onClick={() => {}}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white text-pink-600 font-medium hover:bg-pink-100 transition-colors"
                >
                  <Settings2Icon className="w-5 h-5 flex-shrink-0" />
                  <span>Pengaturan Akun</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <Link
                href="/dashboard/pengaturan-akun"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <p className="text-xl font-bold text-gray-900">Hapus Akun</p>
            </div>

            {/* Warning Banner */}
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-red-900 mb-2">
                    ⚠️ Peringatan Penting
                  </h3>
                  <p className="text-sm text-red-800 mb-3">
                    Untuk melanjutkan, silakan ketik{" "}
                    <span className="font-bold">HAPUS</span> di bawah ini.
                  </p>
                  <p className="text-sm text-red-800">
                    Tindakan ini dilakukan untuk memastikan bahwa kamu
                    benar-benar ingin menghapus akunmu.
                  </p>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">
                Yang akan terjadi jika akun dihapus:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-xs font-bold">✕</span>
                  </span>
                  <span className="text-gray-700">
                    Semua data pribadi Anda akan dihapus secara permanen
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-xs font-bold">✕</span>
                  </span>
                  <span className="text-gray-700">
                    Poin MYOLA yang Anda miliki akan hangus
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-xs font-bold">✕</span>
                  </span>
                  <span className="text-gray-700">
                    Riwayat pesanan dan transaksi akan dihapus
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-xs font-bold">✕</span>
                  </span>
                  <span className="text-gray-700">
                    Akses ke kelas dan event yang telah dibeli akan hilang
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-xs font-bold">✕</span>
                  </span>
                  <span className="text-gray-700">
                    Tindakan ini tidak dapat dibatalkan
                  </span>
                </li>
              </ul>
            </div>

            {/* Confirmation Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {/* Confirmation Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Konfirmasi Hapus Akun
                  </label>
                  <input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => {
                      setConfirmationText(e.target.value);
                      setError("");
                    }}
                    placeholder="Ketik Hapus"
                    disabled={isLoading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Ketik kata "HAPUS" (tanpa tanda kutip) untuk mengonfirmasi
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    href="/dashboard/pengaturan-akun"
                    className="flex-1 px-6 py-3 text-center border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading || !confirmationText}
                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Menghapus...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        <span>Hapus Permanen</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
