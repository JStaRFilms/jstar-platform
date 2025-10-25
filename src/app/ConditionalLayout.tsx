'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { JohnGPTFeature } from "@/features/john-gpt";
import Providers from "@/lib/providers";
import { useScrollBlur } from "@/hooks/useScrollBlur";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const { isScrolling, startScrollBlur } = useScrollBlur({ blurDuration: 600, blurIntensity: 1 });

  // Make startScrollBlur available globally for navigation components
  useEffect(() => {
    (window as any).startScrollBlur = startScrollBlur;
    return () => {
      delete (window as any).startScrollBlur;
    };
  }, [startScrollBlur]);

  // Don't show header/footer on admin pages
  const isAdminPage = pathname?.startsWith('/admin');

  // Don't add padding to homepage since it has its own padding
  const isHomePage = pathname === '/';
  const shouldAddPadding = !isAdminPage && !isHomePage;

  return (
    <Providers>
      {!isAdminPage && <Header />}
      <main className={`${shouldAddPadding ? "pt-12" : ""} pb-20 md:pb-0 transition-all duration-300 ${isScrolling ? 'blur-[1px]' : ''}`}>
        {children}
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <MobileBottomNav />}
      {!isAdminPage && <JohnGPTFeature />}
    </Providers>
  );
}
