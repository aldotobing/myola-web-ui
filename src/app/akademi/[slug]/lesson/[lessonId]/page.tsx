/** @format */

// app/akademi/[slug]/lesson/[lessonId]/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  PlayCircle,
  Clock,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getLessonDetailBySlug } from "@/service/coursesData";
import { isMemberActive, useAuth } from "@/app/contexts/AuthContexts";
import Link from "next/link";

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const lessonSlug = params.lessonId as string;

  // Check user status
  const isLoggedIn = user?.isLoggedIn || false;
  const isMember = isLoggedIn && isMemberActive(user?.memberUntil);
  const canTakeCourse = isMember; //

  // Get lesson detail from data
  const lessonData = getLessonDetailBySlug(lessonSlug);

  // Default data if not found
  const lesson = lessonData || {
    courseTitle: "Course Not Found",
    title: "Lesson Not Found",
    description: "This lesson could not be found.",
    instructor: "Unknown",
    level: "Beginner",
    videoCount: 0,
    duration: "0 menit",
    enrolled: "N/A",
    image: "/images/default.jpg",
    aboutText: "Lesson details not available.",
    whatYouLearn: [],
    videoModules: [],
  };

  const [expandedModules, setExpandedModules] = useState<string[]>(["1"]);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const toggleModule = (id: string) => {
    // Only allow toggle for members
    if (!canTakeCourse) return;

    setExpandedModules((prev) =>
      prev.includes(id)
        ? prev.filter((moduleId) => moduleId !== id)
        : [...prev, id]
    );
  };

  const handleTakeCourse = async () => {
    // Guest - redirect to login
    if (!isLoggedIn) {
      if (
        confirm(
          "Anda harus login dan menjadi member untuk mengambil kursus. Login sekarang?"
        )
      ) {
        router.push(
          "/auth/login?redirect=" + encodeURIComponent(window.location.pathname)
        );
      }
      return;
    }

    // Logged-in but not member - redirect to join member
    if (!isMember) {
      if (
        confirm(
          "Membership Anda sudah berakhir. Perpanjang membership untuk mengambil kursus ini?"
        )
      ) {
        router.push("/join-member");
      }
      return;
    }

    // Member - enroll in course and redirect to dashboard
    setIsEnrolling(true);

    try {
      // Simulate API call to enroll user in course
      // In real app, this would call an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success - redirect to dashboard kelas
      alert("Kursus berhasil ditambahkan ke dashboard Anda!");
      router.push("/dashboard/kelas");
    } catch (error) {
      console.error("Error enrolling in course:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
      setIsEnrolling(false);
    }
  };

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-700 to-rose-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <p className="text-white/80 text-xl uppercase tracking-wide">
                {lesson.courseTitle}
              </p>
              <p className="text-4xl md:text-4xl font-bold leading-tight">
                {lesson.title}
              </p>
              <p className="text-lg text-white/90 leading-relaxed">
                {lesson.description}
              </p>
              <p className="text-white/80">
                <span className="font-semibold">Instructors:</span>{" "}
                {lesson.instructor}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                {/* Member - Can take course */}
                {canTakeCourse && (
                  <button
                    onClick={handleTakeCourse}
                    disabled={isEnrolling}
                    className="w-full md:w-auto bg-white text-rose-700 font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEnrolling ? "Memproses..." : "Ambil Kursus"}
                  </button>
                )}

                {/* Non-Member - Show locked state */}
                {isLoggedIn && !isMember && (
                  <div className="space-y-3">
                    <button
                      onClick={handleTakeCourse}
                      className="w-full md:w-auto bg-white/20 text-white font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-white/30 transition-colors"
                    >
                      <Lock className="w-5 h-5" />
                      Membership Diperlukan
                    </button>
                    <p className="text-white/80 text-sm">
                      💡 Perpanjang membership untuk mengakses kursus ini
                    </p>
                  </div>
                )}

                {/* Guest - Show login prompt */}
                {!isLoggedIn && (
                  <div className="space-y-3">
                    <button
                      onClick={handleTakeCourse}
                      className="w-full md:w-auto bg-white/20 text-white font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-white/30 transition-colors"
                    >
                      <Lock className="w-5 h-5" />
                      Login untuk Ambil Kursus
                    </button>
                    <p className="text-white/80 text-sm">
                      💡 Login dan join member untuk mengakses semua kursus
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={lesson.image}
                alt={lesson.title}
                fill
                className="object-cover"
              />

              {/* Overlay for non-members */}
              {!canTakeCourse && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="w-16 h-16 text-white mx-auto mb-3" />
                    <p className="text-white font-semibold text-lg">
                      {isLoggedIn
                        ? "Membership Diperlukan"
                        : "Login Diperlukan"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Membership Warning Banner */}
      {!canTakeCourse && (
        <section className="py-6 px-4">
          <div className="max-w-7xl mx-auto">
            {!isLoggedIn ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-blue-900 text-lg mb-2">
                      Login dan Join Member untuk Akses Kursus
                    </h3>
                    <p className="text-blue-700 mb-4">
                      Dapatkan akses ke semua kursus premium dengan menjadi
                      member MYOLA. Hanya Rp 99.000/bulan!
                    </p>
                    <div className="flex gap-3">
                      <Link
                        href="/auth/login"
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        href="/join-member"
                        className="px-6 py-2 border-2 border-blue-500 text-blue-500 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                      >
                        Join Member
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-orange-900 text-lg mb-2">
                      Membership Anda Sudah Berakhir
                    </h3>
                    <p className="text-orange-700 mb-4">
                      Perpanjang membership untuk melanjutkan akses ke semua
                      kursus premium. Hanya Rp 99.000/bulan!
                    </p>
                    <Link
                      href="/join-member"
                      className="inline-block px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Perpanjang Membership
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="py-10 px-4 mt-12">
        <div className="max-w-7xl mx-auto">
          {/* Stats Card */}
          <div className="max-w-7xl mx-auto -mt-6 grid grid-cols-1 md:grid-cols-4 gap-6 ">
            <div className="flex items-center gap-3 bg-[#F8F8FF] p-6 rounded-xl shadow-sm">
              <div className="bg-rose-100 p-3 rounded-full">
                <BookOpen className="w-6 h-6 text-rose-700" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Level</p>
                <p className="font-semibold">{lesson.level}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#F8F8FF] p-6 rounded-xl shadow-sm">
              <div className="bg-rose-100 p-3 rounded-full">
                <PlayCircle className="w-6 h-6 text-rose-700" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Video</p>
                <p className="font-semibold">{lesson.videoCount} Video</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#F8F8FF] p-6 rounded-xl shadow-sm">
              <div className="bg-rose-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-rose-700" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Durasi</p>
                <p className="font-semibold">{lesson.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-[#F8F8FF] p-6 rounded-xl shadow-sm">
              <div className="bg-rose-100 p-3 rounded-full">
                <Calendar className="w-6 h-6 text-rose-700" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Jadwal</p>
                <p className="font-semibold">{lesson.enrolled}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-10 px-4 ">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            {lesson.aboutText}
          </p>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            What You'll Learn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lesson.whatYouLearn.map((item, index) => (
              <div key={index} className="flex gap-4">
                <Check className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" />
                <p className="text-gray-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Kursus */}
      <section className="py-10 px-4 ">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Video Kursus
          </h2>

          <div className="space-y-4">
            {lesson.videoModules.map((module) => (
              <div
                key={module.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
              >
                {/* Module Header */}
                <div
                  onClick={() => toggleModule(module.id)}
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={module.thumbnail}
                        alt={module.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {module.title}
                      </h3>
                      <span className="inline-block bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-semibold">
                        {module.level}
                      </span>
                    </div>
                  </div>
                  {expandedModules.includes(module.id) ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                {/* Module Details (Expanded) */}
                {expandedModules.includes(module.id) && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="pt-6 space-y-6">
                      <p className="text-gray-600 leading-relaxed">
                        {module.description}
                      </p>

                      {/* What you'll learn */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">
                          What you'll learn
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {module.whatYouLearn}
                        </p>
                      </div>

                      {/* Skills you'll gain */}
                      <div>
                        <h4 className="font-bold text-gray-900 mb-3">
                          Skill you'll gain
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {module.skillsGained.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
