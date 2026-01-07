/** @format */
import Navbar from "@/components/layout/navbar";
import "./globals.css";
import type { Metadata } from "next";
import { Montserrat, Libre_Baskerville } from "next/font/google";
import Footer from "@/components/layout/footer";
import { AuthProvider } from "./contexts/AuthContexts";
import { CartProvider } from "./contexts/CartContexts";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"], // opsional: pilih weight yang dibutuhkan
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"], // Libre Baskerville hanya punya 400 dan 700
});

export const metadata: Metadata = {
  title: "MYOLA",
  description: "Monetti Academy Online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${libreBaskerville.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
          </CartProvider>
        </AuthProvider>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
