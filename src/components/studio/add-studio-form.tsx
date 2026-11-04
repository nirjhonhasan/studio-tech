"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthUser } from "@/lib/auth-client";
import { LoaderCircle } from "lucide-react";

export function AddStudioForm() {
  const router = useRouter();
  const { user, isPending } = useAuthUser();

  // 1. Loading state for user session
  if (isPending) {
    return (
      <div className="flex min-h-40 items-center justify-center gap-3 text-muted-foreground">
        <LoaderCircle className="size-5 animate-spin" /> Loading your host details…
      </div>
    );
  }




  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!user) {
      toast.error("Please login first!");
      return;
    }

    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const category = (form.elements.namedItem("category") as HTMLSelectElement).value;
    const hourlyRate = (form.elements.namedItem("hourlyRate") as HTMLInputElement).value;
    const securityDeposit = (form.elements.namedItem("securityDeposit") as HTMLInputElement).value;
    const maxCapacity = (form.elements.namedItem("maxCapacity") as HTMLInputElement).value;
    const location = (form.elements.namedItem("location") as HTMLInputElement).value;
    const imageUrl = (form.elements.namedItem("imageUrl") as HTMLInputElement).value;
    const overview = (form.elements.namedItem("overview") as HTMLTextAreaElement).value;


    
    if (title.length < 5) {
      toast.error("Studio title at least 5 characters hote hobe!");
      return;
    }
    if (!category) {
      toast.error("Category select korun!");
      return;
    }
    if (!hourlyRate || Number(hourlyRate) <= 0) {
      toast.error("Hourly rate 0 er besi hote hobe!");
      return;
    }
    if (!location) {
      toast.error("Location address din!");
      return;
    }
    if (!imageUrl.startsWith("http")) {
      toast.error("Valid image URL din (http/https)!");
      return;
    }
    if (overview.length < 20) {
      toast.error("Overview at least 20 characters din!");
      return;
    }


    
    try {
      const response = await fetch("/api/studios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          hourlyRate: Number(hourlyRate),
          securityDeposit: Number(securityDeposit || 0),
          maxCapacity: Number(maxCapacity),
          location,
          imageUrl,
          overview,
          ownerName: user.name,
          ownerEmail: user.email,
          amenities: [],
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || "Failed to save studio");
      }

      toast.success("Studio listed successfully!");
      form.reset();
      router.push("/studios");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong!");
    }
  }


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Studio Title */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Studio Title</label>
        <input
          name="title"
          type="text"
          placeholder="e.g. The Cyc Wall — Daylight Photo Studio"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Category & Hourly Rate */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Category</label>
          <select
            name="category"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select a category</option>
            <option value="Photo Studio">Photo Studio</option>
            <option value="Film Stage">Film Stage</option>
            <option value="Podcast Lounge">Podcast Lounge</option>
            <option value="Music Suite">Music Suite</option>
            <option value="Workshop">Workshop</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Hourly Rate ($)</label>
          <input
            name="hourlyRate"
            type="number"
            placeholder="45"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Security Deposit & Capacity */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Security Deposit ($)</label>
          <input
            name="securityDeposit"
            type="number"
            placeholder="100"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Max Capacity</label>
          <input
            name="maxCapacity"
            type="number"
            placeholder="8"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Location / Address</label>
        <input
          name="location"
          type="text"
          placeholder="House 12, Road 5, Banani, Dhaka"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Image URL */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Image URL</label>
        <input
          name="imageUrl"
          type="url"
          placeholder="https://i.ibb.co/your-studio-photo.jpg"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Detailed Overview */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Detailed Overview</label>
        <textarea
          name="overview"
          rows={4}
          placeholder="Describe the space: gear included, house rules, access hours…"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Host Details (Read-only) */}
      <div className="grid gap-4 rounded-xl border border-border bg-muted/40 p-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Your Name</label>
          <input
            type="text"
            value={user?.name || ""}
            readOnly
            className="w-full rounded-md border border-input bg-muted/60 px-3 py-2 text-sm text-muted-foreground"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Your Email</label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="w-full rounded-md border border-input bg-muted/60 px-3 py-2 text-sm text-muted-foreground"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-2 rounded-full bg-primary px-6 py-2.5 font-medium text-primary-foreground hover:opacity-90"
      >
        Add Studio
      </button>
    </form>
  );
}