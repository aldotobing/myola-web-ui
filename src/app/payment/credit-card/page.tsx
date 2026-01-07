/** @format */

// app/payment/credit-card/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";

interface ProductPaymentData {
  type: "product";
  items: any[];
  subtotal: number;
  redeemPoints: number;
  totalAfterRedeem: number;
  ppn: number;
  shippingCost: number;
  totalBayar: number;
  totalCashback: number;
  address: any;
  timestamp: string;
}

interface EventPaymentData {
  type: "event";
  event: any;
  registration: any;
  eventPrice: number;
  redeemPoints: number;
  totalAfterRedeem: number;
  ppn: number;
  totalBayar: number;
  timestamp: string;
}

interface MemberPaymentData {
  type: "member";
  membershipPrice: number;
  ppn: number;
  totalBayar: number;
  timestamp: string;
}

type PaymentData = ProductPaymentData | EventPaymentData | MemberPaymentData;

export default function CreditCardPaymentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load payment data from localStorage
    const storedData = localStorage.getItem("payment_data");
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setPaymentData(data);
      } catch (error) {
        console.error("Error loading payment data:", error);
        router.push("/payment/select");
      }
    } else {
      router.push("/payment/select");
    }
    setLoading(false);
  }, [router]);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, "");
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setFormData({ ...formData, cardNumber: value });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setFormData({ ...formData, expiryDate: value });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cardNumber) {
      newErrors.cardNumber = "Nomor kartu wajib diisi";
    } else if (formData.cardNumber.length !== 16) {
      newErrors.cardNumber = "Nomor kartu harus 16 digit";
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = "Masa berlaku wajib diisi";
    } else if (formData.expiryDate.length !== 4) {
      newErrors.expiryDate = "Format masa berlaku tidak valid (MM/YY)";
    } else {
      const month = parseInt(formData.expiryDate.slice(0, 2));
      if (month < 1 || month > 12) {
        newErrors.expiryDate = "Bulan tidak valid";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsProcessing(true);

      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);

        if (!paymentData) return;

        // Clear payment data
        localStorage.removeItem("payment_data");
        localStorage.removeItem("selected_payment_method");

        // Redirect based on payment type
        if (paymentData.type === "member") {
          localStorage.removeItem("memberRegistrationData");
          router.push("/payment/success"); // Member success page
        } else if (paymentData.type === "product") {
          localStorage.removeItem("checkout_items");
          router.push("/payment/product-success"); // Product success page
        } else if (paymentData.type === "event") {
          localStorage.removeItem("event_checkout_data");
          router.push("/payment/event-success"); // Event success page
        }
      }, 2000);
    }
  };

  const handleBack = () => {
    router.push("/payment/select");
  };

  const getPaymentDeadline = () => {
    if (!paymentData) return "";

    const deadline = new Date(paymentData.timestamp);
    deadline.setHours(deadline.getHours() + 2);

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return deadline.toLocaleDateString("id-ID", options);
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

  if (!paymentData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Payment Methods Toggle */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Opsi Pembayaran
            </h1>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              {/* Transfer Bank */}
              <button
                onClick={handleBack}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors border-b"
              >
                <span className="font-semibold text-lg text-gray-700">
                  Transfer Bank
                </span>
                <input type="radio" className="w-5 h-5" />
              </button>

              {/* E-Wallet */}
              <button
                onClick={handleBack}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors border-b"
              >
                <span className="font-semibold text-lg text-gray-700">
                  E-Wallet
                </span>
                <input type="radio" className="w-5 h-5" />
              </button>

              {/* Credit Card - Active */}
              <div className="border-b">
                <div className="p-6 flex items-center justify-between bg-gray-50">
                  <span className="font-semibold text-lg text-gray-900">
                    Credit Card
                  </span>
                  <input type="radio" checked readOnly className="w-5 h-5" />
                </div>

                {/* Credit Card Form */}
                <form
                  onSubmit={handleSubmit}
                  className="p-6 bg-gray-50 space-y-6"
                >
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nomor Kartu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formatCardNumber(formData.cardNumber)}
                        onChange={handleCardNumberChange}
                        placeholder="xxxx xxxx xxxx xxxx"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors pr-12 ${
                          errors.cardNumber
                            ? "border-red-500"
                            : "border-gray-300 focus:border-pink-500"
                        }`}
                      />
                      <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                    </div>
                    {errors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Masa Berlaku <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formatExpiryDate(formData.expiryDate)}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                        errors.expiryDate
                          ? "border-red-500"
                          : "border-gray-300 focus:border-pink-500"
                      }`}
                    />
                    {errors.expiryDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.expiryDate}
                      </p>
                    )}
                  </div>

                  {/* Terms & Privacy */}
                  <div className="text-sm text-gray-600 leading-relaxed">
                    Dengan klik Konfirmasi, kamu menyetujui{" "}
                    <a href="#" className="text-pink-500 hover:underline">
                      Syarat & Ketentuan
                    </a>{" "}
                    serta{" "}
                    <a href="#" className="text-pink-500 hover:underline">
                      Kebijakan Privasi
                    </a>{" "}
                    Kartu Kredit.
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`w-full font-bold text-lg py-4 rounded-xl transition-all ${
                      isProcessing
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Memproses...</span>
                      </div>
                    ) : (
                      "Konfirmasi"
                    )}
                  </button>
                </form>
              </div>

              {/* Pembayaran QR */}
              <button
                onClick={handleBack}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-lg text-gray-700">
                  Pembayaran QR
                </span>
                <input type="radio" className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <p className="text-sm text-gray-600 mb-2 text-center">
                Bayar sebelum
              </p>
              <p className="text-base font-semibold text-gray-900 mb-4 text-center">
                {getPaymentDeadline()}
              </p>

              <p className="text-4xl font-bold text-gray-900 mb-6 text-center">
                Rp {paymentData.totalBayar.toLocaleString("id-ID")}
              </p>

              {/* Payment Type Badge */}
              {paymentData.type === "event" && (
                <div className="mb-6 bg-rose-50 border border-rose-200 rounded-xl p-3">
                  <p className="text-sm text-rose-700 font-semibold text-center">
                    🎉 Pembayaran Event
                  </p>
                </div>
              )}

              {paymentData.type === "member" && (
                <div className="mb-6 bg-purple-50 border border-purple-200 rounded-xl p-3">
                  <p className="text-sm text-purple-700 font-semibold text-center">
                    ⭐ Pembayaran Membership
                  </p>
                </div>
              )}

              {paymentData.type === "product" && (
                <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <p className="text-sm text-blue-700 font-semibold text-center">
                    🛍️ Pembayaran Produk
                  </p>
                </div>
              )}

              <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded">
                <p className="font-bold text-red-800 mb-2">
                  Lindungi Diri Anda dari Penipuan
                </p>
                <p className="text-sm text-red-700">
                  Pastikan nama merchant, jumlah pembayaran, dan detail lainnya
                  sudah benar. Selalu periksa sebelum melanjutkan pembayaran.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
