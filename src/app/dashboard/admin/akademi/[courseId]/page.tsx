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
  GripVertical
} from "lucide-react";
import { adminGetCourseById, adminGetLessons } from "@/lib/service/admin/admin-service";
import Link from "next/link";

export default function AdminCurriculumPage() {
  const { user } = useAuth();
  const params = useParams();
  const courseId = params.courseId as string;
  
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    level: "Beginner"
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

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/akademi/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, course_id: courseId })
      });
      if (!response.ok) throw new Error("Gagal membuat materi");
      alert("Materi berhasil ditambahkan!");
      setIsModalOpen(false);
      setFormData({ title: "", duration: "", level: "Beginner" });
      fetchData();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus materi ini?")) return;
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
        <Link href="/dashboard/admin/akademi" className="flex items-center text-gray-500 mb-8"><ArrowLeft className="mr-2"/> Kembali</Link>
        <div className="bg-white p-8 rounded-3xl shadow-sm border mb-8">
          <h1 className="text-3xl font-bold mb-2">{course?.title}</h1>
          <p className="text-gray-500">Kelola kurikulum dan materi pembelajaran</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Daftar Materi ({lessons.length})</h2>
          <button onClick={() => setIsModalOpen(true)} className="bg-pink-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2"><Plus size={18}/> Tambah Materi</button>
        </div>

        <div className="space-y-4">
          {lessons.map((lesson, idx) => (
            <div key={lesson.id} className="bg-white p-6 rounded-2xl border flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="text-gray-300 group-hover:text-pink-200 transition-colors"><GripVertical /></div>
                <div className="w-10 h-10 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center font-bold">{idx + 1}</div>
                <div>
                  <h3 className="font-bold text-gray-900">{lesson.title}</h3>
                  <div className="flex gap-4 text-xs text-gray-400 font-bold mt-1">
                    <span className="flex items-center gap-1"><Clock size={12}/> {lesson.duration}</span>
                    <span className="flex items-center gap-1"><BookOpen size={12}/> {lesson.level}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/admin/akademi/${courseId}/lesson/${lesson.id}`} className="p-2 bg-gray-50 text-gray-400 hover:text-pink-500 rounded-lg"><Plus size={20}/></Link>
                <button onClick={() => handleDelete(lesson.id)} className="p-2 bg-red-50 text-red-400 hover:text-red-600 rounded-lg"><Trash2 size={20}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Tambah Materi</h3>
              <button onClick={() => setIsModalOpen(false)}><X/></button>
            </div>
            <form onSubmit={handleCreateLesson} className="space-y-4">
              <input required placeholder="Judul Materi" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none border-none focus:ring-2 focus:ring-pink-500" />
              <input required placeholder="Durasi (Contoh: 15 menit)" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none border-none focus:ring-2 focus:ring-pink-500" />
              <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none border-none focus:ring-2 focus:ring-pink-500">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-pink-500 text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2">
                {isSubmitting && <Loader2 className="animate-spin" />} Simpan Materi
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
