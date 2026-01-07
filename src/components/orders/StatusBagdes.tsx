/** @format */
"use client";

// components/orders/StatusBadge.tsx
import { OrderStatus } from "@/types/order";

interface StatusBadgeProps {
  status: OrderStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<OrderStatus, { bg: string; text: string }> = {
    sedang_diproses: { bg: "bg-yellow-500", text: "Sedang Diproses" },
    sedang_dikirim: { bg: "bg-blue-500", text: "Sedang Dikirim" },
    selesai: { bg: "bg-green-500", text: "Selesai" },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`${config.bg} text-white px-4 py-2 rounded-full text-sm font-medium`}
    >
      {config.text}
    </span>
  );
}
