
import ServicesHero from "@/features/ServicesPage/components/ServicesHero";
import ServicesOverview from "@/features/ServicesPage/components/ServicesOverview";
import CreativeProcess from "@/features/ServicesPage/components/CreativeProcess";
import Pricing from "@/features/ServicesPage/components/Pricing";
import ServicesCta from "@/features/ServicesPage/components/ServicesCta";

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesOverview />
      <CreativeProcess />
      <Pricing />
      <ServicesCta />
    </>
  );
}
