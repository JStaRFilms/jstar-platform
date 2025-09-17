
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
