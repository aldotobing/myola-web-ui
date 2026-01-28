/** @format */
"use client";

import { useEffect, useState } from "react";
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
  Plus,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setPrimaryAddress,
} from "@/lib/service/member/addresses";
import { Address, AddressFormData } from "@/types/address";
import AddressCard from "@/components/addresses/AddressCard";
import AddressFormModal from "@/components/addresses/AddressFormModal";

export default function AlamatPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  //ADDRESS HANDLER STATE

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const data = await getUserAddresses();
      setAddresses(data);
    } catch (error) {
      console.error("Error loading addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setShowModal(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setShowModal(true);
  };

  const handleSubmit = async (data: AddressFormData) => {
    setModalLoading(true);
    try {
      if (editingAddress) {
        // Update existing address
        const result = await updateAddress(editingAddress.id, data);
        if (result.success) {
          await loadAddresses();
          setShowModal(false);
          alert("Alamat berhasil diperbarui!");
        } else {
          alert(result.error || "Gagal memperbarui alamat");
        }
      } else {
        // Create new address
        const result = await createAddress(data);
        if (result.success) {
          await loadAddresses();
          setShowModal(false);
          alert("Alamat berhasil ditambahkan!");
        } else {
          alert(result.error || "Gagal menambahkan alamat");
        }
      }
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editingAddress) return;

    if (
      !confirm(
        `Apakah Anda yakin ingin menghapus alamat "${editingAddress.label}"?`
      )
    ) {
      return;
    }

    setModalLoading(true);
    try {
      const result = await deleteAddress(editingAddress.id);
      if (result.success) {
        await loadAddresses();
        setShowModal(false);
        alert("Alamat berhasil dihapus!");
      } else {
        alert(result.error || "Gagal menghapus alamat");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleSetPrimary = async (addressId: string) => {
    try {
      const result = await setPrimaryAddress(addressId);
      if (result.success) {
        await loadAddresses();
        alert("Alamat utama berhasil diubah!");
      } else {
        alert(result.error || "Gagal mengubah alamat utama");
      }
    } catch (error) {
      console.error("Error setting primary address:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  //MENU HANDLER STATE

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

                <button
                  onClick={() => {}}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white text-pink-600 font-medium hover:bg-pink-100 transition-colors"
                >
                  <MapIcon className="w-5 h-5 flex-shrink-0" />
                  <span>Alamat Pengiriman</span>
                </button>

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
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-xl md:text-3xl font-bold text-gray-900">
                Alamat Pengiriman
              </p>
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 px-5 py-2.5 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Tambah Alamat Baru</span>
                <span className="sm:hidden">Tambah</span>
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
              </div>
            )}

            {/* Address List */}
            {!loading && addresses.length > 0 && (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    onEdit={handleEdit}
                    onDelete={(id) => {
                      setEditingAddress(address);
                      handleDelete();
                    }}
                    onSetPrimary={handleSetPrimary}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && addresses.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-12">
                <div className="text-center">
                  <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-12 h-12 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Belum ada alamat pengiriman
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Tambahkan alamat pengirimanmu untuk mempermudah proses
                    transaksi.
                  </p>
                  <button
                    onClick={handleAddNew}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Tambah Alamat Baru</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      <AddressFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        onDelete={editingAddress ? handleDelete : undefined}
        address={editingAddress}
        isLoading={modalLoading}
        isEdit={!!editingAddress}
      />
    </div>
  );
}
