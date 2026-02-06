/** @format */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContexts";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  Loader2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import {
  getSalesProfile,
  getCommissionLogs,
  getCommissionSummary,
} from "@/lib/service/sales/sales-service";
import Link from "next/link";

export default function CommissionsPage() {
  const { user } = useAuth();
  const [commissions, setCommissions] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const profile = await getSalesProfile(user?.id);
      if (profile) {
        const [logs, commSummary] = await Promise.all([
          getCommissionLogs(profile.id),
          getCommissionSummary(profile.id),
        ]);
        setCommissions(logs);
        setSummary(commSummary);
      }
      setIsLoading(false);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

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
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/sales"
              className="p-2 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Detail Komisi
              </h1>
              <p className="text-gray-600">
                Riwayat pendapatan dari referral Anda
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                Total Cair
              </p>
              <p className="text-xl font-bold text-gray-900">
                Rp{" "}
                {Number(summary?.total_commission || 0).toLocaleString("id-ID")}
              </p>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm text-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                Pending
              </p>
              <p className="text-xl font-bold text-pink-600">
                Rp{" "}
                {Number(summary?.pending_commission || 0).toLocaleString(
                  "id-ID",
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                    Nilai Transaksi
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                    Komisi (%)
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                    Jumlah Komisi
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y border-gray-100">
                {commissions.length > 0 ? (
                  commissions.map((comm) => (
                    <tr
                      key={comm.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Calendar size={14} />
                          {new Date(comm.created_at).toLocaleDateString(
                            "id-ID",
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {comm.member?.full_name || "Guest User"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                          {comm.commission_type === "join_member"
                            ? "JOIN MEMBER"
                            : "BELANJA"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-600">
                        Rp{" "}
                        {Number(comm.transaction_amount).toLocaleString(
                          "id-ID",
                        )}
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-gray-600">
                        {(comm.commission_rate * 100).toFixed(0)}%
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        Rp{" "}
                        {Number(comm.commission_amount).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {comm.status === "paid" ||
                          comm.status === "approved" ? (
                            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold">
                              <CheckCircle2 size={12} /> BERHASIL
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-xs font-bold">
                              <Clock size={12} /> PENDING
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-20 text-center text-gray-400 italic"
                    >
                      Belum ada catatan komisi tersedia.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
