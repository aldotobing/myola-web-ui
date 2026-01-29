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
  Eye,
  EyeOff,
  Lock,
  User,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import Image from "next/image";
import { getMembership, updateProfile } from "@/lib/service/member/membership";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, signOut, refreshProfile } = useAuth();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [membership, setMembership] = useState<any>(null);
  const supabase = createClient();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [ktpUrl, setKtpUrl] = useState<string | null>(null);
  const [showKtpImage, setShowKtpImage] = useState(false);
  const [isIdVisible, setIsIdVisible] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        idNumber: user.ktp_number || "",
      });

      getMembership(user.id).then(data => setMembership(data));
      
      if (user.ktp_image_url) {
        const getSignedUrl = async () => {
          const { data, error } = await supabase.storage
            .from('myola')
            .createSignedUrl(user.ktp_image_url!, 3600);
          if (data) setKtpUrl(data.signedUrl);
        };
        getSignedUrl();
      }
    }
  }, [user, supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }
    setPreview(URL.createObjectURL(file));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    try {
      let finalKtpPath = user.ktp_image_url;
      const fileInput = document.getElementById('ktp-upload') as HTMLInputElement;
      const file = fileInput?.files?.[0];
      
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `ktp/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('myola').upload(filePath, file);
        if (uploadError) throw uploadError;
        finalKtpPath = filePath;
      }

      await updateProfile(user.id, { ...formData, ktp_image_url: finalKtpPath });
      await refreshProfile();
      toast.success("Profil berhasil diperbarui!");
    } catch (error: any) {
      toast.error("Gagal memperbarui profil: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  const menuItems = [
    { icon: FileText, label: "Profile", href: "/dashboard/profil" },
    { icon: Coins, label: "Poin MYOLA", href: "/dashboard/poin-myola" },
    { icon: ShoppingCart, label: "Pesanan Saya", href: "/dashboard/pesanan" },
    { icon: MonitorPlayIcon, label: "Kelas Saya", href: "/dashboard/kelas" },
    { icon: Megaphone, label: "Event Saya", href: "/dashboard/event" },
    { icon: MapIcon, label: "Alamat Pengiriman", href: "/dashboard/alamat" },
    { icon: Settings2Icon, label: "Pengaturan Akun", href: "/dashboard/pengaturan-akun" },
  ];

  const maskIdNumber = (id: string) => {
    if (!id) return "-";
    if (isIdVisible) return id;
    return id.slice(0, 4) + " •••• •••• " + id.slice(-4);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex justify-between items-center h-16 px-4">
          <h1 className="text-lg font-bold text-gray-900">Akun</h1>
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2 hover:bg-gray-100 rounded-lg">
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
              onClick={() => { router.push(item.href); setShowMobileMenu(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 border-b hover:bg-gray-50 transition-colors text-left"
            >
              <item.icon className="w-5 h-5 text-pink-500 flex-shrink-0" />
              <span className="flex-1 font-medium text-gray-800 text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Desktop Sidebar - Matching poin-myola theme */}
          <div className="hidden md:block md:col-span-1">
            <div className="bg-pink-50 rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {user.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{user.full_name}</h3>
                  <span className="inline-block bg-pink-500 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase mt-1">Member</span>
                </div>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item, idx) => (
                   <Link
                    key={idx}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      item.href === "/dashboard/profil" 
                        ? "bg-white text-pink-600 shadow-sm" 
                        : "text-gray-700 hover:bg-white hover:text-pink-600"
                    }`}
                  >
                    <item.icon size={18} className="flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <p className="text-xl md:text-3xl font-bold text-gray-900">Profil Saya</p>
            </div>

            {/* Membership Expiry Banner - Restored to Original Design */}
            <div className={`border rounded-xl mb-8 px-6 py-4 flex items-center justify-between ${
              membership?.expires_at && (new Date(membership.expires_at).getTime() - Date.now()) < 7 * 24 * 60 * 60 * 1000
                ? "bg-orange-50 border-orange-200"
                : "bg-gradient-to-r from-pink-50 to-white border-pink-200"
            }`}>
              <div className="flex items-center gap-4">
                <Image src="/images/myola-member-logo.png" alt="MyOLA Logo" width={80} height={40} className="object-contain" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-pink-600 font-bold text-sm uppercase">Member Aktif</p>
                    {membership?.expires_at && (new Date(membership.expires_at).getTime() - Date.now()) < 7 * 24 * 60 * 60 * 1000 && (
                      <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">SEGERA BERAKHIR</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-xs">
                    Berakhir pada: {membership?.expires_at ? new Date(membership.expires_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : (membership?.status === 'active' ? "Selamanya" : "-")}
                  </p>
                </div>
              </div>
              <Link href="/dashboard/profil/membership-detail" className="text-pink-600 text-sm font-bold hover:underline">
                Lihat Detail
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-4">
                    <User size={20} className="text-pink-500" /> Informasi Dasar
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                      <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor WhatsApp</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Alamat Email</label>
                      <input type="email" value={formData.email} disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-4">
                    <ShieldCheck size={20} className="text-blue-500" /> Verifikasi Identitas
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor KTP (NIK)</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          name="idNumber" 
                          value={isIdVisible ? formData.idNumber : maskIdNumber(formData.idNumber)} 
                          onChange={handleInputChange} 
                          readOnly={!isIdVisible}
                          className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all font-mono tracking-wider ${isIdVisible ? 'text-gray-900 focus:border-pink-500' : 'text-gray-400'}`} 
                        />
                        <button 
                          type="button" 
                          onClick={() => setIsIdVisible(!isIdVisible)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-white rounded-lg transition-all text-gray-400"
                        >
                          {isIdVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <p className="mt-2 text-[10px] text-gray-400 font-medium">Klik ikon mata untuk mengedit nomor KTP</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Foto Dokumen KTP</label>
                      {(preview || ktpUrl) ? (
                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 h-48 flex items-center justify-center relative group">
                          {showKtpImage ? (
                            <>
                              <Image src={preview || ktpUrl || ""} alt="KTP" fill className="object-contain" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button type="button" onClick={() => setShowKtpImage(false)} className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-xs shadow-lg">Sembunyikan</button>
                                <label htmlFor="ktp-upload" className="bg-pink-500 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-lg cursor-pointer">Ganti</label>
                              </div>
                            </>
                          ) : (
                            <div className="text-center">
                              <div className="bg-pink-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Eye size={20} className="text-pink-500" />
                              </div>
                              <button type="button" onClick={() => setShowKtpImage(true)} className="bg-pink-500 text-white px-6 py-2 rounded-lg font-bold text-xs hover:bg-pink-600 transition-all">Lihat Foto</button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <label htmlFor="ktp-upload" className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-pink-500 transition-all cursor-pointer block bg-gray-50">
                          <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500 font-medium">Upload Foto KTP</p>
                        </label>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-white px-10 py-3.5 rounded-xl font-bold shadow-lg shadow-pink-100 transition-all disabled:bg-gray-300 flex items-center justify-center gap-2"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 size={20} />}
                    {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
              <input id="ktp-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
