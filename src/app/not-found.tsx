import Link from "next/link";
import { Aperture } from "lucide-react";

// Custom 404 — "creative studio illustration" via the aperture icon art,
// with the required direct "Return to Home" button.
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      {/* Simple studio-themed illustration built from the aperture mark */}
      <div className="relative flex size-32 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" />
        <span className="absolute inset-0 animate-pulse rounded-full border border-primary/20" />
        <Aperture className="size-20 text-primary" strokeWidth={1.25} />
      </div>

      <p className="mt-8 text-7xl font-black tracking-tight text-foreground/10 sm:text-8xl">404</p>
      <h1 className="-mt-6 text-2xl font-bold sm:text-3xl">This set doesn&apos;t exist</h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        The page you&apos;re looking for was struck from the scene. Head back to the
        studio floor and find your next space.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
      >
        Return to Home
      </Link>
    </div>
  );
}
