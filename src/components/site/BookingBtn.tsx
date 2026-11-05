"use client";

import { useState } from "react";

interface BookingButtonProps {
  studioId: string;
  studioTitle: string;
  hourlyRate: number;
}

export function BookingButton({ studioId, studioTitle, hourlyRate }: BookingButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    setLoading(true);
    
    console.log(`Booking initiated for ${studioTitle} (ID: ${studioId})`);

    setTimeout(() => {
      alert(`🎉 Booking request sent for ${studioTitle}!`);
      setLoading(false);
    }, 1000);
  };

  return (
    <button
      onClick={handleBooking}
      disabled={loading}
      className="w-full rounded-xl bg-[#f59e0b] py-3.5 text-center font-semibold text-[#121110] transition-all hover:bg-[#d97706] hover:shadow-lg hover:shadow-[#f59e0b]/20 disabled:opacity-50"
    >
      {loading ? "Processing..." : "Book Studio Now"}
    </button>
  );
}