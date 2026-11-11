"use client";

import { useEffect, useState } from "react";
import { useAuthUser, authClient } from "@/lib/auth-client"; // authClient ইম্পোর্ট করা হলো
import { Loader2 } from "lucide-react";
import Image from "next/image";
import type { Booking } from "@/types/booking";
import { ClientTokenForServer } from "@/lib/ClientTokenForServer";

const MyBookingsPage = () => {
    const { user } = useAuthUser();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return;

        const fetchBookings = async () => {
            try {
                // authClient থেকে টোকেন নেওয়া হচ্ছে
                const token = await ClientTokenForServer();

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-listings/${user.email}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`, // Authorization হেডার যুক্ত করা হলো
                    },
                });

                const data = await res.json();
                setBookings(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Fetch bookings error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    // loading er somoy jeta suspance asbe.
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-6">My Bookings ({bookings.length})</h1>

            {bookings.length === 0 ? (
                <p className="text-muted-foreground">No bookings found for {user?.email || "this user"}!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="border rounded-2xl p-4 shadow-sm bg-background space-y-3">
                            {booking.imageUrl && (
                                <Image
                                    src={booking.imageUrl}
                                    alt={booking.studioName}
                                    width={500}
                                    height={500}
                                    className="w-full h-40 object-cover rounded-xl"
                                />
                            )}
                            <h3 className="text-lg font-semibold">{booking.studioName}</h3>
                            <p className="text-xs text-muted-foreground">Location: {booking.location}</p>
                            <p className="text-xs font-medium">Category: {booking.category}</p>
                            <div className="text-sm border-t pt-2 space-y-1">
                                <p>📅 Date: {booking.date}</p>
                                <p>⏰ Time: {booking.startTime} - {booking.endTime}</p>
                                <p className="font-semibold text-primary">💵 Rate: ${booking.hourlyRate}/hr</p>
                            </div>
                            <div className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Status: {booking.status}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookingsPage;