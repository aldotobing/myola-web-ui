/** @format */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContexts";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft,
  Plus,
  Loader2,
  Trash2,
  Tag,
  X,
  LayoutGrid
} from "lucide-react";
import { adminGetCategories } from "@/lib/service/admin/admin-service";
import Link from "next/link";

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await adminGetCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    if (user) fetchCategories();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Gagal membuat kategori");

      setFormData({ name: "", description: "" });
      alert("Kategori berhasil ditambahkan!");
      await fetchCategories();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kategori ini? Produk yang menggunakan kategori ini mungkin terpengaruh.")) return;
    
    setDeletingId(id);
    try {
      const response = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Gagal menghapus kategori");
      
      setCategories(prev => prev.filter(c => c.id !== id));
      alert("Kategori berhasil dihapus");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setDeletingId(null);
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/dashboard/admin/products" className="p-2 hover:bg-white rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Kategori</h1>
            <p className="text-gray-600">Kelola kategori untuk produk store Anda</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Add Category Form */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Plus size={20} className="text-pink-500" /> Tambah Baru
              </h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Kategori</label>
                  <input 
                    type="text" required
                    placeholder="Contoh: Pewarna Rambut"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-pink-500 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi (Opsional)</label>
                  <textarea 
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-pink-500 outline-none transition-all resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition-all shadow-lg shadow-pink-100 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                  Simpan
                </button>
              </form>
            </div>
          </div>

          {/* Categories List */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Kategori</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Deskripsi</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y border-gray-100">
                    {categories.length > 0 ? categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{cat.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">{cat.slug}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-500 line-clamp-1">{cat.description || '-'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <button 
                              disabled={deletingId === cat.id}
                              onClick={() => handleDelete(cat.id)}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                            >
                              {deletingId === cat.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic">
                          Belum ada kategori. Gunakan form di samping untuk menambah.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
