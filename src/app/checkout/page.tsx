/** @format */
"use client";

// app/checkout/page.tsx

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { isMemberActive, useAuth } from "@/app/contexts/AuthContexts";
import { getUserAddresses } from "@/lib/service/member/addresses";
import { Address } from "@/types/address";
import { CartItem } from "@/types/cart";
import AddressFormModal from "@/components/addresses/AddressFormModal";
import { createAddress } from "@/lib/service/member/addresses";
import { AddressFormData } from "@/types/address";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();

  // User status checks
  const isLoggedIn = !!user || false;
  const isMember = isLoggedIn && isMemberActive(user?.memberUntil);

  // Feature eligibility based on user status
  const isEligibleCashback = isMember; // Only active members get cashback
  const canRedeemPoints = isMember; // Only active members can redeem points

  // All hooks at top
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [useExistingAddress, setUseExistingAddress] = useState(true);
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressModalLoading, setAddressModalLoading] = useState(false);

  useEffect(() => {
    // Load checkout items from localStorage
    const storedItems = localStorage.getItem("checkout_items");
    if (storedItems) {
      setCheckoutItems(JSON.parse(storedItems));
    } else {
      // Redirect back to cart if no items
      router.push("/cart");
      return;
    }

    // Load addresses only if logged in
    if (isLoggedIn) {
      loadAddresses();
    } else {
      setLoading(false);
    }
  }, []);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const data = await getUserAddresses();
      setAddresses(data);
      // Auto select primary address
      const primary = data.find((addr) => addr.isPrimary);
      if (primary) {
        setSelectedAddress(primary);
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (data: AddressFormData) => {
    setAddressModalLoading(true);
    try {
      const result = await createAddress(data);
      if (result.success && result.address) {
        await loadAddresses();
        setSelectedAddress(result.address);
        setShowAddressModal(false);
        alert("Alamat berhasil ditambahkan!");
      } else {
        alert(result.error || "Gagal menambahkan alamat");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setAddressModalLoading(false);
    }
  };

  // Calculations
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalAfterRedeem = Math.max(0, subtotal - redeemPoints);
  const ppn = Math.round(totalAfterRedeem * 0.11);
  const shippingCost = 32000; // Fixed shipping
  const totalBayar = totalAfterRedeem + ppn + shippingCost;
  // Cashback: only for active members
  const totalCashback = isEligibleCashback
    ? checkoutItems.reduce(
        (sum, item) => sum + item.cashback * item.quantity,
        0
      )
    : 0;

  const handleRedeemChange = (value: string) => {
    if (!canRedeemPoints) return;

    const numValue = parseInt(value) || 0;
    const userPoints = user?.points_balance || 0;
    const maxRedeem = Math.min(userPoints, subtotal);
    setRedeemPoints(Math.min(numValue, maxRedeem));
  };

  const handlePayment = async () => {
    // Check if address is filled
    if (
      !selectedAddress ||
      !selectedAddress.recipientName ||
      !selectedAddress.phoneNumber ||
      !selectedAddress.fullAddress
    ) {
      alert("Silakan lengkapi informasi pengiriman");
      return;
    }

    const phoneDigits = selectedAddress.phoneNumber.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      alert("Nomor HP minimal 10 digit");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order in database first
      const response = await fetch("/api/member/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: checkoutItems,
          subtotal: subtotal,
          redeemPoints: redeemPoints,
          totalAfterRedeem: totalAfterRedeem,
          ppn: ppn,
          shippingCost: shippingCost,
          totalBayar: totalBayar,
          totalCashback: totalCashback,
          address: selectedAddress,
          paymentMethod: "QRIS", // Default for now
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Failed to create order");

      // 2. Store payment data for payment page
      const paymentData = {
        type: "product",
        orderNumber: result.orderNumber,
        subtotal: subtotal,
        totalBayar: totalBayar,
        totalCashback: totalCashback,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("payment_data", JSON.stringify(paymentData));
      localStorage.removeItem("checkout_items");

      // 3. Redirect to payment selection
      router.push("/payment/select");
    } catch (error: any) {
      alert("Gagal memproses pesanan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // if (!!!user) {
  //   return null; // redirect sudah di-handle useEffect
  // }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Checkout
        </h1>

        {/* Guest Warning */}
        {!isLoggedIn && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                i
              </div>
              <div className="flex-1">
                <p className="font-semibold text-blue-900 mb-1">
                  Login untuk checkout lebih mudah
                </p>
                <p className="text-sm text-blue-700 mb-2">
                  Dengan login, kamu bisa menyimpan alamat, menggunakan poin,
                  dan mendapatkan cashback.
                </p>
                <Link
                  href="/auth/login?redirect=/checkout"
                  className="inline-block text-sm font-semibold text-blue-600 hover:text-blue-700 underline"
                >
                  Login Sekarang →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Non-Member Warning */}
        {isLoggedIn && !isMember && (
          <div className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                ⚡
              </div>
              <div className="flex-1">
                <p className="font-semibold text-orange-900 mb-1">
                  Membership belum aktif atau sudah berakhir
                </p>
                <p className="text-sm text-orange-700 mb-2">
                  Gabung member untuk dapatkan cashback poin dan bisa redeem
                  poin di setiap pembelian!
                </p>
                <Link
                  href="/join-member"
                  className="inline-block text-sm font-semibold text-orange-600 hover:text-orange-700 underline"
                >
                  Join Member Sekarang →
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Rincian Pesanan
              </h2>
              <div className="space-y-4">
                {checkoutItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 pb-4 border-b last:border-0"
                  >
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-1">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Rp {item.price.toLocaleString("id-ID")}
                      </p>
                      <p className="text-sm text-pink-500">
                        Cashback {item.cashback.toLocaleString("id-ID")} Poin
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">
                        Quantity: {item.quantity}
                      </p>
                      <p className="font-bold text-gray-900">
                        Rp{" "}
                        {(item.price * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Redeem Points Section */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Gunakan Poin MYOLA (opsional)
              </h2>

              {!isLoggedIn ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 font-medium mb-2">
                    Login untuk menggunakan poin
                  </p>
                  <p className="text-xs text-gray-600">
                    Kamu perlu login dan menjadi member untuk bisa menggunakan
                    poin.
                  </p>
                </div>
              ) : !isMember ? (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-700 font-medium mb-2">
                    Membership diperlukan untuk redeem poin
                  </p>
                  <p className="text-xs text-orange-600">
                    Hanya member aktif yang bisa menggunakan poin untuk
                    pembayaran.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Kamu bisa menggunakan Poin MOLA untuk mengurangi total
                    pembayaranmu.
                  </p>

                  {/* Redeem Points Input */}
                  <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 mb-1">
                          Kamu punya{" "}
                          {(user?.points_balance || 0).toLocaleString("id-ID")} Poin
                          MOLA
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          Masukkan jumlah poin yang ingin digunakan.
                        </p>
                        <input
                          type="number"
                          value={redeemPoints || ""}
                          onChange={(e) => handleRedeemChange(e.target.value)}
                          placeholder="Bayar menggunakan Poin MOLA"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          1 Poin MOLA sama dengan Rp 1
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* Shipping Address */}
            {isLoggedIn && (
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Opsi Pengiriman
                </h2>

                {/* Existing Address Option */}
                <div className="mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="addressOption"
                      checked={useExistingAddress}
                      onChange={() => setUseExistingAddress(true)}
                      className="w-5 h-5 text-pink-500"
                    />
                    <span className="font-semibold text-gray-900">
                      Sama dengan Alamat Pengiriman
                    </span>
                  </label>

                  {useExistingAddress && selectedAddress && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="font-bold text-gray-900">
                        {selectedAddress.recipientName}
                      </p>
                      <p className="text-gray-700">
                        {selectedAddress.phoneNumber}
                      </p>
                      <p className="text-gray-700">
                        {selectedAddress.fullAddress}
                      </p>
                      {selectedAddress.deliveryNote && (
                        <p className="text-sm text-gray-600 mt-2">
                          Catatan: {selectedAddress.deliveryNote}
                        </p>
                      )}
                    </div>
                  )}

                  {useExistingAddress && !selectedAddress && (
                    <div className="mt-4 text-center py-6">
                      <p className="text-gray-600 mb-3">
                        Belum ada alamat tersimpan
                      </p>
                      <button
                        onClick={() => setShowAddressModal(true)}
                        className="text-pink-500 hover:text-pink-600 font-semibold"
                      >
                        + Tambah Alamat Baru
                      </button>
                    </div>
                  )}
                </div>

                {/* New Address Option */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="addressOption"
                      checked={!useExistingAddress}
                      onChange={() => setUseExistingAddress(false)}
                      className="w-5 h-5 text-pink-500"
                    />
                    <span className="font-semibold text-gray-900">
                      Alamat Lainnya
                    </span>
                  </label>

                  {!useExistingAddress && (
                    <div className="mt-4 text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                      <button
                        onClick={() => setShowAddressModal(true)}
                        className="text-pink-500 hover:text-pink-600 font-semibold"
                      >
                        + Tambah Alamat Baru
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Guest Address Input */}
            {!isLoggedIn && (
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Informasi Pengiriman
                </h2>

                <div className="space-y-4">
                  {/* Recipient Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama Penerima <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nama penerima"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                      onChange={(e) => {
                        setSelectedAddress({
                          id: "guest-address",
                          recipientName: e.target.value,
                          phoneNumber: selectedAddress?.phoneNumber || "",
                          label: "Guest Address",
                          fullAddress: selectedAddress?.fullAddress || "",
                          deliveryNote: selectedAddress?.deliveryNote || "",
                          isPrimary: false,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        });
                      }}
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      No. HP <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <span className="px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg font-medium">
                        +62
                      </span>
                      <input
                        type="tel"
                        placeholder="812345678"
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                        onChange={(e) => {
                          const currentAddress = selectedAddress || {
                            id: "guest-address",
                            recipientName: "",
                            phoneNumber: "",
                            label: "Guest Address",
                            fullAddress: "",
                            deliveryNote: "",
                            isPrimary: false,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                          };
                          setSelectedAddress({
                            ...currentAddress,
                            phoneNumber:
                              "+62" + e.target.value.replace(/\D/g, ""),
                          });
                        }}
                      />
                    </div>
                  </div>

                  {/* Full Address */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Provinsi, Kode Pos"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 resize-none"
                      onChange={(e) => {
                        const currentAddress = selectedAddress || {
                          id: "guest-address",
                          recipientName: "",
                          phoneNumber: "",
                          label: "Guest Address",
                          fullAddress: "",
                          deliveryNote: "",
                          isPrimary: false,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        };
                        setSelectedAddress({
                          ...currentAddress,
                          fullAddress: e.target.value,
                        });
                      }}
                    />
                  </div>

                  {/* Delivery Note */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Catatan untuk Kurir (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Warna Pagar, Patokan, dll"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                      onChange={(e) => {
                        const currentAddress = selectedAddress || {
                          id: "guest-address",
                          recipientName: "",
                          phoneNumber: "",
                          label: "Guest Address",
                          fullAddress: "",
                          deliveryNote: "",
                          isPrimary: false,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString(),
                        };
                        setSelectedAddress({
                          ...currentAddress,
                          deliveryNote: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    💡 <strong>Tips:</strong> Login untuk menyimpan alamat dan
                    checkout lebih cepat di pembelian selanjutnya.
                  </p>
                </div>
              </div>
            )}
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
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>

                {redeemPoints > 0 && (
                  <div className="flex justify-between text-pink-600">
                    <span>Redeem Poin</span>
                    <span className="font-semibold">
                      - {redeemPoints.toLocaleString("id-ID")}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700">
                  <span>Total Pesanan</span>
                  <span className="font-semibold">
                    Rp {totalAfterRedeem.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>PPN</span>
                  <span className="font-semibold">
                    Rp {ppn.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Biaya Pengiriman</span>
                  <span className="font-semibold">
                    Rp {shippingCost.toLocaleString("id-ID")}
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
                onClick={handlePayment}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-xl transition-colors"
              >
                Bayar Sekarang
              </button>

              {/* Cashback Info - Status Based */}
              {isMember ? (
                <div className="mt-4 bg-gradient-to-r from-pink-700 to-pink-900 text-white rounded-lg p-4">
                  <p className="text-sm font-semibold mb-1">
                    ✨ Selamat! Kamu akan mendapatkan cashback
                  </p>
                  <p className="text-2xl font-bold">
                    {totalCashback.toLocaleString("id-ID")} Poin
                  </p>
                  <p className="text-xs mt-1 opacity-90">
                    Cashback akan ditambahkan setelah pesanan selesai
                  </p>
                </div>
              ) : isLoggedIn ? (
                <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-700 font-medium mb-1">
                    Membership tidak aktif
                  </p>
                  <p className="text-xs text-orange-600 mb-2">
                    Gabung member untuk dapatkan cashback{" "}
                    {checkoutItems
                      .reduce(
                        (sum, item) => sum + item.cashback * item.quantity,
                        0
                      )
                      .toLocaleString("id-ID")}{" "}
                    poin dari pembelian ini!
                  </p>
                  <Link
                    href="/join-member"
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 underline"
                  >
                    Join Member →
                  </Link>
                </div>
              ) : (
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700 font-medium mb-1">
                    💰 Dapatkan cashback!
                  </p>
                  <p className="text-xs text-gray-600 mb-2">
                    Login dan join member untuk dapatkan cashback poin di setiap
                    pembelian.
                  </p>
                  <Link
                    href="/auth/login?redirect=/checkout"
                    className="text-xs font-semibold text-gray-600 hover:text-gray-700 underline"
                  >
                    Login Sekarang →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Address Modal - Only for logged-in users */}
      {isLoggedIn && (
        <AddressFormModal
          isOpen={showAddressModal}
          onClose={() => setShowAddressModal(false)}
          onSubmit={handleAddressSubmit}
          isLoading={addressModalLoading}
          isEdit={false}
        />
      )}
    </div>
  );
}
