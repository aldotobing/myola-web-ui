/** @format */

// components/LessonCard.tsx
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export interface LessonCardProps {
  id: string;
  title: string;
  duration: string;
  isLocked: boolean;
  thumbnail: string;
  level?: string;
  videoCount?: number;
  courseSlug?: string; // Add course slug for proper routing
}

export default function LessonCard({
  id,
  title,
  duration,
  isLocked,
  thumbnail,
  level,
  videoCount = 5,
}: LessonCardProps) {
  // Generate lesson slug from title
  const lessonSlug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

  // Generate lesson slug from title
  const courseSlug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
  const cardContent = (
    <div className="bg-white rounded-2xl overflow-hidden  hover:shadow-xl transition-all duration-300 group cursor-pointer">
      {/* Lesson Thumbnail */}
      <div className="relative  h-[250px] sm:h-[320px] md:h-[380px] lg:h-[420px] overflow-hidden bg-gray-900">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-white text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold">
            {level}
          </span>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white font-bold text-lg mb-2 line-clamp-2">
            {title}
          </p>
          <p className="text-white/90 text-sm">{videoCount} Videos</p>
        </div>
      </div>

      {/* Duration & Lock Status */}
      <div className="p-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-500">{duration}</div>
          <button className="bg-[#FDF2F7] hover:bg-[#FDE6F0] text-pink-500 p-3 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg">
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  // If locked, don't make it clickable
  if (isLocked) {
    return cardContent;
  }

  return (
    <Link href={`/akademi/${courseSlug}/lesson/${lessonSlug}`}>
      {cardContent}
    </Link>
  );
}
