/** @format */

// components/PromoBanner.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface BannerProps {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: string;
  bgColor: string;
}

export default function PromoBanner() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners: BannerProps[] = [
    {
      id: "1",
      title: "Exclusive Offer",
      description:
        "Dapatkan diskon eksklusif untuk kursus terbaik dan koleksi warna pilihan kami. Belajar lebih banyak, hemat lebih banyak, dan tampil lebih bersinar!",
      buttonText: "Baca Selengkapnya",
      buttonLink: "#",
      image: "/images/kelas_1.png",
      bgColor: "from-rose-700 to-rose-900",
    },
    {
      id: "2",
      title: "Special Discount",
      description:
        "Nikmati potongan harga spesial hingga 50% untuk semua produk hair care premium. Kesempatan terbatas, buruan ambil sebelum kehabisan!",
      buttonText: "Belanja Sekarang",
      buttonLink: "#",
      image: "/images/kelas_1.png",
      bgColor: "from-purple-700 to-purple-900",
    },
    {
      id: "3",
      title: "New Collection",
      description:
        "Koleksi terbaru sudah hadir! Eksplorasi warna-warna trending 2025 dan teknik styling terkini dari para profesional. Jadilah yang pertama mencoba!",
      buttonText: "Lihat Koleksi",
      buttonLink: "#",
      image: "/images/kelas_1.png",
      bgColor: "from-blue-700 to-blue-900",
    },
  ];

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = scrollContainerRef.current.offsetWidth;
      const index = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <section className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          {/* Carousel Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="w-full flex-shrink-0 snap-start px-2"
              >
                {/* Banner Card */}
                <div
                  className={`relative bg-gradient-to-r ${banner.bgColor} rounded-3xl overflow-hidden shadow-2xl min-h-[400px] md:min-h-[500px]`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                  {/* Left Content */}
                  <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 text-white z-10">
                    {/* Title with Icon */}
                    <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                      {banner?.title || ""}
                    </h3>

                    <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-yellow-300" />
                    </div>

                    {/* Description */}
                    <p className="text-lg md:text-xl leading-relaxed mb-8 text-white/90">
                    {banner.description}
                    </p>

                    {/* CTA Button */}
                    <div>
                    <a
                      href={banner.buttonLink}
                      className="inline-block bg-white text-gray-900 font-bold text-lg px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      {banner.buttonText}
                    </a>
                    </div>
                  </div>

                  {/* Right Image - Hidden on Mobile */}
                  <div className="hidden md:block relative min-h-[400px] md:min-h-[500px] md:h-auto">
                    <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover"
                    priority={banner.id === "1"}
                    />
                  </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (scrollContainerRef.current) {
                    const cardWidth = scrollContainerRef.current.offsetWidth;
                    scrollContainerRef.current.scrollTo({
                      left: cardWidth * index,
                      behavior: "smooth",
                    });
                  }
                }}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-10 bg-rose-600"
                    : "w-3 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
