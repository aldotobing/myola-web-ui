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
  userId?: string;
  email?: string;
  membershipPrice: number;
  ppn: number;
  totalBayar: number;
  totalCashback?: number;
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

  const getPaymentDeadline = () => {
    if (!paymentData?.timestamp) return "";

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

  const renderPaymentDetails = () => {
    if (!paymentData) return null;

    if (paymentData.type === "product") {
      return (
        <div className="mb-6 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal Produk</span>
            <span>Rp {(paymentData.subtotal || 0).toLocaleString("id-ID")}</span>
          </div>
          {(paymentData.redeemPoints || 0) > 0 && (
            <div className="flex justify-between text-pink-600">
              <span>Redeem Poin</span>
              <span>
                - Rp {(paymentData.redeemPoints || 0).toLocaleString("id-ID")}
              </span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Total Pesanan</span>
            <span>
              Rp {(paymentData.totalAfterRedeem || 0).toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>PPN (11%)</span>
            <span>Rp {(paymentData.ppn || 0).toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Biaya Pengiriman</span>
            <span>Rp {(paymentData.shippingCost || 0).toLocaleString("id-ID")}</span>
          </div>
        </div>
      );
    } else if (paymentData.type === "event") {
      return (
        <div className="mb-6 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Harga Event</span>
            <span>Rp {(paymentData.eventPrice || 0).toLocaleString("id-ID")}</span>
          </div>
          {(paymentData.redeemPoints || 0) > 0 && (
            <div className="flex justify-between text-pink-600">
              <span>Redeem Poin</span>
              <span>
                - Rp {(paymentData.redeemPoints || 0).toLocaleString("id-ID")}
              </span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Total Event</span>
            <span>
              Rp {(paymentData.totalAfterRedeem || 0).toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>PPN (11%)</span>
            <span>Rp {(paymentData.ppn || 0).toLocaleString("id-ID")}</span>
          </div>
        </div>
      );
    } else if (paymentData.type === "member") {
      return (
        <div className="mb-6 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Biaya Membership</span>
            <span>
              Rp {(paymentData.membershipPrice || 0).toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>PPN (11%)</span>
            <span>Rp {(paymentData.ppn || 0).toLocaleString("id-ID")}</span>
          </div>
        </div>
      );
    }
  };

  const getPageTitle = () => {
    if (!paymentData) return "Opsi Pembayaran";
    if (paymentData.type === "product") return "Pembayaran Produk";
    if (paymentData.type === "event") return "Pembayaran Event";
    if (paymentData.type === "member") return "Pembayaran Membership";
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

  if (!paymentData) return null;

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
            <p className="text-gray-600 mb-6">Pilih metode pembayaran yang sesuai dengan kebutuhanmu</p>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="border-b">
                <button onClick={() => setSelectedMethod("bank")} className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">🏦</div>
                    <span className="font-semibold text-lg">Transfer Bank</span>
                  </div>
                  <input type="radio" checked={selectedMethod === "bank"} onChange={() => setSelectedMethod("bank")} className="w-5 h-5 text-pink-500" />
                </button>

                {selectedMethod === "bank" && (
                  <div className="p-6 bg-gray-50 space-y-3">
                    {["bca", "bri", "mandiri", "bni"].map((bank) => (
                      <button
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-all ${selectedBank === bank ? "border-pink-500 bg-pink-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
                      >
                        <div className="w-12 h-12 relative">
                          <Image src={`/images/${bank === 'bri' ? 'bri.svg' : bank + '.png'}`} alt={bank.toUpperCase()} fill className="object-contain" />
                        </div>
                        <span className="font-medium">Virtual Account {bank.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-b">
                <button onClick={() => setSelectedMethod("ewallet")} className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">📱</div>
                    <span className="font-semibold text-lg">E-Wallet</span>
                  </div>
                  <input type="radio" checked={selectedMethod === "ewallet"} onChange={() => setSelectedMethod("ewallet")} className="w-5 h-5 text-pink-500" />
                </button>

                {selectedMethod === "ewallet" && (
                  <div className="p-6 bg-gray-50 space-y-3">
                    {["shopeepay", "dana", "ovo", "gopay"].map((ew) => (
                      <button
                        key={ew}
                        onClick={() => setSelectedEwallet(ew)}
                        className={`w-full p-4 border-2 rounded-xl flex items-center gap-4 transition-all ${selectedEwallet === ew ? "border-pink-500 bg-pink-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
                      >
                        <div className="w-12 h-12 relative">
                          <Image src={`/images/${ew}.png`} alt={ew} fill className="object-contain" />
                        </div>
                        <span className="font-medium text-capitalize">{ew.charAt(0).toUpperCase() + ew.slice(1)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <p className="text-lg text-gray-600 mb-2 text-center">Bayar sebelum</p>
              <p className="text-base font-semibold text-gray-900 mb-6 text-center">{getPaymentDeadline()}</p>

              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
                Rp {(paymentData?.totalBayar || 0).toLocaleString("id-ID")}
              </h3>

              {renderPaymentDetails()}

              <div className="pt-4 border-t-2 border-gray-200 mb-6">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total Bayar</span>
                  <span className="text-xl font-bold text-pink-500">Rp {(paymentData?.totalBayar || 0).toLocaleString("id-ID")}</span>
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={!selectedMethod || (selectedMethod === "bank" && !selectedBank) || (selectedMethod === "ewallet" && !selectedEwallet)}
                className={`w-full font-bold py-4 rounded-xl transition-all ${selectedMethod && (selectedMethod !== "bank" || selectedBank) && (selectedMethod !== "ewallet" || selectedEwallet) ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              >
                Lanjutkan Pembayaran
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}