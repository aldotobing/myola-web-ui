/** @format */

// components/cart/AddToCartToast.tsx
"use client";

import { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

interface AddToCartToastProps {
  isVisible: boolean;
  onClose: () => void;
  productName: string;
}

export default function AddToCartToast({
  isVisible,
  onClose,
  productName,
}: AddToCartToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-white rounded-xl shadow-2xl p-4 flex items-center gap-3 border-l-4 border-green-500 min-w-[320px]">
        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-bold text-gray-900">
            Item ditambahkan ke keranjang tes
          </p>
          <p className="text-sm text-gray-600 truncate">{productName}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
