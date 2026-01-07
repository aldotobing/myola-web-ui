/** @format */
"use client";

import { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import OrderCard from "@/components/orders/OrderCard";
import { Order, OrderStatus } from "@/types/order";
import { ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const { getAllOrders } = await import("@/lib/api/pesanan");

export default function PesananPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  //Orders State

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "semua">(
    "semua"
  );

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const result = await getAllOrders();
      setOrders(result);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "semua") return true;
    return order.status === activeFilter;
  });

  //Menu Handlers

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
      href: "/dashboard/kelas",
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

                <button
                  onClick={() => {}}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white text-pink-600 font-medium hover:bg-pink-100 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5 flex-shrink-0" />
                  <span>Pesanan Saya</span>
                </button>

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
                Pesanan Saya
              </p>
              <button className="flex items-center space-x-2 text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
                <span>Filter</span>
                <ChevronDown size={20} />
              </button>
            </div>

            <Tabs
              defaultValue="semua"
              className="mb-6"
              onValueChange={(value) =>
                setActiveFilter(value as OrderStatus | "semua")
              }
            >
              <TabsList className="bg-transparent p-0 h-auto flex w-full overflow-x-auto overflow-y-hidden no-scrollbar justify-start space-x-2 pb-2">
                <TabsTrigger
                  value="semua"
                  className="bg-pink-100 text-pink-500 px-6 py-2 rounded-lg font-medium data-[state=active]:bg-pink-500 data-[state=active]:text-white"
                >
                  Semua
                </TabsTrigger>
                <TabsTrigger
                  value="sedang_diproses"
                  className="bg-pink-100 text-pink-500 px-6 py-2 rounded-lg font-medium data-[state=active]:bg-pink-500 data-[state=active]:text-white whitespace-nowrap"
                >
                  Sedang Diproses
                </TabsTrigger>
                <TabsTrigger
                  value="sedang_dikirim"
                  className="bg-pink-100 text-pink-500 px-6 py-2 rounded-lg font-medium data-[state=active]:bg-pink-500 data-[state=active]:text-white whitespace-nowrap"
                >
                  Sedang Dikirim
                </TabsTrigger>
                <TabsTrigger
                  value="selesai"
                  className="bg-pink-100 text-pink-500 px-6 py-2 rounded-lg font-medium data-[state=active]:bg-pink-500 data-[state=active]:text-white"
                >
                  Selesai
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Tidak ada pesanan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
