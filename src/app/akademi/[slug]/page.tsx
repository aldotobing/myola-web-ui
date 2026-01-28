/** @format */

// app/kursus/[slug]/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Search } from "lucide-react";
import LessonCard, { LessonCardProps } from "@/components/layout/lessoncard";
import { getCourseBySlug, getLessonsByCourseSlug } from "@/service/coursesData";
import { useParams } from "next/navigation";

export default function CourseDetailPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  // Get course slug from URL params using useParams hook
  const params = useParams();
  const courseSlug = params.slug as string;

  // Find course data based on slug
  const courseData = getCourseBySlug(courseSlug);

  // If course not found, show default
  const course = courseData || {
    slug: courseSlug,
    title: "Course Not Found",
    level: "Beginner" as const,
    image: "/images/default.jpg",
    fillCount: 0,
    hugCount: 0,
    description: "Course not found",
    instructor: "Unknown",
  };

  // Get lessons for this course
  const allLessons = getLessonsByCourseSlug(courseSlug);

  const filteredLessons = allLessons.filter((lesson) => {
    const matchesSearch = lesson.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLevel =
      selectedLevel === "all" || lesson.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen ">
      {/* Header Section */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {course.title}
          </h1>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-6 px-4 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Level Filter Dropdown */}
            <div className=" relative w-full md:w-auto">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full md:w-48 px-4 py-3 border-2 border-gray-300 rounded-xl font-medium text-gray-700 focus:outline-none focus:border-pink-500 transition-colors cursor-pointer appearance-none"
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
                  placeholder="Cari Kursus"
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

      {/* Lessons Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredLessons.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredLessons.map((lesson) => (
                <LessonCard key={lesson.id} {...lesson} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Image
                src="/images/empty_akademi.png"
                alt="No Lessons Found"
                width={400}
                height={400}
                className="mx-auto mb-6"
              />
              <p className="text-3xl text-gray-900 font-semibold mb-6">
                Tidak ada lesson yang ditemukan
              </p>
              <p className="text-xl text-gray-500">
                Silakan cek kembali kata kunci atau pilih kategori lain
              </p>
            </div>
          )}

          {/* Load More Button */}
          {filteredLessons.length > 0 && (
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
}
