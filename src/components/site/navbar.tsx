"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogIn, UserPlus, House, Clapperboard, BookOpen, Users, LayoutDashboard, CirclePlus, Library, CalendarCheck } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { UserMenu } from "@/components/site/user-menu";
import { useAuthUser } from "@/lib/auth-client";
import { cn } from "cn";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: House },
  { href: "/studios", label: "Explore Studios", icon: Clapperboard },
  { href: "/#how-it-works", label: "How It Works", icon: BookOpen },
  { href: "/#about-us", label: "About Us", icon: Users },
] as const;

/**
 * Sticky site header with active-route indicators.
 * Shows Login / Register when signed out, and the avatar dropdown when signed in.
 */
export function Navbar() {
  const pathname = usePathname(); // current route, used for the active indicator
  const [mobileOpen, setMobileOpen] = useState(false);


  // Session comes from BetterAuth (src/lib/auth-client.ts).
  const { user, isPending } = useAuthUser();
  const isLoggedIn = Boolean(user);

  // Account links reused by the mobile menu panel.
  const ACCOUNT_LINKS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/add-studio", label: "Add New Studio", icon: CirclePlus },
    { href: "/my-listings", label: "My Studio Listings", icon: Library },
    { href: "/my-bookings", label: "My Bookings", icon: CalendarCheck },
  ];


  
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <div>
            <Image src="/dark-theme-logo.png"
            alt="Logo"
            width={50}
            height={30}
            />
          </div>

          {/* Desktop links */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                // Active route indicator: amber pill behind the current page's link
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm transition-colors hover:bg-muted hover:text-foreground",
                  isActive(pathname, link.href)
                    ? "bg-primary/15 font-medium text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side — changes based on auth state */}
        {isPending ? (
          // Placeholder avatar while the session loads (prevents flash of Login buttons)
          <span className="size-9 animate-pulse rounded-full bg-muted" aria-hidden="true" />
        ) : isLoggedIn ? (
          <UserMenu />
        ) : (
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/login"
              className="inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              <LogIn className="size-4" /> Login
            </Link>
            <Link
              href="/signin"
              className="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
            >
              <UserPlus className="size-4" /> Register
            </Link>
          </div>
        )}

        {/* Mobile hamburger (md and below) */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
          className="inline-flex size-9 items-center justify-center rounded-full border border-border md:hidden"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)} // close the panel after navigating
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                  isActive(pathname, link.href)
                    ? "bg-primary/15 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <link.icon className="size-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          {isLoggedIn ? (
            <>
              <p className="mt-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                My Account
              </p>
              <nav className="flex flex-col gap-1">
                {ACCOUNT_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <link.icon className="size-4" />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </>
          ) : (
            <div className="mt-3 flex gap-2">
              <Link
                href="/login"
                className="flex h-9 flex-1 items-center justify-center rounded-full border border-border text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href="/signin"
                className="flex h-9 flex-1 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

/** "/" is active only on the home page; other paths match by prefix (/studios/123 counts). */
function isActive(pathname: string, href: string) {
  if (href.startsWith("/#")) return false; // section anchors are never "active"
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
