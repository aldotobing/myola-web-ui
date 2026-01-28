/** @format */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContexts";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  ArrowLeft,
  Plus,
  Loader2,
  Edit3,
  Eye,
  EyeOff,
  Clock,
  MapPin,
  CircleDollarSign,
  Users
} from "lucide-react";
import { adminGetEvents, adminCreateEvent, adminUpdateProduct as adminUpdateEvent } from "@/lib/service/admin/admin-service";
import Link from "next/link";
import Image from "next/image";

export default function AdminEventsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await adminGetEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchData();
  }, [user, router]);

  const toggleActive = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    try {
      // Reusing adminUpdateProduct as it's a generic update helper in my current thought but I'll make a specific one if needed
      await adminUpdateEvent(id, { is_active: !currentStatus }); 
      setEvents(prev => prev.map(e => e.id === id ? { ...e, is_active: !currentStatus } : e));
    } catch (error: any) {
      alert("Gagal update status: " + error.message);
    } finally {
      setUpdatingId(null);
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
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/admin" className="p-2 hover:bg-white rounded-full transition-colors">
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manajemen Event</h1>
              <p className="text-gray-600">Kelola jadwal workshop, masterclass, dan penjualan tiket</p>
            </div>
          </div>
          <button className="bg-pink-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-pink-600 transition-all flex items-center gap-2 shadow-lg shadow-pink-100">
            <Plus size={20} /> Tambah Event Baru
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event.id} className={`bg-white rounded-3xl overflow-hidden border-2 transition-all flex flex-col sm:flex-row ${event.is_active ? 'border-transparent shadow-sm' : 'border-gray-100 grayscale opacity-60'}`}>
              <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-gray-100 flex-shrink-0">
                <Image 
                  src={event.image_url || "/images/kelas_1.png"} 
                  alt={event.title} 
                  fill 
                  className="object-cover"
                />
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-pink-500 uppercase tracking-widest">{event.category || 'EVENT'}</span>
                  <div className={`flex items-center gap-1 ${event.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                    <CheckCircle2 size={14} />
                    <span className="text-xs font-bold">{event.is_active ? 'AKTIF' : 'NON-AKTIF'}</span>
                  </div>
                </div>
                
                <h3 className="font-bold text-gray-900 mb-4 line-clamp-1">{event.title}</h3>
                
                <div className="grid grid-cols-2 gap-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar size={14} className="text-pink-500" />
                    <span>{new Date(event.event_date).toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} className="text-pink-500" />
                    <span>{event.start_time?.slice(0, 5)} {event.timezone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CircleDollarSign size={14} className="text-pink-500" />
                    <span className="font-bold text-gray-900">Rp {Number(event.price).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users size={14} className="text-pink-500" />
                    <span>{event.sold_count} / {event.quota || '∞'} Tiket</span>
                  </div>
                </div>

                <div className="mt-auto flex gap-2">
                  <button className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-xl text-sm font-bold hover:bg-gray-100 flex items-center justify-center gap-2 transition-colors">
                    <Edit3 size={16} /> Edit
                  </button>
                  <button 
                    disabled={updatingId === event.id}
                    onClick={() => toggleActive(event.id, event.is_active)}
                    className={`p-2 rounded-xl transition-colors ${event.is_active ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                  >
                    {updatingId === event.id ? <Loader2 size={18} className="animate-spin" /> : (event.is_active ? <EyeOff size={18} /> : <Eye size={18} />)}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper icons
function CheckCircle2({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/>
    </svg>
  );
}
