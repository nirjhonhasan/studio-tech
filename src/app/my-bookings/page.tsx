// My Bookings — places where the logged-in user is the host.
// Simple pattern: get user email from session → fetch /api/studios/mine → render cards.
"use client";

import { useEffect, useState } from "react";
import { useAuthUser } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Studio } from "@/types/studio";

const MyBookingsPage = () => {
    const { user } = useAuthUser();
    const [studios, setStudios] = useState<Studio[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return;

        fetch("/api/studios/mine")
            .then((res) => res.json())
            .then((data) => setStudios(Array.isArray(data) ? data : []))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
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
            <h1 className="text-2xl font-bold mb-6">My Studios ({studios.length})</h1>

            {studios.length === 0 ? (
                <p className="text-muted-foreground">
                    No studios found for {user?.email || "this user"}!
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {studios.map((studio) => (
                        <div key={studio._id} className="border rounded-2xl p-4 shadow-sm bg-background space-y-3">
                            <Image
                                src={studio.imageUrl}
                                alt={studio.title}
                                width={500}
                                height={500}
                                className="w-full h-40 object-cover rounded-xl"
                            />
                            <h3 className="text-lg font-semibold">{studio.title}</h3>
                            <p className="text-xs text-muted-foreground">Location: {studio.location}</p>
                            <p className="text-xs font-medium">Category: {studio.category}</p>
                            <div className="text-sm border-t pt-2 space-y-1">
                                <p>💰 Capacity: {studio.maxCapacity} people</p>
                                <p className="font-semibold text-primary">💵 Rate: ${studio.hourlyRate}/hr</p>
                            </div>
                            <Link
                                href={`/studios/${studio._id}`}
                                className="inline-block px-3 py-1.5 text-xs font-semibold rounded-full bg-primary text-primary-foreground hover:opacity-90"
                            >
                                View Studio
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookingsPage;
