/** @format */

// app/akademi/[slug]/lesson/[lessonId]/page.tsx
"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getLessonDetailBySlug } from "@/lib/service/member/courses";
import { isMemberActive, useAuth } from "@/app/contexts/AuthContexts";
import Link from "next/link";

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const courseSlug = params.slug as string;
  const lessonSlug = params.lessonId as string;

  const [lesson, setLesson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check user status
  const isLoggedIn = !!user;
  const isMember = isLoggedIn && isMemberActive(user?.memberUntil);
  const canTakeCourse = isMember;

  useEffect(() => {
    const fetchLesson = async () => {
      setIsLoading(true);
      const data = await getLessonDetailBySlug(courseSlug, lessonSlug);
      setLesson(data);
      setIsLoading(false);
    };
    fetchLesson();
  }, [courseSlug, lessonSlug]);

  const [expandedModules, setExpandedModules] = useState<string[]>(["1"]);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const toggleModule = (id: string) => {
    if (!canTakeCourse) return;
    setExpandedModules((prev) =>
      prev.includes(id) ? prev.filter((mid) => mid !== id) : [...prev, id]
    );
  };

  const handleTakeCourse = async () => {
    if (!isLoggedIn) {
      if (confirm("Anda harus login dan menjadi member untuk mengambil kursus. Login sekarang?")) {
        router.push("/auth/login?redirect=" + encodeURIComponent(window.location.pathname));
      }
      return;
    }

    if (!isMember) {
      if (confirm("Membership Anda sudah berakhir. Perpanjang membership untuk mengambil kursus ini?")) {
        router.push("/auth/join-member");
      }
      return;
    }

    setIsEnrolling(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Kursus berhasil ditambahkan ke dashboard Anda!");
      router.push("/dashboard/kelas");
    } catch (error) {
      alert("Terjadi kesalahan. Silakan coba lagi.");
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-500 mb-4">Lesson not found</p>
          <Link href="/akademi" className="text-pink-500 font-bold hover:underline">Kembali ke Akademi</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-700 to-rose-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-rose-200 text-sm font-bold uppercase tracking-widest">{courseSlug.replace(/-/g, ' ')}</p>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">{lesson.title}</h1>
              <p className="text-lg text-rose-50 leading-relaxed">{lesson.description}</p>
              
              <div className="flex gap-4 pt-4">
                {canTakeCourse ? (
                  <button onClick={handleTakeCourse} disabled={isEnrolling} className="bg-white text-rose-700 font-bold px-10 py-4 rounded-xl hover:bg-rose-50 transition-all shadow-xl">
                    {isEnrolling ? "Memproses..." : "Ambil Kursus"}
                  </button>
                ) : (
                  <button onClick={handleTakeCourse} className="bg-white/20 text-white font-bold px-10 py-4 rounded-xl flex items-center gap-2 hover:bg-white/30 transition-all">
                    <Lock className="w-5 h-5" /> {isLoggedIn ? "Membership Diperlukan" : "Login Diperlukan"}
                  </button>
                )}
              </div>
            </div>
            <div className="relative h-80 md:h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
              <Image src={lesson.image || "/images/thumb.jpg"} alt={lesson.title} fill className="object-cover" />
              {!canTakeCourse && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="bg-white/20 p-4 rounded-full inline-block mb-4"><Lock className="w-10 h-10 text-white" /></div>
                    <p className="text-white font-bold text-xl">{isLoggedIn ? "Khusus Member" : "Silakan Login"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-pink-500 rounded-full"></span> Detail Materi
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">{lesson.description}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-pink-500 rounded-full"></span> Video Kursus
              </h2>
              <div className="space-y-4">
                {lesson.videos?.map((module: any) => (
                  <div key={module.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                    <div onClick={() => toggleModule(module.id)} className="flex items-center justify-between p-6 cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="bg-pink-50 p-3 rounded-xl"><PlayCircle className="w-6 h-6 text-pink-500" /></div>
                        <div>
                          <h3 className="font-bold text-gray-900">{module.title}</h3>
                          <p className="text-sm text-gray-500">{module.duration}</p>
                        </div>
                      </div>
                      {expandedModules.includes(module.id) ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                    </div>
                    {expandedModules.includes(module.id) && (
                      <div className="px-6 pb-6 border-t border-gray-50 pt-6">
                        {canTakeCourse ? (
                          <div className="space-y-6">
                             <div className="aspect-video bg-black rounded-xl overflow-hidden relative group">
                                <Image src={module.thumbnail || "/images/thumb.jpg"} alt={module.title} fill className="object-cover opacity-60 group-hover:scale-105 transition-transform" />
                                <button className="absolute inset-0 flex items-center justify-center">
                                   <div className="bg-pink-500 p-5 rounded-full shadow-xl hover:scale-110 transition-transform"><PlayCircle className="w-8 h-8 text-white fill-white" /></div>
                                </button>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                   <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">What you'll learn</h4>
                                   <p className="text-gray-600 text-sm leading-relaxed">{module.whatYouLearn}</p>
                                </div>
                                <div>
                                   <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Skills you'll gain</h4>
                                   <div className="flex flex-wrap gap-2">
                                      {module.skillsGained?.map((skill: string, i: number) => (
                                        <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-medium">{skill}</span>
                                      ))}
                                   </div>
                                </div>
                             </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-xl p-8 text-center">
                             <Lock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                             <p className="text-gray-500 font-medium">Video ini terkunci. Silakan menjadi member untuk menonton.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Materi Highlight</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="bg-pink-50 p-2 rounded-lg text-pink-500"><BookOpen size={20} /></div>
                  <span className="text-gray-600 font-medium">{lesson.videos?.length || 0} Video Materi</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-pink-50 p-2 rounded-lg text-pink-500"><Clock size={20} /></div>
                  <span className="text-gray-600 font-medium">{lesson.duration || "Self-paced"}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-pink-50 p-2 rounded-lg text-pink-500"><Calendar size={20} /></div>
                  <span className="text-gray-600 font-medium">Akses Selamanya</span>
                </div>
              </div>
              <button onClick={handleTakeCourse} className="w-full mt-10 bg-pink-500 text-white font-bold py-4 rounded-2xl hover:bg-pink-600 transition-all shadow-lg shadow-pink-100">
                {canTakeCourse ? "Mulai Belajar" : "Daftar Sekarang"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
