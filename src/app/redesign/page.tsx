import type { Metadata } from 'next';
import HeroSection from "@/features/HomePage/components/HeroSection";
import AboutSection from "@/features/HomePage/components/AboutSection";
import ServicesSection from "@/features/HomePage/components/ServicesSection";
import PortfolioSection from "@/features/HomePage/components/PortfolioSection";
import ProcessSection from "@/features/HomePage/components/ProcessSection";
import PricingSection from "@/features/HomePage/components/PricingSection";
import TestimonialsSection from "@/features/HomePage/components/TestimonialsSection";
import BlogSection from "@/features/HomePage/components/BlogSection";
import StoreSection from "@/features/HomePage/components/StoreSection";
import ContactSection from "@/features/HomePage/components/ContactSection";
import FinalCTASection from "@/features/HomePage/components/FinalCTASection";

export const metadata: Metadata = {
  title: { absolute: 'J StaR Films Studios | Previous homepage' },
  description: 'The previous J StaR Films Studios homepage.',
  alternates: { canonical: '/redesign' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'J StaR Films Studios | Previous homepage',
    description: 'The previous J StaR Films Studios homepage.',
    url: '/redesign',
    siteName: 'J StaR Films Studios',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <ProcessSection />
      <PricingSection />
      <TestimonialsSection />
      <BlogSection />
      <StoreSection />
      <ContactSection />
      <FinalCTASection />
    </main>
  );
}
