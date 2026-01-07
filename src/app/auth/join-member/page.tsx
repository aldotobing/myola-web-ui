/** @format */

// app/join-member/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";

export default function JoinMemberPage() {
  const router = useRouter();
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
  const [ktpFileName, setKtpFileName] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validasi semua field wajib
    if (!formData.namaLengkap.trim()) {
      newErrors.namaLengkap = "Nama lengkap wajib diisi";
    }
    if (!formData.tempatLahir) {
      newErrors.tempatLahir = "Tempat lahir wajib dipilih";
    }
    if (!formData.tanggalLahir) {
      newErrors.tanggalLahir = "Tanggal lahir wajib diisi";
    }
    if (!formData.jenisKelamin) {
      newErrors.jenisKelamin = "Jenis kelamin wajib dipilih";
    }
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
    if (!formData.uploadKTP) {
      newErrors.uploadKTP = "Upload KTP wajib";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "ktp" | "bukti"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "ktp") {
        setFormData({ ...formData, uploadKTP: file });
        setKtpFileName(file.name);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Simpan data member registration ke localStorage
      localStorage.setItem("memberRegistrationData", JSON.stringify(formData));

      // Simpan payment data untuk member (fixed amount)
      const memberPaymentData = {
        type: "member", // Identifier untuk payment type
        items: [
          {
            id: "member-1",
            name: "Member MYOLA - 1 Bulan",
            quantity: 1,
          },
        ],
        subtotal: 99000,
        redeemPoints: 0,
        totalAfterRedeem: 99000,
        ppn: 0,
        shippingCost: 0,
        totalBayar: 99000,
        totalCashback: 49000,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem("payment_data", JSON.stringify(memberPaymentData));

      // Redirect ke halaman pilih pembayaran
      router.push("/payment/select");
    } else {
      // Scroll ke error pertama
      const firstError = document.querySelector(".border-red-500");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleApplyReferral = () => {
    if (formData.referralCode) {
      alert(`Referral code "${formData.referralCode}" applied!`);
    }
  };

  // *** Tambahkan state baru ini ***
  const [showPassword, setShowPassword] = useState(false);

  // Fungsi untuk mengganti state visibilitas
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen  py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className=" p-8 space-y-6">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.namaLengkap}
              onChange={(e) =>
                setFormData({ ...formData, namaLengkap: e.target.value })
              }
              placeholder="Nama Lengkap"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                errors.namaLengkap
                  ? "border-red-500"
                  : "border-gray-300 focus:border-pink-500"
              }`}
            />
            {errors.namaLengkap && (
              <p className="text-red-500 text-sm mt-1">{errors.namaLengkap}</p>
            )}
          </div>

          {/* Tempat Lahir */}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tempat Lahir <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.tempatLahir}
              onChange={(e) =>
                setFormData({ ...formData, tempatLahir: e.target.value })
              }
              placeholder="Tempat Lahir"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                errors.tempatLahir
                  ? "border-red-500"
                  : "border-gray-300 focus:border-pink-500"
              }`}
            />
            {errors.tempatLahir && (
              <p className="text-red-500 text-sm mt-1">{errors.tempatLahir}</p>
            )}
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tanggal Lahir <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.tanggalLahir}
              onChange={(e) =>
                setFormData({ ...formData, tanggalLahir: e.target.value })
              }
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                errors.tanggalLahir
                  ? "border-red-500"
                  : "border-gray-300 focus:border-pink-500"
              }`}
            />
            {errors.tanggalLahir && (
              <p className="text-red-500 text-sm mt-1">{errors.tanggalLahir}</p>
            )}
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jenis Kelamin <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.jenisKelamin}
              onChange={(e) =>
                setFormData({ ...formData, jenisKelamin: e.target.value })
              }
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                errors.jenisKelamin
                  ? "border-red-500"
                  : "border-gray-300 focus:border-pink-500"
              }`}
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
            {errors.jenisKelamin && (
              <p className="text-red-500 text-sm mt-1">{errors.jenisKelamin}</p>
            )}
          </div>

          {/* No HP */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              No. Hp <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <span className="px-4 py-3 bg-gray-100 border-2 border-gray-300 rounded-xl font-medium">
                +62
              </span>
              <input
                type="tel"
                value={formData.noHp}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    noHp: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="Contoh : 8123456789"
                className={`flex-1 px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  errors.noHp
                    ? "border-red-500"
                    : "border-gray-300 focus:border-pink-500"
                }`}
              />
            </div>
            {errors.noHp && (
              <p className="text-red-500 text-sm mt-1">{errors.noHp}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Email"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-300 focus:border-pink-500"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Password"
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                errors.password
                  ? "border-red-500"
                  : "border-gray-300 focus:border-pink-500"
              }`}
            />
            {/* Tombol Icon untuk Toggle Visibility */}
            <button
              type="button" // Penting: type="button" agar tidak memicu submit form
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 top-7 flex items-center pr-3 text-gray-500 hover:text-pink-500 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {/* Tampilkan ikon mata yang sesuai dengan status */}
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Nomor KTP */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nomor KTP <span className="text-red-500">*</span>
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
              placeholder="Nomor KTP"
              maxLength={16}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                errors.nomorKTP
                  ? "border-red-500"
                  : "border-gray-300 focus:border-pink-500"
              }`}
            />
            {errors.nomorKTP && (
              <p className="text-red-500 text-sm mt-1">{errors.nomorKTP}</p>
            )}
          </div>

          {/* Upload KTP */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload KTP <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <label className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-bold cursor-pointer transition-colors flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload File
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, "ktp")}
                  className="hidden"
                />
              </label>
              <span className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-500 flex items-center">
                {ktpFileName || "No File Chosen"}
              </span>
            </div>
            {errors.uploadKTP && (
              <p className="text-red-500 text-sm mt-1">{errors.uploadKTP}</p>
            )}
          </div>

          {/* Referral Code */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Referral Code
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={formData.referralCode}
                onChange={(e) =>
                  setFormData({ ...formData, referralCode: e.target.value })
                }
                placeholder="Use Referral Code"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-pink-500"
              />
              <button
                type="button"
                onClick={handleApplyReferral}
                className="border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-8 py-3 rounded-xl font-bold transition-colors"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold text-lg py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Join Member
          </button>
        </form>
      </div>
    </div>
  );
}
