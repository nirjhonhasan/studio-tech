"use client";

import { useState } from "react";
import { useAuthUser } from "@/lib/auth-client";
import { ClientTokenForServer } from "@/lib/ClientTokenForServer";

interface BookingButtonProps {
  studioId: string;
  studioTitle: string;
  hourlyRate: number;
}

export function BookingButton({ studioId, studioTitle, hourlyRate }: BookingButtonProps) {
  const { user } = useAuthUser();
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    if (!user) {
      alert("Please login first to book this studio!");
      return;
    }

    setLoading(true);

    try {
      // authClient থেকে JWT টোকেন নেওয়া হচ্ছে
      const token = await ClientTokenForServer();

      // ব্যাকএন্ডে পাঠানোর জন্য বুকিং ডাটা
      const bookingPayload = {
        studioId,
        studioName: studioTitle,
        hourlyRate,
        userEmail: user.email,
        userName: user.name || "Anonymous",
        status: "Pending",
        bookingDate: new Date().toISOString(),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-set-studios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`, // Authorization হেডার যুক্ত করা হলো
        },
        body: JSON.stringify(bookingPayload),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`🎉 Booking request sent for ${studioTitle}!`);
      } else {
        alert(data.msg || "Failed to book studio.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Something went wrong with the booking!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBooking}
      disabled={loading}
      className="w-full rounded-xl bg-[#f59e0b] py-3.5 text-center font-semibold text-[#121110] transition-all hover:bg-[#d97706] hover:shadow-lg hover:shadow-[#f59e0b]/20 disabled:opacity-50 cursor-pointer"
    >
      {loading ? "Processing..." : "Book Studio Now"}
    </button>
  );
}