// Shared types for bookings.
// Used by the My Listings page and the booking list component, so the
// Booking shape is written down in exactly one place.

export interface Booking {
  _id: string;
  studioName: string;
  imageUrl?: string;
  location?: string;
  category?: string;
  date: string;
  startTime: string;
  endTime: string;
  hourlyRate: number;
  status: string;
}
