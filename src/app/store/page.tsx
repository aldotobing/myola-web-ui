/** @format */

"use client";

import { useState } from "react";
import { Search, ChevronDown, Loader2, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/layout/productcard";
import { getAllProducts } from "@/lib/service/member/products";
import { useAuth } from "@/app/contexts/AuthContexts";
import useSWR from "swr";

export default function StorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isInitialLoading } = useAuth();

  // ONLY fetch products once the initial auth check is finished.
  // This prevents race conditions where the fetch runs while Supabase is still waking up.
  const {
    data: products = [],
    isLoading,
    error,
  } = useSWR(!isInitialLoading ? "all-products" : null, getAllProducts, {
    revalidateOnFocus: true,
    shouldRetryOnError: true,
    errorRetryCount: 3,
  });

  const filteredProducts = (products || []).filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen ">
      <section className="bg-white py-16 px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            MyOLA <span className="text-pink-600">Store</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Temukan koleksi produk pewarnaan dan perawatan rambut profesional
            terbaik. Belanja sekarang dan dapatkan cashback poin eksklusif untuk
            member!
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Filter Dropdown */}
            <div className="relative w-full md:w-auto">
              <select className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 font-medium bg-white focus:outline-none cursor-pointer appearance-none">
                <option value="all">Semua Produk</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3 w-full md:w-96">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Cari produk impianmu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2 border-b border-gray-400 focus:outline-none text-gray-600 placeholder-gray-400"
                />
              </div>
              <button className="text-gray-600 hover:text-gray-800 transition">
                <Search className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="text-center py-10 bg-red-50 text-red-600 rounded-3xl border border-red-100 mb-8 font-bold">
              Gagal memuat produk. Mencoba menghubungkan kembali...
            </div>
          )}

          {isLoading || isInitialLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
              <p className="text-gray-500 font-bold">
                Menyiapkan koleksi produk...
              </p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  rating={product.rating}
                  image={product.image}
                  cashback={product.cashback}
                  slug={product.slug}
                  inStock={product.inStock}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-200" />
              </div>
              <h3 className="text-2xl text-gray-900 font-bold mb-2">
                Produk tidak ditemukan
              </h3>
              <p className="text-gray-500 font-medium">
                Coba cari dengan kata kunci lain.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
