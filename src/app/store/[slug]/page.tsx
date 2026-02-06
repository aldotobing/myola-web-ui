/** @format */

// app/store/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import NextImage from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  X,
  CheckCircle,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import {
  getProductDetailBySlug,
  getAllProducts,
  ProductDetailData,
  ProductData,
} from "@/lib/service/member/products";
import ProductCard from "@/components/layout/productcard";
import { useCart } from "@/app/contexts/CartContexts";
import { useAuth } from "@/app/contexts/AuthContexts";
import AddToCartToast from "@/components/cart/AddToCartToast";
import { toast } from "sonner";
import useSWR from "swr";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productSlug = params.slug as string;
  const { isInitialLoading } = useAuth();

  const { addToCart } = useCart();
  const [showAddToCartToast, setShowAddToCartToast] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Sync data fetching with Auth ready state to prevent race conditions
  const {
    data: product,
    isLoading,
    error,
    mutate,
  } = useSWR(
    !isInitialLoading && productSlug ? ["product-detail", productSlug] : null,
    () => getProductDetailBySlug(productSlug),
    {
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    },
  );

  const { data: allProducts = [] } = useSWR(
    !isInitialLoading ? "all-products" : null,
    getAllProducts,
  );

  const recommendedProducts = (allProducts || [])
    .filter((p: any) => p.slug !== productSlug)
    .slice(0, 4);

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
  }, [productSlug]);

  if ((isLoading || isInitialLoading) && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-200" />
          </div>
          <p className="text-2xl text-gray-900 font-bold mb-4">
            Produk tidak ditemukan
          </p>
          <button
            onClick={() => router.push("/store")}
            className="bg-pink-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-600 transition-all"
          >
            Kembali ke Toko
          </button>
        </div>
      </div>
    );
  }

  const averageRating = product.rating || 0;
  const priceNumber = parseInt(product.price.replace(/[^0-9]/g, "")) || 0;

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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRating === 0 || !reviewTitle.trim() || !reviewComment.trim()) {
      toast.error("Silakan lengkapi semua data ulasan");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const response = await fetch("/api/member/products/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating: selectedRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Gagal mengirim ulasan");

      toast.success("Terima kasih! Ulasan Anda telah berhasil disimpan.");
      setShowReviewModal(false);
      setSelectedRating(0);
      setReviewTitle("");
      setReviewComment("");
      mutate();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="relative bg-[#F8F8FF] rounded-[32px] overflow-hidden mb-6 h-[400px] md:h-[500px] border border-gray-50 shadow-sm">
                {product.colorLabel && (
                  <div className="absolute top-6 left-6 z-10 bg-white px-4 py-2 rounded-xl shadow-md">
                    <p className="text-lg font-bold text-gray-900">
                      {product.colorLabel}
                    </p>
                  </div>
                )}
                <NextImage
                  src={product.images[selectedImage] || product.image}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain p-8"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {(product.images.length > 0
                  ? product.images
                  : [product.image]
                ).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 md:h-24 bg-[#F8F8FF] rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-pink-500 scale-95"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <NextImage
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-2">
                <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest">
                  {product.category}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <p className="text-3xl font-bold text-gray-900 tracking-tight">
                  {product.price}
                </p>
                <div className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-pink-100">
                  ✨ Cashback {product.cashback.toLocaleString("id-ID")} Poin
                </div>
              </div>

              <div className="space-y-8 flex-grow">
                <div className="flex items-center gap-6">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Kuantitas
                  </p>
                  <div className="border-2 border-gray-100 rounded-2xl px-4 py-2 flex items-center gap-6 bg-gray-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-gray-400 hover:text-pink-500 transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-gray-900 min-w-[30px] text-center font-bold text-xl">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-pink-500 hover:text-pink-600 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white  py-5 rounded-[20px] font-bold flex items-center justify-center gap-3 shadow-xl shadow-pink-100 transition-all active:scale-[0.98]"
                  >
                    <ShoppingCart className="w-6 h-6" /> Masukkan Keranjang
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white font-bold py-5 rounded-[20px] transition-all active:scale-[0.98]"
                  >
                    Beli Sekarang
                  </button>
                </div>

                <div className="pt-8 border-t border-gray-50">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Deskripsi Produk
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-medium">
                    {product.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Ulasan Pelanggan
                </h2>
                <p className="text-gray-500 font-medium mb-6">
                  Dengarkan apa kata para ahli tentang produk ini.
                </p>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-gray-900 text-white font-bold px-10 py-4 rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200"
                >
                  Tulis Ulasan
                </button>
              </div>
              <div className="flex items-center gap-8 bg-gray-50 p-8 rounded-[32px]">
                <div className="text-6xl font-bold text-gray-900 tracking-tighter">
                  {averageRating.toFixed(1)}
                </div>
                <div>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-6 h-6 ${s <= averageRating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    {product.reviews.length} ulasan terverifikasi
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {product.reviews.length > 0 ? (
                product.reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm">
                        <NextImage
                          src={review.userAvatar}
                          alt={review.userName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">
                          {review.userName}
                        </p>
                        <div className="flex gap-0.5 mt-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              className={`${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {review.date}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">
                      {review.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed text-sm font-medium">
                      {review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 border-2 border-dashed border-gray-100 rounded-3xl">
                  <p className="text-gray-400 font-bold">
                    Belum ada ulasan untuk produk ini.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Produk Rekomendasi
            </h2>
            <Link
              href="/store"
              className="text-pink-600 font-bold hover:underline"
            >
              Lihat Semua →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {recommendedProducts.map((p: any) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </div>
      </section>

      <AddToCartToast
        isVisible={showAddToCartToast}
        onClose={() => setShowAddToCartToast(false)}
        productName={product.name}
      />

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] max-w-2xl w-full shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="flex justify-between items-center p-8 border-b">
              <h3 className="text-2xl font-bold text-gray-900">Tulis Ulasan</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-3 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmitReview} className="p-10 space-y-8">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Rating Produk
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedRating(s)}
                      className="transition-all hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`w-12 h-12 ${s <= selectedRating ? "fill-yellow-400 text-yellow-400" : "text-gray-100"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Judul Review
                  </label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-pink-500 outline-none transition-all font-bold"
                    placeholder="Apa poin terbaik produk ini?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Ceritakan Pengalaman Anda
                  </label>
                  <textarea
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-pink-500 outline-none resize-none transition-all font-medium"
                    placeholder="Bagaimana hasil pemakaiannya?"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-4 text-gray-400 font-bold hover:bg-gray-50 rounded-2xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="flex-1 py-4 bg-pink-500 text-white rounded-2xl font-bold hover:bg-pink-600 shadow-xl shadow-pink-100 disabled:bg-gray-300 flex items-center justify-center gap-2 transition-all"
                >
                  {isSubmittingReview ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    "Kirim Review"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
