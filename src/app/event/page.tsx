/** @format */

// app/event/page.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { ChevronDown } from "lucide-react";
import EventCard, { EventCardProps } from "@/components/layout/eventcard";

export default function EventPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const events: EventCardProps[] = [
    {
      id: "1",
      title: "Precision Cutting for Modern Styles",
      image: "/images/kelas_1.png",
      date: "20 October 2025",
      time: "16.00 WIB",
      category: "MASTERCLASS",
      slug: "precision-cutting-modern-styles-1",
    },
    {
      id: "2",
      title: "Precision Cutting for Modern Styles",
      image: "/images/kelas_2.png",
      date: "20 October 2025",
      time: "16.00 WIB",
      category: "MASTERCLASS",
      slug: "precision-cutting-modern-styles-2",
    },
    {
      id: "3",
      title: "Precision Cutting for Modern Styles",
      image: "/images/kelas_3.png",
      date: "20 October 2025",
      time: "16.00 WIB",
      category: "MASTERCLASS",
      slug: "precision-cutting-modern-styles-3",
    },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || event.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen ">
      {/* Header Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Event
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto">
            Temukan berbagai{" "}
            <span className="font-semibold text-pink-500">
              kegiatan edukatif dan inspiratif
            </span>{" "}
            yang mempertemukan passion, keterampilan, dan inovasi di dunia tata
            rambut.
          </p>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Filter Dropdown */}
            <div className="relative w-full md:w-auto">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
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

      {/* Events Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-3xl text-gray-900 font-semibold mb-6">
                Tidak ada event yang ditemukan
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
