/** @format */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContexts";
import { useRouter } from "next/navigation";
import { 
  DollarSign, 
  ArrowLeft,
  Search,
  Loader2,
  CheckCircle2,
  Clock,
  Calendar,
  Wallet,
  ArrowUpRight
} from "lucide-react";
import { adminGetCommissionReports } from "@/lib/service/admin/admin-service";
import Link from "next/link";

export default function AdminCommissionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [commissions, setCommissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const fetchCommissions = async () => {
    setIsLoading(true);
    try {
      const data = await adminGetCommissionReports();
      setCommissions(data);
    } catch (error) {
      console.error("Error fetching commissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    if (user) fetchCommissions();
  }, [user]);

  const handleApprove = async (id: string) => {
    if (!confirm("Tandai komisi ini sebagai sudah dibayarkan?")) return;
    
    setApprovingId(id);
    try {
      const response = await fetch("/api/admin/commissions/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commissionId: id })
      });

      if (!response.ok) throw new Error("Gagal memproses pembayaran");

      alert("Komisi berhasil ditandai sebagai PAID");
      await fetchCommissions();
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/dashboard/admin/users" className="p-2 hover:bg-white rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laporan Komisi Sales</h1>
            <p className="text-gray-600">Pantau dan setujui pembayaran komisi staf sales</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Sales & Code</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Member</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Tipe</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Jumlah</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y border-gray-100">
                {commissions.map((comm) => (
                  <tr key={comm.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{comm.sales?.profiles?.full_name}</p>
                      <p className="text-xs text-pink-500 font-bold uppercase tracking-widest">{comm.sales?.referral_code}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-700">{comm.member?.full_name}</p>
                      <p className="text-[10px] text-gray-400 uppercase">{new Date(comm.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black px-2 py-1 bg-gray-100 text-gray-500 rounded-md uppercase">
                        {comm.commission_type === 'join_member' ? 'JOIN' : 'SHOP'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-black text-gray-900">Rp {Number(comm.commission_amount).toLocaleString('id-ID')}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {comm.status === 'paid' ? (
                          <span className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black">
                            <CheckCircle2 size={12} /> PAID
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black">
                            <Clock size={12} /> PENDING
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {comm.status === 'pending' && (
                          <button 
                            onClick={() => handleApprove(comm.id)}
                            disabled={approvingId === comm.id}
                            className="bg-green-500 text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-green-600 flex items-center gap-1 transition-all disabled:opacity-50"
                          >
                            {approvingId === comm.id ? <Loader2 size={12} className="animate-spin" /> : <Wallet size={12} />} Bayar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
