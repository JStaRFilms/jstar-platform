import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "J StaR Films - Creative Operating System | Faith-Inspired Content Creation",
  description: "Where faith meets film and future. Professional video production, app development, and AI-powered creator tools by John Oluleke-Oke.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
