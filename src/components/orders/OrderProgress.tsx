/** @format */

"use client";

// components/orders/OrderProgress.tsx
import { Package, Settings, Truck, CheckCircle } from "lucide-react";
import { OrderStatus } from "@/types/order";
import Image from "next/image";

interface OrderProgressProps {
  status: OrderStatus;
}

export default function OrderProgress({ status }: OrderProgressProps) {
  const steps = [
    {
      key: "pesanan_dibuat",
      label: "Pesanan Dibuat",
      image: "/images/Box.png",
    },
    {
      key: "sedang_diproses",
      label: "Sedang Diproses",
      image: "/images/Paid.png",
    },
    {
      key: "sedang_dikirim",
      label: "Sedang Dikirim",
      image: "/images/Delivery Time.png",
    },
    { key: "terkirim", label: "Terkirim", image: "/images/Tick-Box.png" },
  ];

  const statusIndex: Record<OrderStatus, number> = {
    sedang_diproses: 1,
    sedang_dikirim: 2,
    selesai: 3,
  };

  const currentIndex = statusIndex[status] || 0;

  return (
    // <div className="flex items-center justify-between mb-8">
    //   {steps.map((step, index) => {
    //     // const Icon = step.icon;
    //     const isActive = index <= currentIndex;
    //     const isCompleted = index < currentIndex;

    //     return (
    //       <div key={step.key} className="flex items-center flex-1">
    //         <div className="flex flex-col items-center flex-1">
    //           <div
    //             className={`w-16 h-16 rounded-full flex items-center justify-center ${
    //               isActive ? "bg-pink-500" : "bg-pink-100"
    //             }`}
    //           >
    //             {/* <Icon
    //               className={isActive ? "text-white" : "text-pink-300"}
    //               size={28}
    //             /> */}

    //             <Image
    //               src={step.image}
    //               alt={step.label}
    //               width={28}
    //               height={28}
    //               className={isActive ? "opacity-100" : "opacity-50"}
    //             />
    //           </div>
    //           <span
    //             className={`text-xs mt-2 font-medium text-center max-w-[80px] ${
    //               isActive ? "text-gray-900" : "text-gray-400"
    //             }`}
    //           >
    //             {step.label}
    //           </span>
    //         </div>
    //         {index < steps.length - 1 && (
    //           <div
    //             className={`flex-1 h-1 mx-2 ${
    //               isCompleted ? "bg-pink-500" : "bg-pink-100"
    //             }`}
    //           />
    //         )}
    //       </div>
    //     );
    //   })}
    // </div>

    <div className="relative mb-10">
      {/* Background line */}
      <div className="absolute top-8 left-0 right-0 h-1 bg-pink-100 rounded-full" />

      {/* Active progress line */}
      <div
        className="absolute top-8 left-0 h-1 bg-pink-500 rounded-full transition-all"
        style={{
          width: `${(currentIndex / (steps.length - 1)) * 100}%`,
        }}
      />

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isActive = index <= currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center w-24">
              {/* Circle */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? "bg-pink-500" : "bg-pink-100"
                }`}
              >
                <Image
                  src={step.image}
                  alt={step.label}
                  width={28}
                  height={28}
                  className={`transition-all ${
                    isActive ? "opacity-100" : "opacity-40 grayscale"
                  }`}
                />
              </div>

              {/* Label */}
              <span
                className={`mt-3 text-xs font-medium text-center ${
                  isActive ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
