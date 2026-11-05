import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Users } from "lucide-react";
import type { Studio } from "@/types/studio";


export function StudioCard({ studio }: { studio: Studio }) {

  
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      {/* Cover image — fixed height keeps every card's media area identical */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={studio.imageUrl}
          alt={studio.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        {/* Category + rating badges float over the photo */}
        <span className="absolute left-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur">
          {studio.category}
        </span>
        {studio.rating > 0 ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-1 text-xs font-semibold backdrop-blur">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {studio.rating.toFixed(1)}
          </span>
        ) : (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
            New
          </span>
        )}
      </div>

      {/* Body — flex column so the button always aligns at the bottom */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold leading-snug">{studio.title}</h3>
        <p className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5" />
          {studio.location}
          <span className="text-border">•</span>
          <Users className="size-3.5" />
          up to {studio.maxCapacity}
        </p>

        <div className="mt-4 flex items-end justify-between border-t border-border pt-4">
          <p>
            <span className="text-xl font-bold text-primary">${studio.hourlyRate}</span>
            <span className="text-sm text-muted-foreground"> / hr</span>
          </p>
          <Link
            href={`/studios/${studio._id}`}
            className="inline-flex h-9 items-center rounded-full border border-primary/40 bg-primary/10 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
