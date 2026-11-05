import { Camera, Clapperboard, Mic, Music, Palette } from "lucide-react";
import type { StudioCategory, CategoryMeta } from "@/types/studio";

export const STUDIO_CATEGORY_META: CategoryMeta[] = [
  { name: "Photo Studio", slug: "photo-studio", image: "/images/studio-cyc-wall.jpg", icon: Camera },
  { name: "Film Stage", slug: "film-stage", image: "/images/studio-sound-stage.jpg", icon: Clapperboard },
  { name: "Podcast Lounge", slug: "podcast-lounge", image: "/images/studio-podcast.jpg", icon: Mic },
  { name: "Music Suite", slug: "music-suite", image: "/images/studio-music.jpg", icon: Music },
  { name: "Workshop", slug: "workshop", image: "/images/studio-workshop.jpg", icon: Palette },
];

/** "Photo Studio" → "photo-studio" */
export function categoryToSlug(category: StudioCategory): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

/** "photo-studio" → "Photo Studio" (returns undefined for unknown slugs) */
export function categoryFromSlug(slug: string): StudioCategory | undefined {
  return STUDIO_CATEGORY_META.find((meta) => meta.slug === slug)?.name;
}
