
import BlogHero from "@/features/BlogPage/components/BlogHero";
import SearchAndFilter from "@/features/BlogPage/components/SearchAndFilter";
import FeaturedArticle from "@/features/BlogPage/components/FeaturedArticle";
import BlogGrid from "@/features/BlogPage/components/BlogGrid";
import Newsletter from "@/features/BlogPage/components/Newsletter";

export default function BlogPage() {
  return (
    <>
      <BlogHero />
      <SearchAndFilter />
      <FeaturedArticle />
      <BlogGrid />
      <Newsletter />
    </>
  );
}
