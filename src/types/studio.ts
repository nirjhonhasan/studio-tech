// Shared TypeScript types for StudioSpace.
// All domain types live here so both client components and server code
// import from one place.

import type { ObjectId } from "mongodb";
import type { LucideIcon } from "lucide-react";

export const STUDIO_CATEGORIES = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
] as const;

export type StudioCategory = (typeof STUDIO_CATEGORIES)[number];

/**
 * The five studio categories with everything the UI needs:
 * display name, URL slug (used in /studios?category=...), cover image and icon.
 * Shared by the home page category grid and the explore page filter.
 */
export interface CategoryMeta {
  name: StudioCategory;
  slug: string;
  image: string;
  icon: LucideIcon;
}

export interface Studio {
  _id: string;
  title: string;
  category: StudioCategory;
  imageUrl: string;
  hourlyRate: number;
  securityDeposit?: number;
  maxCapacity: number;
  amenities: string[];
  overview?: string;
  ownerName: string;
  /** 0 means "no reviews yet" — cards show a "New" badge instead. */
  rating: number;
  location: string;
  hostName: string;
  ownerEmail?: string;
  createdAt?: string;
}

/** Raw document shape in the `studios` MongoDB collection. */
export interface StudioDoc {
  _id: ObjectId;
  title: string;
  category: string;
  imageUrl: string;
  hourlyRate: number;
  securityDeposit?: number;
  maxCapacity: number;
  amenities: string[];
  overview?: string;
  rating?: number;
  location: string;
  ownerName: string;
  ownerEmail: string;
  createdAt?: Date;
}

/**
 * Shape of the Add Studio form while being edited.
 * Numbers stay strings in state so empty inputs don't jump to 0;
 * they are converted when building the API payload on submit.
 */
export interface StudioFormData {
  title: string;
  category: StudioCategory | "";
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  imageUrl: string;
  amenities: string[];
  overview: string;
}


export interface Studio {
  _id: string;
}