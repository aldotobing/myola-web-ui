/** @format */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContexts";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft,
  Plus,
  Loader2,
  Trash2,
  X,
  BookOpen,
  Clock,
  PlayCircle,
  GripVertical,
  Upload,
  Edit3
} from "lucide-react";
import { adminGetCourseById, adminGetLessons } from "@/lib/service/admin/admin-service";
import Link from "next/link";
import Image from "next/image";

export default function AdminCurriculumPage() {
  const { user } = useAuth();
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editId, setEditId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    level: "Beginner",
    image: null as File | null
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [c, l] = await Promise.all([
        adminGetCourseById(courseId),
        adminGetLessons(courseId)
      ]);
      setCourse(c);
      setLessons(l);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditId(null);
    setFormData({ title: "", duration: "", level: "Beginner", image: null });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lesson: any) => {
    setModalMode('edit');
    setEditId(lesson.id);
    setFormData({
      title: lesson.title,
      duration: lesson.duration || "",
      level: lesson.level || "Beginner",
      image: null
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrl = "";
      if (formData.image) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.image);
        uploadFormData.append('folder', 'lessons');
        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: uploadFormData });
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url;
      }

      const method = modalMode === 'create' ? "POST" : "PATCH";
      const body: any = { 
        ...formData, 
        course_id: courseId,
        thumbnail_url: imageUrl 
      };
      if (modalMode === 'edit') body.id = editId;

      const response = await fetch("/api/admin/akademi/lessons", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error("Gagal menyimpan materi");
      
      alert(`Materi berhasil ${modalMode === 'create' ? 'ditambahkan' : 'diperbarui'}!`);
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus materi ini? Semua video di dalamnya akan terhapus.")) return;
    try {
      await fetch(`/api/admin/akademi/lessons?id=${id}`, { method: "DELETE" });
      setLessons(prev => prev.filter(l => l.id !== id));
    } catch (error) {
      alert("Gagal menghapus");
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-pink-500" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard/admin/akademi" className="flex items-center text-gray-500 mb-8 hover:text-pink-500 transition-colors">
          <ArrowLeft className="mr-2" size={20}/> Kembali ke Daftar Kursus
        </Link>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-8 items-center">
          <div className="relative w-full md:w-48 h-32 rounded-2xl overflow-hidden flex-shrink-0">
            <Image src={course?.thumbnail_url || "/images/thumb.jpg"} alt={course?.title} fill className="object-cover" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">{course?.title}</h1>
            <p className="text-gray-500 font-medium">Kelola kurikulum dan materi pembelajaran</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Struktur Materi ({lessons.length})</h2>
          <button onClick={handleOpenCreate} className="bg-pink-500 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-pink-600 transition-all shadow-lg shadow-pink-100">
            <Plus size={18}/> Tambah Materi
          </button>
        </div>

        <div className="space-y-4">
          {lessons.map((lesson, idx) => (
            <div key={lesson.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between group hover:border-pink-200 transition-all shadow-sm">
              <div className="flex items-center gap-6 flex-1 w-full">
                <div className="text-gray-300 hidden sm:block"><GripVertical /></div>
                
                <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image src={lesson.thumbnail_url || "/images/thumb.jpg"} alt={lesson.title} fill className="object-cover" />
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">{lesson.title}</h3>
                  <div className="flex gap-4 text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                    <span className="flex items-center gap-1"><Clock size={12}/> {lesson.duration}</span>
                    <span className="flex items-center gap-1 text-pink-500"><BookOpen size={12}/> {lesson.level}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                <Link 
                  href={`/dashboard/admin/akademi/${courseId}/lesson/${lesson.id}`} 
                  className="flex-1 sm:flex-none p-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-all flex items-center justify-center gap-2 font-bold text-xs"
                >
                  <Plus size={16}/> Video
                </Link>
                <button onClick={() => handleOpenEdit(lesson)} className="p-3 bg-gray-50 text-gray-400 hover:text-pink-500 rounded-xl transition-all">
                  <Edit3 size={18}/>
                </button>
                <button onClick={() => handleDelete(lesson.id)} className="p-3 bg-red-50 text-red-400 hover:text-red-600 rounded-xl transition-all">
                  <Trash2 size={18}/>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="flex justify-between items-center p-8 border-b">
              <h3 className="text-2xl font-black text-gray-900">{modalMode === 'create' ? 'Tambah Materi' : 'Edit Materi'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Judul Materi</label>
                  <input required placeholder="Contoh: Teknik Sectioning Dasar" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-pink-500 outline-none transition-all" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Durasi</label>
                    <input required placeholder="Contoh: 15 menit" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-pink-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Level</label>
                    <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-pink-500 outline-none transition-all appearance-none">
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Thumbnail Materi {modalMode === 'edit' && "(Opsional)"}</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500 font-bold px-4 text-center">
                        {formData.image ? formData.image.name : "Klik untuk upload cover materi"}
                      </p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={e => setFormData({...formData, image: e.target.files?.[0] || null})} />
                  </label>
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-pink-500 text-white font-black rounded-2xl shadow-xl hover:bg-pink-600 disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center gap-2 transition-all">
                {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />} 
                {modalMode === 'create' ? 'Buat Materi Baru' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}