// Shared TypeScript types for StudioSpace.
// The Studio type matches what our Express + MongoDB API will return,
// so swapping sample data for real fetches later needs no component changes.

export const STUDIO_CATEGORIES = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
] as const;

export type StudioCategory = (typeof STUDIO_CATEGORIES)[number];

/**
 * A studio as stored in MongoDB and returned by /api/studios.
 * `image` is the normalized cover image URL (local /images path or remote URL).
 */
export interface Studio {
  id: string;
  title: string;
  category: StudioCategory;
  image: string;
  hourlyRate: number;
  securityDeposit?: number;
  maxCapacity: number;
  amenities: string[];
  overview?: string;
  /** 0 means "no reviews yet" — cards show a "New" badge instead. */
  rating: number;
  location: string;
  hostName: string;
  ownerEmail?: string;
  createdAt?: string;
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
