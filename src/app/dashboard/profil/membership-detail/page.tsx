/** @format */

// app/dashboard/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";

export default function MembershipDetailPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  // const [isLoading, setIsLoading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState<
    "active" | "inactive"
  >("active");

  // useEffect(() => {
  //   if (!!!user) {
  //     router.push("/login");
  //   }
  // }, [user, router]);

  // if (!!!user) {
  //   return null;
  // }

  const handlesignOut = () => {
    signOut();
    router.push("/");
  };

  const handleMenuClick = (href: string) => {
    router.push(href);
    setShowMobileMenu(false);
  };

  if (!!!user) {
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
      href: "/dashboard/pesanan-saya",
      color: "text-pink-500",
    },
    {
      icon: MonitorPlayIcon,
      label: "Kelas Saya",
      href: "/dashboard/kelas-saya",
      color: "text-pink-500",
    },
    {
      icon: Megaphone,
      label: "Event Saya",
      href: "/dashboard/event-saya",
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

  useEffect(() => {
    if (!!!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleBatalkanClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmBatalkan = async () => {
    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update membership status to inactive
      setMembershipStatus("inactive");

      // Update user data
      const updatedUser = {
        ...user!,
        membershipActive: false,
        memberUntil: "Tidak Aktif",
      };

      alert("Membership Anda telah dibatalkan");
      setShowConfirmation(false);

      // Redirect back after 2 seconds
      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error) {
      alert("Gagal membatalkan membership");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelDialog = () => {
    setShowConfirmation(false);
  };

  if (!!!user) {
    return null;
  }

  const benefits = [
    {
      id: "akses-video",
      title: "Akses Penuh Video Akademi Eksklusif",
      icon: "🎬",
      description: [
        "Nikmati akses tanpa batas ke seluruh koleksi video akademi tutorial premium.",
        "Pelajari teknik terbaru dan terlengkap mengenai potengan rambut, pewarnaan (cat rambut), hair styling, perawatan, dan topik kecantikan profesional lainnya, kapan saja dan di mana saja.",
      ],
    },
    {
      id: "poin-cashback",
      title: "Poin Cashback MYOLA untuk Setiap Pembelian",
      icon: "💰",
      description: [
        "Dapatkan Poin Cashback MYOLA yang bernilai uang untuk setiap transaksi pembelian produk melalui website resmi MYOLA.",
        "Poin dapat diturkarkan atau digunakan sebagai diskon pada pembelian berikutnya.",
      ],
    },
    {
      id: "diskon-khusus",
      title: "Diskon Khusus Member",
      icon: "🎁",
      description: [
        "Nikmati harga spesial dan diskon eksklusif yang hanya berlaku untuk Member MYOLA pada produk-produk tertentu dan sesi workshop atau gathering yang diselenggarakan oleh MYOLA.",
      ],
    },
    {
      id: "prioritas-info",
      title: "Prioritas Informasi dan Pre-Order",
      icon: "⚡",
      description: [
        "Dapatkan informasi paling awal mengenai peluncuran produk baru, tren kecantikan terkini, serta kesempatan pre-order eksklusif sebelum dibuka untuk publik.",
      ],
    },
    {
      id: "komunitas",
      title: "Komunitas Eksklusif dan Dukungan Ahli",
      icon: "👥",
      description: [
        "Bergabunglah dengan komunitas profesional MYOLA untuk berbagi pengetahuan, networking, dan mendapatkan dukungan langsung dari para ahli melalui forum atau grup khusus member.",
      ],
    },
  ];

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

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
            <div className="bg-pink-50 rounded-2xl p-6 sticky ">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">
                    {user.full_name}
                  </h3>
                  <span className="inline-block bg-pink-500 text-white text-xs px-3 py-1 rounded-full mt-1">
                    {user.points_balance?.toLocaleString() || "10,000"} poin
                  </span>
                </div>
              </div>

              {/* Menu Items */}
              <nav className="space-y-2">
                <button
                  onClick={() => {}}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white text-pink-600 font-medium hover:bg-pink-100 transition-colors"
                >
                  <User2Icon className="w-5 h-5 flex-shrink-0" />
                  <span>Profil</span>
                </button>

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

                <Link
                  href="/dashboard/pengaturan-akun"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-white hover:text-pink-600 font-medium transition-colors"
                >
                  <Settings2Icon className="w-5 h-5 flex-shrink-0" />
                  <span>Pengaturan Akun</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <p className="text-xl md:text-3xl font-bold text-gray-900">
              Membership Detail
            </p>

            <div className="bg-gradient-to-r from-pink-100 to-pink-100 h-[80px] border border-pink-600 rounded-xl mt-6 mb-8 px-3 md:px-6 flex items-center">
              <div className="flex items-center justify-between w-full">
                {/* LEFT CONTENT */}
                <div className="md:flex items-center gap-8 md:gap-2">
                  <Image
                    src="/images/myola-member-logo.png"
                    alt="MyOLA Logo"
                    width={120}
                    height={64}
                    className="object-contain"
                  />

                  <p className="text-gray-900 text-xs md:text-base font-semibold">
                    Berakhir pada {user.memberUntil || "10 Januari 2026"}
                  </p>
                </div>

                {/* MEMBERSHIP STATUS */}
                <div
                  className={`px-4 py-2 rounded-full ${
                    membershipStatus === "active"
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  <span
                    className={`font-bold text-sm ${
                      membershipStatus === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {membershipStatus === "active" ? "Aktif" : "Tidak Aktif"}
                  </span>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>✨</span>
                Keuntungan Eksklusif Menjadi Member MYOLA
                <span>✨</span>
              </h2>

              {benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="  rounded-lg overflow-hidden border  "
                >
                  {/* Header Expandable */}
                  <button
                    onClick={() => toggleSection(benefit.id)}
                    className="w-full px-4 md:px-6 py-4 flex items-start md:items-center justify-between  text-left"
                  >
                    <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
                      <span className="text-2xl md:text-3xl flex-shrink-0">
                        {benefit.icon}
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm md:text-lg leading-tight">
                        {benefit.title}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {expandedSection === benefit.id ? (
                        <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-pink-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-pink-600" />
                      )}
                    </div>
                  </button>

                  {/* Expandable Content */}
                  {expandedSection === benefit.id && (
                    <div className="px-4 md:px-6 pb-4 md:pb-6 border-t  bg-opacity-50">
                      <ul className="space-y-3">
                        {benefit.description.map((item, idx) => (
                          <li key={idx} className="flex gap-3">
                            <Check className="w-5 h-5 md:w-6 md:h-6 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm md:text-base leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Section */}
            <div className="bg-white rounded-lg p-6 md:p-6 flex items-center justify-between mt-8 border-2">
              <p className="text-lg md:text-xl font-bold text-gray-900">
                Batalkan Langganan
              </p>
              <button
                onClick={handleBatalkanClick}
                disabled={membershipStatus === "inactive"}
                className={`px-6 md:px-8 py-2 md:py-3 rounded-lg font-bold transition-colors text-sm md:text-base ${
                  membershipStatus === "inactive"
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                {membershipStatus === "inactive"
                  ? "Sudah Dibatalkan"
                  : "Batalkan"}
              </button>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmation && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 md:p-8 animate-in">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                      Batalkan Membership?
                    </h2>
                    <p className="text-gray-600 text-sm md:text-base">
                      Anda yakin ingin membatalkan membership? Akses eksklusif
                      akan segera dihentikan.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleConfirmBatalkan}
                      disabled={isProcessing}
                      className={`w-full py-3 rounded-lg font-bold text-white transition-colors ${
                        isProcessing
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        "Ya, Batalkan"
                      )}
                    </button>
                    <button
                      onClick={handleCancelDialog}
                      disabled={isProcessing}
                      className="w-full py-3 rounded-lg font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      Batal
                    </button>
                  </div>

                  <p className="text-center text-xs text-gray-500 mt-4">
                    Keputusan ini tidak dapat dibatalkan. Hubungi support jika
                    ada pertanyaan.
                  </p>
                </div>
              </div>
            )}

            {/* Back Button */}
            <div className="mt-6 md:mt-8">
              <button
                onClick={() => router.back()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors text-sm md:text-base"
              >
                ← Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
