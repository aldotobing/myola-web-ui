/** @format */

"use client";

import { useState } from "react";
import { Search, ChevronDown, BookOpen, Loader2 } from "lucide-react";
import ClassCard from "@/components/layout/classcard";
import { getAllCourses } from "@/lib/service/member/courses";
import Image from "next/image";
import useSWR from "swr";

export default function AkademiPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Use SWR for resilient fetching
  const {
    data: courses = [],
    isLoading,
    error,
  } = useSWR("all-courses", getAllCourses, {
    revalidateOnFocus: true,
    dedupingInterval: 10000,
  });

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLevel =
      selectedLevel === "all" || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="bg-white py-16 px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold  mb-4">
            MyOLA <span className="text-pink-600">Akademi</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Tingkatkan skill salon Anda bersama instruktur profesional. Belajar
            kapan saja, di mana saja dengan akses materi selamanya.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 ">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Level Filter Dropdown */}
            <div className="relative w-full md:w-auto">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 font-medium bg-white focus:outline-none cursor-pointer appearance-none"
              >
                <option value="all">Semua Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3 w-full md:w-96">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Cari Kelas Impianmu.."
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
          {error && (
            <div className="mb-8 p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 font-bold text-center">
              Gagal menghubungkan ke database. Mencoba menghubungkan kembali...
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
              <p className="text-gray-500 font-bold tracking-tight">
                Memuat materi kurikulum...
              </p>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredCourses.map((course) => (
                <ClassCard
                  key={course.id}
                  title={course.title}
                  level={course.level as any}
                  image={course.image}
                  fillCount={course.fillCount}
                  hugCount={course.hugCount}
                  slug={course.slug}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-gray-200" />
              </div>
              <h3 className="text-2xl text-gray-900 font-black mb-2">
                Belum ada kelas tersedia
              </h3>
              <p className="text-gray-500 font-medium">
                Coba gunakan kata kunci lain atau pilih level berbeda.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
