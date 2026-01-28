/** @format */

// app/kursus/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, Search, Loader2 } from "lucide-react";
import LessonCard, { LessonCardProps } from "@/components/layout/lessoncard";
import { getCourseBySlug, getLessonsByCourseSlug } from "@/lib/service/member/courses";
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
        getLessonsByCourseSlug(courseSlug)
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
          <button onClick={() => window.history.back()} className="text-pink-500 font-bold hover:underline">Kembali</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white py-16 px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">{course.title}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{course.description}</p>
        </div>
      </section>

      <section className="py-8 px-4 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-auto">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full md:w-48 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium bg-gray-50 focus:outline-none focus:border-pink-500 cursor-pointer appearance-none"
              >
                <option value="all">Semua Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Cari materi dalam kursus ini..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 text-gray-700 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLessons.map((lesson) => (
                <LessonCard key={lesson.id} {...(lesson as any)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <Image src="/images/empty_akademi.png" alt="Empty" width={250} height={250} className="mx-auto mb-6 opacity-60" />
              <h3 className="text-2xl text-gray-900 font-bold mb-2">Materi tidak ditemukan</h3>
              <p className="text-gray-500">Coba gunakan kata kunci lain atau ubah filter level.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
