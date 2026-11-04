import type { Metadata } from "next";
import Link from "next/link";
import { SearchX, CirclePlus } from "lucide-react";
import { StudioCard } from "@/components/home/studio-card";
import { SectionHeading } from "@/components/home/section-heading";
import { listStudios } from "@/lib/studios";
import { categoryFromSlug } from "@/lib/studio-categories";

export const metadata: Metadata = {
  title: "Explore Studios — StudioSpace",
};


// Explore Studios page — grid of every listed workspace.
// Reads ?category=<slug> (set by the home page category cards) and filters.
export default async function ExploreStudiosPage({ searchParams }: PageProps<"/studios">) {
  const params = await searchParams;
  const slug = typeof params.category === "string" ? params.category : undefined;
  const category = slug ? categoryFromSlug(slug) : undefined;

  const studios = await listStudios({ category, limit: 24 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
      <SectionHeading
        eyebrow="Find your space"
        title={category ? `${category}s` : "Explore Studios"}
        description={
          category
            ? `Every listed ${category.toLowerCase()} on StudioSpace, newest first.`
            : "Every creative workspace on StudioSpace — filter by category to narrow the hunt."
        }
      />

      {/* Active filter chip with a way to clear it */}
      {category && (
        <div className="mt-6 flex justify-center">
          <Link
            href="/studios"
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
          >
            Filtering by {category} · clear ✕
          </Link>
        </div>
      )}

      {studios.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <StudioCard key={studio.id} studio={studio} />
          ))}
        </div>
      ) : (
        /* Friendly empty state with CTAs (required by the spec) */
        <div className="mx-auto mt-16 flex max-w-md flex-col items-center rounded-2xl border border-border bg-card px-8 py-14 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <SearchX className="size-8" />
          </span>
          <h2 className="mt-5 text-lg font-semibold">No studios here yet</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {category
              ? `Nobody has listed a ${category.toLowerCase()} so far — you could be the first.`
              : "No studios have been listed yet. Be the first host on StudioSpace!"}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/add-studio"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
            >
              <CirclePlus className="size-4" /> Add Your Studio
            </Link>
            {category && (
              <Link
                href="/studios"
                className="inline-flex h-10 items-center rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
              >
                Browse all studios
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
