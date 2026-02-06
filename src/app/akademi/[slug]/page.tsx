/** @format */

// app/kursus/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, Search, Loader2 } from "lucide-react";
import LessonCard, { LessonCardProps } from "@/components/layout/lessoncard";
import {
  getCourseBySlug,
  getLessonsByCourseSlug,
} from "@/lib/service/member/courses";
import { useParams } from "next/navigation";

export default function CourseDetailPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [course, setCourse] = useState<any>(null);
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const courseSlug = params.slug as string;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [courseData, lessonsData] = await Promise.all([
        getCourseBySlug(courseSlug),
        getLessonsByCourseSlug(courseSlug),
      ]);
      setCourse(courseData);
      setAllLessons(lessonsData);
      setIsLoading(false);
    };
    fetchData();
  }, [courseSlug]);

  const filteredLessons = allLessons.filter((lesson) => {
    const matchesSearch = lesson.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLevel =
      selectedLevel === "all" || lesson.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-500 mb-4">Kursus tidak ditemukan</p>
          <button
            onClick={() => window.history.back()}
            className="text-pink-500 font-bold hover:underline"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white py-16 px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-4xl lg:text-4xl font-bold text-gray-900 mb-4">
            {course.title}
          </h1>
        </div>
      </section>

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

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredLessons.map((lesson) => (
                <LessonCard key={lesson.id} {...(lesson as any)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <Image
                src="/images/empty_akademi.png"
                alt="Empty"
                width={250}
                height={250}
                className="mx-auto mb-6 opacity-60"
              />
              <h3 className="text-2xl text-gray-900 font-bold mb-2">
                Materi tidak ditemukan
              </h3>
              <p className="text-gray-500">
                Coba gunakan kata kunci lain atau ubah filter level.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
