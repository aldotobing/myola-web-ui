/** @format */

// app/dashboard/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContexts";
import {
  FileText,
  ShoppingCart,
  Menu,
  X,
  Wallet,
  Coins,
  Megaphone,
  MonitorPlayIcon,
  MapIcon,
  Settings2Icon,
  CoinsIcon,
  User2Icon,
  Loader2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { getMembership, updateProfile } from "@/lib/service/member/membership";
import { createClient } from "@/utils/supabase/client";

export default function ProfilePage() {
  const { user, signOut, refreshProfile } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [membership, setMembership] = useState<any>(null);
  const supabase = createClient();
  
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    birthPlace: "",
    birthDate: "",
    email: "",
    phone: "",
    idNumber: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [ktpUrl, setKtpUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || "",
        gender: "", // Add to schema if needed
        birthPlace: "", // Add to schema if needed
        birthDate: "", // Add to schema if needed
        email: user.email || "",
        phone: user.phone || "",
        idNumber: user.ktp_number || "",
      });

      // Fetch membership info
      getMembership(user.id).then(data => setMembership(data));
      
      // If has KTP image, get public URL
      if (user.ktp_image_url) {
        const { data: { publicUrl } } = supabase.storage
          .from('ktp-documents')
          .getPublicUrl(user.ktp_image_url);
        setKtpUrl(publicUrl);
      }
    }
  }, [user, supabase]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }

    // Preview locally
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Upload immediately or wait for submit? Let's do it on submit for consistency
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);

    try {
      // 1. If new KTP file selected, upload it
      let finalKtpPath = user.ktp_image_url;
      const fileInput = document.getElementById('ktp-upload') as HTMLInputElement;
      const file = fileInput?.files?.[0];
      
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `ktp-documents/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('ktp-documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;
        finalKtpPath = filePath;
      }

      // 2. Update profile in database
      await updateProfile(user.id, {
        ...formData,
        ktp_image_url: finalKtpPath
      });

      await refreshProfile();
      alert("Profil berhasil diperbarui!");
    } catch (error: any) {
      console.error("Update error:", error);
      alert("Gagal memperbarui profil: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlesignOut = async () => {
    await signOut();
    router.push("/");
  };

  const handleMenuClick = (href: string) => {
    router.push(href);
    setShowMobileMenu(false);
  };

  if (!user) {
    return null;
  }

  const menuItems = [
    { icon: FileText, label: "Profile", href: "/dashboard/profil", color: "text-pink-500" },
    { icon: Coins, label: "Poin MYOLA", href: "/dashboard/poin-myola", color: "text-pink-500" },
    { icon: ShoppingCart, label: "Pesanan Saya", href: "/dashboard/pesanan", color: "text-pink-500" },
    { icon: MonitorPlayIcon, label: "Kelas Saya", href: "/dashboard/kelas", color: "text-pink-500" },
    { icon: Megaphone, label: "Event Saya", href: "/dashboard/event", color: "text-pink-500" },
    { icon: MapIcon, label: "Alamat Pengiriman", href: "/dashboard/alamat", color: "text-pink-500" },
    { icon: Settings2Icon, label: "Pengaturan Akun", href: "/dashboard/pengaturan-akun", color: "text-pink-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex justify-between items-center h-16 px-4">
          <h1 className="text-lg font-bold text-gray-900">Akun</h1>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-3 flex items-center gap-3 border-b bg-pink-50">
            <Wallet className="w-5 h-5 text-pink-600" />
            <div>
              <p className="text-xs text-gray-600">Poin </p>
              <p className="font-bold text-gray-900">{user.points_balance?.toLocaleString() || "0"}</p>
            </div>
          </div>
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleMenuClick(item.href)}
              className="w-full flex items-center gap-3 px-4 py-3 border-b hover:bg-gray-50 transition-colors text-left"
            >
              <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0`} />
              <span className="flex-1 font-medium text-gray-800 text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden md:block md:col-span-1">
            <div className="bg-pink-50 rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {user.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{user.full_name}</h3>
                  <span className="inline-block bg-pink-500 text-white text-xs px-3 py-1 rounded-full mt-1">
                    {user.points_balance?.toLocaleString() || "0"} poin
                  </span>
                </div>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item, idx) => (
                   <Link
                    key={idx}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      item.href === "/dashboard/profil" 
                        ? "bg-white text-pink-600" 
                        : "text-gray-700 hover:bg-white hover:text-pink-600"
                    }`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                <button
                  onClick={handlesignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-white font-medium transition-colors mt-4"
                >
                  <X className="w-5 h-5 flex-shrink-0" />
                  <span>Keluar</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Profile Form Area */}
          <div className="md:col-span-3">
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-6">Profil</h2>

            {/* Membership Expiry Banner */}
            <div className="bg-gradient-to-r from-pink-50 to-white border border-pink-200 rounded-xl mb-8 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image src="/images/myola-member-logo.png" alt="MyOLA Logo" width={80} height={40} className="object-contain" />
                <div>
                  <p className="text-pink-600 font-bold text-sm">MEMBER AKTIF</p>
                  <p className="text-gray-600 text-xs">
                    Berakhir pada: {membership?.expires_at ? new Date(membership.expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "Lifetime"}
                  </p>
                </div>
              </div>
              <Link href="/dashboard/profil/membership-detail" className="text-pink-600 text-sm font-bold hover:underline">
                Lihat Detail
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-50 bg-gray-50 rounded-xl text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">No. HP</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor KTP</label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-pink-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Foto KTP</label>
                  <label
                    htmlFor="ktp-upload"
                    className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-pink-500 transition-colors cursor-pointer block bg-gray-50"
                  >
                    {preview || ktpUrl ? (
                      <div className="relative w-full h-48">
                        <Image src={preview || ktpUrl || ""} alt="KTP" fill className="object-contain" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                          <p className="text-white font-bold bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">Ganti Foto</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-500">Klik untuk upload foto KTP baru</p>
                      </div>
                    )}
                  </label>
                  <input id="ktp-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-pink-200 transition-all disabled:bg-gray-400 flex items-center gap-2"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
