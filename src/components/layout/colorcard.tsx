/** @format */

// components/ColorCard.tsx
import Image from "next/image";

export interface ColorCardProps {
  id: string;
  name: string;
  image: string;
}

export default function ColorCard({ name, image }: ColorCardProps) {
  return (
    <div className="group cursor-pointer flex-shrink-0 w-full">
      <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image src={image} alt={name} fill className="object-cover" />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
        </div>

        {/* Color Label */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
          <p className="text-white font-bold text-xl uppercase tracking-wider drop-shadow-lg">
            {name}
          </p>
        </div>
      </div>
    </div>
  );
}
