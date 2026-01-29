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
  Users,
  Edit3,
  Trash2,
  X,
  Upload
} from "lucide-react";
import { adminGetCourses, adminUpdateCourse } from "@/lib/service/admin/admin-service";
import Link from "next/link";
import Image from "next/image";

export default function AdminAkademiPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editId, setEditId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    level: "Beginner",
    image: null as File | null
  });

  const fetchCourses = async () => {
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

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    if (user) fetchCourses();
  }, [user]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditId(null);
    setFormData({ title: "", description: "", instructor: "", level: "Beginner", image: null });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: any) => {
    setModalMode('edit');
    setEditId(course.id);
    setFormData({
      title: course.title,
      description: course.description || "",
      instructor: course.instructor || "",
      level: course.level || "Beginner",
      image: null
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kursus ini secara permanen? Semua lesson di dalamnya akan ikut terhapus.")) return;
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/admin/akademi?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Gagal menghapus kursus");
      alert("Kursus berhasil dihapus");
      fetchCourses();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = "";
      if (formData.image) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.image);
        uploadFormData.append('folder', 'courses');
        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: uploadFormData });
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const method = modalMode === 'create' ? "POST" : "PATCH";
      const body: any = { ...formData, thumbnail_url: imageUrl };
      if (modalMode === 'edit') body.id = editId;

      const response = await fetch("/api/admin/akademi", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error("Gagal menyimpan kursus");

      alert(`Kursus berhasil ${modalMode === 'create' ? 'dibuat' : 'diupdate'}!`);
      setIsModalOpen(false);
      fetchCourses();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
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
              <h1 className="text-3xl font-bold text-gray-900">Manajemen Akademi</h1>
              <p className="text-gray-600">Upload materi kursus, kelola video dan kurikulum</p>
            </div>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="bg-pink-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-pink-600 transition-all flex items-center gap-2 shadow-lg shadow-pink-100"
          >
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
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-pink-500 bg-pink-50 px-3 py-1 rounded-full uppercase tracking-wider">
                      {course.level}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenEdit(course)} className="p-2 text-gray-400 hover:text-pink-500 transition-colors"><Edit3 size={20} /></button>
                      <button onClick={() => handleDelete(course.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
                  <p className="text-gray-500 mb-6 line-clamp-2">{course.description}</p>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex gap-6">
                       <div className="flex items-center gap-2 text-gray-400 text-sm font-bold"><PlayCircle size={16}/> {course.instructor || 'Expert'}</div>
                    </div>
                    <Link 
                      href={`/dashboard/admin/akademi/${course.id}`}
                      className="bg-pink-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-pink-600 flex items-center gap-2 shadow-lg shadow-pink-100"
                    >
                      Kelola Kurikulum <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-900">{modalMode === 'create' ? 'Tambah Kursus' : 'Edit Kursus'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Judul Kursus</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Instruktur</label>
                    <input type="text" required value={formData.instructor} onChange={e => setFormData({...formData, instructor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Level</label>
                    <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none">
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi</label>
                  <textarea rows={3} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Thumbnail</label>
                  <input type="file" accept="image/*" onChange={e => setFormData({...formData, image: e.target.files?.[0] || null})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100" />
                </div>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-pink-500 text-white font-bold rounded-2xl shadow-lg hover:bg-pink-600 disabled:bg-gray-300 flex items-center justify-center gap-2">
                {isSubmitting && <Loader2 size={20} className="animate-spin" />}
                {modalMode === 'create' ? 'Buat Kursus' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}