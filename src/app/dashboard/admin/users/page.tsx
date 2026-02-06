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
  DollarSign,
  MoreHorizontal,
  Eye,
  Coins,
  Trash2,
  X,
  Settings2,
} from "lucide-react";
import {
  adminGetMembers,
  adminGetSales,
  adminUpdateMemberPoints,
} from "@/lib/service/admin/admin-service";
import Link from "next/link";
import NextImage from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import useSWR, { useSWRConfig } from "swr";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const [searchTerm, setSearchTerm] = useState("");
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // Points Modal State
  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPoints, setNewPoints] = useState("");
  const [pointReason, setPointReason] = useState("");
  const [isUpdatingPoints, setIsUpdatingPoints] = useState(false);

  // Status Modal State
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // KTP Modal State
  const [isKtpModalOpen, setIsKtpModalOpen] = useState(false);
  const [ktpUrl, setKtpUrl] = useState("");
  const [isLoadingKtp, setIsLoadingKtp] = useState(false);

  // Protect Route
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // SWR Fetching
  const { data: members = [], isLoading: isLoadingMembers } = useSWR(
    user?.role === "admin" ? "admin-members" : null,
    adminGetMembers,
  );

  const { data: sales = [], isLoading: isLoadingSales } = useSWR(
    user?.role === "admin" ? "admin-sales" : null,
    adminGetSales,
  );

  const isLoading = isLoadingMembers || isLoadingSales;

  const handleApprove = async (userId: string) => {
    if (
      !confirm(
        "Approve member ini? Member akan mendapatkan 49.000 poin otomatis.",
      )
    )
      return;

    setApprovingId(userId);
    try {
      const response = await fetch("/api/admin/approve-member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Gagal approve member");

      toast.success("Member berhasil diaktifkan!");
      mutate("admin-members");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setApprovingId(null);
    }
  };

  const handleViewKtp = async (member: any) => {
    if (!member.ktp_image_url) {
      toast.error("Member belum upload KTP");
      return;
    }

    setIsLoadingKtp(true);
    setSelectedUser(member);
    setIsKtpModalOpen(true);

    try {
      const response = await fetch(
        "/api/member/upload-ktp?path=" +
          encodeURIComponent(member.ktp_image_url),
      );
      const data = await response.json();
      if (data.url) {
        setKtpUrl(data.url);
      } else {
        throw new Error("Gagal mengambil data KTP");
      }
    } catch (error) {
      toast.error("Gagal memuat KTP");
      setIsKtpModalOpen(false);
    } finally {
      setIsLoadingKtp(false);
    }
  };

  const handleOpenPoints = (member: any) => {
    setSelectedUser(member);
    setNewPoints(member.points_balance.toString());
    setPointReason("");
    setIsPointsModalOpen(true);
  };

  const handleOpenStatus = (member: any) => {
    setSelectedUser(member);
    setSelectedStatus(member.membership_status);
    setIsStatusModalOpen(true);
  };

  const handleUpdatePoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsUpdatingPoints(true);
    try {
      await adminUpdateMemberPoints(
        selectedUser.user_id,
        parseInt(newPoints),
        pointReason,
      );
      toast.success("Poin berhasil diperbarui!");
      setIsPointsModalOpen(false);
      mutate("admin-members");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdatingPoints(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsUpdatingStatus(true);
    try {
      const response = await fetch("/api/admin/members/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.user_id,
          status: selectedStatus,
        }),
      });

      if (!response.ok) throw new Error("Gagal update status");

      toast.success("Status berhasil diperbarui!");
      setIsStatusModalOpen(false);
      mutate("admin-members");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading && members.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
    );
  }

  const filteredMembers = (members as any[]).filter(
    (m) =>
      m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone?.includes(searchTerm),
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/admin"
              className="p-2 hover:bg-white rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                User & Sales Management
              </h1>
              <p className="text-gray-600">
                Kelola database member dan staf penjualan
              </p>
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
            <TabsTrigger
              value="members"
              className="px-8 py-3 rounded-xl data-[state=active]:bg-pink-500 data-[state=active]:text-white"
            >
              <Users size={18} className="mr-2" /> Database Member
            </TabsTrigger>
            <TabsTrigger
              value="sales"
              className="px-8 py-3 rounded-xl data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <ShieldCheck size={18} className="mr-2" /> Staf Sales
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Cari member berdasarkan nama atau nomor HP..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                        Member
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">
                        Kontak & Referral
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">
                        Pembayaran
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">
                        Status
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-gray-100">
                    {filteredMembers.map((member: any) => (
                      <tr
                        key={member.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                              {member.full_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">
                                {member.full_name}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">
                                  ID: {member.user_id.slice(0, 8)}
                                </span>
                                <span className="text-[10px] text-pink-600 font-bold flex items-center gap-0.5">
                                  <Coins size={10} />{" "}
                                  {member.points_balance?.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700 font-medium">
                            {member.phone}
                          </p>
                          <p className="text-xs text-pink-500 font-bold">
                            Code: {member.referral_code_used || "DIRECT"}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {member.payment_status === "paid" ? (
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                              LUNAS
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
                              BELUM BAYAR
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleOpenStatus(member)}
                            className="hover:scale-105 transition-transform"
                          >
                            {member.membership_status === "active" ? (
                              <span className="inline-block px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 uppercase">
                                AKTIF
                              </span>
                            ) : member.membership_status === "expired" ? (
                              <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-full border border-red-100 uppercase">
                                EXPIRED
                              </span>
                            ) : member.membership_status === "cancelled" ? (
                              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-400 text-[10px] font-bold rounded-full border border-gray-200 uppercase">
                                CANCELLED
                              </span>
                            ) : (
                              <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full border border-orange-100 uppercase">
                                PENDING
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            {member.membership_status === "pending" && (
                              <button
                                onClick={() => handleApprove(member.user_id)}
                                disabled={approvingId === member.user_id}
                                className="bg-pink-500 text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-pink-600 flex items-center gap-1 transition-all disabled:opacity-50"
                              >
                                {approvingId === member.user_id ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <Zap size={12} />
                                )}{" "}
                                Approve
                              </button>
                            )}

                            <button
                              onClick={() => handleViewKtp(member)}
                              className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                              title="Lihat KTP"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              onClick={() => handleOpenPoints(member)}
                              className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Edit Poin"
                            >
                              <Coins size={16} />
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
              {sales.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-pink-200 transition-all group relative"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">
                      {item.profiles?.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        Referral Code
                      </p>
                      <p className="text-xl font-bold text-pink-600 tracking-tight">
                        {item.referral_code}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {item.profiles?.full_name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    {item.profiles?.phone || item.profiles?.email}
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50 mb-6">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        Total Member
                      </p>
                      <p className="font-bold text-gray-900">
                        {item.member_count} Member
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        Status
                      </p>
                      <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                        <CheckCircle2 size={12} /> AKTIF
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        Total Cair
                      </p>
                      <p className="font-bold text-gray-900 text-sm">
                        Rp{" "}
                        {Number(item.total_commission).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-orange-400 uppercase mb-1">
                        Pending
                      </p>
                      <p className="font-bold text-orange-500 text-sm">
                        Rp{" "}
                        {Number(item.pending_commission).toLocaleString(
                          "id-ID",
                        )}
                      </p>
                    </div>
                  </div>

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

      {/* Adjust Points Modal */}
      {isPointsModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] max-w-sm w-full p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Coins className="text-blue-500" /> Atur Saldo Poin
              </h3>
              <button onClick={() => setIsPointsModalOpen(false)}>
                <X className="text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Sesuaikan poin untuk <strong>{selectedUser?.full_name}</strong>.
              Saldo saat ini: {selectedUser?.points_balance?.toLocaleString()}
            </p>
            <form onSubmit={handleUpdatePoints} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  Jumlah Poin Baru
                </label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
                  value={newPoints}
                  onChange={(e) => setNewPoints(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  Alasan Penyesuaian
                </label>
                <textarea
                  required
                  placeholder="Contoh: Bonus Event Khusus"
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                  rows={2}
                  value={pointReason}
                  onChange={(e) => setPointReason(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isUpdatingPoints}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUpdatingPoints && (
                  <Loader2 className="animate-spin" size={18} />
                )}{" "}
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Status Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] max-w-sm w-full p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Settings2 className="text-pink-500" /> Ubah Status Member
              </h3>
              <button onClick={() => setIsStatusModalOpen(false)}>
                <X className="text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Ubah status akses untuk <strong>{selectedUser?.full_name}</strong>
              .
            </p>
            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
                  Pilih Status Baru
                </label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none font-bold"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active (Full Access)</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isUpdatingStatus}
                className="w-full py-4 bg-pink-500 text-white font-bold rounded-2xl shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUpdatingStatus && (
                  <Loader2 className="animate-spin" size={18} />
                )}{" "}
                Perbarui Status
              </button>
            </form>
          </div>
        </div>
      )}

      {/* KTP View Modal */}
      {isKtpModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="flex justify-between items-center p-8 border-b">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                  Dokumen KTP
                </h3>
                <p className="text-gray-500 text-sm font-medium">
                  {selectedUser?.full_name}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsKtpModalOpen(false);
                  setKtpUrl("");
                }}
                className="p-3 hover:bg-gray-100 rounded-full transition-all group"
              >
                <X
                  className="text-gray-400 group-hover:text-gray-900"
                  size={24}
                />
              </button>
            </div>

            <div className="p-8 bg-gray-50 flex items-center justify-center min-h-[400px]">
              {isLoadingKtp ? (
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
                  <p className="text-gray-500 font-bold text-sm">
                    Mengambil dokumen aman...
                  </p>
                </div>
              ) : ktpUrl ? (
                <div className="relative w-full aspect-[1.58/1] rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                  <NextImage
                    src={ktpUrl}
                    alt="KTP Member"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-red-500 font-bold">
                    Gagal memuat dokumen.
                  </p>
                </div>
              )}
            </div>

            <div className="p-8 bg-white border-t flex gap-4">
              <button
                onClick={() => {
                  setIsKtpModalOpen(false);
                  setKtpUrl("");
                }}
                className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all"
              >
                Tutup Review
              </button>
              {ktpUrl && (
                <a
                  href={ktpUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-4 bg-pink-50 text-pink-600 font-bold rounded-2xl hover:bg-pink-100 transition-all flex items-center justify-center"
                >
                  <ExternalLink size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
