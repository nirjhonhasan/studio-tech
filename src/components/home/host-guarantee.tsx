import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, BadgeCheck, PackageCheck, Headphones, Check } from "lucide-react";
import { SectionHeading } from "@/components/home/section-heading";

// Platform assurances required for this section.
const GUARANTEES = [
  {
    icon: ShieldCheck,
    title: "Liability Protection",
    text: "Every booking includes damage and liability coverage, so gear and spaces stay protected on both sides.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Profiles",
    text: "Hosts and renters go through ID verification before a single booking is confirmed.",
  },
  {
    icon: PackageCheck,
    title: "Equipment Safety",
    text: "Studio inventory is checked in and out digitally, so nothing goes missing and disputes stay rare.",
  },
  {
    icon: Headphones,
    title: "24/7 Host Support",
    text: "Shoot overran? Door code failed? Our support team answers around the clock, every day.",
  },
];




// Proof stats — small, honest numbers a new marketplace can show.
const STATS = [
  { value: "120+", label: "Studios listed" },
  { value: "340+", label: "Bookings completed" },
  { value: "4.9", label: "Average rating" },
];




/**
 * Host Guarantee & Creator Support section (doubles as the "About Us" anchor
 * that the navbar and footer link to).
 */
export function HostGuarantee() {
  return (
    <section id="about-us" className="scroll-mt-24 border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">



          {/* Left — image with a floating stat chip */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
              <Image
                src="/images/guarantee.jpg"
                alt="Studio monitoring headphones on a mixing desk"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
            <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 gap-6 rounded-xl border border-border bg-background px-6 py-4 shadow-xl sm:left-auto sm:right-6 sm:translate-x-0">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — heading + guarantee list */}
          <div className="mt-6 lg:mt-0">
            <SectionHeading
              align="left"
              eyebrow="Host guarantee & creator support"
              title="Host with Confidence. Create with Support."
              description="StudioSpace is built for both sides of the booking: owners get protected, professional listings, and creators get a dependable space every time."
            />

            <ul className="mt-8 space-y-5">
              {GUARANTEES.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="mt-0.5 inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <item.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Link
              href="/add-studio"
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
            >
              <Check className="size-4" /> List Your Studio Today
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
