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
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getUserCourses } from "@/lib/service/member/kelas";
import { Course } from "@/types/kelas";
import CourseCard from "@/components/kelas/KelasCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import useSWR from "swr";

export default function KelasPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Use SWR for Resilient Fetching
  const { data: courses = [], isLoading: loading } = useSWR(
    user ? ["user-courses", user.id] : null,
    () => getUserCourses(user?.id),
  );

  const handleMenuClick = (href: string) => {
    router.push(href);
    setShowMobileMenu(false);
  };

  if (!user) return null;

  const notStartedCourses = (courses as Course[]).filter(
    (c) => c.status === "not_started",
  );
  const inProgressCourses = (courses as Course[]).filter(
    (c) => c.status === "in_progress",
  );
  const completedCourses = (courses as Course[]).filter(
    (c) => c.status === "completed",
  );

  const menuItems = [
    { icon: FileText, label: "Profile", href: "/dashboard/profil" },
    { icon: Coins, label: "Poin MYOLA", href: "/dashboard/poin-myola" },
    { icon: ShoppingCart, label: "Pesanan Saya", href: "/dashboard/pesanan" },
    { icon: MonitorPlayIcon, label: "Kelas Saya", href: "/dashboard/kelas" },
    { icon: Megaphone, label: "Event Saya", href: "/dashboard/event" },
    { icon: MapIcon, label: "Alamat Pengiriman", href: "/dashboard/alamat" },
    {
      icon: Settings2Icon,
      label: "Pengaturan Akun",
      href: "/dashboard/pengaturan-akun",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex justify-between items-center h-16 px-4">
          <h1 className="text-lg font-bold text-gray-900">Kelas Saya</h1>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden md:block md:col-span-1">
            <div className="bg-pink-50 rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {user.full_name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 truncate">
                    {user.full_name}
                  </h3>
                  <span className="inline-block bg-pink-500 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase mt-1">
                    Member
                  </span>
                </div>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      item.href === "/dashboard/kelas"
                        ? "bg-white text-pink-600 shadow-sm"
                        : "text-gray-700 hover:bg-white hover:text-pink-600"
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Kelas Saya
            </h2>

            <Tabs defaultValue="not_started" className="w-full">
              <TabsList className="bg-transparent p-0 h-auto flex w-full overflow-x-auto overflow-y-hidden no-scrollbar justify-start space-x-2 pb-2">
                <TabsTrigger
                  value="not_started"
                  className="bg-pink-100 text-pink-500 px-6 py-2 rounded-lg font-medium data-[state=active]:bg-pink-500 data-[state=active]:text-white"
                >
                  Belum Mulai
                </TabsTrigger>
                <TabsTrigger
                  value="in_progress"
                  className="bg-pink-100 text-pink-500 px-6 py-2 rounded-lg font-medium data-[state=active]:bg-pink-500 data-[state=active]:text-white whitespace-nowrap"
                >
                  Sedang Berlangsung
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="bg-pink-100 text-pink-500 px-6 py-2 rounded-lg font-medium data-[state=active]:bg-pink-500 data-[state=active]:text-white"
                >
                  Selesai
                </TabsTrigger>
              </TabsList>

              {["not_started", "in_progress", "completed"].map((status) => (
                <TabsContent key={status} value={status}>
                  {loading && courses.length === 0 ? (
                    <div className="py-20 text-center">
                      <Loader2 className="w-10 h-10 animate-spin text-pink-500 mx-auto" />
                    </div>
                  ) : (status === "not_started"
                      ? notStartedCourses
                      : status === "in_progress"
                        ? inProgressCourses
                        : completedCourses
                    ).length > 0 ? (
                    <div className="space-y-4">
                      {(status === "not_started"
                        ? notStartedCourses
                        : status === "in_progress"
                          ? inProgressCourses
                          : completedCourses
                      ).map((course) => (
                        <CourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MonitorPlayIcon className="w-10 h-10 text-gray-200" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Belum ada kelas
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Mulai belajar dari kelas yang tersedia di Akademi.
                      </p>
                      <Link
                        href="/akademi"
                        className="inline-block px-8 py-3 bg-pink-500 text-white font-bold rounded-xl shadow-lg shadow-pink-100 hover:bg-pink-600 transition-all"
                      >
                        Jelajahi Akademi
                      </Link>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
