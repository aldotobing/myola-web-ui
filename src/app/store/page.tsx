/** @format */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, Search, Loader2 } from "lucide-react";
import ProductCard, { ProductCardProps } from "@/components/layout/productcard";
import { getAllProducts, ProductData } from "@/lib/service/member/products";

const Store = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState<string>("all");
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const data = await getAllProducts();
      setProducts(data);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    const matchesStock = 
      selectedStock === "all" || 
      (selectedStock === "available" && product.inStock) || 
      (selectedStock === "outOfStock" && !product.inStock);

    return matchesSearch && matchesStock;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white py-16 px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Produk <span className="text-pink-500">Kami</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Temukan pewarna rambut, perawatan, dan perlengkapan salon yang
            <span className="font-semibold text-pink-500">
              {" "}mendukung setiap ide kreatif
            </span>{" "}
            dan gaya unikmu.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Stock Filter Dropdown */}
            <div className="relative w-full md:w-auto">
              <select
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="w-full md:w-48 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium bg-gray-50 focus:outline-none focus:border-pink-500 cursor-pointer appearance-none"
              >
                <option value="all">Semua Status</option>
                <option value="available">Tersedia</option>
                <option value="outOfStock">Stok Habis</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Cari produk impianmu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 text-gray-700 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Memuat produk...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <Image
                src="/images/empty_akademi.png"
                alt="No Products Found"
                width={300}
                height={300}
                className="mx-auto mb-6 opacity-80"
              />
              <h3 className="text-2xl text-gray-900 font-bold mb-2">
                Produk tidak ditemukan
              </h3>
              <p className="text-gray-500">
                Maaf, produk yang Anda cari tidak tersedia saat ini.
              </p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedStock("all"); }}
                className="mt-6 text-pink-500 font-bold hover:underline"
              >
                Reset Pencarian
              </button>
            </div>
          )}

          {/* Load More Button Placeholder */}
          {!isLoading && filteredProducts.length > 0 && (
            <div className="flex justify-center mt-16">
              <button className="bg-white border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white font-bold px-12 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg">
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
