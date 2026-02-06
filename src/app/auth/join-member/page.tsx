/** @format */

// app/join-member/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Eye, EyeOff, ChevronDown } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function JoinMemberPage() {
  const router = useRouter();
  const supabase = createClient();
  const [formData, setFormData] = useState({
    namaLengkap: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "",
    noHp: "",
    email: "",
    password: "",
    nomorKTP: "",
    uploadKTP: null as File | null,
    referralCode: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [ktpFileName, setKtpFileName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.namaLengkap.trim())
      newErrors.namaLengkap = "Nama lengkap wajib diisi";
    if (!formData.tempatLahir)
      newErrors.tempatLahir = "Tempat lahir wajib diisi";
    if (!formData.tanggalLahir)
      newErrors.tanggalLahir = "Tanggal lahir wajib diisi";
    if (!formData.jenisKelamin)
      newErrors.jenisKelamin = "Jenis kelamin wajib dipilih";
    if (!formData.noHp.trim()) {
      newErrors.noHp = "Nomor HP wajib diisi";
    } else if (formData.noHp.length < 10) {
      newErrors.noHp = "Nomor HP minimal 10 digit";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }
    if (!formData.nomorKTP.trim()) {
      newErrors.nomorKTP = "Nomor KTP wajib diisi";
    } else if (formData.nomorKTP.length !== 16) {
      newErrors.nomorKTP = "Nomor KTP harus 16 digit";
    }
    if (!formData.uploadKTP) newErrors.uploadKTP = "Upload KTP wajib";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, uploadKTP: file });
      setKtpFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      setErrors({});

      try {
        // 1. Call Register API
        const response = await fetch("/api/member/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            namaLengkap: formData.namaLengkap,
            nomorKTP: formData.nomorKTP,
            referralCode: formData.referralCode,
            noHp: formData.noHp,
            tempatLahir: formData.tempatLahir,
            tanggalLahir: formData.tanggalLahir,
            jenisKelamin: formData.jenisKelamin,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to register");
        }

        const userId = result.userId;

        // 2. Upload KTP using API (which uses Admin Client to bypass RLS)
        if (formData.uploadKTP) {
          const uploadFormData = new FormData();
          uploadFormData.append("file", formData.uploadKTP);
          uploadFormData.append("userId", userId);

          const uploadResponse = await fetch("/api/member/upload-ktp", {
            method: "POST",
            body: uploadFormData,
          });

          if (!uploadResponse.ok) {
            console.error("KTP Upload failed, but continuing registration...");
          }
        }

        // 3. Set payment data for next step
        const memberPaymentData = {
          type: "member",
          userId: userId,
          email: formData.email,
          membershipPrice: 99000,
          ppn: 0,
          totalBayar: 99000,
          totalCashback: 49000,
          timestamp: new Date().toISOString(),
        };

        localStorage.setItem("payment_data", JSON.stringify(memberPaymentData));
        localStorage.removeItem("memberRegistrationData");

        // 4. Redirect to payment
        router.push("/payment/select");
      } catch (error: any) {
        toast.error(error.message);
        setIsLoading(false);
      }
    } else {
      const firstError = document.querySelector(".border-red-500");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Join Member
          </h1>
          <p className="text-gray-600 text-lg">
            Mulai belajar jadi profesional!{" "}
            <span className="text-pink-500 font-bold">
              Bayar Rp99.000 per bulan
            </span>{" "}
            untuk akses akademi dan dapatkan cashback di setiap pembelian
            produk!
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={formData.namaLengkap}
                  onChange={(e) =>
                    setFormData({ ...formData, namaLengkap: e.target.value })
                  }
                  placeholder="Nama Lengkap"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${errors.namaLengkap ? "border-red-500" : "border-gray-200 focus:border-pink-500"}`}
                />
                {errors.namaLengkap && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.namaLengkap}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Email"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${errors.email ? "border-red-500" : "border-gray-200 focus:border-pink-500"}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Password"
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${errors.password ? "border-red-500" : "border-gray-200 focus:border-pink-500"}`}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  No. Hp * (+62)
                </label>
                <input
                  type="tel"
                  value={formData.noHp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      noHp: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  placeholder="8123456789"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${errors.noHp ? "border-red-500" : "border-gray-200 focus:border-pink-500"}`}
                />
                {errors.noHp && (
                  <p className="text-red-500 text-sm mt-1">{errors.noHp}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tempat Lahir *
                </label>
                <input
                  type="text"
                  value={formData.tempatLahir}
                  onChange={(e) =>
                    setFormData({ ...formData, tempatLahir: e.target.value })
                  }
                  placeholder="Tempat Lahir"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${errors.tempatLahir ? "border-red-500" : "border-gray-200 focus:border-pink-500"}`}
                />
                {errors.tempatLahir && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.tempatLahir}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tanggal Lahir *
                </label>
                <input
                  type="date"
                  value={formData.tanggalLahir}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggalLahir: e.target.value })
                  }
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${errors.tanggalLahir ? "border-red-500" : "border-gray-200 focus:border-pink-500"}`}
                />
                {errors.tanggalLahir && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.tanggalLahir}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jenis Kelamin *
                </label>
                <div className="relative">
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) =>
                      setFormData({ ...formData, jenisKelamin: e.target.value })
                    }
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none appearance-none ${errors.jenisKelamin ? "border-red-500" : "border-gray-200 focus:border-pink-500"}`}
                  >
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                </div>
                {errors.jenisKelamin && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.jenisKelamin}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor KTP * (16 digit)
                </label>
                <input
                  type="text"
                  value={formData.nomorKTP}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nomorKTP: e.target.value.replace(/\D/g, "").slice(0, 16),
                    })
                  }
                  placeholder="350xxxxxxxxxxxxx"
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none ${errors.nomorKTP ? "border-red-500" : "border-gray-200 focus:border-pink-500"}`}
                />
                {errors.nomorKTP && (
                  <p className="text-red-500 text-sm mt-1">{errors.nomorKTP}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload KTP *
              </label>
              <div className="flex gap-3">
                <label className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-bold cursor-pointer transition-colors flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <span className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-500 flex items-center overflow-hidden">
                  {ktpFileName || "Pilih foto KTP..."}
                </span>
              </div>
              {errors.uploadKTP && (
                <p className="text-red-500 text-sm mt-1">{errors.uploadKTP}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Referral Code (Opsional)
              </label>
              <input
                type="text"
                value={formData.referralCode}
                onChange={(e) =>
                  setFormData({ ...formData, referralCode: e.target.value })
                }
                placeholder="Kode referral"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-bold text-lg py-4 rounded-xl transition-all ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"}`}
            >
              {isLoading ? "Memproses..." : "Daftar & Lanjut Pembayaran"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
