
import PortfolioHero from "@/features/PortfolioPage/components/PortfolioHero";
import PortfolioFilter from "@/features/PortfolioPage/components/PortfolioFilter";
import PortfolioGrid from "@/features/PortfolioPage/components/PortfolioGrid";
import PortfolioCta from "@/features/PortfolioPage/components/PortfolioCta";

export default function PortfolioPage() {
  return (
    <>
      <PortfolioHero />
      <PortfolioFilter />
      <PortfolioGrid />
      <PortfolioCta />
    </>
  );
}
