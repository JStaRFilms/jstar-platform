
import StoreHero from "@/features/StorePage/components/StoreHero";
import ProductFilters from "@/features/StorePage/components/ProductFilters";
import FeaturedProducts from "@/features/StorePage/components/FeaturedProducts";
import ProductCategories from "@/features/StorePage/components/ProductCategories";
import FreeResourceHighlight from "@/features/StorePage/components/FreeResourceHighlight";
import StoreCta from "@/features/StorePage/components/StoreCta";

export default function StorePage() {
  return (
    <>
      <StoreHero />
      <ProductFilters />
      <FeaturedProducts />
      <ProductCategories />
      <FreeResourceHighlight />
      <StoreCta />
    </>
  );
}
