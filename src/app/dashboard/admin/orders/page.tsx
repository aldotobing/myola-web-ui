/** @format */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContexts";
import { useRouter } from "next/navigation";
import {
  Package,
  ArrowLeft,
  Search,
  Loader2,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  Camera,
  X,
} from "lucide-react";
import {
  adminGetAllOrders,
  adminUpdateOrderStatus,
} from "@/lib/service/admin/admin-service";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await adminGetAllOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchData();
  }, [user, router]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      await adminUpdateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o)),
      );
      toast.success("Status pesanan berhasil diperbarui!");
    } catch (error: any) {
      toast.error("Gagal update status: " + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link
            href="/dashboard/admin"
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manajemen Order
            </h1>
            <p className="text-gray-600">
              Pantau dan proses semua transaksi produk & event
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                    Order Number
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">
                    Total Bayar
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y border-gray-100">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-bold text-gray-900">
                        {order.order_number}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900 text-sm">
                        {order.profiles?.full_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {order.profiles?.phone}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-gray-900">
                        Rp {Number(order.total_payment).toLocaleString("id-ID")}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {order.status === "selesai" ? (
                          <span className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                            <CheckCircle2 size={12} /> SELESAI
                          </span>
                        ) : order.status === "sedang_dikirim" ? (
                          <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                            <Truck size={12} /> DIKIRIM
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                            <Clock size={12} /> PROSES
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {order.status === "sedang_diproses" && (
                          <button
                            disabled={updatingId === order.id}
                            onClick={() =>
                              handleUpdateStatus(order.id, "sedang_dikirim")
                            }
                            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            title="Kirim Pesanan"
                          >
                            <Truck size={18} />
                          </button>
                        )}
                        {order.status === "sedang_dikirim" && (
                          <button
                            disabled={updatingId === order.id}
                            onClick={() =>
                              handleUpdateStatus(order.id, "selesai")
                            }
                            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                            title="Selesaikan Pesanan"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        )}
                        {/* <button className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200">
                          <Eye size={18} />
                        </button> */}
                        <Link
                          href={`/dashboard/admin/orders/${order.order_number}`}
                          className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200"
                        >
                          <Eye size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
