/** @format */

import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Libre_Baskerville,
  Montserrat,
} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { AuthProvider } from "./contexts/AuthContexts";
import { CartProvider } from "./contexts/CartContexts";
import ToastProvider from "@/components/providers/ToastProvider";
import SWRProvider from "@/components/providers/SWRProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const libreBaskervillle = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyOLA - Professional Hair Academy & Store",
  description: "Learn hair techniques and shop professional hair products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${libreBaskervillle.variable} ${montserrat.variable} antialiased font-montserrat`}
      >
        <SWRProvider>
          <AuthProvider>
            <CartProvider>
              <ToastProvider />
              <Navbar />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </SWRProvider>
      </body>
    </html>
  );
}