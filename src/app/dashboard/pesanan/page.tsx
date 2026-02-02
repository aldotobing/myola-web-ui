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
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import OrderCard from "@/components/orders/OrderCard";
import { Order, OrderStatus } from "@/types/order";
import { ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllOrders } from "@/lib/service/member/pesanan";
import useSWR from "swr";

export default function PesananPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "semua">(
    "semua",
  );

  // Use SWR for Resilient Fetching
  const { data: orders = [], isLoading: loading } = useSWR(
    user ? ["user-orders", user.id] : null,
    () => getAllOrders(user?.id),
  );

  const filteredOrders = (orders as Order[]).filter((order) => {
    if (activeFilter === "semua") return true;
    return order.status === activeFilter;
  });

  const handleMenuClick = (href: string) => {
    router.push(href);
    setShowMobileMenu(false);
  };

  if (!user) return null;

  const menuItems = [
    { icon: FileText, label: "Profile", href: "/dashboard/profil" },
    { icon: Coins, label: "Poin MYOLA", href: "/dashboard/poin-myola" },
    { icon: ShoppingCart, label: "Pesanan Saya", href: "/dashboard/pesanan" },
    { icon: MonitorPlayIcon, label: "Kelas Saya", href: "/dashboard/kelas" },
    { icon: Megaphone, label: "Event Saya", href: "/dashboard/event" },
    { icon: MapIcon, label: "Alamat Pengiriman", href: "/dashboard/alamat" },
    {
      icon: Settings2Icon,
      label: "Pengaturan Akun",
      href: "/dashboard/pengaturan-akun",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex justify-between items-center h-16 px-4">
          <h1 className="text-lg font-bold text-gray-900">Pesanan Saya</h1>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-3 flex items-center gap-3 border-b bg-pink-50">
            <Wallet className="w-5 h-5 text-pink-600" />
            <div>
              <p className="text-xs text-gray-600">Poin </p>
              <p className="font-bold text-gray-900">
                {user.points_balance?.toLocaleString() || "0"}
              </p>
            </div>
          </div>
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleMenuClick(item.href)}
              className="w-full flex items-center gap-3 px-4 py-3 border-b hover:bg-gray-50 text-left"
            >
              <item.icon size={18} className="text-pink-500" />
              <span className="font-medium text-gray-800 text-sm">
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
            <div className="bg-pink-50 rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {user.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">
                    {user.full_name}
                  </h3>
                  <span className="inline-block bg-pink-500 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase">
                    Member
                  </span>
                </div>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      item.href === "/dashboard/pesanan"
                        ? "bg-white text-pink-600 shadow-sm"
                        : "text-gray-700 hover:bg-white hover:text-pink-600"
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Pesanan Saya
              </h2>
            </div>

            <Tabs
              defaultValue="semua"
              className="w-full"
              onValueChange={(value) => setActiveFilter(value as any)}
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
                  className="bg-pink-50 text-pink-500 px-6 py-2 rounded-lg font-medium data-[state=active]:bg-pink-500 data-[state=active]:text-white whitespace-nowrap"
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

              <TabsContent value={activeFilter} className="mt-4">
                {loading && orders.length === 0 ? (
                  <div className="py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-pink-500 mx-auto" />
                  </div>
                ) : filteredOrders.length > 0 ? (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                    <ShoppingCart
                      size={48}
                      className="mx-auto text-gray-200 mb-4"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Belum ada pesanan
                    </h3>
                    <p className="text-gray-500">
                      Mulai belanja produk favorit Anda sekarang!
                    </p>
                    <Link
                      href="/store"
                      className="inline-block mt-6 px-8 py-3 bg-pink-500 text-white font-bold rounded-xl shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all"
                    >
                      Buka Toko
                    </Link>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
