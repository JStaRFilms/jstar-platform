import AboutHero from '@/features/AboutPage/components/AboutHero';
import FeaturedProjects from '@/features/AboutPage/components/FeaturedProjects';
import ProfessionalExperience from '@/features/AboutPage/components/ProfessionalExperience';
import MySkills from '@/features/AboutPage/components/MySkills';
import AboutCta from '@/features/AboutPage/components/AboutCta';
import ThePolymath from '@/features/AboutPage/components/ThePolymath';
import Entrepreneurship from '@/features/AboutPage/components/Entrepreneurship';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      <AboutHero />
      <ThePolymath />
      <Entrepreneurship />
      <ProfessionalExperience />
      <FeaturedProjects />
      <MySkills />
      <AboutCta />
    </main>
  );
}
