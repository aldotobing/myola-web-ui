/** @format */
"use client";

// components/orders/OrderCard.tsx
import { Handbag } from "lucide-react";
import Link from "next/link";
import { Order } from "@/types/order";
import StatusBadge from "./StatusBagdes";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <Handbag className="text-gray-600" size={24} />
          <div>
            <p className="font-semibold">Order Number : {order.orderNumber}</p>
            <p className="text-sm text-gray-500">{order.date}</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <img
          src={order.items[0].image}
          alt={order.items[0].name}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{order.items[0].name}</h3>
          <p className="text-sm text-gray-900 font-medium">
            Rp {order.items[0].price.toLocaleString("id-ID")}
          </p>
          <p className="text-sm text-gray-500">
            Quantity : {order.items[0].quantity}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <div>
          <p className="text-sm text-gray-600">Total Bayar</p>
          <p className="text-xl font-bold">
            Rp {order.totalAmount.toLocaleString("id-ID")}
          </p>
        </div>
        <Link
          href={`/dashboard/pesanan/${order.orderNumber}`}
          className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600"
        >
          Detail
        </Link>
      </div>
    </div>
  );
}
