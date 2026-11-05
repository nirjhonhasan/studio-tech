import { Suspense } from "react";
import { HeroSlider } from "@/components/home/hero-slider";
import { CategoryGrid } from "@/components/home/category-grid";
import { HowItWorks } from "@/components/home/how-it-works";
import { HostGuarantee } from "@/components/home/host-guarantee";
import FeaturedStudio from "@/components/home/featured-studios";

// Home page — composed entirely of section components so each part
// (slider, featured grid, categories, etc.) stays easy to edit separately.
// Featured studios load from MongoDB inside Suspense (skeleton while streaming).
export default function HomePage() {
  return (
    <>
      <HeroSlider />

      <Suspense fallback={<div><h2>Loading...</h2></div>}>
        <FeaturedStudio/>
      </Suspense>
      
      <CategoryGrid />
      <HowItWorks />
      <HostGuarantee />
    </>
  );
}
