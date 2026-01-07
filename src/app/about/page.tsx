/** @format */
"use client";

// app/tentang-kami/page.tsx
import Image from "next/image";
import { Users, MapPin, Award, BookOpen, Palette } from "lucide-react";

export default function AboutPage() {
  const teamMembers = [
    {
      id: "1",
      name: "Amelia Hartono",
      position: "Founder & Creative Director",
      image: "/images/profil1.png",
    },
    {
      id: "2",
      name: "Kevin Pratama",
      position: "Head of Education",
      image: "/images/profil2.png",
    },
    {
      id: "3",
      name: "Livia Santoso",
      position: "Senior Hairstylist & Instructor",
      image: "/images/profil3.png",
    },
    {
      id: "4",
      name: "Clara Wijaya",
      position: "Marketing & Brand Strategist",
      image: "/images/profil4.png",
    },
  ];

  const stats = [
    {
      image: "/images/icons8-wonder-woman-100.png",
      title: "60+ profesional berpengalaman",
    },
    {
      image: "/images/icons8-webex-100.png",
      title: "600+ salon mitra di Indonesia",
    },
    {
      image: "/images/icons8-ai-100.png",
      title: "7 pengajar tersertifikasi",
    },
    {
      image: "/images/icons8-ios-photos-100.png",
      title: "Kolaborasi dengan beauty blogger",
    },
    {
      image: "/images/icons8-home-100.png",
      title: "2 pusat pelatihan hair stylist",
    },
    {
      image: "/images/icons8-community-100.png",
      title: "Jaringan stylist profesional nasional",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="flex h-full ">
          <div className="min-w-full h-full relative">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(images/background_about.png)`,
              }}
            />

            {/* Content */}
            <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex items-center">
              <div className="grid md:grid-cols-2 gap-8 items-center w-full">
                {/* Left Content */}
                <div className="text-white max-w-2xl">
                  <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    Tentang Kami
                  </h1>
                  <p className="text-lg md:text-xl leading-relaxed">
                    Kami adalah akademi online salon yang percaya bahwa rambut
                    adalah <span className="font-bold">alat ekspresi diri</span>{" "}
                    untuk semua jenis <span className="font-bold">kelamin</span>
                    . Melalui{" "}
                    <span className="font-bold">kelas profesional</span> dan{" "}
                    <span className="font-bold">produk berkualitas</span>, kami
                    bantu para hairstylist meningkatkan keterampilan, skill
                    ✨/levei — dan lebih hingga praktik di salon. ✨
                  </p>
                </div>

                {/* Right Image */}
                <div className="hidden md:block">
                  <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src="/images/background_about.png"
                      alt="Tentang Kami"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="py-20 px-2 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="max-w-5xl mx-auto text-justify">
          <h2 className="text-3xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight">
            <span className="text-pink-600 font-bold">Coloring</span>
            <span className="text-gray-900 font-medium md:text-4xl lg:text-5xl">
              , styling,
            </span>
            <span className="text-pink-600 font-bold">cutting</span>
            <span className="text-gray-900 font-medium md:text-4xl lg:text-5xl">
              , and every technique
            </span>
          </h2>

          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 font-medium mt-8">
            that defines beauty —
            <span className="text-pink-600 font-bld">all in one academy.</span>
          </p>
        </div>
      </section>

      {/* Journey Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative w-full h-64 overflow-hidden shadow-2xl ">
                <Image
                  src="/images/about1.png"
                  alt="Salon Experience"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-full h-80 overflow-hidden shadow-2xl  mt-12">
                <Image
                  src="/images/about2.png"
                  alt="Training Session"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-full h-64 overflow-hidden shadow-2xl  -mt-16">
                <Image
                  src="/images/about3.png"
                  alt="Student Learning"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Perjalanan <span className="text-pink-500">Kami</span>
              </h2>
              <p className="text-pink-500 font-semibold text-lg mb-4">
                Dari salon kecil ke platform edukasi global.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                Kami berawal dari salon lokal yang ingin buka akses belajar bagi
                semua hairstylist.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg mb-4">
                Kini, lewat kursus online dan produk profesional, kami bantu
                ribuan murid tumbuh{" "}
                <span className="font-bold">dan menciptakan tren</span> baru
                setiap hari. 💅
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col md:flex-row justify-between md:items-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-4 md:mb-0">
              Tim <span className="text-pink-500">Kami</span>
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed max-w-xl">
              Kami adalah{" "}
              <span className="font-bold text-pink-500">hairstylist</span>,{" "}
              <span className="font-bold text-pink-500">
                professional educator
              </span>
              , dan{" "}
              <span className="font-bold text-pink-500">beauty innovators</span>{" "}
              yang punya satu misi: bantu kamu tampil percaya diri lewat rambut
              yang sehat dan penuh warna.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <div key={member.id} className=" overflow-hidden  ">
                <div className="relative  h-80 overflow-hidden bg-gray-100">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500 shadow-xl rounded-sm "
                  />
                </div>
                <div className="pt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-gray-600">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12 ">
            Sekilas Tentang <span className="text-pink-500">Kami</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  {/* Image Icon Container */}
                  <div
                    className={`flex-shrink-0 w-16 h-16 rounded-xl p-3 flex items-center justify-center`}
                  >
                    {stat.image && (
                      <div className="relative w-full h-full">
                        <Image
                          src={stat.image}
                          alt={stat.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <p className="text-base font-semibold text-gray-900 leading-relaxed">
                    {stat.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
