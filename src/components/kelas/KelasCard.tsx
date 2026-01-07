/** @format */
"use client";

import { Course } from "@/types/kelas";
import { Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface CourseCardProps {
  course: Course;
  showProgress?: boolean;
}

export default function CourseCard({
  course,
  showProgress = true,
}: CourseCardProps) {
  const getStatusButton = () => {
    if (course.status === "completed") {
      return (
        <Link
          href={`/dashboard/kelas/${course.id}`}
          className="px-4 py-2 bg-white text-pink-500 border-2 border-pink-500 rounded-lg text-sm font-semibold hover:bg-pink-50 transition-colors"
        >
          Lihat Ulang
        </Link>
      );
    }

    if (course.status === "in_progress") {
      return (
        <Link
          href={`/dashboard/kelas/${course.id}`}
          className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-semibold hover:bg-pink-600 transition-colors"
        >
          Lanjutkan
        </Link>
      );
    }

    if (course.status === "not_started") {
      return (
        <Link
          href={`/dashboard/kelas/${course.id}`}
          className="px-4 py-2 bg-white text-pink-500 border-2 border-pink-500 rounded-lg text-sm font-semibold hover:bg-pink-50 transition-colors"
        >
          Mulai
        </Link>
      );
    }
  };

  const getStatusBadge = () => {
    if (course.status === "completed") {
      return (
        <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Selesai</span>
        </div>
      );
    }

    if (course.status === "in_progress") {
      return (
        <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
          <Clock className="w-4 h-4" />
          <span>Sedang Berlangsung</span>
        </div>
      );
    }

    if (course.status === "not_started") {
      return (
        <div className="text-xs text-gray-500 font-medium">
          Belum mulai belajar
        </div>
      );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Course Header */}
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-lg font-bold text-gray-900 flex-1 pr-4">
            {course.title}
          </p>
          {getStatusButton()}
        </div>

        {/* Course Info */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
          <span>
            {course.completedVideos}/{course.totalVideos} video
          </span>
          <span>•</span>
          <span>
            {course.videos.reduce((total, video) => {
              const duration = parseInt(video.duration);
              return total + duration;
            }, 0)}{" "}
            menit
          </span>
          {course.startDate && (
            <>
              <span>•</span>
              <span>Mulai belajar {course.startDate}</span>
            </>
          )}
        </div>

        {/* Status Badge */}
        <div className="mb-3">{getStatusBadge()}</div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">Progress</span>
              <span className="text-xs font-bold text-pink-500">
                {course.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-pink-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
