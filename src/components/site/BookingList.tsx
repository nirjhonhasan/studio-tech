"use client";

import { useState } from "react";
import { CalendarCheck, MapPin, XCircle, Clock } from "lucide-react";

interface Booking {
  _id: string;
  studioName: string;
  location: string;
  date: string;
  price: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
}

interface BookingListProps {
  initialBookings: Booking[];
}

export function BookingList({ initialBookings }: BookingListProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleCancelBooking = async (id: string) => {
    try {
      setLoadingId(id);
      const res = await fetch(`http://localhost:5000/my-listings/${user.email}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: "Cancelled" as const } : b))
        );
      }
    } catch (error) {
      console.error("Failed to cancel booking:", error);
    } finally {
      setLoadingId(null);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Clock className="size-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">No Bookings Found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          You haven&apos;t reserved any studio spaces yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bookings.map((booking) => (
        <div key={booking._id} className="border border-border rounded-xl p-5 bg-background shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-2 mb-3">
              <h3 className="font-semibold text-base">{booking.studioName}</h3>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  booking.status === "Confirmed"
                    ? "bg-green-500/15 text-green-600"
                    : booking.status === "Pending"
                    ? "bg-yellow-500/15 text-yellow-600"
                    : booking.status === "Cancelled"
                    ? "bg-red-500/15 text-red-600"
                    : "bg-blue-500/15 text-blue-600"
                }`}
              >
                {booking.status}
              </span>
            </div>

            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-2">
              <MapPin className="size-4" /> {booking.location}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-4">
              <CalendarCheck className="size-4" /> {booking.date}
            </p>
            <p className="text-sm font-semibold mb-4">
              Price: <span className="text-primary">${booking.price}/hr</span>
            </p>
          </div>

          {booking.status === "Pending" && (
            <button
              onClick={() => handleCancelBooking(booking._id)}
              disabled={loadingId === booking._id}
              className="inline-flex items-center justify-center gap-2 w-full h-9 rounded-lg border border-destructive/50 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors"
            >
              <XCircle className="size-4" />
              {loadingId === booking._id ? "Cancelling..." : "Cancel Booking"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}