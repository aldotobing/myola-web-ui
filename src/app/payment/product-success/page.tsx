/** @format */

// app/payment/product-success/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, Package, ShoppingBag, Home } from "lucide-react";
import { useEffect, useState } from "react";

interface PaymentData {
  totalBayar: number;
  totalCashback: number;
  items: any[];
}

export default function ProductPaymentSuccessPage() {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  useEffect(() => {
    // Try to get payment data (might be cleared already)
    const storedData = localStorage.getItem("payment_data");
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setPaymentData(data);
      } catch (error) {
        console.error("Error loading payment data:", error);
      }
    }
  }, []);

  const handleViewOrders = () => {
    router.push("/dashboard/pesanan");
  };

  const handleContinueShopping = () => {
    router.push("/store");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-6 bg-white rounded-full shadow-2xl mb-6">
            <CheckCircle className="w-24 h-24 text-green-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pembayaran Berhasil! 🎉
          </h1>
          <p className="text-xl text-gray-700 font-semibold mb-2">
            Pesanan Anda Sedang Diproses
          </p>
          <p className="text-lg text-gray-600">
            Terima kasih telah berbelanja di MYOLA
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 animate-slide-up">
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-bold text-lg mb-4">
              Transaksi Selesai
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">
              Pesanan Anda telah kami terima dan akan segera diproses. Anda
              dapat melacak status pesanan di halaman "Pesanan Saya".
            </p>

            {paymentData && (
              <div className="bg-pink-50 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Total Pembayaran
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      Rp {paymentData.totalBayar.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Item</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {paymentData.items.length}
                    </p>
                  </div>
                </div>

                {paymentData.totalCashback > 0 && (
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg p-4">
                    <p className="text-sm font-semibold mb-1">
                      🎁 Cashback Poin MYOLA
                    </p>
                    <p className="text-2xl font-bold">
                      {paymentData.totalCashback.toLocaleString("id-ID")} Poin
                    </p>
                    <p className="text-xs mt-1 opacity-90">
                      Akan ditambahkan setelah pesanan selesai
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
            <p className="font-bold text-blue-800 mb-2">
              📦 Langkah Selanjutnya:
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>✓ Pesanan Anda akan diproses dalam 1-2 hari kerja</li>
              <li>
                ✓ Anda akan menerima notifikasi status pengiriman via email
              </li>
              <li>✓ Estimasi pengiriman 3-5 hari kerja</li>
              <li>✓ Cek status pesanan di "Pesanan Saya"</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-semibold">
                Dikemas dengan Aman
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <ShoppingBag className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-semibold">
                Gratis Retur 7 Hari
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-semibold">
                Garansi Kualitas
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 animate-slide-up animation-delay-200">
          <button
            onClick={handleViewOrders}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Package className="w-6 h-6" />
            Lihat Status Pesanan
          </button>

          <button
            onClick={handleContinueShopping}
            className="w-full border-2 border-pink-500 text-pink-500 hover:bg-pink-50 font-bold text-lg py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-6 h-6" />
            Lanjut Belanja
          </button>

          <button
            onClick={handleGoHome}
            className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold text-lg py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Home className="w-6 h-6" />
            Kembali ke Beranda
          </button>
        </div>

        {/* Support */}
        <p className="text-center text-gray-600 mt-6">
          Butuh bantuan? Hubungi{" "}
          <a
            href="mailto:support@myola.com"
            className="text-pink-500 font-semibold hover:underline"
          >
            Customer Service
          </a>
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
