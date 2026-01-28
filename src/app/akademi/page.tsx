/** @format */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, Search, Loader2 } from "lucide-react";
import ClassCard, { ClassCardProps } from "@/components/layout/classcard";
import { getAllCourses, CourseData } from "@/lib/service/member/courses";

const Akademi = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      const data = await getAllCourses();
      setCourses(data);
      setIsLoading(false);
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLevel =
      selectedLevel === "all" || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Kursus <span className="text-pink-500">Unggulan</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Jelajahi{" "}
            <span className="font-semibold text-pink-500">
              kursus profesional
            </span>{" "}
            dalam potong, pewarnaan, dan penataan rambut — untuk membangun
            karier dan gaya khasmu.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Level Filter Dropdown */}
            <div className="relative w-full md:w-auto">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full md:w-48 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium bg-gray-50 focus:outline-none cursor-pointer appearance-none"
              >
                <option value="all">Semua Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Cari kursus idaman..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 text-gray-700 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Memuat kursus...</p>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <ClassCard key={course.id} {...(course as any)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <Image
                src="/images/empty_akademi.png"
                alt="No Courses Found"
                width={300}
                height={300}
                className="mx-auto mb-6 opacity-80"
              />
              <h3 className="text-2xl text-gray-900 font-bold mb-2">
                Kursus tidak ditemukan
              </h3>
              <p className="text-gray-500">
                Silakan cek kembali kata kunci atau pilih kategori lain
              </p>
            </div>
          )}

          {/* Load More Button */}
          {!isLoading && filteredCourses.length > 0 && (
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

export default Akademi;
