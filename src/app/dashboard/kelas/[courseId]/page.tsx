/** @format */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContexts";
import {
  FileText,
  ShoppingCart,
  Menu,
  X,
  Wallet,
  Coins,
  Megaphone,
  MonitorPlayIcon,
  MapIcon,
  Settings2Icon,
  CoinsIcon,
  User2Icon,
  ArrowLeft,
  CheckCircle2,
  PlayIcon,
  Lock,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Course, Video } from "@/types/kelas";
import { completeVideo, getCourseById, getCurrentVideo } from "@/lib/api/kelas";
import { Play } from "next/font/google";

export default function KelasDetailPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const params = useParams<{ courseId: string }>();

  const courseId = params.courseId;

  // All hooks at top
  const [course, setCourse] = useState<Course | null>(null);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [completingVideo, setCompletingVideo] = useState(false);

  useEffect(() => {
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const loadCourse = async () => {
    setLoading(true);
    try {
      const courseData = await getCourseById(courseId);
      if (courseData) {
        setCourse(courseData);
        // Set current video
        const current = await getCurrentVideo(courseId);
        setCurrentVideo(current || courseData.videos[0]);
      }
    } catch (error) {
      console.error("Error loading course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video: Video) => {
    // Only allow clicking on first video or completed videos or current video
    if (video.order === 1 || video.completed || video.id === currentVideo?.id) {
      setCurrentVideo(video);
    }
  };

  const handleCompleteVideo = async () => {
    if (!currentVideo || !course) return;

    setCompletingVideo(true);
    try {
      const result = await completeVideo(course.id, currentVideo.id);

      if (result.success && result.course) {
        setCourse(result.course);

        // Move to next video if available
        if (result.nextVideo) {
          setCurrentVideo(result.nextVideo);
        } else {
          // Course completed
          alert("Selamat! Anda telah menyelesaikan kelas ini! 🎉");
        }
      }
    } catch (error) {
      console.error("Error completing video:", error);
      alert("Gagal menyelesaikan video. Silakan coba lagi.");
    } finally {
      setCompletingVideo(false);
    }
  };

  // Get YouTube embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId =
      url.split("youtu.be/")[1]?.split("?")[0] ||
      url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Course not found</p>
          <button
            onClick={() => router.push("/dashboard/kelas")}
            className="text-pink-500 hover:text-pink-600 font-semibold"
          >
            Kembali ke Kelas Saya
          </button>
        </div>
      </div>
    );
  }

  //MENU HANDLER

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleMenuClick = (href: string) => {
    router.push(href);
    setShowMobileMenu(false);
  };

  if (!user?.isLoggedIn) {
    return null;
  }

  const menuItems = [
    {
      icon: FileText,
      label: "Profile",
      href: "/dashboard/profil",
      color: "text-pink-500",
    },
    {
      icon: Coins,
      label: "Poin MYOLA",
      href: "/dashboard/poin-myola",
      color: "text-pink-500",
    },
    {
      icon: ShoppingCart,
      label: "Pesanan Saya",
      href: "/dashboard/pesanan",
      color: "text-pink-500",
    },
    {
      icon: MonitorPlayIcon,
      label: "Kelas Saya",
      href: "/dashboard/kelas",
      color: "text-pink-500",
    },
    {
      icon: Megaphone,
      label: "Event Saya",
      href: "/dashboard/event-saya",
      color: "text-pink-500",
    },
    {
      icon: MapIcon,
      label: "Alamat Pengiriman",
      href: "/dashboard/alamat",
      color: "text-pink-500",
    },
    {
      icon: Settings2Icon,
      label: "Pengaturan Akun",
      href: "/dashboard/pengaturan-akun-akun",
      color: "text-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex justify-between items-center h-16 px-4">
          <h1 className="text-lg font-bold text-gray-900">Akun</h1>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu - Dropdown Style */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-b border-gray-200">
          {/* Saldo Card */}
          <div className="px-4 py-3 flex items-center gap-3 border-b bg-blue-50">
            <Wallet className="w-5 h-5 text-pink-600" />
            <div>
              <p className="text-xs text-gray-600">Poin </p>
              <p className="font-bold text-gray-900">10.000</p>
            </div>
          </div>

          {/* Menu Items */}
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleMenuClick(item.href)}
              className="w-full flex items-center gap-3 px-4 py-3 border-b hover:bg-gray-50 transition-colors text-left"
            >
              <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0`} />
              <span className="flex-1 font-medium text-gray-800 text-sm">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push("/dashboard/kelas")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar - Video List */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-bold text-gray-900 mb-2">
                    {course.title}
                  </h2>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>
                      {course.completedVideos}/{course.totalVideos} video
                      selesai
                    </span>
                    <span className="font-semibold text-pink-500">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-pink-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {course.videos.map((video) => {
                    const isLocked =
                      video.order > 1 &&
                      !video.completed &&
                      video.id !== currentVideo?.id;
                    const isCurrent = video.id === currentVideo?.id;

                    return (
                      <button
                        key={video.id}
                        onClick={() => handleVideoClick(video)}
                        disabled={isLocked}
                        className={`w-full p-4 text-left transition-colors ${
                          isCurrent
                            ? "bg-pink-50 border-l-4 border-pink-500"
                            : video.completed
                            ? "bg-green-50 hover:bg-green-100"
                            : isLocked
                            ? "bg-gray-50 cursor-not-allowed opacity-60"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {video.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : isLocked ? (
                              <Lock className="w-5 h-5 text-gray-400" />
                            ) : isCurrent ? (
                              <PlayIcon className="w-5 h-5 text-pink-600" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-semibold text-sm mb-1 ${
                                isCurrent
                                  ? "text-pink-600"
                                  : video.completed
                                  ? "text-green-900"
                                  : isLocked
                                  ? "text-gray-400"
                                  : "text-gray-900"
                              }`}
                            >
                              {video.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {video.duration}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content - Video Player */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Video Player */}
                {currentVideo && (
                  <div className="aspect-video w-full bg-black">
                    <iframe
                      src={getYouTubeEmbedUrl(currentVideo.youtubeUrl)}
                      title={currentVideo.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                {/* Video Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {currentVideo?.title}
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Instructors: {course.instructor}
                      </p>
                    </div>
                    {currentVideo && !currentVideo.completed && (
                      <button
                        onClick={handleCompleteVideo}
                        disabled={completingVideo}
                        className="px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {completingVideo ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Memproses...</span>
                          </>
                        ) : (
                          "Lanjutkan"
                        )}
                      </button>
                    )}
                    {currentVideo?.completed && (
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Selesai</span>
                      </div>
                    )}
                  </div>

                  {/* Course Description */}
                  <div className="border-t pt-6">
                    <h3 className="font-bold text-gray-900 mb-3">
                      What you'll learn
                    </h3>
                    <p className="text-gray-700 mb-6">{course.description}</p>

                    <h3 className="font-bold text-gray-900 mb-3">
                      Skill you'll gain
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {course.skillsGained.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
