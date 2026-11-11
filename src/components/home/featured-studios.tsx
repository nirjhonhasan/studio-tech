import { StudioCard } from "./studio-card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Studio } from "@/types/studio";

export default async function FeaturedStudio() {
  let studios: Studio[] = [];

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      const res = await fetch(`${apiUrl}/studios`, {
        cache: 'no-store'
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          studios = data;
        }
      } else {
        console.error("FeaturedStudio API failed with status:", res.status);
      }
    }
  } catch (error) {
    console.error("FeaturedStudio fetch error:", error);
  }

  return (
    <section className="w-full bg-[#121110] px-4 py-16 text-[#f3f0ea]">
      <div className="mx-auto max-w-7xl">
        
        <div className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#f59e0b]">
            FRESH ON THE MARKET
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#f3f0ea] sm:text-4xl">
            Featured Studios
          </h2>
          <p className="mt-3 text-sm text-[#a8a29e]">
            The newest spaces our hosts just listed on StudioSpace.
          </p>
        </div>

        {studios.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.slice(0, 6).map((studio: Studio, i: number) => (
              <div key={studio._id || i}>
                <StudioCard studio={studio} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-[#a8a29e]">
            No studios available at the moment.
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/studios"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#f59e0b] transition-colors hover:text-[#d97706] hover:underline"
          >
            Browse all studios <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}