
import PortfolioHero from "@/features/PortfolioPage/components/PortfolioHero";
import AiBuildWall from "@/features/HomePage/components/AiBuildWall";
import PortfolioFilter from "@/features/PortfolioPage/components/PortfolioFilter";
import PortfolioGrid from "@/features/PortfolioPage/components/PortfolioGrid";
import PortfolioCta from "@/features/PortfolioPage/components/PortfolioCta";

export default function PortfolioPage() {
  return (
    <>
      <PortfolioHero />
      <AiBuildWall compact />
      <PortfolioFilter />
      <PortfolioGrid />
      <PortfolioCta />
    </>
  );
}
