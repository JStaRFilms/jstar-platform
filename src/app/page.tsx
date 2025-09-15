
import HeroSection from "@/features/HomePage/components/HeroSection";
import AboutSection from "@/features/HomePage/components/AboutSection";
import PortfolioSection from "@/features/HomePage/components/PortfolioSection";
import ServicesSection from "@/features/HomePage/components/ServicesSection";
import StoreSection from "@/features/HomePage/components/StoreSection";
import BlogSection from "@/features/HomePage/components/BlogSection";
import ContactSection from "@/features/HomePage/components/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <PortfolioSection />
      <ServicesSection />
      <StoreSection />
      <BlogSection />
      <ContactSection />
    </>
  );
}
