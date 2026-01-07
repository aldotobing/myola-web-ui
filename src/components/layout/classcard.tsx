/** @format */

// components/ClassCard.tsx
import Image from "next/image";
import Link from "next/link";

export interface ClassCardProps {
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  fillCount: number;
  hugCount: number;
  slug?: string; // Optional slug for linking to detail page
}

export default function ClassCard({
  title,
  level,
  image,
  fillCount,
  hugCount,
  slug,
}: ClassCardProps) {
  const levelColors = {
    Beginner: "bg-white text-gray-800",
    Intermediate: "bg-white text-gray-800",
    Advanced: "bg-white text-gray-800",
  };

  // Generate slug from title if not provided
  const courseSlug =
    slug ||
    title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

  const cardContent = (
    <div className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
      {/* Image Container */}
      <div className="relative  h-[280px] sm:h-[320px] md:h-[380px] lg:h-[420px] w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        {/* Level Badge */}
        <span
          className={`inline-block px-4 py-1.5 rounded-full text-xs sm:text-sm  font-medium mb-2 sm:mb-3 ${levelColors[level]}`}
        >
          {level}
        </span>

        {/* Title */}
        <p className="text-lg sm:text-xl md:text-2xl font-bold uppercase  mb-1 sm:mb-2 drop-shadow-lg">
          {title}
        </p>

        {/* Kelas */}
        <p className="text-sm sm:text-base md:text-lg  mb-1 sm:mb-2 drop-shadow-lg">
          {fillCount} Kelas
        </p>
      </div>
    </div>
  );

  return <Link href={`/akademi/${courseSlug}`}>{cardContent}</Link>;
}
