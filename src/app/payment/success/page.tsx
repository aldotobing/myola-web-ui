/** @format */

// app/payment/success/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, Home, Book } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();

  const handleGoHome = () => {
    localStorage.removeItem("memberRegistrationData");
    router.push("/");
  };

  const handleExploreClasses = () => {
    router.push("/akademi");
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
            Selamat! 🎉
          </h1>
          <p className="text-2xl text-gray-700 font-semibold mb-2">
            Anda Berhasil Menjadi Member MyOLA
          </p>
          <p className="text-lg text-gray-600">
            Terima kasih telah bergabung dengan komunitas kami!
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 animate-slide-up">
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold text-lg mb-4">
              Member Active
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
        <div className="space-y-4 animate-slide-up animation-delay-200">
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
