"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

// Each slide gets its own headline, subtext and background image.
// Requirement: at least 3 slides.
const SLIDES = [
  {
    image: "/images/hero-photo.jpg",
    alt: "Photographer adjusting lights in a dark photo studio",
    headline: "Where Creators Find Their Stage",
    subtext:
      "Book photography studios, sound stages, podcast lounges and music suites by the hour — from fellow creators who run them themselves.",
  },
  {
    image: "/images/hero-film.jpg",
    alt: "Cinema camera rig on a film set",
    headline: "Shoot Your Next Production Here",
    subtext:
      "Full blackout sound stages with grid lighting, green rooms and loading docks, ready for your call sheet.",
  },
  {
    image: "/images/hero-sound.jpg",
    alt: "Condenser microphone in a podcast studio",
    headline: "Press Record in a Pro Room",
    subtext:
      "Acoustically treated podcast booths and music suites with the mics, consoles and monitors already patched in.",
  },
];

/**
 * Hero slider built with Embla Carousel (already included with the project's
 * shadcn setup). Auto-advances every 6 seconds; dots + arrows for manual control.
 */
export function HeroSlider() {
  // `emblaRef` goes on the scroll container; `emblaApi` controls the carousel.
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentSlide, setCurrentSlide] = useState(0);

  // Keep the dot indicators in sync whenever the slide changes.
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setCurrentSlide(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);

    // Gentle auto-advance. setState happens inside the interval callback,
    // not directly in the effect body.
    const autoAdvance = setInterval(() => emblaApi.scrollNext(), 6000);

    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(autoAdvance);
    };
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );



  return (
    <section className="relative" aria-label="Featured highlights">
      {/* Viewport — overflow hidden lives here */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {SLIDES.map((slide, index) => (
            <div key={slide.image} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative h-[85vh] min-h-[540px] max-h-[820px] w-full">
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0} // only the first slide loads eagerly
                  className="object-cover"
                  sizes="100vw"
                />
                {/* Dark gradient so the text stays readable over any photo */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />

                {/* Slide copy */}
                <div className="absolute inset-0 flex items-center">
                  <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
                    <div className="max-w-2xl">


                      <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur">
                        <Sparkles className="size-3.5" />
                        Peer-to-peer studio marketplace
                      </p>
                      <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                        {slide.headline}
                      </h1>
                      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                        {slide.subtext}
                      </p>


                      <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                          href="/studios"
                          className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
                        >
                          Explore Studios
                        </Link>

                        <Link
                          href="/add-studio"
                          className="inline-flex h-11 items-center rounded-full border border-border bg-background/60 px-6 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-muted"
                        >
                          Host Your Space
                        </Link>

                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev / next arrows */}
      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-4 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/60 text-foreground backdrop-blur transition-colors hover:bg-muted sm:flex"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-4 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/60 text-foreground backdrop-blur transition-colors hover:bg-muted sm:flex"
      >
        <ChevronRight className="size-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.image}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => scrollTo(index)}
            className={
              index === currentSlide
                ? "h-2 w-8 rounded-full bg-primary transition-all"
                : "h-2 w-2 rounded-full bg-foreground/30 transition-all hover:bg-foreground/50"
            }
          />
        ))}
      </div>
    </section>
  );
}
