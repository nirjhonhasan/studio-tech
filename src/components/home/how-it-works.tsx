import { Search, Clock, Zap, Clapperboard } from "lucide-react";
import { SectionHeading } from "@/components/home/section-heading";

// The required 4-step booking workflow: Discover → Select Hours → Book → Create.
const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Discover Spaces",
    text: "Filter verified studios by category, city, capacity and budget to shortlist your perfect set.",
  },
  {
    icon: Clock,
    step: "02",
    title: "Select Shoot Hours",
    text: "Check live availability and reserve exactly the hours you need — one hour or a full production day.",
  },
  {
    icon: Zap,
    step: "03",
    title: "Book Instantly",
    text: "Confirm with transparent hourly pricing and a clear deposit. No emails, no hidden fees.",
  },
  {
    icon: Clapperboard,
    step: "04",
    title: "Create & Produce",
    text: "Show up, plug in and get to work. Cancel free up to 24 hours before your slot.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Simple by design"
          title="How Booking Works"
          description="From searching for a cyc wall to calling “action” — four steps, zero back-and-forth."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.step}
              className="relative h-full rounded-xl border border-border bg-card p-6"
            >
              {/* Big ghosted step number behind the icon */}
              <span className="absolute right-5 top-4 text-4xl font-black text-foreground/5">
                {step.step}
              </span>
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <step.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
