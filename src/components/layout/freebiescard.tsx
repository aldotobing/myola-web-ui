/** @format */

// components/FreebiesCard.tsx
import Image from "next/image";
import { Download } from "lucide-react";

export interface FreebiesCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  downloadCount: number;
  fileType: string; // PDF, PSD, etc.
  downloadUrl: string;
}

export default function FreebiesCard({
  title,
  description,
  image,
  downloadCount,
  fileType,
  downloadUrl,
}: FreebiesCardProps) {
  const handleDownload = () => {
    // Handle download logic
    window.open(downloadUrl, "_blank");
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
      {/* Freebie Image */}
      <div className="relative h-72 bg-gray-50 flex items-center justify-center p-8">
        <div className="relative w-full h-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>

      {/* Freebie Info */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
          {description}
        </p>

        {/* Download Info */}
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <Download className="w-4 h-4" />
          <span>{downloadCount} download</span>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
        >
          Download
        </button>
      </div>
    </div>
  );
}
