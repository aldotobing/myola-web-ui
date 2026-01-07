/** @format */
"use client";

import { EventOrder } from "@/types/event";
import { Calendar, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface EventOrderCardProps {
  order: EventOrder;
}

export default function EventOrderCard({ order }: EventOrderCardProps) {
  const getStatusBadge = () => {
    switch (order.status) {
      case "sedang_diproses":
        return (
          <span className="px-4 py-2 bg-yellow-500 rounded-full text-white  text-sm font-semibold">
            Sedang Diproses
          </span>
        );
      case "aktif":
        return (
          <span className="px-4 py-2 bg-blue-500  text-white rounded-full text-sm font-semibold">
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* Header */}

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <ShoppingBag className="text-gray-600" size={24} />
          <div>
            <p className="font-semibold">Order Number : {order.orderNumber}</p>
            <p className="text-sm text-gray-500">{order.eventDate}</p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Event Info */}
      <p className="text-lg font-bold text-gray-900 mb-2">{order.eventTitle}</p>
      <p className="text-gray-600 text-sm mb-1">
        Rp {order.items[0]?.price.toLocaleString("id-ID")}
      </p>
      <p className="text-gray-500 text-sm mb-4">
        Quantity : {order.items[0]?.quantity || 1}
      </p>

      {/* Total */}
      <div className="border-t pt-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">Total Bayar</p>
          <p className="text-xl font-bold text-gray-900">
            Rp {order.totalPayment.toLocaleString("id-ID")}
          </p>
        </div>
        <Link
          href={`/dashboard/event/${order.orderNumber}`}
          className="px-5 py-2.5 bg-pink-500 text-white rounded-lg text-sm font-semibold hover:bg-pink-600 transition-colors"
        >
          Detail
        </Link>
      </div>
    </div>
  );
}
