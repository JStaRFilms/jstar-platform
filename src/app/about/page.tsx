
import AboutHero from "@/features/AboutPage/components/AboutHero";
import ProfessionalExperience from "@/features/AboutPage/components/ProfessionalExperience";
import MySkills from "@/features/AboutPage/components/MySkills";
import FeaturedProjects from "@/features/AboutPage/components/FeaturedProjects";
import AboutCta from "@/features/AboutPage/components/AboutCta";

export default function AboutPage() {
  return (
    <main className="bg-black min-h-screen">
      <AboutHero />
      <FeaturedProjects />
      <ProfessionalExperience />
      <MySkills />
      <AboutCta />
    </main>
  );
}
