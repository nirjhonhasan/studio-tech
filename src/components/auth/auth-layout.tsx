import Link from "next/link";
import Image from "next/image";
import { Aperture } from "lucide-react";

/**
 * Shared shell for the login and register pages:
 * form on the left, studio photo panel on the right (desktop only).
 * Keeps both pages visually identical, per the UI consistency rules.
 */
export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      {/* Form column */}
      <div className="mx-auto w-full max-w-md">
        <div className="flex items-center gap-2">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Aperture className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Studio<span className="text-primary">Space</span>
          </span>
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>

        <div className="mt-8">{children}</div>
      </div>

      {/* Branding column (hidden on mobile/tablet) */}
      <div className="relative hidden aspect-[4/5] max-h-[560px] overflow-hidden rounded-2xl border border-border lg:block">
        <Image
          src="/images/hero-photo.jpg"
          alt="Photographer working in a StudioSpace studio"
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 50vw, 0vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
        <blockquote className="absolute bottom-0 p-8">
          <p className="text-lg font-semibold leading-snug">
            “I booked a cyc wall on Monday and shot my campaign on Tuesday.”
          </p>
          <footer className="mt-2 text-sm text-muted-foreground">
            — Farhan K., Commercial Photographer
          </footer>
        </blockquote>
      </div>
    </div>
  );
}

/** Outlined card used by both auth forms. */
export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      {children}
    </div>
  );
}

/** Text + link row under the form ("New here? Register" / "Have an account? Login"). */
export function AuthSwitchLink({
  text,
  linkText,
  href,
}: {
  text: string;
  linkText: string;
  href: string;
}) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {text}{" "}
      <Link href={href} className="font-semibold text-primary hover:underline">
        {linkText}
      </Link>
    </p>
  );
}
