/** @format */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContexts";
import { useRouter } from "next/navigation";
import { 
  Users, 
  ShoppingBag, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Package, 
  ChevronRight,
  Loader2,
  Settings,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { adminGetDashboardStats } from "@/lib/service/admin/admin-service";

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await adminGetDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchData();
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
    );
  }

  const statsConfig = [
    { label: "Total Penjualan", value: `Rp ${Number(stats?.totalPenjualan || 0).toLocaleString('id-ID')}`, icon: DollarSign, color: "bg-blue-50 text-blue-600" },
    { label: "Member Aktif", value: stats?.activeMembers?.toString() || "0", icon: Users, color: "bg-pink-50 text-pink-600" },
    { label: "Pesanan Baru", value: stats?.pesananBaru?.toString() || "0", icon: Package, color: "bg-orange-50 text-orange-600" },
    { label: "Kursus Akademi", value: stats?.totalCourses?.toString() || "0", icon: BookOpen, color: "bg-purple-50 text-purple-600" },
  ];

  const adminMenu = [
    { 
      title: "Manajemen Produk", 
      desc: "Kelola stok, harga, dan cashback produk store", 
      href: "/dashboard/admin/products", 
      icon: ShoppingBag,
      count: "Produk Store"
    },
    { 
      title: "Manajemen Akademi", 
      desc: "Upload kursus, lesson, dan video materi", 
      href: "/dashboard/admin/akademi", 
      icon: BookOpen,
      count: "Materi Kursus"
    },
    { 
      title: "Manajemen Event", 
      desc: "Kelola tiket dan kuota workshop/masterclass", 
      href: "/dashboard/admin/events", 
      icon: Calendar,
      count: "Agenda Event"
    },
    { 
      title: "Manajemen Order", 
      desc: "Proses pesanan produk dan event member", 
      href: "/dashboard/admin/orders", 
      icon: Package,
      count: "Transaksi"
    },
    { 
      title: "User & Sales", 
      desc: "Daftar member, data KTP, dan performa sales", 
      href: "/dashboard/admin/users", 
      icon: Users,
      count: "Database"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="text-pink-600" size={24} />
              <h1 className="text-3xl font-bold text-gray-900">Admin Master Dashboard</h1>
            </div>
            <p className="text-gray-600">Selamat datang di pusat kendali ekosistem MyOLA</p>
          </div>
          <button className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 transition-colors">
            <Settings size={20} />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsConfig.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-2xl ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <p className="font-bold text-gray-500 text-sm">{stat.label}</p>
              </div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <div className="mt-2 flex items-center text-green-600 text-[10px] font-bold uppercase tracking-wider">
                <TrendingUp size={12} className="mr-1" /> Real-time data
              </div>
            </div>
          ))}
        </div>

        {/* Management Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminMenu.map((item, i) => (
            <Link 
              key={i} 
              href={item.href}
              className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-pink-500 transition-all group flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-gray-50 text-gray-600 rounded-2xl group-hover:bg-pink-50 group-hover:text-pink-600 transition-colors">
                  <item.icon size={32} />
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full group-hover:bg-pink-100 group-hover:text-pink-600 transition-colors">
                  {item.count}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">{item.title}</h3>
              <p className="text-gray-500 text-sm mb-8 flex-grow">{item.desc}</p>
              <div className="flex items-center text-pink-600 font-bold text-sm">
                Kelola Sekarang <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}