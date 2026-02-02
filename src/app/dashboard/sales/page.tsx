/** @format */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContexts";
import { useRouter } from "next/navigation";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  ChevronRight,
  Copy,
  CheckCircle2,
  Loader2,
  UserCircle,
  BarChart3
} from "lucide-react";
import { 
  getSalesProfile, 
  getCommissionSummary, 
  getPerformanceData 
} from "@/lib/service/sales/sales-service";
import Link from "next/link";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import useSWR from "swr";

export default function SalesDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  // Protect Route
  useEffect(() => {
    if (user && user.role !== 'sales' && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  // 1. Fetch Sales Profile (Base for others)
  const { data: salesProfile, isLoading: isLoadingProfile } = useSWR(
    user?.id ? ['sales-profile', user.id] : null,
    () => getSalesProfile(user?.id)
  );

  // 2. Fetch Summary using Profile ID
  const { data: summary, isLoading: isLoadingSummary } = useSWR(
    salesProfile?.id ? ['sales-summary', salesProfile.id] : null,
    () => getCommissionSummary(salesProfile.id)
  );

  // 3. Fetch Performance Data
  const { data: performance = [], isLoading: isLoadingPerf } = useSWR(
    salesProfile?.id ? ['sales-perf', salesProfile.id] : null,
    () => getPerformanceData(salesProfile.id)
  );

  const isLoading = isLoadingProfile || (!!salesProfile && isLoadingSummary);

  const copyReferralCode = () => {
    if (salesProfile?.referral_code) {
      navigator.clipboard.writeText(salesProfile.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading && !salesProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (!isLoading && !salesProfile && user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <DollarSign className="w-10 h-10 text-pink-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Akses Terbatas</h2>
          <p className="text-gray-500 mb-8">
            Hanya Staf Sales yang memiliki akses ke dashboard ini. Silakan hubungi Admin jika Anda seharusnya terdaftar sebagai Sales.
          </p>
          <Link href="/dashboard/profil" className="block w-full bg-pink-500 text-white font-bold py-4 rounded-2xl hover:bg-pink-600 transition-all shadow-lg shadow-pink-100">
            Kembali ke Profil
          </Link>
        </div>
      </div>
    );
  }

  // Handle Admin view fallback
  const displayProfile = salesProfile || (user?.role === 'admin' ? { referral_code: "ADMIN-MASTER" } : null);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
            <p className="text-gray-600">Selamat datang kembali, {user?.full_name}</p>
          </div>
          {displayProfile && (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kode Referral Anda</p>
                <p className="text-2xl font-black text-pink-600 tracking-tight">{displayProfile.referral_code}</p>
              </div>
              <button 
                onClick={copyReferralCode}
                className="p-3 bg-pink-50 text-pink-600 rounded-xl hover:bg-pink-100 transition-colors"
              >
                {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
              </button>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Users size={24} />
              </div>
              <p className="font-bold text-gray-500">Total Member</p>
            </div>
            <p className="text-4xl font-black text-gray-900">{summary?.member_count || 0}</p>
            <p className="mt-2 text-gray-400 text-sm font-medium">Aktif & Pending</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-pink-50 text-pink-600 rounded-2xl">
                <DollarSign size={24} />
              </div>
              <p className="font-bold text-gray-500">Total Komisi</p>
            </div>
            <p className="text-4xl font-black text-gray-900">Rp {Number(summary?.total_commission || 0).toLocaleString('id-ID')}</p>
            <p className="mt-2 text-gray-400 text-sm font-medium">Sudah disetujui</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                <TrendingUp size={24} />
              </div>
              <p className="font-bold text-gray-500">Pending</p>
            </div>
            <p className="text-4xl font-black text-gray-900">Rp {Number(summary?.pending_commission || 0).toLocaleString('id-ID')}</p>
            <p className="mt-2 text-gray-400 text-sm font-medium">Menunggu persetujuan</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Chart */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                  <BarChart3 size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Grafik Komisi</h3>
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">6 Bulan Terakhir</p>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performance}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(value) => `Rp ${value / 1000}k`} />
                  <Tooltip cursor={{fill: '#fdf2f7'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} formatter={(value: any) => [`Rp ${Number(value || 0).toLocaleString('id-ID')}`, 'Komisi']} />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={40}>
                    {performance.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index === performance.length - 1 ? '#db2777' : '#fbcfe8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Akses Cepat</h2>
            <div className="grid grid-cols-1 gap-4">
              <Link href="/dashboard/sales/members" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-pink-500 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-50 text-gray-600 rounded-xl group-hover:bg-pink-50 group-hover:text-pink-600 transition-colors">
                    <UserCircle size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Daftar Member</p>
                    <p className="text-sm text-gray-500">Lihat siapa saja yang menggunakan kode Anda</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-pink-500 transition-colors" />
              </Link>

              <Link href="/dashboard/sales/commissions" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-pink-500 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-50 text-gray-600 rounded-xl group-hover:bg-pink-50 group-hover:text-pink-600 transition-colors">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Detail Komisi</p>
                    <p className="text-sm text-gray-500">Log transaksi dan status pembayaran komisi</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-pink-500 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
