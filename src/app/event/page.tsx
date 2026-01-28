/** @format */

// app/event/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import EventCard, { EventCardProps } from "@/components/layout/eventcard";
import { getAllEvents, EventData } from "@/lib/service/member/event-catalog";

export default function EventPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const data = await getAllEvents();
      setEvents(data as any);
      setIsLoading(false);
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || event.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Event <span className="text-pink-500">MyOLA</span>
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
      <section className="py-8 px-4 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Filter Dropdown */}
            <div className="relative w-full md:w-auto">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full md:w-48 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium bg-gray-50 focus:outline-none focus:border-pink-500 cursor-pointer appearance-none"
              >
                <option value="all">Semua Kategori</option>
                <option value="MASTERCLASS">Masterclass</option>
                <option value="WORKSHOP">Workshop</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Cari event seru..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 text-gray-700 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Memuat event...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} {...(event as any)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-100">
              <p className="text-2xl text-gray-900 font-bold mb-2">
                Tidak ada event yang ditemukan
              </p>
              <p className="text-gray-500">
                Silakan cek kembali kata kunci atau pilih kategori lain
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
