import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudioSpace — Book Creative Studios & Production Workspaces",
  description:
    "A peer-to-peer marketplace for photo studios, sound stages, podcast rooms, music suites and art workshops. Discover spaces, check availability and book by the hour.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased scroll-smooth`}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-full flex-col font-sans">
        {/* Navbar uses client hooks (usePathname, session) — Suspense lets the
            page shell prerender and the navbar stream in. */}
        <Suspense>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Sonner handles every toast on the site (auth, CRUD, bookings) */}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
