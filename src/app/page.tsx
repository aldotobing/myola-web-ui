/** @format */

"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  User,
  ShoppingCart,
  Heading1Icon,
  Star,
  StarIcon,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import ClassCard, { ClassCardProps } from "@/components/layout/classcard";
import ProductCard, { ProductCardProps } from "@/components/layout/productcard";
import Image from "next/image";
import ColorCard, { ColorCardProps } from "@/components/layout/colorcard";
import EventCard, { EventCardProps } from "@/components/layout/eventcard";
import PromoBanner from "@/components/layout/promobanner";
import Footer from "@/components/layout/footer";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContexts";

interface Slide {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export default function Home() {
  const { user } = useAuth();
  //Hero Slider

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const slides: Slide[] = [
    {
      title: "Grow Your Skills",
      subtitle: "Boost Your Salon Career",
      description:
        "Ayo join member sekarang dan dapatkan akses gratis ke akademi kelas eksklusif! Belajar teknik potong dan pewarnaan rambut langsung dari ahlinya.",
      image:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
    },
    {
      title: "Professional Training",
      subtitle: "Master Hair Techniques",
      description:
        "Tingkatkan kemampuan Anda dengan pelatihan profesional dari instruktur berpengalaman. Kelas praktis dengan sertifikat resmi.",
      image:
        "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop",
    },
    {
      title: "Exclusive Classes",
      subtitle: "Join Our Community",
      description:
        "Bergabunglah dengan komunitas salon profesional. Akses materi premium, video tutorial, dan konsultasi langsung dengan expert.",
      image:
        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop",
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = (): void => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = (): void => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number): void => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  //Class Card
  const classes: ClassCardProps[] = [
    {
      title: "SHADOW & LIGHT HAIR COLOR",
      level: "Beginner",
      image: "/images/kelas_1.png",
      fillCount: 1284,
      hugCount: 50,
    },
    {
      title: "REFLEXION COLOR HAIR CUT",
      level: "Beginner",
      image: "/images/kelas_2.png",
      fillCount: 1284,
      hugCount: 50,
    },
    {
      title: "THREE TONE COLOR TECHNIQUE",
      level: "Intermediate",
      image: "/images/kelas_3.png",
      fillCount: 1284,
      hugCount: 50,
    },
    {
      title: "ADVANCED CREATIVE CUTTING",
      level: "Advanced",
      image: "/images/kelas_4.png",
      fillCount: 1284,
      hugCount: 50,
    },
  ];

  //Product Card

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const products: ProductCardProps[] = [
    {
      id: "1",
      name: "Hair Color Cream Black Sugar",
      price: "Rp 56.000",
      rating: 5.0,
      image: "/images/product_1.png",
      cashback: 10000,
      inStock: true,
    },
    {
      id: "2",
      name: "Hair Color Cream Purple Sugar",
      price: "Rp 56.000",
      rating: 5.0,
      image: "/images/product_2.png",
      cashback: 10000,
      inStock: true,
    },
    {
      id: "3",
      name: "Hair Color Cream Pink Sugar",
      price: "Rp 56.000",
      rating: 5.0,
      image: "/images/product_3.png",
      cashback: 10000,
      inStock: true,
    },
    {
      id: "4",
      name: "Hair Color Cream Brown Sugar",
      price: "Rp 56.000",
      rating: 5.0,
      image: "/images/product_3.png",
      cashback: 10000,
      inStock: true,
    },
    {
      id: "5",
      name: "Hair Color Cream Red Sugar",
      price: "Rp 56.000",
      rating: 5.0,
      image: "/images/product_5.png",
      cashback: 10000,
      inStock: true,
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350;
      const newScrollPosition =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  //Color Card

  const colors: ColorCardProps[] = [
    {
      id: "1",
      name: "BLACK",
      image: "/images/color_black.png",
    },
    {
      id: "2",
      name: "BROWN",
      image: "/images/color_brown.png",
    },
    {
      id: "3",
      name: "GREEN",
      image: "/images/color_green.png",
    },
    {
      id: "4",
      name: "ORANGE",
      image: "/images/color_orange.png",
    },
    {
      id: "5",
      name: "BLUE",
      image: "/images/color_blue.png",
    },
    {
      id: "6",
      name: "BLUE",
      image: "/images/color_blue.png",
    },
  ];

  //Event Card
  const events: EventCardProps[] = [
    {
      id: "1",
      title: "Precision Cutting for Modern Styles",
      image: "/images/kelas_1.png",
      date: "20 October 2025",
      time: "16.00 WIB",
      category: "MASTERCLASS",
    },
    {
      id: "2",
      title: "Precision Cutting for Modern Styles",
      image: "/images/kelas_3.png",
      date: "20 October 2025",
      time: "16.00 WIB",
      category: "MASTERCLASS",
    },
    {
      id: "3",
      title: "Precision Cutting for Modern Styles",
      image: "/images/kelas_4.png",
      date: "20 October 2025",
      time: "16.00 WIB",
      category: "MASTERCLASS",
    },
    {
      id: "4",
      title: "Advanced Hair Coloring Techniques",
      image: "/images/kelas_2.png",
      date: "25 October 2025",
      time: "14.00 WIB",
      category: "MASTERCLASS",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Slides */}
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="min-w-full h-full relative">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${slide.image})`,
                }}
              />

              {/* Content */}
              <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex items-center">
                <div className="grid md:grid-cols-2 gap-8 items-center w-full">
                  {/* Left Content */}
                  <div className="text-white space-y-6">
                    <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                      {slide.title}
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-bold leading-tight">
                      {slide.subtitle}
                    </h3>
                    <p className="text-lg md:text-xl text-gray-200 max-w-xl">
                      {slide.description}
                    </p>

                    <Link
                      href={user ? "/dashboard" : "/auth/join-member"}
                      className="mt-12 bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg inline-block"
                      aria-label={user ? "Dashboard" : "Register"}
                    >
                      {user ? "Buka Dashboard" : "Join Member"}
                    </Link>
                  </div>

                  {/* Right Image */}
                  <div className="hidden md:block">
                    <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-3 rounded-full transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-3 rounded-full transition-all"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* {/*  Section  Quote/*} */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1">
        <p className="mx-auto my-10 sm:my-16 max-w-[770px] opacity-100 text-center text-xl sm:text-2xl leading-[150%]">
          Dari teknik dasar hingga tren terkini jadikan setiap sentuhan rambut
          sebagai karya seni.
        </p>
      </section>

      {/* Scrolling Text */}
      <section className="bg-pink-50 py-8 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          <span className="mx-8 text-pink-600 font-medium">
            <Star className="fill-pink-600" />
          </span>

          <span className="mx-8 text-pink-600 font-bold text-2xl md:text-3xl">
            <h1>Teknik Pewarnaan Global</h1>
          </span>
          <span className="mx-8 text-pink-600 font-bold text-2xl md:text-3xl">
            <Star className="fill-pink-600" />
          </span>
          <span className="mx-8 text-pink-600 font-bold text-2xl md:text-3xl">
            <h1>Rahasia Finishing</h1>
          </span>
          <span className="mx-8 text-pink-600 font-bold text-2xl md:text-3xl">
            <Star className="fill-pink-600" />
          </span>
          <span className="mx-8 text-pink-600 font-bold text-2xl md:text-3xl">
            <h1>Akses Selamanya</h1>
          </span>
          <span className="mx-8 text-pink-600 font-bold text-2xl md:text-3xl">
            <Star className="fill-pink-600" />
          </span>
          <span className="mx-8 text-pink-600 font-bold text-2xl md:text-3xl">
            <h1>Cashback Menarik</h1>
          </span>
          <span className="mx-8 text-pink-600 font-bold text-2xl md:text-3xl">
            <Star className="fill-pink-600" />
          </span>
          <span className="mx-8 text-pink-600 font-bold text-2xl md:text-3xl">
            <h1>Event Eksklusif</h1>
          </span>
        </div>
      </section>

      {/* Kelas saya */}

      <section className="max-w-7xl my-16 mx-auto px-4 sm:px-6 lg:px-1">
        <div className="max-w-7xl mx-auto">
          {/* Header with border */}

          <div className="flex items-center justify-between">
            <p className="text-4xl md:text-4xl sm:text-xl font-bold text-gray-900">
              Kelas Paling Disukai
            </p>
          </div>
          {/* Cards – Mobile Scroll, Desktop Grid */}
          <div
            className=" flex md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-10 overflow-x-auto md:overflow-visible scrollbar-hide "
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {classes.map((classItem, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[80%] sm:w-[60%] md:w-auto"
              >
                <ClassCard {...classItem} />
              </div>
            ))}
          </div>

          {/* Mobile Navigation Dots */}
          <div className="flex md:hidden justify-center gap-2 mt-6">
            {classes.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-200 ${
                  index === 0 ? "w-8 bg-pink-500" : "w-2 bg-gray-300"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* Try master class saya */}
      <section className="max-w-7xl my-16 mx-auto px-4 sm:px-6 lg:px-1">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Image */}
            <div className="relative w-full h-[320px] lg:h-[320px] rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/images/masterclas.png"
                alt="masterclass"
                className="object-cover"
                priority
                fill
              />
            </div>

            {/* Right Side - Content */}
            <div className="flex flex-col justify-center space-y-6">
              {/* Badge */}
              <div className="inline-block">
                <span className="text-pink-500 font-bold text-sm md:text-base uppercase tracking-wider">
                  TRY THE MASTERCLASS
                </span>
              </div>

              {/* Heading */}
              <p className="text-2xl md:text-2xl lg:text-2xl font-semibold text-gray-900 leading-tight">
                Kuasai teknik terkini dalam memotong dan mewarnai rambut.
                Tingkatkan keterampilanmu, bangun kepercayaan diri di kursi
                salon, dan jadikan kreativitasmu sumber inspirasi bagi setiap
                gaya yang kamu ciptakan.
              </p>

              {/* CTA Button */}
              <div className="pt-4">
                <button className="bg-pink-500 hover:bg-pink-600 text-white font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Daftar Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Produk Terlaris */}

      <section className="max-w-7xl my-16 mx-auto px-4 sm:px-6 lg:px-1">
        <div className="max-w-7xl mx-auto">
          {/* Header with border */}

          <div className="flex items-center justify-between ">
            <p className="text-4xl md:text-4xl sm:text-xl font-bold text-gray-900">
              Produk Terlaris
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden md:flex items-center gap-3 justify-end">
            <button
              onClick={() => scroll("left")}
              disabled={!showLeftArrow}
              className={`p-3 rounded-full transition-all duration-200 ${
                showLeftArrow
                  ? " hover:border-gray-400 hover:bg-gray-100 text-gray-700"
                  : " text-gray-300 cursor-not-allowed"
              }`}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!showRightArrow}
              className={`p-3 rounded-full transition-all duration-200 ${
                showRightArrow
                  ? " hover:border-gray-400 hover:bg-gray-100 text-gray-700"
                  : " text-gray-300 cursor-not-allowed"
              }`}
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative mt-6 ">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 "
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="w-full md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] min-w-[280px]"
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>

          {/* Mobile Navigation Dots */}
          <div className="flex md:hidden justify-center gap-2 mt-6">
            {products.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-200 ${
                  index === 0 ? "w-8 bg-pink-500" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Beli Berdasrkan Warna Terlaris */}

      <section className="max-w-7xl my-16 mx-auto px-4 sm:px-6 lg:px-1">
        <div className="max-w-7xl mx-auto">
          {/* Header with border */}

          <div className="flex items-center justify-between">
            <p className="text-4xl md:text-4xl sm:text-xl font-bold text-gray-900">
              Beli Berdasarkan Warna
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden md:flex items-center gap-3 justify-end">
            <button
              onClick={() => scroll("left")}
              disabled={!showLeftArrow}
              className={`p-3 rounded-full transition-all duration-200 ${
                showLeftArrow
                  ? " hover:border-gray-400 hover:bg-gray-100 text-gray-700"
                  : " text-gray-300 cursor-not-allowed"
              }`}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!showRightArrow}
              className={`p-3 rounded-full transition-all duration-200 ${
                showRightArrow
                  ? " hover:border-gray-400 hover:bg-gray-100 text-gray-700"
                  : " text-gray-300 cursor-not-allowed"
              }`}
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative mt-6">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {colors.map((color) => (
              <div
                className="w-[200px] md:w-[220px] lg:w-[240px] flex-shrink-0"
                key={color.id}
              >
                <ColorCard {...color} />
              </div>
            ))}
          </div>

          {/* Mobile Navigation Dots */}
          <div className="flex md:hidden justify-center gap-2 mt-8">
            {colors.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-200 ${
                  index === 0 ? "w-8 bg-pink-500" : "w-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Event */}

      <section className="ax-w-7xl my-16 mx-auto px-4 sm:px-6 lg:px-1">
        <div className="max-w-7xl mx-auto">
          {/* Header */}

          <div className="flex items-center justify-between">
            <div className="mb-4">
              <p className="text-4xl md:text-4xl sm:text-xl font-bold text-gray-900mb-3">
                Event Terbaru
              </p>
              <p className="text-gray-600 text-lg mt-2">
                Ikut sesi workshop ekslusif, peluncuran produk, dan demo
                langsung bersama para profesional rambut terbaik
              </p>
            </div>

            {/* Navigation Arrows */}
            <div className="hidden md:flex items-center gap-3 justify-end">
              <button
                onClick={() => scroll("left")}
                disabled={!showLeftArrow}
                className={`p-3 rounded-full transition-all duration-200 ${
                  showLeftArrow
                    ? " hover:border-gray-400 hover:bg-gray-100 text-gray-700"
                    : " text-gray-300 cursor-not-allowed"
                }`}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!showRightArrow}
                className={`p-3 rounded-full transition-all duration-200 ${
                  showRightArrow
                    ? " hover:border-gray-400 hover:bg-gray-100 text-gray-700"
                    : " text-gray-300 cursor-not-allowed"
                }`}
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Carousel Container */}
          <div className="relative mt-8">
            {/* Cards */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth pb-4"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] flex-shrink-0 snap-start"
                >
                  <EventCard {...event} />
                </div>
              ))}
            </div>

            {/* Pagination Dots - Mobile Only */}
            <div className="flex md:hidden justify-center gap-2 mt-6">
              {events.map((_, index) => (
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
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-8 bg-pink-500"
                      : "w-2 bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Banner Promo */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1 mb-12">
        <PromoBanner />
      </section>
    </div>
  );
}
