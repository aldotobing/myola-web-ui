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
  User,
  CreditCard,
  Video,
  Calendar,
  MapPin,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PoinPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  //Content State
  const [showModal, setShowModal] = useState(false);
  const [points] = useState(1200000);

  const transactions = [
    {
      id: 1,
      title: "Join Member",
      date: "Diterima 2 Agustus 2025",
      points: 49000,
      type: "add",
    },
    {
      id: 2,
      title: "Transaksi SM7178299894",
      date: "Diterima 2 Agustus 2025",
      points: 20000,
      type: "add",
    },
    {
      id: 3,
      title: "Transaksi SM7178299894",
      date: "Diterima 2 Agustus 2025",
      points: 20000,
      type: "add",
    },
    {
      id: 4,
      title: "Event Hair Color",
      date: "Diterima 2 Agustus 2025",
      points: 20000,
      type: "add",
    },
    {
      id: 5,
      title: "Poin Redeemed",
      date: "Digunakan 2 Agustus 2025",
      points: -20000,
      type: "subtract",
    },
  ];

  const expiringTransactions = [
    {
      id: 1,
      title: "Join Member",
      date: "Kadaluarsa 30 Agustus 2025",
      points: 49000,
    },
    {
      id: 2,
      title: "Transaksi SM7178299894",
      date: "Kadaluarsa 30 Agustus 2025",
      points: 20000,
    },
    {
      id: 3,
      title: "Transaksi SM7178299894",
      date: "Kadaluarsa 30 Agustus 2025",
      points: 20000,
    },
    {
      id: 4,
      title: "Event Hair Color",
      date: "Kadaluarsa 30 Agustus 2025",
      points: 20000,
    },
  ];

  const pointInfo = [
    {
      icon: "💰",
      text: "Setiap 1 (satu) Poin MOLA bernilai 1 (satu) IDR saat digunakan untuk bertransaksi di MOLA.",
    },
    {
      icon: "🎨",
      text: "Poin MOLA bisa digunakan untuk transaksi atau penukaran promo tertentu yang tersedia di website.",
    },
    {
      icon: "🚫",
      text: "Poin MOLA tidak dapat diuangkan atau dipindahkan ke akun pengguna lain.",
    },
    {
      icon: "💫",
      text: "Poin MOLA akan aktif setelah transaksi kamu berhasil dan status pesanan dinyatakan selesai.",
    },
    {
      icon: "📅",
      text: "MOLA Points berlaku selama 1 (satu) tahun sejak tanggal aktivasi poin.",
    },
  ];

  //Menu and signOut Handler

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
                <Link
                  href="/dashboard/profil"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-white hover:text-pink-600 font-medium transition-colors"
                >
                  <User2Icon className="w-5 h-5 flex-shrink-0" />
                  <span>Profil</span>
                </Link>

                <button
                  onClick={() => {}}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white text-pink-600 font-medium hover:bg-pink-100 transition-colors"
                >
                  <CoinsIcon className="w-5 h-5 flex-shrink-0" />
                  <span>Poin MOLA</span>
                </button>

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
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-xl md:text-3xl font-bold text-gray-900">
                Poin MYOLA
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="text-pink-500 border border-pink-500 px-4 py-2 rounded-lg hover:bg-pink-50"
              >
                Tentang Poin
              </button>
            </div>

            {/* Points Card */}
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 text-white mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-baseline space-x-2 mb-2">
                    <span className="text-4xl font-bold">
                      {points.toLocaleString("id-ID")}
                    </span>
                    <span className="text-xl">Poin</span>
                  </div>
                  <span className="inline-block bg-white bg-opacity-30 text-sm px-3 py-1 rounded-full">
                    1 poin setara dengan Rp 1
                  </span>
                  <p className="mt-4 text-sm font-semibold">
                    Dapatkan cashback poin dari setiap transaksi, kumpulkan dan
                    pakai lagi untuk belanja berikutnya!
                  </p>
                </div>
                <div className="w-20 h-20">
                  <img src="/images/icon koin.png" alt="Coins" />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="riwayat" className="mb-6">
              <TabsList className="bg-transparent p-0 h-auto space-x-2">
                <TabsTrigger
                  value="riwayat"
                  className="bg-pink-100 text-pink-500 px-6 py-2 rounded-lg font-medium data-[state=active]:bg-pink-500 data-[state=active]:text-white"
                >
                  Riwayat
                </TabsTrigger>
                <TabsTrigger
                  value="kadaluarsa"
                  className="bg-pink-100 text-pink-500 px-6 py-2 rounded-lg font-medium data-[state=active]:bg-pink-500 data-[state=active]:text-white"
                >
                  Akan Kadaluarsa
                </TabsTrigger>
              </TabsList>

              <TabsContent value="riwayat" className="mt-6">
                {points > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="bg-white rounded-lg p-4 flex justify-between items-center shadow-sm"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {transaction.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.date}
                          </p>
                        </div>
                        <div
                          className={`font-bold text-lg ${
                            transaction.type === "add"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "add" ? "+" : ""}
                          {transaction.points.toLocaleString("id-ID")}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mb-6">
                      <img
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cg fill='%23ec4899' opacity='0.3'%3E%3Cpath d='M100 160c-33.137 0-60-26.863-60-60s26.863-60 60-60 60 26.863 60 60-26.863 60-60 60zm0-100c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40z'/%3E%3Ccircle cx='100' cy='100' r='25'/%3E%3C/g%3E%3Cpath fill='%23ec4899' d='M150 80h40v10h-40zM10 80h40v10H10zM100 10v40h-10V10zM100 150v40h-10v-40z'/%3E%3Cpath fill='%23f472b6' d='M160 120l20 20-7 7-20-20zM27 33l20 20-7 7-20-20zM160 73l20-20-7-7-20 20zM27 160l20-20-7-7-20 20z'/%3E%3C/svg%3E"
                        alt="No points"
                        className="w-48 h-48 mx-auto"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Belum ada poin
                    </h3>
                    <p className="text-gray-600">
                      Belum ada poin saat ini. Dapatkan poin dari setiap
                      transaksi
                      <br />
                      dan gunakan untuk belanja berikutnya.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="kadaluarsa" className="mt-6">
                {points > 0 ? (
                  <div className="space-y-4">
                    {expiringTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="bg-white rounded-lg p-4 flex justify-between items-center shadow-sm"
                      >
                        <div>
                          <p className="font-semibold text-gray-900">
                            {transaction.title}
                          </p>
                          <p className="text-sm text-red-500">
                            {transaction.date}
                          </p>
                        </div>
                        <div className="font-bold text-lg text-red-600">
                          {transaction.points.toLocaleString("id-ID")}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mb-6">
                      <img
                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cg fill='%23ec4899' opacity='0.3'%3E%3Cpath d='M100 160c-33.137 0-60-26.863-60-60s26.863-60 60-60 60 26.863 60 60-26.863 60-60 60zm0-100c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40z'/%3E%3Ccircle cx='100' cy='100' r='25'/%3E%3C/g%3E%3Cpath fill='%23ec4899' d='M150 80h40v10h-40zM10 80h40v10H10zM100 10v40h-10V10zM100 150v40h-10v-40z'/%3E%3Cpath fill='%23f472b6' d='M160 120l20 20-7 7-20-20zM27 33l20 20-7 7-20-20zM160 73l20-20-7-7-20 20zM27 160l20-20-7-7-20 20z'/%3E%3C/svg%3E"
                        alt="No points"
                        className="w-48 h-48 mx-auto"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Belum ada poin
                    </h3>
                    <p className="text-gray-600">
                      Belum ada poin saat ini. Dapatkan poin dari setiap
                      transaksi
                      <br />
                      dan gunakan untuk belanja berikutnya.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Tentang Poin MOLA</h2>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {pointInfo.map((info, index) => (
                      <div key={index} className="flex space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center text-2xl">
                          {info.icon}
                        </div>
                        <p className="text-gray-700 flex-1 pt-2">{info.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
