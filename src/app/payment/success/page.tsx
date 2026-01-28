/** @format */

// app/payment/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Home, Book, Loader2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [isFinalizing, setIsFinalizing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const finalize = async () => {
      const paymentDataStr = localStorage.getItem("payment_data");
      if (!paymentDataStr) {
        setIsFinalizing(false);
        return;
      }

      try {
        const paymentData = JSON.parse(paymentDataStr);
        
        if (paymentData.type === "member") {
          const response = await fetch("/api/member/membership/finalize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: paymentData.userId,
              paymentReference: "PAY-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
              paymentMethod: "Selected Method", // Should get from actual payment flow
            }),
          });

          if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || "Failed to finalize membership");
          }
        }
        
        // Clear payment data after successful finalization
        localStorage.removeItem("payment_data");
        localStorage.removeItem("memberRegistrationData");
      } catch (err: any) {
        console.error("Finalization error:", err);
        setError(err.message);
      } finally {
        setIsFinalizing(false);
      }
    };

    finalize();
  }, []);

  const handleGoHome = () => {
    router.push("/");
  };

  const handleExploreClasses = () => {
    router.push("/dashboard/kelas");
  };

  if (isFinalizing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold">Mengaktifkan Keanggotaan Anda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-block p-6 bg-white rounded-full shadow-2xl mb-6">
            <CheckCircle className="w-24 h-24 text-green-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Selamat! 🎉
          </h1>
          <p className="text-2xl text-gray-700 font-semibold mb-2">
            Anda Berhasil Menjadi Member MyOLA
          </p>
          <p className="text-lg text-gray-600">
            Terima kasih telah bergabung dengan komunitas kami!
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
            <p className="text-red-700">Terjadi kendala saat aktivasi otomatis: {error}</p>
            <p className="text-red-600 text-sm">Silakan hubungi customer service kami.</p>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold text-lg mb-4">
              Member Aktif
            </div>
            <p className="text-gray-700 leading-relaxed">
              Akun Anda telah diaktifkan dan siap digunakan. Sekarang Anda dapat
              mengakses semua kelas premium, produk eksklusif, dan berbagai
              benefit lainnya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-pink-50 rounded-xl">
              <p className="text-3xl font-bold text-pink-600 mb-1">∞</p>
              <p className="text-sm text-gray-600">Akses Unlimited</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <p className="text-3xl font-bold text-purple-600 mb-1">100+</p>
              <p className="text-sm text-gray-600">Kelas Premium</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-3xl font-bold text-blue-600 mb-1">49.000</p>
              <p className="text-sm text-gray-600">Cashback Poin</p>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
            <p className="font-bold text-green-800 mb-1">
              ✨ Yang Bisa Anda Lakukan Sekarang:
            </p>
            <ul className="text-sm text-green-700 space-y-1">
              <li>✓ Akses semua kelas dan materi premium</li>
              <li>✓ Download freebies eksklusif</li>
              <li>✓ Ikut event dan workshop khusus member</li>
              <li>✓ Dapatkan cashback produk</li>
              <li>✓ Konsultasi gratis dengan instruktur</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleExploreClasses}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Book className="w-6 h-6" />
            Mulai Belajar Sekarang
          </button>

          <button
            onClick={handleGoHome}
            className="w-full border-2 border-pink-500 text-pink-500 hover:bg-pink-50 font-bold text-lg py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
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
    </div>
  );
}
