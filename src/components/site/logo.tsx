import Link from "next/link";
import { Aperture } from "lucide-react";
import { cn } from "cn";

/**
 * StudioSpace logo — aperture icon + wordmark.
 * Used in the navbar and footer so the branding stays identical everywhere.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Aperture className="size-5" />
      </span>
      <span className="text-lg font-bold tracking-tight">
        Studio<span className="text-primary">Space</span>
      </span>
    </Link>
  );
}
