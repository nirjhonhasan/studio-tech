import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/home/section-heading";
import { STUDIO_CATEGORY_META } from "@/lib/studio-categories";

export function CategoryGrid() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Find your fit"
          title="Browse by Category"
          description="Every kind of creative space, from cyc walls to grand pianos — pick a lane and start browsing."
        />

        {/* 2 cols on mobile, 5 across on desktop; equal heights via h-full */}
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {STUDIO_CATEGORY_META.map((category) => (
            <Link
              key={category.slug}
              href={`/studios?category=${category.slug}`}
              className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-xl border border-border sm:h-64"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 20vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

              <div className="relative p-4">
                <span className="mb-2 inline-flex size-9 items-center justify-center rounded-lg bg-primary/20 text-primary backdrop-blur">
                  <category.icon className="size-5" />
                </span>
                <p className="flex items-center gap-1 text-sm font-semibold">
                  {category.name}
                  <ArrowUpRight className="size-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
