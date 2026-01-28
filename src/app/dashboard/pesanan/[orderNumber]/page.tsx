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
  ArrowLeft,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import OrderCard from "@/components/orders/OrderCard";
import { Order } from "@/types/order";
import OrderProgress from "@/components/orders/OrderProgress";
import { confirmOrderDelivery, getOrderByNumber } from "@/lib/service/member/pesanan";
import DeliveryConfirmationModal from "@/components/orders/DeliveryConfirmationModal";
import DeliveryProofModal from "@/components/orders/DeliveryProofModal";

// interface OrderDetailPageProps {
//   params: {
//     orderNumber: string;
//   };
// }

export default function OrderDetailPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  //Orders Detail State

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams<{ orderNumber: string }>();
  const orderNumber = params.orderNumber;

  useEffect(() => {
    if (!orderNumber) return;
    loadOrderDetail(orderNumber);
  }, [orderNumber]);

  const loadOrderDetail = async (orderNumber: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await getOrderByNumber(orderNumber);

      if (result) {
        setOrder(result);
      } else {
        setError("Order not found");
      }
    } catch (err) {
      console.error("Error loading order:", err);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    router.push("/dashboard/pesanan");
  };

  //Modal Delivery Photo Upload State

  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleDeliveryConfirm = async (photoFile: File) => {
    setIsConfirming(true);

    try {
      const result = await confirmOrderDelivery(orderNumber, photoFile);

      if (result.success && result.order) {
        setOrder(result.order);
        setShowDeliveryModal(false);
        // Show success notification (toast)
      } else {
        // Show error notification
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error confirming delivery:", error);
    } finally {
      setIsConfirming(false);
    }
  };

  // ===== CONDITIONAL RETURNS (AFTER ALL HOOKS) =====
  if (!!!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        \
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <p className="mt-2 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error || "Order not found"}</p>
            <button
              onClick={handleBackToList}
              className="mt-4 text-pink-500 hover:text-pink-600 underline"
            >
              Kembali ke Daftar Pesanan
            </button>
          </div>
        </div>
      </div>
    );
  }

  //Menu Handlers

  const handlesignOut = () => {
    signOut();
    router.push("/");
  };

  const handleMenuClick = (href: string) => {
    router.push(href);
    setShowMobileMenu(false);
  };

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
            {/* Header */}
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={handleBackToList}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <p className="text-2xl font-bold">
                No. Orderan : {order.orderNumber}
              </p>
            </div>

            {/* Progress Tracker */}
            <OrderProgress status={order.status} />

            {/* Notification */}
            {order.notification && (
              <div className="bg-pink-50 border-2 border-pink-500 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <p className="text-gray-800 font-semibold">
                    {order.notification.type === "info"
                      ? "Pesanan sudah sampai?"
                      : "Pesanan Selesai"}
                  </p>
                  {order.status === "sedang_diproses" && (
                    <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600">
                      Sedang Diproses
                    </button>
                  )}
                  {order.status === "sedang_dikirim" && (
                    <button
                      onClick={() => setShowDeliveryModal(true)}
                      className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-600"
                    >
                      Pesanan Diterima
                    </button>
                  )}
                  {order.status === "selesai" && (
                    <button
                      onClick={() => setShowProofModal(true)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600"
                    >
                      Bukti Diterima
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {order.notification.message}
                </p>
              </div>
            )}

            <div className="bg-white rounded-lg p-6 shadow-sm">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">No. Orderan</p>
                  <p className="font-semibold">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tanggal Order</p>
                  <p className="font-semibold">{order.date}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Alamat Pengiriman</p>
                <p className="font-semibold">{order.customerName}</p>
                <p className="text-gray-700">{order.customerPhone}</p>
                <p className="text-gray-700">{order.address}</p>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Metode Pembayaran</p>
                <p className="font-semibold">{order.paymentMethod}</p>
              </div>
            </div>

            {/* Track Order */}
            <div className="border border-gray-300 rounded-lg p-4 mb-6 mt-6 flex justify-between items-center">
              <p className="font-medium">Lacak pesananmu disini</p>
              <button className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-600 transition-colors">
                Lacak
              </button>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <p className="text-xl font-bold mb-4">Rincian Pesanan</p>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>
                      <p className="text-sm text-pink-500">
                        Cashback {item.cashback.toLocaleString("id-ID")} Poin
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="font-bold">
                        Rp{" "}
                        {(item.price * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="border-t pt-6  ">
              <div className="space-y-3 gap-8">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal Produk</span>
                  <span className="font-semibold">
                    Rp {order.subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Redeem Poin</span>
                  <span className="font-semibold">
                    {order.redeemPoints.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Pesanan</span>
                  <span className="font-semibold">
                    Rp {order.totalPayment.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PPN</span>
                  <span className="font-semibold">
                    Rp {order.ppn.toLocaleString("id-ID")}
                  </span>
                </div>
                {order.shippingCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya Pengiriman</span>
                    <span className="font-semibold">
                      Rp {order.shippingCost.toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t-2 border-gray-300">
                  <span className="text-lg font-bold">Total Bayar</span>
                  <span className="text-lg font-bold">
                    Rp{" "}
                    {(
                      order.totalPayment +
                      order.ppn +
                      order.shippingCost
                    ).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* MODAL */}
          <DeliveryConfirmationModal
            isOpen={showDeliveryModal}
            onClose={() => setShowDeliveryModal(false)}
            onConfirm={handleDeliveryConfirm}
            orderNumber={order.orderNumber}
            isLoading={isConfirming}
          />

          <DeliveryProofModal
            isOpen={showProofModal}
            onClose={() => setShowProofModal(false)}
            imageUrl={order.deliveryProof || ""}
            orderNumber={order.orderNumber}
          />
        </div>
      </div>
    </div>
  );
}
