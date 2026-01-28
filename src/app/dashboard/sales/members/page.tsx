/** @format */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContexts";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft,
  Search,
  UserCircle,
  Phone,
  Calendar,
  Loader2
} from "lucide-react";
import { getSalesProfile, getReferredMembers } from "@/lib/service/sales/sales-service";
import Link from "next/link";

export default function ReferredMembersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const profile = await getSalesProfile(user?.id);
      if (profile) {
        const data = await getReferredMembers(profile.id);
        setMembers(data);
      }
      setIsLoading(false);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const filteredMembers = members.filter(m => 
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone?.includes(searchTerm)
  );

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
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/sales" className="p-2 hover:bg-white rounded-full transition-colors">
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Daftar Member</h1>
              <p className="text-gray-600">Total {members.length} member menggunakan kode Anda</p>
            </div>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Cari nama atau nomor HP..."
              value={searchTerm}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Members List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <div key={member.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-pink-200 transition-all group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 font-bold text-xl">
                    {member.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-pink-600 transition-colors">{member.fullName}</h3>
                    {member.status === 'active' ? (
                      <span className="inline-block px-2 py-0.5 bg-green-50 text-green-600 text-xs font-bold rounded-md border border-green-100">AKTIF</span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 bg-orange-50 text-orange-600 text-xs font-bold rounded-md border border-orange-100">PENDING (BELUM BAYAR)</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-500 text-sm">
                    <Phone size={16} />
                    <span>{member.phone || "Tidak ada nomor"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-500 text-sm">
                    <Calendar size={16} />
                    <span>Gabung: {new Date(member.joinDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <UserCircle size={48} className="mx-auto text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium text-lg">Belum ada member yang ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
