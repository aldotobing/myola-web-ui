/** @format */

// app/payment/select/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  isGuest?: boolean;
}

interface EventPaymentData {
  type: "event";
  event: any;
  registration: any;
  address?: any;
  eventPrice: number;
  redeemPoints: number;
  totalAfterRedeem: number;
  ppn: number;
  totalBayar: number;
  timestamp: string;
  isGuest?: boolean;
}

interface MemberPaymentData {
  type: "member";
  membershipPrice: number;
  ppn: number;
  totalBayar: number;
  timestamp: string;
}

type PaymentData = ProductPaymentData | EventPaymentData | MemberPaymentData;

export default function PaymentSelectionPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [selectedEwallet, setSelectedEwallet] = useState<string>("");
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
        router.push("/");
      }
    } else {
      // No payment data, redirect back
      router.push("/");
    }
    setLoading(false);
  }, [router]);

  const handleContinue = () => {
    if (selectedMethod === "bank" && selectedBank) {
      // Store selected payment method
      localStorage.setItem(
        "selected_payment_method",
        JSON.stringify({
          type: "bank",
          bank: selectedBank,
        })
      );
      router.push(`/payment/bank-transfer/${selectedBank}`);
    } else if (selectedMethod === "ewallet" && selectedEwallet) {
      // Store selected payment method
      localStorage.setItem(
        "selected_payment_method",
        JSON.stringify({
          type: "ewallet",
          provider: selectedEwallet,
        })
      );

      // Redirect to e-wallet external link (simulation)
      const ewalletLinks: Record<string, string> = {
        shopeepay: "https://shopee.co.id/pay",
        dana: "https://dana.id",
        ovo: "https://ovo.id",
        gopay: "https://gopay.co.id",
      };

      // For demo, redirect to success after delay
      alert(`Redirecting to ${selectedEwallet.toUpperCase()} payment...`);
      setTimeout(() => {
        handlePaymentSuccess();
      }, 1500);
    } else if (selectedMethod === "credit") {
      localStorage.setItem(
        "selected_payment_method",
        JSON.stringify({
          type: "credit",
        })
      );
      router.push("/payment/credit-card");
    } else if (selectedMethod === "qr") {
      localStorage.setItem(
        "selected_payment_method",
        JSON.stringify({
          type: "qr",
        })
      );
      router.push("/payment/qr-code");
    }
  };

  const handlePaymentSuccess = () => {
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
  };

  // Calculate payment deadline (2 hours from now)
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

  // Render payment details based on type
  const renderPaymentDetails = () => {
    if (!paymentData) return null;

    if (paymentData.type === "product") {
      return (
        <div className="mb-6 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal Produk</span>
            <span>Rp {paymentData.subtotal.toLocaleString("id-ID")}</span>
          </div>
          {paymentData.redeemPoints > 0 && (
            <div className="flex justify-between text-pink-600">
              <span>Redeem Poin</span>
              <span>
                - Rp {paymentData.redeemPoints.toLocaleString("id-ID")}
              </span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Total Pesanan</span>
            <span>
              Rp {paymentData.totalAfterRedeem.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>PPN (11%)</span>
            <span>Rp {paymentData.ppn.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Biaya Pengiriman</span>
            <span>Rp {paymentData.shippingCost.toLocaleString("id-ID")}</span>
          </div>
        </div>
      );
    } else if (paymentData.type === "event") {
      return (
        <div className="mb-6 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Harga Event</span>
            <span>Rp {paymentData.eventPrice.toLocaleString("id-ID")}</span>
          </div>
          {paymentData.redeemPoints > 0 && (
            <div className="flex justify-between text-pink-600">
              <span>Redeem Poin</span>
              <span>
                - Rp {paymentData.redeemPoints.toLocaleString("id-ID")}
              </span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Total Event</span>
            <span>
              Rp {paymentData.totalAfterRedeem.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>PPN (11%)</span>
            <span>Rp {paymentData.ppn.toLocaleString("id-ID")}</span>
          </div>
        </div>
      );
    } else if (paymentData.type === "member") {
      return (
        <div className="mb-6 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Biaya Membership</span>
            <span>
              Rp {paymentData.membershipPrice.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>PPN (11%)</span>
            <span>Rp {paymentData.ppn.toLocaleString("id-ID")}</span>
          </div>
        </div>
      );
    }
  };

  // Get page title based on payment type
  const getPageTitle = () => {
    if (!paymentData) return "Opsi Pembayaran";

    if (paymentData.type === "product") {
      return "Pembayaran Produk";
    } else if (paymentData.type === "event") {
      return "Pembayaran Event";
    } else if (paymentData.type === "member") {
      return "Pembayaran Membership";
    }

    return "Opsi Pembayaran";
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
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left - Payment Methods */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getPageTitle()}
            </h1>
            <p className="text-gray-600 mb-6">
              Pilih metode pembayaran yang sesuai dengan kebutuhanmu
            </p>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Transfer Bank */}
              <div className="border-b">
                <button
                  onClick={() => setSelectedMethod("bank")}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <span className="font-semibold text-lg">Transfer Bank</span>
                  </div>
                  <input
                    type="radio"
                    checked={selectedMethod === "bank"}
                    onChange={() => setSelectedMethod("bank")}
                    className="w-5 h-5 text-pink-500"
                  />
                </button>

                {selectedMethod === "bank" && (
                  <div className="p-6 bg-gray-50 space-y-3">
                    <button
                      onClick={() => setSelectedBank("bca")}
                      className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-all ${
                        selectedBank === "bca"
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-12 h-12 relative">
                        <Image
                          src="/images/bca.png"
                          alt="BCA"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-medium">Virtual Account BCA</span>
                    </button>

                    <button
                      onClick={() => setSelectedBank("bri")}
                      className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-all ${
                        selectedBank === "bri"
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-12 h-12 relative">
                        <Image
                          src="/images/bri.svg"
                          alt="BRI"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-medium">Virtual Account BRI</span>
                    </button>

                    <button
                      onClick={() => setSelectedBank("mandiri")}
                      className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-all ${
                        selectedBank === "mandiri"
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-12 h-12 relative">
                        <Image
                          src="/images/mandiri.png"
                          alt="Mandiri"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-medium">
                        Virtual Account MANDIRI
                      </span>
                    </button>

                    <button
                      onClick={() => setSelectedBank("bni")}
                      className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-all ${
                        selectedBank === "bni"
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-12 h-12 relative">
                        <Image
                          src="/images/bni.png"
                          alt="BNI"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-medium">Virtual Account BNI</span>
                    </button>
                  </div>
                )}
              </div>

              {/* E-Wallet */}
              <div className="border-b">
                <button
                  onClick={() => setSelectedMethod("ewallet")}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="font-semibold text-lg">E-Wallet</span>
                  </div>
                  <input
                    type="radio"
                    checked={selectedMethod === "ewallet"}
                    onChange={() => setSelectedMethod("ewallet")}
                    className="w-5 h-5 text-pink-500"
                  />
                </button>

                {selectedMethod === "ewallet" && (
                  <div className="p-6 bg-gray-50 space-y-3">
                    <button
                      onClick={() => setSelectedEwallet("shopeepay")}
                      className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-all ${
                        selectedEwallet === "shopeepay"
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-12 h-12 relative">
                        <Image
                          src="/images/shopeepay.png"
                          alt="ShopeePay"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-medium">ShopeePay</span>
                    </button>

                    <button
                      onClick={() => setSelectedEwallet("dana")}
                      className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-all ${
                        selectedEwallet === "dana"
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-12 h-12 relative">
                        <Image
                          src="/images/dana.png"
                          alt="DANA"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-medium">DANA</span>
                    </button>

                    <button
                      onClick={() => setSelectedEwallet("ovo")}
                      className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-all ${
                        selectedEwallet === "ovo"
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-12 h-12 relative">
                        <Image
                          src="/images/ovo.png"
                          alt="OVO"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-medium">OVO</span>
                    </button>

                    <button
                      onClick={() => setSelectedEwallet("gopay")}
                      className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-all ${
                        selectedEwallet === "gopay"
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="w-12 h-12 relative">
                        <Image
                          src="/images/gopay.png"
                          alt="GoPay"
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span className="font-medium">GoPay</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Credit Card */}
              <div className="border-b">
                <button
                  onClick={() => setSelectedMethod("credit")}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <span className="font-semibold text-lg">Credit Card</span>
                  </div>
                  <input
                    type="radio"
                    checked={selectedMethod === "credit"}
                    onChange={() => setSelectedMethod("credit")}
                    className="w-5 h-5 text-pink-500"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Right - Payment Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <p className="text-lg text-gray-600 mb-2 text-center">
                Bayar sebelum
              </p>
              <p className="text-base font-semibold text-gray-900 mb-6 text-center">
                {getPaymentDeadline()}
              </p>

              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
                Rp {paymentData.totalBayar.toLocaleString("id-ID")}
              </h3>

              {/* Payment Details */}
              {renderPaymentDetails()}

              <div className="pt-4 border-t-2 border-gray-200 mb-6">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    Total Bayar
                  </span>
                  <span className="text-xl font-bold text-pink-500">
                    Rp {paymentData.totalBayar.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
                <p className="font-bold text-red-800 mb-2 text-sm">
                  ⚠️ Lindungi Diri dari Penipuan
                </p>
                <p className="text-xs text-red-700">
                  Pastikan nama merchant, jumlah pembayaran, dan detail lainnya
                  sudah benar. Selalu periksa sebelum melanjutkan pembayaran.
                </p>
              </div>

              <button
                onClick={handleContinue}
                disabled={
                  !selectedMethod ||
                  (selectedMethod === "bank" && !selectedBank) ||
                  (selectedMethod === "ewallet" && !selectedEwallet)
                }
                className={`w-full font-bold py-4 rounded-xl transition-all ${
                  selectedMethod &&
                  ((selectedMethod !== "bank" &&
                    selectedMethod !== "ewallet") ||
                    (selectedMethod === "bank" && selectedBank) ||
                    (selectedMethod === "ewallet" && selectedEwallet))
                    ? "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Lanjutkan Pembayaran
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Dengan melanjutkan, Anda menyetujui syarat dan ketentuan MYOLA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
