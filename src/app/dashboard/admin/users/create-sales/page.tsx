/** @format */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  Tag,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CreateSalesPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    referralCode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/create-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok)
        throw new Error(result.error || "Gagal membuat akun sales");

      toast.success("Akun Sales berhasil dibuat!");
      router.push("/dashboard/admin/users");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard/admin/users"
          className="inline-flex items-center text-gray-500 hover:text-pink-600 font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" /> Kembali ke Daftar User
        </Link>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-pink-500 p-8 text-white">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <UserPlus size={32} />
              </div>
              <h1 className="text-3xl font-bold">Tambah Staf Sales</h1>
            </div>
            <p className="text-pink-100">
              Buat akun baru untuk staf lapangan atau digital marketing
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <User size={16} className="text-pink-500" /> Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-pink-500 outline-none transition-all"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone size={16} className="text-pink-500" /> Nomor HP
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0812XXXXXXXX"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-pink-500 outline-none transition-all"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={16} className="text-pink-500" /> Email Login
              </label>
              <input
                type="email"
                required
                placeholder="sales@myola.com"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-pink-500 outline-none transition-all"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Lock size={16} className="text-pink-500" /> Password Sementara
              </label>
              <input
                type="password"
                required
                placeholder="Minimal 6 karakter"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-pink-500 outline-none transition-all"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <div className="bg-pink-50 p-6 rounded-2xl border-2 border-pink-100">
              <label className="block text-sm font-bold text-pink-700 mb-2 flex items-center gap-2">
                <Tag size={16} /> Kode Referral (PENTING)
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: MYOLA-BUDI"
                className="w-full px-4 py-3 bg-white border-2 border-transparent rounded-xl focus:border-pink-500 outline-none transition-all font-bold text-xl tracking-widest text-pink-600 uppercase"
                value={formData.referralCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    referralCode: e.target.value
                      .toUpperCase()
                      .replace(/\s/g, ""),
                  })
                }
              />
              <p className="text-xs text-pink-600 mt-2 font-medium">
                * Kode ini akan digunakan member saat pendaftaran untuk mencatat
                komisi.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                isLoading
                  ? "bg-gray-400"
                  : "bg-pink-500 hover:bg-pink-600 active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <CheckCircle2 size={20} />
              )}
              {isLoading ? "Memproses..." : "Buat Akun Sales"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
