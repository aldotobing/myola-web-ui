/** @format */
"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPointTransactions, getTransactionTitle, PointTransaction } from "@/lib/service/member/points";

export default function PoinPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setIsLoading(true);
      const data = await getPointTransactions(user.id);
      setTransactions(data);
      setIsLoading(false);
    };
    fetchData();
  }, [user]);

  const pointInfo = [
    {
      icon: "💰",
      text: "Setiap 1 (satu) Poin MOLA bernilai 1 (satu) IDR saat digunakan untuk bertransaksi di MOLA.",
    },
    {
      icon: "🎨",
      text: "Poin MOLA bisa digunakan untuk transaksi atau penukaran promo tertentu yang tersedia di website.",
    },
    {
      icon: "🚫",
      text: "Poin MOLA tidak dapat diuangkan atau dipindahkan ke akun pengguna lain.",
    },
    {
      icon: "💫",
      text: "Poin MOLA akan aktif setelah transaksi kamu berhasil dan status pesanan dinyatakan selesai.",
    },
    {
      icon: "📅",
      text: "MOLA Points berlaku selama 1 (satu) tahun sejak tanggal aktivasi poin.",
    },
  ];

  const handleSignOut = async () => {
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
    { icon: FileText, label: "Profile", href: "/dashboard/profil" },
    { icon: Coins, label: "Poin MYOLA", href: "/dashboard/poin-myola" },
    { icon: ShoppingCart, label: "Pesanan Saya", href: "/dashboard/pesanan" },
    { icon: MonitorPlayIcon, label: "Kelas Saya", href: "/dashboard/kelas" },
    { icon: Megaphone, label: "Event Saya", href: "/dashboard/event" },
    { icon: MapIcon, label: "Alamat Pengiriman", href: "/dashboard/alamat" },
    { icon: Settings2Icon, label: "Pengaturan Akun", href: "/dashboard/pengaturan-akun" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex justify-between items-center h-16 px-4">
          <h1 className="text-lg font-bold text-gray-900">Poin MOLA</h1>
          <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="p-2">
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

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
                  <span className="inline-block bg-pink-500 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase">Member</span>
                </div>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      item.href === "/dashboard/poin-myola" 
                        ? "bg-white text-pink-600 shadow-sm" 
                        : "text-gray-700 hover:bg-white hover:text-pink-600"
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Poin MYOLA</h2>
              <button onClick={() => setShowModal(true)} className="text-pink-500 border border-pink-500 px-4 py-2 rounded-xl hover:bg-pink-50 text-sm font-bold transition-all">
                Tentang Poin
              </button>
            </div>

            {/* Points Card */}
            <div className="bg-gradient-to-br from-pink-500 to-pink-700 rounded-3xl p-8 text-white mb-8 shadow-xl shadow-pink-100 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-pink-100 text-sm font-bold uppercase tracking-widest mb-2">Total Saldo Anda</p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-black tracking-tight">{(user.points_balance || 0).toLocaleString("id-ID")}</span>
                  <span className="text-xl font-bold opacity-80">Poin</span>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 inline-block">
                  <p className="text-sm font-medium">✨ 1 Poin = Rp 1. Gunakan untuk belanja lebih hemat!</p>
                </div>
              </div>
              <Coins className="absolute -right-4 -bottom-4 w-40 h-40 text-white/10 rotate-12" />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="riwayat" className="w-full">
              <TabsList className="bg-white p-1 rounded-2xl border border-gray-100 mb-6 inline-flex">
                <TabsTrigger value="riwayat" className="px-8 py-3 rounded-xl data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                  Riwayat Transaksi
                </TabsTrigger>
                <TabsTrigger value="kadaluarsa" className="px-8 py-3 rounded-xl data-[state=active]:bg-pink-500 data-[state=active]:text-white">
                  Akan Kadaluarsa
                </TabsTrigger>
              </TabsList>

              <TabsContent value="riwayat">
                {isLoading ? (
                  <div className="py-20 text-center"><Loader2 className="w-10 h-10 animate-spin text-pink-500 mx-auto" /></div>
                ) : transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((t) => (
                      <div key={t.id} className="bg-white rounded-2xl p-6 flex justify-between items-center shadow-sm border border-gray-50 hover:border-pink-100 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${t.amount > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            <CoinsIcon size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{getTransactionTitle(t.transaction_type, t.description)}</p>
                            <p className="text-xs text-gray-400 font-medium">{new Date(t.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                        <div className={`text-lg font-black ${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {t.amount > 0 ? "+" : ""}{t.amount.toLocaleString("id-ID")}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Coins size={32} className="text-gray-200" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada riwayat poin</h3>
                    <p className="text-gray-500">Kumpulkan poin dari setiap transaksi Anda!</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="kadaluarsa">
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                  <p className="text-gray-500 font-medium">Belum ada poin yang akan kadaluarsa dalam waktu dekat.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* About Poin Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-gray-900">Tentang Poin MOLA</h2>
                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <X size={24} className="text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {pointInfo.map((info, index) => (
                      <div key={index} className="flex gap-6 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0 w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-2xl">
                          {info.icon}
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium">{info.text}</p>
                      </div>
                    ))}
                  </div>
                  
                  <button onClick={() => setShowModal(false)} className="w-full mt-10 py-4 bg-pink-500 text-white font-bold rounded-2xl shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all">
                    Saya Mengerti
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}