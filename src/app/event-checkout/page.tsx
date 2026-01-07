/** @format */

// app/event-checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { isMemberActive, useAuth } from "@/app/contexts/AuthContexts";
import { getUserAddresses } from "@/lib/api/addresses";
import { Address } from "@/types/address";
import AddressFormModal from "@/components/addresses/AddressFormModal";
import { createAddress } from "@/lib/api/addresses";
import { AddressFormData } from "@/types/address";
import Link from "next/link";
import { Calendar, Clock, CircleDollarSign, User } from "lucide-react";

interface EventData {
  eventTitle: string;
  title: string;
  description: string;
  instructor: string;
  level: string;
  date: string;
  time: string;
  price: string;
  image: string;
  slug: string;
}

export default function EventCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // User status checks
  const isLoggedIn = user?.isLoggedIn || false;
  const isMember = isLoggedIn && isMemberActive(user?.memberUntil);

  // Event data
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  // Registration form
  const [registrationData, setRegistrationData] = useState({
    fullName: "",
    phoneNumber: "",
    idCardNumber: "",
  });

  // Address management (for logged-in users)
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [useExistingAddress, setUseExistingAddress] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressModalLoading, setAddressModalLoading] = useState(false);

  // Points redemption
  const [redeemPoints, setRedeemPoints] = useState(0);
  const canRedeemPoints = isMember;

  useEffect(() => {
    // Load event data from localStorage or URL params
    const storedEvent = localStorage.getItem("event_checkout_data");
    if (storedEvent) {
      setEventData(JSON.parse(storedEvent));
    } else {
      // Redirect back if no event data
      router.push("/");
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

  // Parse price from string like "Rp 150.000" or "Gratis"
  const parsePrice = (priceString: string): number => {
    if (priceString.toLowerCase().includes("gratis")) return 0;
    const numericPrice = priceString.replace(/[^0-9]/g, "");
    return parseInt(numericPrice) || 0;
  };

  const eventPrice = eventData ? parsePrice(eventData.price) : 0;
  const totalAfterRedeem = Math.max(0, eventPrice - redeemPoints);
  const ppn = Math.round(totalAfterRedeem * 0.11);
  const totalBayar = totalAfterRedeem + ppn;

  const handleRedeemChange = (value: string) => {
    if (!canRedeemPoints) return;
    const numValue = parseInt(value) || 0;
    const userPoints = user?.points || 0;
    const maxRedeem = Math.min(userPoints, eventPrice);
    setRedeemPoints(Math.min(numValue, maxRedeem));
  };

  const handlePayment = () => {
    // Validate registration form
    if (!registrationData.fullName.trim()) {
      alert("Silakan isi nama lengkap");
      return;
    }

    const phoneDigits = registrationData.phoneNumber.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      alert("Nomor HP minimal 10 digit");
      return;
    }

    if (!registrationData.idCardNumber.trim()) {
      alert("Silakan isi Nomor KTP");
      return;
    }

    // For logged-in users, check address
    if (isLoggedIn) {
      if (
        !selectedAddress ||
        !selectedAddress.recipientName ||
        !selectedAddress.fullAddress
      ) {
        alert("Silakan lengkapi alamat pengiriman");
        return;
      }
    }

    // Store payment data for payment page
    const paymentData = {
      type: "event",
      event: eventData,
      registration: registrationData,
      address: selectedAddress,
      eventPrice: eventPrice,
      redeemPoints: redeemPoints,
      totalAfterRedeem: totalAfterRedeem,
      ppn: ppn,
      totalBayar: totalBayar,
      timestamp: new Date().toISOString(),
      isGuest: !isLoggedIn,
    };

    localStorage.setItem("payment_data", JSON.stringify(paymentData));
    router.push("/payment/select");
  };

  if (loading || !eventData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Pendaftaran Event
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
                  Login untuk pengalaman lebih baik
                </p>
                <p className="text-sm text-blue-700 mb-2">
                  Dengan login, kamu bisa menyimpan data dan menggunakan poin
                  untuk pembayaran.
                </p>
                <Link
                  href="/auth/login?redirect=/event-checkout"
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
                  Gabung member untuk bisa redeem poin di pembayaran event!
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
            {/* Event Details */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Rincian Event
              </h2>
              <div className="flex gap-4 pb-4 border-b">
                <div className="relative w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                  <Image
                    src={eventData.image}
                    alt={eventData.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {eventData.title}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{eventData.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{eventData.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{eventData.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CircleDollarSign className="w-4 h-4" />
                      <span className="font-semibold text-pink-500">
                        {eventData.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Detail Pendaftaran
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={registrationData.fullName}
                    onChange={(e) =>
                      setRegistrationData({
                        ...registrationData,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    No. Hp <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <span className="px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg font-medium">
                      +62
                    </span>
                    <input
                      type="tel"
                      placeholder="812345678"
                      value={registrationData.phoneNumber.replace("+62", "")}
                      onChange={(e) =>
                        setRegistrationData({
                          ...registrationData,
                          phoneNumber:
                            "+62" + e.target.value.replace(/\D/g, ""),
                        })
                      }
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nomor KTP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nomor KTP"
                    value={registrationData.idCardNumber}
                    onChange={(e) =>
                      setRegistrationData({
                        ...registrationData,
                        idCardNumber: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    maxLength={16}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">16 digit angka</p>
                </div>
              </div>
            </div>

            {/* Redeem Points Section */}
            {isLoggedIn && (
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Metode Pembayaran
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Pembayaran dilakukan melalui transfer bank setelah checkout.
                  Kamu bisa menggunakan Poin MOLA untuk mengurangi total
                  pembayaranmu.
                </p>

                {!isMember ? (
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
                  <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 mb-1">
                          Kamu punya{" "}
                          {(user?.points || 0).toLocaleString("id-ID")} Poin
                          MOLA
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          Masukkan jumlah poin yang ingin digunakan (opsional).
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
                )}
              </div>
            )}

            {/* Address Section - Only for logged-in users */}
            {isLoggedIn && (
              <div className="bg-white rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Alamat Pengiriman (untuk Sertifikat/Goodie Bag)
                </h2>

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
                      Gunakan Alamat Tersimpan
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
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-pink-50 rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Ringkasan Pesanan
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Harga Event</span>
                  <span className="font-semibold">
                    Rp {eventPrice.toLocaleString("id-ID")}
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
                  <span>Total Event</span>
                  <span className="font-semibold">
                    Rp {totalAfterRedeem.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>PPN (11%)</span>
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
                onClick={handlePayment}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-xl transition-colors"
              >
                Bayar Sekarang
              </button>

              <p className="text-xs text-gray-600 text-center mt-4">
                Dengan melanjutkan, Anda menyetujui syarat dan ketentuan
                pendaftaran event
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
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
