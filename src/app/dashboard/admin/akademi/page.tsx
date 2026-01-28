/** @format */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContexts";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  ArrowLeft,
  Plus,
  Loader2,
  Video,
  PlayCircle,
  Clock,
  MoreVertical,
  CheckCircle2,
  Lock,
  ChevronRight,
  Users
} from "lucide-react";
import { adminGetCourses } from "@/lib/service/admin/admin-service";
import Link from "next/link";
import Image from "next/image";

export default function AdminAkademiPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await adminGetCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/admin" className="p-2 hover:bg-white rounded-full transition-colors">
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manajemen Akademi</h1>
              <p className="text-gray-600">Upload materi kursus, kelola video dan kurikulum</p>
            </div>
          </div>
          <button className="bg-pink-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-pink-600 transition-all flex items-center gap-2 shadow-lg shadow-pink-100">
            <Plus size={20} /> Tambah Kursus Baru
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-pink-200 transition-all group">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="relative w-full lg:w-72 h-48 rounded-2xl overflow-hidden flex-shrink-0">
                  <Image 
                    src={course.thumbnail_url || "/images/thumb.jpg"} 
                    alt={course.title} 
                    fill 
                    className="object-cover"
                  />
                  {!course.is_active && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Lock className="text-white" size={32} />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-pink-500 bg-pink-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      {course.level}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={20} />
                    </button>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
                  <p className="text-gray-500 mb-6 line-clamp-2">{course.description}</p>

                  <div className="flex flex-wrap gap-6 mb-8">
                    <div className="flex items-center gap-2 text-gray-600">
                      <PlayCircle size={18} className="text-pink-500" />
                      <span className="text-sm font-medium">12 Video</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={18} className="text-pink-500" />
                      <span className="text-sm font-medium">4j 25m</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users size={18} className="text-pink-500" />
                      <span className="text-sm font-medium">450 Siswa</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-50">
                    <div className="flex -space-x-3 overflow-hidden">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200" />
                      ))}
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-50 ring-2 ring-white text-[10px] font-bold text-pink-600">
                        +42
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link 
                        href={`/dashboard/admin/akademi/${course.id}`}
                        className="bg-gray-50 text-gray-700 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-100 flex items-center gap-2"
                      >
                        Lihat Kurikulum <ChevronRight size={16} />
                      </Link>
                      <button className="bg-pink-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-pink-600 flex items-center gap-2">
                        <Plus size={16} /> Tambah Materi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
