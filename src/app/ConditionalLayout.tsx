'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { JohnGPTFeature } from "@/features/john-gpt";
import Providers from "@/lib/providers";
import { useScrollBlur } from "@/hooks/useScrollBlur";
import type { User as WorkOSUser } from '@workos-inc/node';

interface ConditionalLayoutProps {
  children: React.ReactNode;
  authButton?: React.ReactNode;
  user?: WorkOSUser | null;
}

export default function ConditionalLayout({ children, authButton, user }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const { isScrolling, startScrollBlur } = useScrollBlur({ blurDuration: 600, blurIntensity: 1 });

  // Make startScrollBlur available globally for navigation components
  useEffect(() => {
    (window as any).startScrollBlur = startScrollBlur;
    return () => {
      delete (window as any).startScrollBlur;
    };
  }, [startScrollBlur]);

  // Don't show header/footer on admin pages or JohnGPT pages
  const isAdminPage = pathname?.startsWith('/admin');
  const isJohnGPTPage = pathname?.startsWith('/john-gpt');
  const shouldShowGlobalNav = !isAdminPage && !isJohnGPTPage;

  // Don't add padding to homepage since it has its own padding
  const isHomePage = pathname === '/';
  const shouldAddPadding = shouldShowGlobalNav && !isHomePage;

  return (
    <Providers>
      {shouldShowGlobalNav && <Header authButton={authButton} />}
      <main className={`${shouldAddPadding ? "pt-12" : ""} ${shouldShowGlobalNav ? "pb-20 md:pb-0" : ""} transition-all duration-300 ${isScrolling ? 'blur-[1px]' : ''}`}>
        {children}
      </main>
      {shouldShowGlobalNav && (
        <div className="pb-16 md:pb-0">
          <Footer />
        </div>
      )}
      {shouldShowGlobalNav && <MobileBottomNav />}
      {shouldShowGlobalNav && <JohnGPTFeature user={user} />}
    </Providers>
  );
}
