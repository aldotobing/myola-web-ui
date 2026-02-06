/** @format */

// app/freebies/page.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import FreebiesCard, {
  FreebiesCardProps,
} from "@/components/layout/freebiescard";
import { ChevronDown } from "lucide-react";

export default function FreebiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const freebies: FreebiesCardProps[] = [
    {
      id: "1",
      title: "Hair Color Palette Collection (PDF)",
      description:
        "Kumpulan palet warna rambut terbaru dari ash brown sampai rose gold untuk inspirasi warna yang sempurna",
      image: "/images/freebies-1.avif",
      downloadCount: 100,
      fileType: "PDF",
      downloadUrl: "/downloads/hair-color-palette.pdf",
    },
    {
      id: "2",
      title: "Trend Haircut Lookbook 2025 (PDF)",
      description:
        "Lookbook berisi inspirasi potongan rambut modern untuk wanita dan pria dengan gaya terkini tahun 2025",
      image: "/images/freebie-2.jpeg",
      downloadCount: 100,
      fileType: "PDF",
      downloadUrl: "/downloads/trend-haircut-lookbook.pdf",
    },
    {
      id: "3",
      title: "Hair Care Product Label Mockup (PSD)",
      description:
        "Kumpulan palet warna rambut terbaru dari ash brown sampai rose gold untuk inspirasi warna yang sempurna",
      image: "/images/freebie-3.jpg",
      downloadCount: 100,
      fileType: "PSD",
      downloadUrl: "/downloads/hair-care-mockup.psd",
    },
    {
      id: "4",
      title: "Bleaching & Toning Guide (PDF)",
      description:
        "Kumpulan palet warna rambut terbaru dari ash brown sampai rose gold untuk inspirasi warna yang sempurna",
      image: "/images/freebie-4.png",
      downloadCount: 100,
      fileType: "PDF",
      downloadUrl: "/downloads/bleaching-guide.pdf",
    },
  ];

  const filteredFreebies = freebies.filter((freebie) => {
    const matchesSearch =
      freebie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freebie.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || freebie.fileType === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen ">
      {/* Header Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold  mb-4">
            MyOLA <span className="text-pink-600">Freebies</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto">
            Temukan <span className="font-semibold text-pink-500">koleksi</span>{" "}
            gambar warna rambut, panduan styling, dan materi edukasi lainnya
            yang bisa kamu unduh secara gratis.
          </p>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Filter Dropdown */}
            <div className="w-full md:w-auto">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 font-medium bg-white focus:outline-none cursor-pointer appearance-none"
              >
                <option value="all">Availability</option>
                <option value="PDF">PDF</option>
                <option value="PSD">PSD</option>
                <option value="PNG">PNG</option>
                <option value="JPG">JPG</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            {/* Search Bar */}

            <div className="flex items-center gap-3 w-full md:w-96">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Cari Event"
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

      {/* Freebies Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredFreebies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredFreebies.map((freebie) => (
                <FreebiesCard key={freebie.id} {...freebie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-3xl text-gray-900 font-semibold mb-6">
                Tidak ada freebies yang ditemukan
              </p>
              <p className="text-xl text-gray-500">
                Silakan cek kembali kata kunci atau pilih kategori lain
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
