'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/lib/providers";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();

  // Don't show header/footer on admin pages
  const isAdminPage = pathname?.startsWith('/admin');

  // Don't add padding to homepage since it has its own padding
  const isHomePage = pathname === '/';
  const shouldAddPadding = !isAdminPage && !isHomePage;

  return (
    <Providers>
      {!isAdminPage && <Header />}
      <main className={shouldAddPadding ? "pt-12" : ""}>
        {children}
      </main>
      {!isAdminPage && <Footer />}
    </Providers>
  );
}
