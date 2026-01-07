/** @format */

// app/join-member/pending/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Mail, CheckCircle, Home } from "lucide-react";

export default function PendingConfirmationPage() {
  const router = useRouter();
  const [memberData, setMemberData] = useState<any>(null);

  useEffect(() => {
    // Ambil data dari localStorage
    const data = localStorage.getItem("pendingMemberData");
    if (data) {
      setMemberData(JSON.parse(data));
    } else {
      // Jika tidak ada data, redirect ke join member
      router.push("/join-member");
    }
  }, [router]);

  const handleGoHome = () => {
    // Clear data
    localStorage.removeItem("pendingMemberData");
    router.push("/");
  };

  if (!memberData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block p-6 bg-white rounded-full shadow-2xl mb-6">
            <Clock className="w-20 h-20 text-pink-500 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Menunggu Konfirmasi Pembayaran
          </h1>
          <p className="text-xl text-gray-600">
            Terima kasih telah mendaftar sebagai member MyOLA!
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 animate-slide-up">
          <div className="flex items-start gap-4 mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
            <Mail className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">
                Email Konfirmasi Telah Dikirim
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Kami telah mengirimkan email konfirmasi ke{" "}
                <span className="font-bold text-pink-500">
                  {memberData.email}
                </span>
                . Silakan cek inbox atau folder spam Anda.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="font-bold text-xl text-gray-900">
              Langkah Selanjutnya:
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <p className="text-gray-700 pt-1">
                  Tim kami akan memverifikasi pembayaran Anda dalam waktu{" "}
                  <span className="font-bold">1x24 jam</span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <p className="text-gray-700 pt-1">
                  Anda akan menerima email konfirmasi setelah pembayaran
                  diverifikasi
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <p className="text-gray-700 pt-1">
                  Setelah disetujui, Anda dapat login dan mengakses semua kelas
                  premium
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-900 mb-1">
                  Data Berhasil Dikirim
                </h4>
                <p className="text-gray-700 text-sm">
                  Data pendaftaran Anda telah kami terima dengan lengkap
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Member Info Summary */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 animate-slide-up animation-delay-200">
          <h3 className="font-bold text-xl text-gray-900 mb-4">
            Ringkasan Data Pendaftaran
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nama Lengkap</p>
              <p className="font-semibold text-gray-900">
                {memberData.namaLengkap}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-gray-900">{memberData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">No. HP</p>
              <p className="font-semibold text-gray-900">
                +62{memberData.noHp}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tanggal Pendaftaran</p>
              <p className="font-semibold text-gray-900">
                {new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 animate-slide-up animation-delay-400">
          <button
            onClick={handleGoHome}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Home className="w-6 h-6" />
            Kembali ke Beranda
          </button>

          <p className="text-center text-gray-600">
            Butuh bantuan?{" "}
            <a
              href="mailto:support@myola.com"
              className="text-pink-500 font-semibold hover:underline"
            >
              Hubungi Customer Service
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
