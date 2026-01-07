/** @format */

"use client";

import { useState } from "react";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  LayoutDashboardIcon,
  ShoppingCartIcon,
  MonitorPlayIcon,
  LogOutIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../app/contexts/AuthContexts";
import { LayoutDashboard } from "lucide-react";
import { useCart } from "../../app/contexts/CartContexts";

interface NavLink {
  name: string;
  href: string;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [cartCount] = useState<number>(0);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cart } = useCart();

  const navLinks: NavLink[] = [
    { name: "Akademi", href: "/akademi" },
    { name: "Store", href: "/store" },
    { name: "Event", href: "/event" },
    { name: "Freebies", href: "/freebies" },
    { name: "Tentang Kami", href: "/about" },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  const handleLogout = () => {
    logout();
    router.push("/");
    setShowDropdown(false);
    setIsMenuOpen(false);
  };

  const handleProfileClick = () => {
    router.push("/dashboard/profil");
    setShowDropdown(false);
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    router.push("/auth/login");
    setShowDropdown(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="MyOLA Logo"
                width={120}
                height={40}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center space-x-12 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors duration-200 text-base ${
                  isActive(link.href)
                    ? "text-pink-600 font-bold"
                    : "text-gray-800 font-medium hover:text-pink-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            {/* Cart Icon with Badge */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-6 h-6 text-gray-800 stroke-[1.5]" />
              {cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </Link>

            {/* User Icon / Profile */}
            {user?.isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="User profile"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <span className="inline-block bg-pink-500 text-white text-xs px-2 py-1 rounded mt-2">
                        {user.points?.toLocaleString()} Poin
                      </span>
                    </div>

                    {/* Menu Items */}
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 font-medium transition-colors text-sm flex items-center gap-2"
                    >
                      <LayoutDashboardIcon className="w-4 h-4" />
                      <span> Profil</span>
                    </button>

                    <button
                      onClick={() => {
                        router.push("/dashboard/kelas");
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 font-medium transition-colors text-sm flex items-center gap-2"
                    >
                      <MonitorPlayIcon className="w-4 h-4" />
                      <span> Kelas Saya</span>
                    </button>

                    <button
                      onClick={() => {
                        router.push("/dashboard/pesanan");
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-pink-50 hover:text-pink-600 font-medium transition-colors text-sm flex items-center gap-2"
                    >
                      <ShoppingCartIcon className="w-4 h-4" />
                      <span> Pesanan Saya</span>
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium transition-colors text-sm flex items-center gap-2"
                    >
                      <LogOutIcon className="w-4 h-4" />
                      <span> Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="User profile"
              >
                <User className="w-6 h-6 text-gray-800 stroke-[1.5]" />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-800" />
              ) : (
                <Menu className="w-6 h-6 text-gray-800" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition-colors duration-200 px-2 py-2 text-base ${
                    isActive(link.href)
                      ? "text-pink-600 font-bold"
                      : "text-gray-800 font-medium hover:text-pink-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile User Menu */}
              {user?.isLoggedIn ? (
                <div className="border-t pt-4 mt-4">
                  <div className="px-2 py-2">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-2 py-2 text-gray-700 hover:text-pink-600 font-medium transition-colors"
                  >
                    <LayoutDashboardIcon className="w-4 h-4" />
                    <span> Profil</span>
                  </button>
                  <button
                    onClick={() => {
                      router.push("/dashboard/kelas");
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-2 text-gray-700 hover:text-pink-600 font-medium transition-colors"
                  >
                    <MonitorPlayIcon className="w-4 h-4" />
                    <span> Kelas Saya</span>
                  </button>
                  <button
                    onClick={() => {
                      router.push("/dashboard/pesanan");
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-2 py-2 text-gray-700 hover:text-pink-600 font-medium transition-colors"
                  >
                    <ShoppingCartIcon className="w-4 h-4" />
                    <span> Pesanan Saya</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-2 py-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    <LogOutIcon className="w-4 h-4" />
                    <span> Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="w-full text-left px-2 py-2 text-pink-600 font-bold hover:text-pink-700 transition-colors border-t pt-4"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
