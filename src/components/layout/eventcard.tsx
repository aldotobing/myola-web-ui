/** @format */

"use client";

// components/EventCard.tsx
import Image from "next/image";
import { Calendar } from "lucide-react";
import Link from "next/link";

export interface EventCardProps {
  id: string;
  title: string;
  image: string;
  date: string;
  time: string;
  category: string;
  slug?: string;
}

export default function EventCard({
  title,
  image,
  date,
  time,
  category,
  slug,
}: EventCardProps) {
  // Generate slug from title if not provided
  const eventSlug =
    slug ||
    title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

  const cardContent = (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group flex-shrink-0 w-full">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-6 bg-gradient-to-b from-pink-50 to-white">
        {/* Category Badge */}
        <div className="mb-4">
          <span className="inline-block bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 min-h-[3.5rem]">
          {title}
        </h3>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-gray-700 mb-5">
          <Calendar className="w-5 h-5 text-pink-500" />
          <span className="font-medium">
            {date} | {time}
          </span>
        </div>

        {/* CTA Button */}
        <button className="w-full border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white font-bold py-3 px-6 rounded-xl transition-all duration-300">
          Gabung Sekarang
        </button>
      </div>
    </div>
  );

  return <Link href={`/event/${eventSlug}`}>{cardContent}</Link>;
}
