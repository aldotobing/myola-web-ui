/** @format */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContexts";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  ArrowLeft,
  Plus,
  Loader2,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  TrendingUp,
  Tag,
  X,
  Upload,
  Search,
  LayoutGrid
} from "lucide-react";
import { adminGetProducts, adminUpdateProduct, adminGetCategories } from "@/lib/service/admin/admin-service";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

export default function AdminProductsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editId, setEditId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    description: "",
    price: "",
    cashback_points: "",
    stock: "",
    image: null as File | null
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prodData, catData] = await Promise.all([
        adminGetProducts(),
        adminGetCategories()
      ]);
      setProducts(prodData);
      setCategories(catData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }
    if (user) fetchData();
  }, [user]);

  const toggleActive = async (id: string, currentStatus: boolean) => {
    setUpdatingId(id);
    try {
      await adminUpdateProduct(id, { is_active: !currentStatus });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
    } catch (error: any) {
      alert("Gagal update status: " + error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus produk ini secara permanen?")) return;
    
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Gagal menghapus produk");
      
      setProducts(prev => prev.filter(p => p.id !== id));
      alert("Produk berhasil dihapus");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenEdit = (product: any) => {
    setModalMode('edit');
    setEditId(product.id);
    setFormData({
      name: product.name,
      category_id: product.category_id,
      description: product.description || "",
      price: product.price.toString(),
      cashback_points: product.cashback_points.toString(),
      stock: product.stock.toString(),
      image: null // We only upload if they choose a NEW one
    });
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setEditId(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = "";
      
      // 1. Upload Image to Storage if a NEW one is selected
      if (formData.image) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.image);
        uploadFormData.append('folder', 'products');

        const uploadResponse = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadFormData,
        });

        const uploadResult = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadResult.error || "Gagal upload gambar");
        
        imageUrl = uploadResult.url;
      }

      // 2. Create or Update via API
      const url = "/api/admin/products";
      const method = modalMode === 'create' ? "POST" : "PATCH";
      
      const body: any = {
        ...formData,
        price: parseFloat(formData.price),
        cashback_points: parseInt(formData.cashback_points),
        stock: parseInt(formData.stock),
      };

      if (modalMode === 'edit') body.id = editId;
      if (imageUrl) body.imageUrls = [imageUrl];

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `Gagal ${modalMode === 'create' ? 'membuat' : 'mengupdate'} produk`);

      alert(`Produk berhasil ${modalMode === 'create' ? 'ditambahkan' : 'diperbarui'}!`);
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category_id: "",
      description: "",
      price: "",
      cashback_points: "",
      stock: "",
      image: null
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
    );
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/admin" className="p-2 hover:bg-white rounded-full transition-colors">
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manajemen Produk</h1>
              <p className="text-gray-600">Atur inventaris, harga, dan poin cashback store</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/dashboard/admin/products/categories"
              className="bg-white text-gray-700 border border-gray-200 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <LayoutGrid size={20} className="text-pink-500" /> Kelola Kategori
            </Link>
            <button 
              onClick={handleOpenCreate}
              className="bg-pink-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-pink-600 transition-all flex items-center gap-2 shadow-lg shadow-pink-100"
            >
              <Plus size={20} /> Tambah Produk Baru
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Cari nama produk..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className={`bg-white rounded-3xl overflow-hidden border-2 transition-all group ${product.is_active ? 'border-transparent shadow-sm hover:border-pink-200' : 'border-gray-100 grayscale opacity-60'}`}>
              <div className="relative h-48 bg-gray-100">
                <Image 
                  src={product.image_url || "/images/product_1.png"} 
                  alt={product.name} 
                  fill 
                  className="object-contain p-4"
                />
                {!product.is_active && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white text-gray-900 px-4 py-1 rounded-full text-xs font-bold">NON-AKTIF</span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-pink-500 uppercase tracking-widest">{product.product_categories?.name}</span>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <TrendingUp size={14} />
                    <span className="text-xs font-bold text-gray-900">{product.rating}</span>
                  </div>
                </div>
                
                <h3 className="font-bold text-gray-900 mb-4 line-clamp-1">{product.name}</h3>
                
                <div className="space-y-3 mb-6 border-t border-gray-50 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Harga</span>
                    <span className="font-bold text-gray-900">Rp {Number(product.price).toLocaleString('id-ID') || '0'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Stok</span>
                    <span className={`font-bold ${product.stock < 10 ? 'text-orange-500' : 'text-gray-900'}`}>{product.stock}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1"><Tag size={12} /> Cashback</span>
                    <span className="font-bold text-pink-600">{product.cashback_points.toLocaleString()} Poin</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenEdit(product)}
                    className="flex-1 bg-gray-50 text-gray-600 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-100 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                  <button 
                    disabled={updatingId === product.id}
                    onClick={() => toggleActive(product.id, product.is_active)}
                    className={`p-2.5 rounded-xl transition-colors ${product.is_active ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                  >
                    {updatingId === product.id ? <Loader2 size={18} className="animate-spin" /> : (product.is_active ? <EyeOff size={18} /> : <Eye size={18} />)}
                  </button>
                  <button 
                    disabled={updatingId === product.id}
                    onClick={() => handleDelete(product.id)}
                    className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal (Create & Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-900">
                {modalMode === 'create' ? 'Tambah Produk Baru' : 'Edit Produk'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Produk</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-pink-500 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                  <select 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-pink-500 outline-none transition-all appearance-none"
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Harga (Rupiah)</label>
                  <input 
                    type="number" required
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-pink-500 outline-none transition-all"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stok</label>
                  <input 
                    type="number" required
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-pink-500 outline-none transition-all"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Cashback (Poin)</label>
                  <input 
                    type="number" required
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-pink-500 outline-none transition-all"
                    value={formData.cashback_points}
                    onChange={(e) => setFormData({...formData, cashback_points: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi</label>
                  <textarea 
                    rows={4} required
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-pink-500 outline-none transition-all resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Foto Produk {modalMode === 'edit' && "(Opsional)"}</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          {formData.image ? formData.image.name : (modalMode === 'edit' ? "Biarkan kosong jika tidak ingin ganti foto" : "Klik untuk upload foto")}
                        </p>
                      </div>
                      <input 
                        type="file" className="hidden" accept="image/*"
                        onChange={(e) => setFormData({...formData, image: e.target.files?.[0] || null})}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 shadow-lg shadow-pink-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                  {isSubmitting ? "Menyimpan..." : (modalMode === 'create' ? "Simpan Produk" : "Perbarui Produk")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
