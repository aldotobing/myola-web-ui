/** @format */

// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContexts";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //API
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (validateForm()) {
  //     setIsLoading(true);

  //     try {
  //       // Simulate API call
  //       // In production, replace with actual API endpoint
  //       const response = await fetch("/api/auth/login", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(formData),
  //       });

  //       if (response.ok) {
  //         const data = await response.json();

  //         // Store user data in localStorage
  //         localStorage.setItem(
  //           "user",
  //           JSON.stringify({
  //             name: data.name || "Susi Susanti",
  //             email: formData.email,
  //             points: 10000,
  //             memberUntil: "10 Januari 2026",
  //             isLoggedIn: true,
  //           })
  //         );

  //         // Redirect to homepage
  //         router.push("/");
  //       } else {
  //         setErrors({ general: "Email atau password salah" });
  //       }
  //     } catch (error) {
  //       // If API not available, use mock login for demo
  //       console.log("Using mock login");

  //       // Mock successful login
  //       localStorage.setItem(
  //         "user",
  //         JSON.stringify({
  //           name: "Susi Susanti",
  //           email: formData.email,
  //           points: 10000,
  //           memberUntil: "10 Januari 2026",
  //           avatar: "/images/avatar-default.jpg",
  //           isLoggedIn: true,
  //         })
  //       );

  //       setTimeout(() => {
  //         setIsLoading(false);
  //         router.push("/");
  //       }, 1000);
  //     }
  //   }
  // };
  // *** Tambahkan state baru ini ***

  // Data user yang valid untuk login
  const validUsers = [
    {
      email: "user@myola.com",
      password: "password123",
      name: "Susi Susanti",
    },
    {
      email: "admin@myola.com",
      password: "admin123",
      name: "Admin User",
    },
    {
      email: "tiarahardiyanti26@gmail.com",
      password: "password123",
      name: "Tiara Hardiyanti",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      try {
        // Cari user dari data valid
        const foundUser = validUsers.find(
          (user) =>
            user.email === formData.email && user.password === formData.password
        );

        if (foundUser) {
          // Login berhasil
          const userData = {
            name: foundUser.name,
            email: formData.email,
            points: 1000000,
            memberUntil: "10 Januari 2026",
            avatar: "/images/avatar-default.jpg",
            isLoggedIn: true,
          };

          login(userData);

          // Delay sebentar untuk UX yang lebih baik
          setTimeout(() => {
            setIsLoading(false);
            router.push("/");
          }, 1000);
        } else {
          // Login gagal
          setErrors({ general: "Email atau password salah" });
          setIsLoading(false);
        }
      } catch (error) {
        setErrors({ general: "Terjadi kesalahan. Silakan coba lagi." });
        setIsLoading(false);
      }
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  // Fungsi untuk mengganti state visibilitas
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screenflex items-center justify-center py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Login Member
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
        <div className=" p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Nama Lengkap"
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
                Password
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-bold text-lg py-4 rounded-xl transition-all ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 flex items-center justify-center gap-4 text-sm">
            <Link
              href="/forgot-password"
              className="text-gray-600 hover:text-pink-500 font-medium underline"
            >
              Forgot password
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/auth/join-member"
              className="text-gray-600 hover:text-pink-500 font-medium underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
