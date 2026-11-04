import { Suspense } from "react";
import { HeroSlider } from "@/components/home/hero-slider";
import { FeaturedStudios, FeaturedStudiosSkeleton } from "@/components/home/featured-studios";
import { CategoryGrid } from "@/components/home/category-grid";
import { HowItWorks } from "@/components/home/how-it-works";
import { HostGuarantee } from "@/components/home/host-guarantee";

// Home page — composed entirely of section components so each part
// (slider, featured grid, categories, etc.) stays easy to edit separately.
// Featured studios load from MongoDB inside Suspense (skeleton while streaming).
export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <Suspense fallback={<FeaturedStudiosSkeleton />}>
        <FeaturedStudios />
      </Suspense>
      <CategoryGrid />
      <HowItWorks />
      <HostGuarantee />
    </>
  );
}
