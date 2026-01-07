/** @format */

// app/payment/bank-transfer/[bank]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Copy, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export default function BankTransferDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bank = params.bank as string;

  const [copied, setCopied] = useState(false);
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

  const bankDetails: Record<string, any> = {
    bca: {
      name: "BCA",
      logo: "/images/bca.png",
      vaNumber: "468732934800018192",
      accountName: "MYOLA",
    },
    bri: {
      name: "BRI",
      logo: "/images/bri.svg",
      vaNumber: "888801234567890123",
      accountName: "MYOLA",
    },
    mandiri: {
      name: "MANDIRI",
      logo: "/images/mandiri.png",
      vaNumber: "8990012345678901",
      accountName: "MYOLA",
    },
    bni: {
      name: "BNI",
      logo: "/images/bni.png",
      vaNumber: "8088012345678901",
      accountName: "MYOLA",
    },
  };

  const currentBank = bankDetails[bank] || bankDetails.bca;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const handlePaymentComplete = () => {
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Transfer Melalui
            </h1>
            <div className="w-24 h-12 relative">
              <Image
                src={currentBank.logo}
                alt={currentBank.name}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Virtual Account Info */}
          <div className="bg-pink-50 rounded-xl p-6 mb-6">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Virtual Account Number
              </p>
              <div className="flex items-center justify-between gap-4">
                <p className="text-2xl font-bold text-gray-900 tracking-wider">
                  {currentBank.vaNumber}
                </p>
                <button
                  onClick={() => copyToClipboard(currentBank.vaNumber)}
                  className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Virtual Account Name</p>
              <p className="text-xl font-bold text-gray-900">
                {currentBank.accountName}
              </p>
            </div>
          </div>

          {/* Payment Amount */}
          <div className="text-center py-4 bg-gray-50 rounded-xl mb-6">
            <p className="text-sm text-gray-600 mb-2">Bayar sebelum</p>
            <p className="text-base font-semibold text-gray-900 mb-4">
              {getPaymentDeadline()}
            </p>
            <h2 className="text-5xl font-bold text-gray-900">
              Rp {paymentData.totalBayar.toLocaleString("id-ID")}
            </h2>
          </div>

          {/* Payment Type Badge */}
          {paymentData.type === "event" && (
            <div className="mb-6 bg-rose-50 border border-rose-200 rounded-xl p-4">
              <p className="text-sm text-rose-700 font-semibold text-center">
                🎉 Pembayaran Event
              </p>
            </div>
          )}

          {paymentData.type === "member" && (
            <div className="mb-6 bg-purple-50 border border-purple-200 rounded-xl p-4">
              <p className="text-sm text-purple-700 font-semibold text-center">
                ⭐ Pembayaran Membership
              </p>
            </div>
          )}

          {/* Warning */}
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

        {/* Instructions Tabs */}
        <Tabs defaultValue="atm">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
            {/* Kontainer untuk TabsList */}
            <div className="border-b">
              <TabsList className="flex w-full p-0">
                {/* ATM Tab Trigger */}
                <TabsTrigger
                  value="atm"
                  className="flex-1 px-6 py-4 rounded-none data-[state=active]:font-bold data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=inactive]:font-medium data-[state=inactive]:text-gray-600 transition duration-150 ease-in-out data-[state=inactive]:bg-white data-[state=inactive]:hover:bg-white"
                >
                  ATM
                </TabsTrigger>

                {/* M-Banking Tab Trigger */}
                <TabsTrigger
                  value="m-banking"
                  className="flex-1 px-6 py-4 rounded-none data-[state=active]:font-bold data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=inactive]:font-medium data-[state=inactive]:text-gray-600 transition duration-150 ease-in-out data-[state=inactive]:bg-white data-[state=inactive]:hover:bg-white"
                >
                  M-Banking
                </TabsTrigger>

                {/* I-Banking Tab Trigger */}
                <TabsTrigger
                  value="i-banking"
                  className="flex-1 px-6 py-4 rounded-none data-[state=active]:font-bold data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-pink-600 data-[state=inactive]:font-medium data-[state=inactive]:text-gray-600 transition duration-150 ease-in-out data-[state=inactive]:bg-white data-[state=inactive]:hover:bg-white"
                >
                  I-Banking
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Isi Konten Tab */}

            {/* Konten ATM */}
            <TabsContent value="atm" className="mt-0">
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Temukan ATM Terdekat
                </h3>
                <ol className="space-y-3 list-decimal list-inside text-gray-700">
                  <li>Masukkan kartu ATM **{currentBank.name}**</li>
                  <li>Masukkan **PIN**</li>
                </ol>

                <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
                  Detail Pembayaran
                </h3>
                <ol className="space-y-3 list-decimal list-inside text-gray-700">
                  <li>Pilih menu "**Transaksi Lainnya**"</li>
                  <li>Pilih "**Transfer**"</li>
                  <li>
                    Pilih "**Ke Rekening {currentBank.name} Virtual Account**"
                  </li>
                  <li>
                    Masukkan **Nomor Virtual Account** kamu (VA kamu), lalu
                    tekan "**Benar**"
                  </li>
                  <li>
                    Cek halaman konfirmasi — pastikan No VA, nama, produk, dan
                    total tagihan sudah sesuai, terus tekan "**Benar**"
                  </li>
                  <li>Pastikan nama dan total tagihan udah bener</li>
                  <li>Tekan "**Ya**" kalau sudah sesuai</li>
                </ol>

                <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
                  Transaksi Berhasil
                </h3>
                <ol className="space-y-3 list-decimal list-inside text-gray-700">
                  <li>Transaksi selesai</li>
                  <li>
                    Setelah transaksi selesai, *invoice* bakal ke-update
                    otomatis (biasanya butuh waktu sampai **5 menit**)
                  </li>
                </ol>
              </div>
            </TabsContent>

            {/* Konten M-Banking */}
            <TabsContent value="m-banking" className="mt-0">
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Langkah Pembayaran M-Banking
                </h3>
                <ol className="space-y-3 list-decimal list-inside text-gray-700">
                  <li>Buka aplikasi **M-Banking {currentBank.name}**</li>
                  <li>Masukkan **User ID** dan **Password**</li>
                </ol>

                <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
                  Detail Pembayaran
                </h3>
                <ol className="space-y-3 list-decimal list-inside text-gray-700">
                  <li>Pilih menu "**Transfer**" atau "**Pembayaran**"</li>
                  <li>Pilih "**Virtual Account**"</li>
                  <li>Masukkan **Nomor Virtual Account** kamu (VA kamu)</li>
                  <li>
                    Cek halaman konfirmasi — pastikan No VA, nama, produk, dan
                    total tagihan sudah sesuai
                  </li>
                  <li>Masukkan **PIN M-Banking** kamu</li>
                </ol>

                <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
                  Transaksi Berhasil
                </h3>
                <ol className="space-y-3 list-decimal list-inside text-gray-700">
                  <li>Transaksi selesai</li>
                  <li>
                    Setelah transaksi selesai, *invoice* bakal ke-update
                    otomatis (biasanya butuh waktu sampai **5 menit**)
                  </li>
                </ol>
              </div>
            </TabsContent>

            {/* Konten I-Banking */}
            <TabsContent value="i-banking" className="mt-0">
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Langkah Pembayaran I-Banking
                </h3>
                <ol className="space-y-3 list-decimal list-inside text-gray-700">
                  <li>Buka website **I-Banking {currentBank.name}**</li>
                  <li>Masukkan **User ID** dan **Password**</li>
                </ol>

                <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
                  Detail Pembayaran
                </h3>
                <ol className="space-y-3 list-decimal list-inside text-gray-700">
                  <li>Pilih menu "**Transfer**" atau "**Pembayaran**"</li>
                  <li>Pilih "**Virtual Account**"</li>
                  <li>Masukkan **Nomor Virtual Account** kamu (VA kamu)</li>
                  <li>
                    Cek halaman konfirmasi — pastikan No VA, nama, produk, dan
                    total tagihan sudah sesuai
                  </li>
                  <li>Masukkan **PIN I-Banking** kamu atau **kode token**</li>
                </ol>

                <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
                  Transaksi Berhasil
                </h3>
                <ol className="space-y-3 list-decimal list-inside text-gray-700">
                  <li>Transaksi selesai</li>
                  <li>
                    Setelah transaksi selesai, *invoice* bakal ke-update
                    otomatis (biasanya butuh waktu sampai **5 menit**)
                  </li>
                </ol>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Confirm Button */}
        <button
          onClick={handlePaymentComplete}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
        >
          Saya Sudah Bayar
        </button>
      </div>
    </div>
  );
}
