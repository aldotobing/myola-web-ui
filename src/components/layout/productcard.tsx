/** @format */

"use client";

// components/ProductCard.tsx
import Image from "next/image";
import { Star, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/app/contexts/CartContexts";
import AddToCartToast from "@/components/cart/AddToCartToast";

export interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  rating: number;
  image: string;
  cashback: number;
  slug?: string; // Optional slug for linking to detail page
  inStock?: boolean; // Add stock status
}

export default function ProductCard({
  id,
  name,
  price,
  rating,
  image,
  cashback,
  slug,
  inStock,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);

  // Convert price string to number
  const priceNumber = parseInt(price.replace(/[^0-9]/g, ""));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Generate slug from title if not provided
  const productSlug =
    slug ||
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling

    if (!inStock) return;

    // Add to cart
    addToCart({
      productId: id,
      name: name,
      price: priceNumber,
      quantity: 1,
      image: image,
      cashback: cashback,
      slug: productSlug,
    });

    // Show toast notification
    setShowToast(true);
  };

  const cardContent = (
    <div className="bg-white rounded-lg md:rounded-2xl lg:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex-shrink-0 w-full">
      {/* Rating Badge */}
      <div className="relative p-4 pb-0">
        <div className="absolute top-8 left-2 md:left-4 lg:left-4 z-10 bg-white rounded-full px-3 py-1.5 shadow-md flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-bold text-gray-900">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Product Image */}
      <div className="relative rounded-lg md:rounded-2xl lg:rounded-2xl  h-48 md:h-72 lg:h-72 bg-gradient-to-b  from-[#F8F8FF] to-[#FFFFFF] px-8 pt-8 pb-4">
        <div className="relative h-56 md:h-64 lg:h-64 w-full">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Out of Stock Overlay */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl">
            <p className="text-white font-bold text-lg">Habis</p>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-2 pt-16 md:pt-4 lg:pt-4 md:p-4 lg:p-4">
        {/* Cashback Badge */}
        <div className="mb-4 md:mb-4 lg:mb-4">
          <span className="inline-block bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-full md:text-xs lg:text-xs text-[8px] font-bold">
            Cashback {cashback.toLocaleString("id-ID")} Poin
          </span>
        </div>

        {/* Product Name */}
        <p className="text-sm md:text-lg lg:text-lg font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">
          {name}
        </p>

        {/* Price and Cart */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Harga */}
          <div className="text-sm md:text-lg font-semibold text-gray-500">
            {price}
          </div>

          {/* Button Mobile (Add to Cart) */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="w-full md:hidden bg-[#FDF2F7] hover:bg-[#FDE6F0] text-pink-500 p-3 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <span className="text-sm font-semibold">Add to Cart</span>
          </button>

          {/* Button Desktop (Icon Only) */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className="hidden md:flex bg-[#FDF2F7] hover:bg-[#FDE6F0] text-pink-500 p-3 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      <AddToCartToast
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        productName={name}
      />
    </div>
  );

  // If out of stock, make card non-clickable
  if (!inStock) {
    return <div className="cursor-not-allowed">{cardContent}</div>;
  }

  return <Link href={`/store/${productSlug}`}>{cardContent}</Link>;
}
