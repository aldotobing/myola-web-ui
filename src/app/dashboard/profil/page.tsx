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
} from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    birthPlace: "",
    birthDate: "",
    email: "",
    phone: "",
    idNumber: "",
  });

  //   useEffect(() => {
  //     if (!user?.isLoggedIn) {
  //       router.push("/auth/login");
  //     } else {
  //       setFormData((prev) => ({
  //         ...prev,
  //         fullName: user.name || "Susi Susanti",
  //         email: user.email || "",
  //       }));
  //     }
  //   }, [user, router]);

  //Preview KTP State
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  //Input Change Handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedUser = {
        ...user!,
        name: formData.fullName,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Profil berhasil diperbarui!");
    } catch (error) {
      alert("Gagal memperbarui profil");
    } finally {
      setIsLoading(false);
    }
  };

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
            <div className="bg-pink-50 rounded-2xl p-6 sticky ">
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
              Profil
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

                <Link
                  href="/dashboard/profil/membership-detail"
                  className="bg-pink-500 text-white px-4 md:px-6 py-2 rounded-lg font-semibold hover:bg-pink-600 transition-colors text-sm whitespace-nowrap"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Membership Card */}

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Nama Lengkap */}
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors text-sm"
                    />
                  </div>

                  {/* Jenis Kelamin */}
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                      Jenis Kelamin
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors text-sm"
                    >
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                  </div>

                  {/* Tempat Lahir */}
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                      Tempat Lahir
                    </label>
                    <input
                      type="text"
                      name="birthPlace"
                      value={formData.birthPlace}
                      onChange={handleInputChange}
                      placeholder="Surabaya"
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors text-sm"
                    />
                  </div>

                  {/* Tanggal Lahir */}
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors text-sm"
                    />
                  </div>

                  {/* No. HP */}
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                      No. HP
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors text-sm"
                    />
                  </div>

                  {/* No. KTP */}
                  <div className="md:col-span-2">
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                      No. KTP
                    </label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-500 transition-colors text-sm"
                    />
                  </div>

                  {/* Foto KTP */}
                  <div className="md:col-span-2">
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                      Foto KTP
                    </label>

                    {/* Upload Area */}
                    {/* Upload Area */}
                    <label
                      htmlFor="ktp-upload"
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-8 text-center hover:border-pink-500 transition-colors cursor-pointer block"
                    >
                      {preview ? (
                        <div className="relative w-full h-48">
                          <Image
                            src={preview}
                            alt="Preview KTP"
                            fill
                            className="object-contain rounded-md"
                          />
                        </div>
                      ) : (
                        <>
                          <svg
                            className="mx-auto h-10 w-10 md:h-12 md:w-12 text-gray-400 mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          <p className="text-xs md:text-sm text-gray-600">
                            Klik atau drag untuk upload foto KTP
                          </p>
                        </>
                      )}
                    </label>

                    <input
                      id="ktp-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 md:px-8 py-2 md:py-3 rounded-lg font-bold text-white transition-all text-sm ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                    }`}
                  >
                    {isLoading ? "Loading..." : "Simpan"}
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
