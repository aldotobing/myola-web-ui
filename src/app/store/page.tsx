/** @format */

"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Search } from "lucide-react";
import ProductCard, { ProductCardProps } from "@/components/layout/productcard";
import { PRODUCT_DATA } from "@/lib/productData";

const Store = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  const product: ProductCardProps[] = PRODUCT_DATA.map((product) => ({
    slug: product.slug,
    id: product.id,
    name: product.name,
    price: product.price,
    rating: product.rating,
    image: product.image,
    cashback: product.cashback,
    inStock: product.inStock,
  }));

  const filteredProduct = product.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="min-h-screen ">
      {/* Header Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Produk <span className="text-pink-500">Kami</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Temukan pewarna rambut, perawatan, dan perlengkapan salon yang
            <span className="font-semibold text-pink-500">
              mendukung setiap ide kreatif
            </span>{" "}
            dan gaya unikmu.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Level Filter Dropdown */}
            <div className="relative w-full md:w-auto">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 font-medium bg-white focus:outline-none cursor-pointer appearance-none"
              >
                <option value="all">Semua </option>
                <option value="Beginner">Tersedia</option>
                <option value="Intermediate">Habis</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3 w-full md:w-96">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Cari Produk"
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

      {/* Courses Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredProduct.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProduct.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Image
                src="/images/empty_akademi.png"
                alt="No Courses Found"
                width={400}
                height={400}
                className="mx-auto mb-6"
              />
              <p className="text-3xl text-gray-900 font-semibold mb-6">
                Tidak ada produk yang ditemukan
              </p>
              <p className="text-xl text-gray-500">
                Silakan cek kembali kata kunci
              </p>
            </div>
          )}

          {/* Load More Button */}
          {filteredProduct.length > 0 && (
            <div className="flex justify-center mt-12">
              <button className="border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white font-bold px-12 py-4 rounded-xl transition-all duration-300 transform hover:scale-105">
                Lihat Selengkapnya
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Store;
