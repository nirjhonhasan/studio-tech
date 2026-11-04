"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/site/logo";
import { XLogoIcon, InstagramIcon, YoutubeIcon, FacebookIcon } from "@/components/site/social-icons";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#about-us", label: "About Us" },
  { href: "/add-studio", label: "Host Your Space" },
];

const POPULAR_CATEGORIES = [
  { href: "/studios?category=photo-studio", label: "Photo Studios" },
  { href: "/studios?category=film-stage", label: "Sound Stages" },
  { href: "/studios?category=podcast-lounge", label: "Podcast Rooms" },
  { href: "/studios?category=music-suite", label: "Music Suites" },
  { href: "/studios?category=workshop", label: "Art Workshops" },
];

const SOCIALS = [
  { label: "X (Twitter)", icon: XLogoIcon, href: "https://x.com" },
  { label: "Instagram", icon: InstagramIcon, href: "https://instagram.com" },
  { label: "YouTube", icon: YoutubeIcon, href: "https://youtube.com" },
  { label: "Facebook", icon: FacebookIcon, href: "https://facebook.com" },
];

export function Footer() {
  const [email, setEmail] = useState("");

  // Newsletter is front-end only for now — swap the toast for a real API call later.
  function handleSubscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address first.");
      return;
    }
    toast.success("You're on the list! Studio tips are coming your way.");
    setEmail("");
  }

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        {/* Brand + mission + socials */}
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Our mission is to help every creator find a space to make something
            worth sharing — and to help every studio owner fill their calendar.
          </p>
          <div className="mt-5 flex gap-2">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <social.icon />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <nav aria-label="Quick links">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Popular studio categories */}
        <nav aria-label="Popular studio categories">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Popular Categories
          </h3>
          <ul className="mt-4 space-y-2.5">
            {POPULAR_CATEGORIES.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Newsletter */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            Studio Notes
          </h3>
          <p className="mt-4 text-sm text-muted-foreground">
            Monthly drop of new spaces, booking tips, and creator stories. No spam, ever.
          </p>
          <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              aria-label="Email address"
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
            />
            <button
              type="submit"
              className="h-10 shrink-0 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <p>© 2026 StudioSpace. All rights reserved.</p>
          <p className="flex gap-4">
            <Link href="/" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/" className="hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
