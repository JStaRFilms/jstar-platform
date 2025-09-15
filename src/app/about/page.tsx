
import AboutHero from "@/features/AboutPage/components/AboutHero";
import MyStory from "@/features/AboutPage/components/MyStory";
import MyPhilosophy from "@/features/AboutPage/components/MyPhilosophy";
import MySkills from "@/features/AboutPage/components/MySkills";
import ProfileCard from "@/features/AboutPage/components/ProfileCard";
import JourneyTimeline from "@/features/AboutPage/components/JourneyTimeline";
import AboutCta from "@/features/AboutPage/components/AboutCta";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <MyStory />
              <MyPhilosophy />
              <MySkills />
            </div>
            <div>
              <ProfileCard />
              <JourneyTimeline />
            </div>
          </div>
        </div>
      </section>
      <AboutCta />
    </>
  );
}
