import { ArrowRight, CirclePlus } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/home/section-heading";
import { StudioCard } from "@/components/home/studio-card";
import { listStudios } from "@/lib/studios";

/**
 * "Featured Studios" section — the 6 newest studios, fetched live from
 * MongoDB (equivalent of `.limit(6)` on the studios collection).
 * Async server component; the home page wraps it in <Suspense> with a skeleton.
 */
export async function FeaturedStudios() {
  const studios = await listStudios({ limit: 6 });

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        eyebrow="Fresh on the market"
        title="Featured Studios"
        description="The newest spaces our hosts just listed on StudioSpace."
      />

      {studios.length > 0 ? (
        <>
          {/* Equal-size grid: 1 col on mobile, 2 on tablet, 3 on desktop */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard key={studio.id} studio={studio} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Browse all studios <ArrowRight className="size-4" />
            </Link>
          </div>
        </>
      ) : (
        /* Empty marketplace state — invite the first host in */
        <div className="mx-auto mt-12 flex max-w-md flex-col items-center rounded-2xl border border-border bg-card px-8 py-12 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CirclePlus className="size-7" />
          </span>
          <h3 className="mt-4 text-base font-semibold">The stage is empty… for now</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            No studios have been listed yet. Add yours and it will appear right here.
          </p>
          <Link
            href="/add-studio"
            className="mt-5 inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
          >
            List the first studio
          </Link>
        </div>
      )}
    </section>
  );
}

/** Branded skeleton shown while the featured studios load. */
export function FeaturedStudiosSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6" aria-busy="true" aria-label="Loading featured studios">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto h-3 w-40 animate-pulse rounded-full bg-muted" />
        <div className="mx-auto mt-4 h-9 w-72 animate-pulse rounded-lg bg-muted" />
        <div className="mx-auto mt-3 h-4 w-96 max-w-full animate-pulse rounded-full bg-muted" />
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="h-52 w-full animate-pulse bg-muted" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded-full bg-muted" />
              <div className="h-8 w-full animate-pulse rounded-lg bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
