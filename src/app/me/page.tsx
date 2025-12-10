import { PersonaProvider } from '@/features/PersonalPage/context/PersonaContext';
import MeHero from '@/features/PersonalPage/components/MeHero';
import BioSection from '@/features/PersonalPage/components/BioSection';
import StatsRow from '@/features/PersonalPage/components/StatsRow';
import SkillsMatrix from '@/features/PersonalPage/components/SkillsMatrix';
import FeaturedProjects from '@/features/PersonalPage/components/FeaturedProjects';
import TestimonialsCarousel from '@/features/PersonalPage/components/TestimonialsCarousel';
import ContactCTA from '@/features/PersonalPage/components/ContactCTA';

export default function PersonalPage() {
  return (
    <PersonaProvider>
      <main className="min-h-screen bg-black text-white selection:bg-white/20">
        <MeHero />
        <StatsRow />
        <BioSection />
        <SkillsMatrix />
        <FeaturedProjects />
        <TestimonialsCarousel />
        <ContactCTA />
      </main>
    </PersonaProvider>
  );
}
