/** @format */

// app/store/[slug]/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Star, Minus, Plus, ShoppingCart, X, CheckCircle } from "lucide-react";
import { getProductDetailBySlug } from "@/lib/productData";
import ProductCard from "@/components/layout/productcard";
import { PRODUCT_DETAIL_DATA } from "@/lib/productData";
import { useCart } from "@/app/contexts/CartContexts";
import AddToCartToast from "@/components/cart/AddToCartToast";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productSlug = params.slug as string;

  const product = getProductDetailBySlug(productSlug);
  const { addToCart } = useCart();
  const [showAddToCartToast, setShowAddToCartToast] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-gray-500">Product not found</p>
      </div>
    );
  }

  const recommendedProducts = PRODUCT_DETAIL_DATA.filter(
    (p) => p.id !== product.id
  ).slice(0, 4);
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : 0;

  // Convert price string to number
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

    // Show toast notification
    setShowAddToCartToast(true);
    setShowToast(true);
  };

  const handleBuyNow = () => {
    // Add to cart
    addToCart({
      productId: product.id,
      name: product.name,
      price: priceNumber,
      quantity: quantity,
      image: product.images[0],
      cashback: product.cashback,
      slug: product.slug,
    });

    // Redirect to checkout immediately
    const cartItem = {
      id: `cart-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: priceNumber,
      quantity: quantity,
      image: product.images[0],
      cashback: product.cashback,
      slug: product.slug,
    };

    localStorage.setItem("checkout_items", JSON.stringify([cartItem]));
    router.push("/checkout");
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (selectedRating === 0 || !reviewTitle.trim() || !reviewComment.trim()) {
      alert("Please fill in all fields");
      return;
    }

    // Here you would typically send to API
    console.log({
      rating: selectedRating,
      title: reviewTitle,
      comment: reviewComment,
    });

    // Show success alert
    setShowSuccessAlert(true);
    setShowReviewModal(false);

    // Reset form
    setSelectedRating(0);
    setReviewTitle("");
    setReviewComment("");

    // Hide success alert after 3 seconds
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen ">
      {/* Product Detail Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Images */}
            <div>
              {/* Main Image */}
              <div className="relative bg-[#F8F8FF] rounded-2xl overflow-hidden mb-4 h-[500px]">
                {product.colorLabel && (
                  <div className="absolute top-6 left-6 z-10 bg-white px-4 py-2 rounded-lg shadow-md">
                    <p className="text-lg font-bold text-gray-900">
                      {product.colorLabel}
                    </p>
                  </div>
                )}
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 bg-[#F8F8FF] rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-pink-500"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Product Info */}
            <div>
              <p className="text-pink-500 font-semibold mb-2">
                {product.category}
              </p>
              <p className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </p>

              <div className="flex items-center gap-4 mb-6">
                <p className="text-3xl font-semibold text-gray-900">
                  {product.price}
                </p>
                <span className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">
                  Cashback {product.cashback.toLocaleString("id-ID")} Poin
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <div className="border-2 border-pink-500 rounded-lg px-6 py-2 inline-flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-gray-400 hover:text-pink-500 transition-colors "
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className=" text-pink-500 min-w-[60px] text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-pink-500 hover:text-pink-600 transition-colors "
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Masukkan Keranjang
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 border-2 border-pink-500 text-pink-500 hover:bg-pink-50 font-bold py-4 px-6 rounded-xl transition-colors"
                >
                  Beli Sekarang
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-8">
                Pajak dan pengiriman akan dihitung saat checkout
              </p>

              {/* Description */}
              <div>
                <p className="text-xl font-bold text-gray-900 mb-3">
                  Description
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review Section */}
      <section className="py-12 px-4 ">
        <div className="max-w-7xl mx-auto ">
          <div className="items-center rounded-2xl p-8 bg-[#FDF2F7] ">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
                  Review Customer
                </p>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  Buat Ulasan
                </button>
              </div>

              {/* Average Rating */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
                <p className="text-3xl md:text-5xl lg:text-5xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </p>
                <div>
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${
                          star <= averageRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {product.reviews.length} ulasan pelanggan
                  </p>
                </div>
              </div>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Tulis Review Anda
                </h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="hover:scale-110 transition-transform"
                        >
                          <Star className="w-8 h-8 text-gray-300 hover:text-yellow-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Judul Review
                    </label>
                    <input
                      type="text"
                      placeholder="Ringkasan pengalaman Anda"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Review
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Ceritakan pengalaman Anda dengan produk ini"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-pink-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-3 rounded-xl transition-colors"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reviews List */}
      <section className="py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6">
            {product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image
                        src={review.userAvatar}
                        alt={review.userName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-bold text-gray-900">
                            {review.userName}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              {review.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                      <p className="font-bold text-gray-900 mb-2">
                        {review.title}
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">
                Belum ada review untuk produk ini
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-3xl font-bold text-gray-900 mb-8">
            Produk Rekomendasi
          </p>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                rating={p.rating}
                image={p.image}
                cashback={p.cashback}
                slug={p.slug}
                inStock={p.inStock}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Add to Cart Toast */}
      <AddToCartToast
        isVisible={showAddToCartToast}
        onClose={() => setShowAddToCartToast(false)}
        productName={product.name}
      />

      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-white rounded-xl shadow-2xl p-6 flex items-center gap-4 border-l-4 border-green-500">
            <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
            <div>
              <p className="font-bold text-gray-900 text-lg">Berhasil!</p>
              <p className="text-gray-600">
                Review Anda telah berhasil dikirim
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-gray-900">
                Tulis Review Anda
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitReview} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSelectedRating(star)}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= selectedRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 hover:text-yellow-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Judul Review <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Ringkasan pengalaman Anda"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Ceritakan pengalaman Anda dengan produk ini"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-pink-500 resize-none"
                  required
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
