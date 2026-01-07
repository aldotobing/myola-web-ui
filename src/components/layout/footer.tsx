/** @format */

// components/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br bg-[#9B4A47]  text-white ">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Left Section - Logo & Contact Info */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="mb-8">
              <Image
                src="/logo_white.png" // path file logo di folder public
                alt="MyOLA Logo"
                width={160} // sesuaikan ukuran
                height={60}
                className="object-contain"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <p className="font-semibold text-lg">Ruko Sentra Darmo Villa C</p>
              <p className="text-white/90 leading-relaxed">
                Jl. Simpang Darmo Permai Utara No.5, Pradahkalikendal,
                <br />
                Kec. Dukuhpakis, Surabaya, Jawa Timur 60226
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <a
                href="mailto:monetti@gmail.com"
                className="flex items-center gap-3 hover:text-white/80 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>monetti@gmail.com</span>
              </a>
              <a
                href="tel:031-701289102"
                className="flex items-center gap-3 hover:text-white/80 transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>031-701289102</span>
              </a>
            </div>
          </div>

          {/* Right Section - Navigation & Quote */}
          <div className="space-y-8">
            {/* Navigation Links */}
            <nav className="flex flex-wrap gap-8 text-lg">
              <Link
                href="/tentang-kami"
                className="hover:text-white/80 transition-colors font-medium"
              >
                Tentang Kami
              </Link>
              <Link
                href="/kursus"
                className="hover:text-white/80 transition-colors font-medium"
              >
                Kursus
              </Link>
              <Link
                href="/produk"
                className="hover:text-white/80 transition-colors font-medium"
              >
                Produk
              </Link>
              <Link
                href="/event"
                className="hover:text-white/80 transition-colors font-medium"
              >
                Event
              </Link>
            </nav>

            {/* Social Media Icons */}
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                aria-label="TikTok"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>

            {/* Quote */}
            <blockquote className="text-xl md:text-2xl leading-relaxed italic">
              "Belajar, berkreasi, dan tampil percaya diri. Kami menghadirkan
              kursus dan produk rambut profesional yang memadukan edukasi,
              kreativitas, dan sentuhan seni"
            </blockquote>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20 mb-8"></div>

        {/* Bottom Section - Copyright & Links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p className="text-white/80">© 2025 MOLA. All Rights Reserved.</p>

          <div className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-white/80 transition-colors underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/term-of-condition"
              className="hover:text-white/80 transition-colors underline"
            >
              Term of Condition
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
