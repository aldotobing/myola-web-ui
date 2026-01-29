/** @format */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContexts";
import { useRouter } from "next/navigation";
import { 
  Users, 
  ArrowLeft,
  Search,
  Plus,
  Loader2,
  CreditCard,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  Zap,
  DollarSign
} from "lucide-react";
import { adminGetMembers, adminGetSales } from "@/lib/service/admin/admin-service";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const [memberData, salesData] = await Promise.all([
        adminGetMembers(),
        adminGetSales()
      ]);
      setMembers(memberData);
      setSales(salesData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    if (user) fetchUsers();
  }, [user]);

  const handleApprove = async (userId: string) => {
    if (!confirm("Konfirmasi aktivasi member secara manual? Poin dan komisi akan otomatis terhitung.")) return;
    
    setApprovingId(userId);
    try {
      const response = await fetch("/api/admin/approve-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Gagal menyetujui member");

      alert("Member berhasil diaktifkan!");
      await fetchUsers(); // Refresh list
    } catch (error: any) {
      alert(error.message);
    } finally {
      setApprovingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
    );
  }

  const filteredMembers = members.filter(m => 
    m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.phone?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/admin" className="p-2 hover:bg-white rounded-full transition-colors">
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User & Sales Management</h1>
              <p className="text-gray-600">Kelola database member dan staf penjualan</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/dashboard/admin/users/commissions"
              className="bg-white text-gray-700 border border-gray-200 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <DollarSign size={20} className="text-pink-500" /> Laporan Komisi
            </Link>
            <Link 
              href="/dashboard/admin/users/create-sales"
              className="bg-pink-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-pink-600 transition-all flex items-center gap-2 shadow-lg shadow-pink-100"
            >
              <Plus size={20} /> Tambah Staf Sales
            </Link>
          </div>
        </div>

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="bg-white p-1 rounded-2xl border border-gray-100 mb-8 inline-flex">
            <TabsTrigger value="members" className="px-8 py-3 rounded-xl data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              Daftar Member ({members.length})
            </TabsTrigger>
            <TabsTrigger value="sales" className="px-8 py-3 rounded-xl data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              Daftar Sales ({sales.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text"
                    placeholder="Cari member (nama, nomor HP, atau email)..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Member</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Kontak & Referral</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Pembayaran</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-gray-100">
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                              {member.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{member.full_name}</p>
                              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">ID: {member.user_id.slice(0,8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700 font-medium">{member.phone}</p>
                          <p className="text-xs text-pink-500 font-bold">Code: {member.referral_code_used || 'DIRECT'}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {member.payment_status === 'paid' ? (
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">LUNAS</span>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">BELUM BAYAR</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {member.membership_status === 'active' ? (
                            <span className="inline-block px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-full border border-green-100">AKTIF</span>
                          ) : (
                            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black rounded-full border border-orange-100">PENDING</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            {member.membership_status === 'pending' && (
                              <button 
                                onClick={() => handleApprove(member.user_id)}
                                disabled={approvingId === member.user_id}
                                className="bg-pink-500 text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-pink-600 flex items-center gap-1 transition-all disabled:opacity-50"
                              >
                                {approvingId === member.user_id ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />} Approve
                              </button>
                            )}
                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400" title="Detail User">
                              <ExternalLink size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sales">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sales.map((item) => (
                <div key={item.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-pink-200 transition-all group relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-black">
                      {item.profiles?.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Referral Code</p>
                      <p className="text-xl font-black text-pink-600 tracking-tight">{item.referral_code}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{item.profiles?.full_name}</h3>
                  <p className="text-gray-500 text-sm mb-6">{item.profiles?.phone || item.profiles?.email}</p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50 mb-6">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Member</p>
                      <p className="font-bold text-gray-900">{item.member_count} Member</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Status</p>
                      <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                        <CheckCircle2 size={12} /> AKTIF
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Total Cair</p>
                      <p className="font-bold text-gray-900 text-sm">Rp {Number(item.total_commission).toLocaleString('id-ID')}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-orange-400 uppercase mb-1">Pending</p>
                      <p className="font-bold text-orange-500 text-sm">Rp {Number(item.pending_commission).toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-8 flex gap-2">
                    <Link 
                      href={`/dashboard/admin/users/sales/${item.id}`}
                      className="flex-1 bg-gray-50 text-gray-600 py-3 rounded-xl text-xs font-bold hover:bg-gray-100 flex items-center justify-center gap-2 transition-colors"
                    >
                      <ExternalLink size={14} /> Lihat Performa
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}