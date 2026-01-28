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
  Filter,
  Calendar,
  ArrowLeft,
  Phone,
  Mail,
  Download,
  Send,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
  getEventOrderByNumber,
  downloadETicket,
  resendETicket,
} from "@/lib/service/member/events";
import { EventOrder } from "@/types/event";

export default function EventDetailPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  //GET USE STATE EVENT ORDERS
  const params = useParams<{ orderNumber: string }>();
  const orderNumber = params.orderNumber;
  const [order, setOrder] = useState<EventOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingTicket, setDownloadingTicket] = useState(false);
  const [resendingTicket, setResendingTicket] = useState(false);

  useEffect(() => {
    if (orderNumber) {
      loadOrder();
    }
  }, [orderNumber]);

  const loadOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEventOrderByNumber(orderNumber);
      if (data) {
        setOrder(data);
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

  const handleDownloadTicket = async () => {
    if (!order) return;

    setDownloadingTicket(true);
    try {
      const result = await downloadETicket(order.orderNumber);
      if (result.success && result.url) {
        // Open in new tab or trigger download
        window.open(result.url, "_blank");
      } else {
        alert(result.error || "Failed to download ticket");
      }
    } catch (error) {
      console.error("Error downloading ticket:", error);
      alert("Failed to download e-ticket");
    } finally {
      setDownloadingTicket(false);
    }
  };

  const handleResendTicket = async () => {
    if (!order) return;

    setResendingTicket(true);
    try {
      const result = await resendETicket(order.orderNumber);
      if (result.success) {
        alert(result.message || "E-ticket sent successfully");
      } else {
        alert(result.error || "Failed to send ticket");
      }
    } catch (error) {
      console.error("Error resending ticket:", error);
      alert("Failed to resend e-ticket");
    } finally {
      setResendingTicket(false);
    }
  };

  const handleBackToList = () => {
    router.push("/dashboard/event");
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

  //Status Badge Function
  const getStatusBadge = () => {
    if (!order) return null;

    switch (order.status) {
      case "sedang_diproses":
        return (
          <span className="px-4 py-2 bg-yellow-500 rounded-full text-white  text-sm font-semibold">
            Sedang Diproses
          </span>
        );
      case "aktif":
        return (
          <span className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold">
            Aktif
          </span>
        );
      case "selesai":
        return (
          <span className="px-4 py-2 bg-green-500 text-white rounded-full text-sm font-semibold">
            Selesai
          </span>
        );
      default:
        return null;
    }
  };

  // Conditional returns after all hooks

  if (!user?.isLoggedIn) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">
            {error || "Order not found"}
          </p>
          <button
            onClick={handleBackToList}
            className="text-pink-500 hover:text-pink-600 font-semibold"
          >
            Kembali ke Event Saya
          </button>
        </div>
      </div>
    );
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

                <button
                  onClick={() => {}}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white text-pink-600 font-medium hover:bg-pink-100 transition-colors"
                >
                  <Megaphone className="w-5 h-5 flex-shrink-0" />
                  <span>Event Saya</span>
                </button>

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
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handleBackToList}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <p className="text-2xl font-bold text-gray-900">
                No. Orderan : {order.orderNumber}
              </p>
            </div>

            {/* E-Ticket Notice */}
            {order.hasETicket && order.eTicketSent && (
              <div className="bg-pink-600 text-white rounded-lg p-4 mb-6">
                <p className="font-bold mb-2">
                  Cek email untuk mendapatkan e-tiketmu!
                </p>
                <p className="text-sm font-semibold">
                  Kami sudah mengirimkan e-tiket ke alamat email yang kamu
                  gunakan saat pemesanan. Pastikan juga cek folder spam atau
                  promosi, ya!
                </p>
              </div>
            )}

            {/* Order Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">No. Orderan</p>
                  <p className="font-bold text-gray-900">{order.orderNumber}</p>
                </div>
                <div>{getStatusBadge()}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-600">Tanggal Order</p>
                  <p className="font-semibold text-gray-900 leading-none">
                    {order.orderDate}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-600">Metode Pembayaran</p>
                  <p className="font-semibold text-gray-900 leading-none">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Detail Pemesanan
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User2Icon className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold">{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{order.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{order.customerEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <p className="text-xl font-bold text-gray-900 mb-4">
                Rincian Event
              </p>

              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="font-bold text-gray-900 mb-2">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Quantity : {item.quantity}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}

              {/* Payment Summary */}
              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    Rp {order.subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
                {order.redeemPoints > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Redeem Poin</span>
                    <span className="font-semibold">
                      {order.redeemPoints.toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t">
                  <span>Total Bayar</span>
                  <span>Rp {order.totalPayment.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>

            {/* E-Ticket Actions */}
            {order.hasETicket && (
              <div className="flex gap-3">
                <button
                  onClick={handleDownloadTicket}
                  disabled={downloadingTicket}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {downloadingTicket ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Download E-Ticket</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleResendTicket}
                  disabled={resendingTicket}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-pink-500 text-pink-500 rounded-lg font-semibold hover:bg-pink-50 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {resendingTicket ? (
                    <>
                      <div className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Kirim Ulang</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
