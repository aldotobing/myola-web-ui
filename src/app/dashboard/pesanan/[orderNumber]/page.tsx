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
import {
  confirmOrderDelivery,
  getOrderByNumber,
} from "@/lib/service/member/pesanan";
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

            {/* Hubungi Penjual */}
            <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-6 mt-6">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-800">
                  Punya pertanyaan tentang pesanan ini?
                </p>
                <a
                  href="https://wa.me/6289612756458"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Chat Penjual
                </a>
              </div>
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
