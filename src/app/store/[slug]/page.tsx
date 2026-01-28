/** @format */

// app/store/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Star, Minus, Plus, ShoppingCart, X, CheckCircle, Loader2 } from "lucide-react";
import { getProductDetailBySlug, getAllProducts, ProductDetailData, ProductData } from "@/lib/service/member/products";
import ProductCard from "@/components/layout/productcard";
import { useCart } from "@/app/contexts/CartContexts";
import AddToCartToast from "@/components/cart/AddToCartToast";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productSlug = params.slug as string;

  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { addToCart } = useCart();
  const [showAddToCartToast, setShowAddToCartToast] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [detail, allProducts] = await Promise.all([
        getProductDetailBySlug(productSlug),
        getAllProducts()
      ]);
      setProduct(detail);
      setRecommendedProducts(allProducts.filter(p => p.slug !== productSlug).slice(0, 4));
      setIsLoading(false);
    };
    fetchData();
  }, [productSlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
           <p className="text-2xl text-gray-500 mb-4">Produk tidak ditemukan</p>
           <button onClick={() => router.push('/store')} className="text-pink-500 font-bold hover:underline">Kembali ke Toko</button>
        </div>
      </div>
    );
  }

  const averageRating = product.rating;
  const priceNumber = parseInt(product.price.replace(/[^0-9]/g, ""));

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: priceNumber,
      quantity: quantity,
      image: product.image,
      cashback: product.cashback,
      slug: productSlug,
    });
    setShowAddToCartToast(true);
  };

  const handleBuyNow = () => {
    const cartItem = {
      id: `cart-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: priceNumber,
      quantity: quantity,
      image: product.image,
      cashback: product.cashback,
      slug: product.slug,
    };
    localStorage.setItem("checkout_items", JSON.stringify([cartItem]));
    router.push("/checkout");
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRating === 0 || !reviewTitle.trim() || !reviewComment.trim()) {
      alert("Please fill in all fields");
      return;
    }
    setShowSuccessAlert(true);
    setShowReviewModal(false);
    setSelectedRating(0);
    setReviewTitle("");
    setReviewComment("");
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Product Detail Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Images */}
            <div>
              <div className="relative bg-[#F8F8FF] rounded-2xl overflow-hidden mb-4 h-[500px]">
                {product.colorLabel && (
                  <div className="absolute top-6 left-6 z-10 bg-white px-4 py-2 rounded-lg shadow-md">
                    <p className="text-lg font-bold text-gray-900">{product.colorLabel}</p>
                  </div>
                )}
                <Image
                  src={product.images[selectedImage] || product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {(product.images.length > 0 ? product.images : [product.image]).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 bg-[#F8F8FF] rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-pink-500" : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${index + 1}`} fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Info */}
            <div>
              <p className="text-pink-500 font-semibold mb-2">{product.category}</p>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center gap-4 mb-6">
                <p className="text-3xl font-semibold text-gray-900">{product.price}</p>
                <span className="bg-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-bold">
                  Cashback {product.cashback.toLocaleString("id-ID")} Poin
                </span>
              </div>

              <div className="mb-6">
                <div className="border-2 border-pink-500 rounded-lg px-6 py-2 inline-flex items-center gap-6">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-pink-500"><Minus className="w-5 h-5" /></button>
                  <span className="text-pink-500 min-w-[30px] text-center font-bold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-pink-500 hover:text-pink-600"><Plus className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <button onClick={handleAddToCart} className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" /> Masukkan Keranjang
                </button>
                <button onClick={handleBuyNow} className="flex-1 border-2 border-pink-500 text-pink-500 hover:bg-pink-50 font-bold py-4 rounded-xl">
                  Beli Sekarang
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-8">Pajak dan pengiriman akan dihitung saat checkout</p>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Deskripsi</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
           <div className="bg-white rounded-2xl p-8 shadow-sm">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div>
                   <h2 className="text-3xl font-bold text-gray-900 mb-4">Ulasan Pelanggan</h2>
                   <button onClick={() => setShowReviewModal(true)} className="bg-pink-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-pink-600 transition-all">
                     Tulis Ulasan
                   </button>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</div>
                   <div>
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-6 h-6 ${s <= averageRating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />)}
                      </div>
                      <p className="text-sm text-gray-500">{product.reviews.length} ulasan</p>
                   </div>
                </div>
             </div>

             <div className="space-y-8">
               {product.reviews.length > 0 ? (
                 product.reviews.map((review) => (
                   <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0">
                     <div className="flex items-start gap-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                           <Image src={review.userAvatar} alt={review.userName} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-start mb-2">
                              <div>
                                 <p className="font-bold text-gray-900">{review.userName}</p>
                                 <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-4 h-4 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />)}
                                 </div>
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                           </div>
                           <p className="font-bold text-gray-900 mb-1">{review.title}</p>
                           <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                        </div>
                     </div>
                   </div>
                 ))
               ) : (
                 <p className="text-center text-gray-500 py-8">Belum ada ulasan untuk produk ini.</p>
               )}
             </div>
           </div>
        </div>
      </section>

      {/* Recommended */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Produk Rekomendasi</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendedProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* Modals & Toasts */}
      <AddToCartToast isVisible={showAddToCartToast} onClose={() => setShowAddToCartToast(false)} productName={product.name} />
      {showSuccessAlert && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-white rounded-xl shadow-2xl p-6 flex items-center gap-4 border-l-4 border-green-500">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="font-bold text-gray-900">Berhasil!</p>
              <p className="text-gray-600 text-sm">Ulasan Anda telah dikirim.</p>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden">
             <div className="flex items-center justify-between p-6 border-b">
               <h3 className="text-2xl font-bold text-gray-900">Tulis Ulasan</h3>
               <button onClick={() => setShowReviewModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6" /></button>
             </div>
             <form onSubmit={handleSubmitReview} className="p-8 space-y-6">
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-3">Rating *</label>
                   <div className="flex gap-2">
                     {[1, 2, 3, 4, 5].map(s => (
                       <button key={s} type="button" onClick={() => setSelectedRating(s)} className="transition-transform hover:scale-110">
                         <Star className={`w-10 h-10 ${s <= selectedRating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                       </button>
                     ))}
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Judul Review *</label>
                   <input type="text" value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-pink-500 outline-none" placeholder="Contoh: Warna sangat pigmented!" required />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-2">Review Anda *</label>
                   <textarea rows={4} value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-pink-500 outline-none resize-none" placeholder="Ceritakan pengalaman Anda..." required />
                </div>
                <div className="flex gap-4 pt-4">
                   <button type="button" onClick={() => setShowReviewModal(false)} className="flex-1 py-3 border-2 border-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Batal</button>
                   <button type="submit" className="flex-1 py-3 bg-pink-500 text-white rounded-xl font-bold hover:bg-pink-600 shadow-lg shadow-pink-100">Kirim Review</button>
                </div>
             </form>
           </div>
        </div>
      )}
    </div>
  );
}
