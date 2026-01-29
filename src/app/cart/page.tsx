/** @format */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/app/contexts/CartContexts";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getTotalCashback } = useCart();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedItems(cart.items.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId]);
    } else {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
      setSelectAll(false);
    }
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      removeFromCart(itemId);
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    }
  };

  const calculateSelectedTotal = () => {
    return cart.items
      .filter((item) => selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculatePPN = (subtotal: number) => {
    return Math.round(subtotal * 0.11); // 11% PPN
  };

  const selectedSubtotal = calculateSelectedTotal();
  const ppn = calculatePPN(selectedSubtotal);
  const totalBayar = selectedSubtotal + ppn;

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Pilih minimal 1 item untuk checkout");
      return;
    }

    // Store selected items for checkout
    const selectedCartItems = cart.items.filter((item) =>
      selectedItems.includes(item.id)
    );
    localStorage.setItem("checkout_items", JSON.stringify(selectedCartItems));

    router.push("/checkout");
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Keranjang Anda Kosong
            </h2>
            <p className="text-gray-600 mb-6">
              Yuk, mulai belanja dan tambahkan produk ke keranjang!
            </p>
            <Link
              href="/store"
              className="inline-block px-8 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors"
            >
              Belanja Sekarang
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Keranjang
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Select All */}
            <div className="bg-white rounded-xl p-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="selectAll"
                checked={selectAll}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="w-5 h-5 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
              />
              <label
                htmlFor="selectAll"
                className="font-bold text-gray-900 cursor-pointer"
              >
                Pilih Semua
              </label>
            </div>

            {/* Cart Items List */}
            {cart.items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) =>
                      handleSelectItem(item.id, e.target.checked)
                    }
                    className="w-5 h-5 text-pink-500 border-gray-300 rounded focus:ring-pink-500 mt-2"
                  />

                  {/* Product Image */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">
                      {item.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-900 mb-1">
                      Rp {item.price.toLocaleString("id-ID")}
                    </p>
                    <p className="text-sm text-pink-500 mb-3">
                      Cashback {item.cashback.toLocaleString("id-ID")} Poin
                    </p>

                    {/* Quantity Controls & Delete */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border-2 border-pink-500 rounded-lg">
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-pink-50 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-pink-500" />
                        </button>
                        <span className="px-4 font-semibold text-pink-500 min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-pink-50 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-pink-500" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Item Total (Desktop) */}
                  <div className="hidden sm:block text-right">
                    <p className="font-bold text-gray-900 text-lg">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

                {/* Item Total (Mobile) */}
                <div className="sm:hidden mt-3 pt-3 border-t text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-bold text-gray-900 text-lg">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-pink-50 rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Ringkasan Belanja
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal Produk</span>
                  <span className="font-semibold">
                    Rp {selectedSubtotal.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Total Pesanan</span>
                  <span className="font-semibold">
                    Rp {selectedSubtotal.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>PPN</span>
                  <span className="font-semibold">
                    Rp {ppn.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="pt-3 border-t-2 border-pink-200 flex justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    Total Bayar
                  </span>
                  <span className="text-xl font-bold text-pink-500">
                    Rp {totalBayar.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-xl transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Beli ({selectedItems.length})
              </button>

              {selectedItems.length === 0 && (
                <p className="text-center text-sm text-gray-600 mt-3">
                  Pilih minimal 1 item untuk checkout
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
