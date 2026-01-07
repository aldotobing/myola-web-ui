/** @format */

// app/payment/event-success/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, Calendar, Clock, MapPin, Home, User } from "lucide-react";
import { useEffect, useState } from "react";

interface EventPaymentData {
  event: {
    title: string;
    date: string;
    time: string;
    instructor: string;
    image: string;
  };
  registration: {
    fullName: string;
    phoneNumber: string;
    idCardNumber: string;
  };
  totalBayar: number;
  eventPrice: number;
  redeemPoints?: number;
}

export default function EventPaymentSuccessPage() {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<EventPaymentData | null>(null);

  useEffect(() => {
    // Try to get payment data
    const storedData = localStorage.getItem("payment_data");
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        if (data.type === "event") {
          setPaymentData(data);
        }
      } catch (error) {
        console.error("Error loading payment data:", error);
      }
    }
  }, []);

  const handleViewEvents = () => {
    router.push("/dashboard/event");
  };

  const handleBrowseEvents = () => {
    router.push("/event");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-6 bg-white rounded-full shadow-2xl mb-6">
            <CheckCircle className="w-24 h-24 text-green-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Pendaftaran Berhasil! 🎉
          </h1>
          <p className="text-xl text-gray-700 font-semibold mb-2">
            Selamat! Kamu Sudah Terdaftar
          </p>
          <p className="text-lg text-gray-600">
            Terima kasih telah mendaftar event MYOLA
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 animate-slide-up">
          {paymentData && (
            <>
              {/* Event Details */}
              <div className="bg-gradient-to-r from-rose-700 to-rose-900 text-white rounded-xl p-6 mb-6">
                <h3 className="text-2xl font-bold mb-4">
                  {paymentData.event.title}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">
                      {paymentData.event.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">
                      {paymentData.event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5" />
                    <span className="font-medium">
                      {paymentData.event.instructor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Registration Details */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3 text-lg">
                  Detail Pendaftaran
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nama Peserta:</span>
                    <span className="font-semibold text-gray-900">
                      {paymentData.registration.fullName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">No. HP:</span>
                    <span className="font-semibold text-gray-900">
                      {paymentData.registration.phoneNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">No. KTP:</span>
                    <span className="font-semibold text-gray-900">
                      {paymentData.registration.idCardNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-pink-50 rounded-xl p-6 mb-6">
                <h4 className="font-bold text-gray-900 mb-3 text-lg">
                  Ringkasan Pembayaran
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Harga Event:</span>
                    <span className="font-semibold">
                      Rp {paymentData.eventPrice.toLocaleString("id-ID")}
                    </span>
                  </div>
                  {paymentData.redeemPoints && paymentData.redeemPoints > 0 && (
                    <div className="flex justify-between text-pink-600">
                      <span>Redeem Poin:</span>
                      <span className="font-semibold">
                        - {paymentData.redeemPoints.toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                  <div className="pt-3 border-t-2 border-pink-200 flex justify-between">
                    <span className="font-bold text-gray-900">
                      Total Dibayar:
                    </span>
                    <span className="text-xl font-bold text-pink-500">
                      Rp {paymentData.totalBayar.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
            <p className="font-bold text-blue-800 mb-2">
              📧 Langkah Selanjutnya:
            </p>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>✓ Konfirmasi pendaftaran akan dikirim via email</li>
              <li>✓ Cek detail event dan persiapan di dashboard</li>
              <li>
                ✓ Link meeting/lokasi akan dikirim H-1 sebelum event dimulai
              </li>
              <li>✓ Jangan lupa catat tanggal dan waktunya!</li>
            </ul>
          </div>

          {/* Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-semibold">
                Simpan di Kalender
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 font-semibold">
                Siapkan Materi
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 animate-slide-up animation-delay-200">
          <button
            onClick={handleViewEvents}
            className="w-full bg-gradient-to-r from-rose-700 to-rose-900 hover:from-rose-800 hover:to-rose-950 text-white font-bold text-lg py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Calendar className="w-6 h-6" />
            Lihat Event Saya
          </button>

          <button
            onClick={handleBrowseEvents}
            className="w-full border-2 border-rose-700 text-rose-700 hover:bg-rose-50 font-bold text-lg py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <MapPin className="w-6 h-6" />
            Lihat Event Lainnya
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
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">
            Ada pertanyaan tentang event ini?
          </p>
          <a
            href="mailto:support@myola.com"
            className="text-rose-700 font-semibold hover:underline"
          >
            Hubungi Customer Service
          </a>
        </div>
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
