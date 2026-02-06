/** @format */

//orders/[orderNumber]/page.tsx

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContexts";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Order } from "@/types/order";
import OrderProgress from "@/components/orders/OrderProgress";
import { confirmOrderDelivery } from "@/lib/service/member/pesanan";

import DeliveryProofModal from "@/components/orders/DeliveryProofModal";
import {
  adminGetOrderByNumber,
  adminUpdateOrderStatus,
} from "@/lib/service/admin/admin-service";
import { toast } from "sonner";

export default function OrderDetailPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [updatingId, setUpdatingId] = useState<string | number | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

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
      const result = await adminGetOrderByNumber(orderNumber);

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
    router.push("/dashboard/admin/orders");
  };

  //Modal Delivery Photo Upload State

  const [showProofModal, setShowProofModal] = useState(false);

  const handleUpdateStatus = async (
    orderId: string | number,
    status: string,
  ) => {
    setUpdatingId(orderId);
    try {
      await adminUpdateOrderStatus(orderId.toString(), status);

      // Update order + notification
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            return {
              ...o,
              status,
              notification: {
                type: status === "selesai" ? "selesai" : "confirmation",
                message:
                  status === "selesai"
                    ? "Bukti barang diterima."
                    : "Menunggu konfirmasi dari pembeli",
              },
            };
          }
          return o;
        }),
      );

      toast.success("Status pesanan berhasil diperbarui!");
      setTimeout(() => window.location.reload(), 500); // Kasih waktu toast muncul
    } catch (error: any) {
      toast.error("Gagal update status: " + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // ===== CONDITIONAL RETURNS (AFTER ALL HOOKS) =====
  if (!!!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                      ? "Siap kirim pesanan?"
                      : (order.notification.type as string) === "confirmation"
                        ? "Menunggu konfirmasi penerimaan"
                        : (order.notification.type as string) === "selesai"
                          ? "Pesanan sudah diterima"
                          : "Pesanan Selesai"}
                  </p>
                  {order.status === "sedang_diproses" && (
                    <button
                      disabled={updatingId === order.id}
                      onClick={() =>
                        handleUpdateStatus(order.id, "sedang_dikirim")
                      }
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg  hover:bg-blue-600 disabled:opacity-50"
                      title="Kirim Pesanan"
                      type="button"
                    >
                      Kirim Pesanan
                    </button>
                  )}
                  {order.status === "sedang_dikirim" && (
                    <button
                      disabled={updatingId === order.id}
                      onClick={() => handleUpdateStatus(order.id, "selesai")}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                      title="Selesaikan Pesanan"
                      type="button"
                    >
                      Selesaikan Pesanan
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

          <DeliveryProofModal
            isOpen={showProofModal}
            onClose={() => setShowProofModal(false)}
            imageUrl={
              order.deliveryProof ||
              "https://upload.wikimedia.org/wikipedia/commons/5/59/Empty.png"
            }
            orderNumber={order.orderNumber}
          />
        </div>
      </div>
    </div>
  );
}
