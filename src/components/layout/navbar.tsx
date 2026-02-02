/** @format */

"use client";

import { useState } from "react";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  LayoutDashboard,
  ShoppingCart,
  MonitorPlay,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../app/contexts/AuthContexts";
import { useCart } from "../../app/contexts/CartContexts";
import LogoutModal from "../auth/LogoutModal";
import { Terminal } from "lucide-react";

interface NavLink {
  name: string;
  href: string;
}

export default function Navbar() {
  const isDev = process.env.NODE_ENV === "development";
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
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

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      // Add a small artificial delay to let the sophisticated animation "breathe"
      await new Promise((resolve) => setTimeout(resolve, 1800));

      await signOut();
      router.push("/");
      setIsLogoutModalOpen(false);
      setShowDropdown(false);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
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
                src={
                  user?.role === "admin"
                    ? "/Admin.png"
                    : user?.role === "sales"
                      ? "/Sales.png"
                      : "/logo.png"
                }
                alt="MyOLA Logo"
                width={120}
                height={40}
                className="object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          {!user || (user.role !== "admin" && user.role !== "sales") ? (
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
                          {isDev && (
                            <Link 
                              href="/dev/api-test" 
                              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-black hover:bg-black transition-all shadow-lg shadow-gray-200"
                            >
                              <Terminal size={14} className="text-pink-500" /> DEV LAB
                            </Link>
                          )}
                        </div>          ) : null}

          {/* Right Side Icons */}
          <div className="flex items-center space-x-3">
            {(!user || (user.role !== "admin" && user.role !== "sales")) && (
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
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {user.full_name?.charAt(0).toUpperCase()}
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl py-3 z-50 border border-gray-100 animate-in fade-in zoom-in duration-200">
                    <div className="px-6 py-4 border-b border-gray-100 mb-2">
                      <p className="font-bold text-gray-900 truncate">
                        {user.full_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] w-fit font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded uppercase">
                            {user.role}
                          </span>
                          {user.memberUntil &&
                            new Date(user.memberUntil).getTime() - Date.now() <
                              7 * 24 * 60 * 60 * 1000 && (
                              <span className="text-[9px] font-black text-orange-600 animate-pulse">
                                ⚠️ SEGERA BERAKHIR
                              </span>
                            )}
                        </div>
                        {user.role === "member" && (
                          <span className="text-xs font-bold text-gray-700">
                            {user.points_balance?.toLocaleString()} Poin
                          </span>
                        )}
                      </div>
                    </div>

                    {user.role === "admin" && (
                      <>
                        <Link
                          href="/dashboard/admin"
                          onClick={() => setShowDropdown(false)}
                          className="w-full text-left px-6 py-3 text-pink-600 hover:bg-pink-50 font-bold flex items-center gap-3 transition-colors"
                        >
                          <LayoutDashboard size={18} /> Master Dashboard
                        </Link>
                        {isDev && (
                          <Link 
                            href="/dev/api-test" 
                            onClick={() => setShowDropdown(false)} 
                            className="w-full text-left px-6 py-3 text-gray-900 bg-gray-50 hover:bg-gray-100 font-black flex items-center gap-3 transition-colors border-y border-gray-100"
                          >
                            <Terminal size={18} className="text-pink-500" /> API LAB (DEV)
                          </Link>
                        )}
                      </>
                    )}

                    {user.role === "sales" && (
                      <Link
                        href="/dashboard/sales"
                        onClick={() => setShowDropdown(false)}
                        className="w-full text-left px-6 py-3 text-blue-600 hover:bg-blue-50 font-bold flex items-center gap-3 transition-colors"
                      >
                        <LayoutDashboard size={18} /> Sales Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-6 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 font-medium flex items-center gap-3 transition-colors"
                    >
                      <User size={18} /> Profil Saya
                    </button>

                    {user.role === "member" && (
                      <>
                        <button
                          onClick={() => {
                            router.push("/dashboard/kelas");
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-6 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 font-medium flex items-center gap-3 transition-colors"
                        >
                          <MonitorPlay size={18} /> Kelas Saya
                        </button>
                        <button
                          onClick={() => {
                            router.push("/dashboard/pesanan");
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-6 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 font-medium flex items-center gap-3 transition-colors"
                        >
                          <ShoppingCart size={18} /> Pesanan Saya
                        </button>
                      </>
                    )}

                    <div className="border-t border-gray-100 my-2"></div>
                    <button
                      onClick={() => setIsLogoutModalOpen(true)}
                      className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 font-bold flex items-center gap-3 transition-colors"
                    >
                      <LogOut size={18} /> Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLoginClick}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-gray-200"
              >
                <User className="w-6 h-6 text-gray-800 stroke-[1.5]" />
              </button>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t animate-in slide-in-from-top duration-300">
            <div className="flex flex-col space-y-2">
              {!user || (user.role !== "admin" && user.role !== "sales") ? (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`px-4 py-3 rounded-xl text-lg font-medium transition-colors ${isActive(link.href) ? "bg-pink-50 text-pink-600 font-bold" : "text-gray-800 hover:bg-gray-50"}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}{" "}
                  {isDev && (
                    <Link 
                      href="/dev/api-test" 
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-3 rounded-xl text-lg font-black bg-gray-900 text-white flex items-center gap-3"
                    >
                      <Terminal size={20} className="text-pink-500" /> DEV LAB
                    </Link>
                  )}
                </>
              ) : null}
              {user ? (
                <div className="pt-6 mt-4 border-t border-gray-100 space-y-2">
                  <div className="px-4 mb-4">
                    <p className="font-bold text-gray-900">{user.full_name}</p>
                    <p className="text-sm text-gray-500 uppercase font-bold text-pink-600">
                      {user.role}
                    </p>
                  </div>

                  {user.role === "admin" && (
                    <>
                      <Link
                        href="/dashboard/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full text-left px-4 py-3 rounded-xl bg-pink-50 text-pink-600 font-bold flex items-center gap-3"
                      >
                        <LayoutDashboard size={20} /> Master Dashboard
                      </Link>
                      {isDev && (
                        <Link 
                          href="/dev/api-test" 
                          onClick={() => setIsMenuOpen(false)}
                          className="w-full text-left px-4 py-3 rounded-xl bg-gray-900 text-white font-black flex items-center gap-3 mt-2"
                        >
                          <Terminal size={20} className="text-pink-500" /> API LAB (DEV)
                        </Link>
                      )}
                    </>
                  )}

                  {user.role === "sales" && (
                    <Link
                      href="/dashboard/sales"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full text-left px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center gap-3"
                    >
                      <LayoutDashboard size={20} /> Sales Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-pink-50 hover:text-pink-600 font-medium flex items-center gap-3"
                  >
                    <User size={20} /> Profil Saya
                  </button>

                  {user.role === "member" && (
                    <>
                      <button
                        onClick={() => {
                          router.push("/dashboard/kelas");
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-pink-50 hover:text-pink-600 font-medium flex items-center gap-3"
                      >
                        <MonitorPlay size={20} /> Kelas Saya
                      </button>
                      <button
                        onClick={() => {
                          router.push("/dashboard/pesanan");
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-pink-50 hover:text-pink-600 font-medium flex items-center gap-3"
                      >
                        <ShoppingCart size={20} /> Pesanan Saya
                      </button>
                    </>
                  )}

                  <div className="border-t border-gray-100 my-2"></div>
                  <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-bold flex items-center gap-3"
                  >
                    <LogOut size={20} /> Keluar
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="mt-6 mx-4 bg-pink-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-100"
                >
                  Login / Register
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleSignOut}
        isLoading={isLoggingOut}
      />
    </nav>
  );
}
