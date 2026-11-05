"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // App Router-এর সঠিক হুক
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { DollarSign, Sparkles, User, Mail } from "lucide-react";
import { useAuthUser } from "@/lib/auth-client";
import { Studio } from "@/types/studio";

interface SubmitPopOverProps {
    studio: Studio;
}

const SubmitPopOver = ({ studio }: SubmitPopOverProps) => {
    const { user } = useAuthUser();
    const [loading, setLoading] = useState(false);
    const router = useRouter(); // হুক কল করা হলো

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        console.log("Studio Prop Data:", studio);

        const formElement = e.currentTarget;
        const formData = new FormData(formElement);
        const data = Object.fromEntries(formData.entries());

        const payload = {
            studioId: studio?._id || "",
            studioName: studio?.title || "Unknown Studio",
            hourlyRate: studio?.hourlyRate || 0,
            imageUrl: studio?.imageUrl || "",
            location: studio?.location || "N/A",
            category: studio?.category || "General",
            status: "Pending",
            userName: user?.name || "Anonymous",
            userEmail: user?.email || "N/A",
            createdAt: new Date().toISOString(),
            ...data,
        };

        try {
            setLoading(true);
            const res = await fetch(`NEXT_PUBLIC_API_URL/my-set-studios`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.message || "Booking Failed!");
                return;
            }

            toast.success("Booking submitted successfully!");
            formElement.reset();
            
           
            router.refresh();
            router.push('/my-listings');

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Popover>
                {/* Base UI has no asChild — the button is passed with the render prop. */}
                <PopoverTrigger
                    render={
                        <Button className="w-full h-12 text-lg font-semibold bg-primary text-primary-foreground rounded-xl">
                            <Sparkles className="size-5 mr-2" /> Book Studio Now
                        </Button>
                    }
                />
                
                <PopoverContent className="w-[380px] sm:w-[420px] p-6 rounded-2xl bg-background">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="border-b pb-3">
                            <h4 className="text-xl font-bold">{studio?.title || "Studio Name"}</h4>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <DollarSign className="size-3.5" /> Rate: ${studio?.hourlyRate || 0} / hour
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <Label htmlFor="date" className="text-xs">Booking Date</Label>
                                <Input id="date" name="date" type="date" required className="h-10 mt-1" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="startTime" className="text-xs">Start Time</Label>
                                    <Input id="startTime" name="startTime" type="time" required className="h-10 mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="endTime" className="text-xs">End Time</Label>
                                    <Input id="endTime" name="endTime" type="time" required className="h-10 mt-1" />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="notes" className="text-xs">Notes (Optional)</Label>
                                <Input id="notes" name="notes" type="text" placeholder="Special notes..." className="h-10 mt-1" />
                            </div>
                        </div>

                        <div className="rounded-xl bg-muted p-3 space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                                <User className="size-3.5" /> Name: {user?.name || "Loading..."}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="size-3.5" /> Email: {user?.email || "N/A"}
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full h-11 font-bold rounded-xl">
                            {loading ? "Processing..." : "Confirm Booking"}
                        </Button>
                    </form>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default SubmitPopOver;