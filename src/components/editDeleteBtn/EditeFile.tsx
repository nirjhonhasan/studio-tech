"use client";

import { useState } from "react";
import { Studio } from "@/types/studio";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EditStudioFormProps {
  studio: Studio;
  onClose?: () => void;
}

export default function EditStudioForm({ studio, onClose }: EditStudioFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: studio?.title || "",
    category: studio?.category || "",
    hourlyRate: studio?.hourlyRate || "",
    securityDeposit: studio?.securityDeposit || "",
    maxCapacity: studio?.maxCapacity || "",
    location: studio?.location || "",
    imageUrl: studio?.imageUrl || "",
    overview: studio?.overview || "",
    ownerName: studio?.ownerName || "",
    ownerEmail: studio?.ownerEmail || "",
  });

  const [loading, setLoading] = useState(false);

  if (!studio) {
    return (
      <div className="w-full max-w-3xl mx-auto rounded-2xl border border-[#262422] bg-[#1a1816] p-8 text-center text-[#a8a29e]">
        Loading studio details...
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedPayload = {
        ...formData,
        hourlyRate: Number(formData.hourlyRate),
        securityDeposit: Number(formData.securityDeposit),
        maxCapacity: Number(formData.maxCapacity),
      };

      const res = await fetch(`NEXT_PUBLIC_API_URL/studios/${studio._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPayload),
      });

      const data = await res.json();

      if (res.ok) {
        toast("Studio updated successfully!");
        if (onClose) onClose();
        router.refresh();
      } else {
        toast("Failed to update studio.");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl border border-[#262422] bg-[#1a1816] p-6 sm:p-8 text-[#f3f0ea] shadow-2xl">
      <div className="text-center mb-8">
        <span className="text-xs font-semibold text-[#f59e0b] tracking-wider uppercase">
          UPDATE YOUR SPACE
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold mt-1 text-[#f3f0ea]">
          Edit Studio Details
        </h2>
        <p className="text-xs sm:text-sm text-[#a8a29e] mt-1">
          Modify the details below to update your studio listing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-[#a8a29e] mb-1.5">Studio Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-[#262422] bg-[#121110] px-4 py-3 text-sm text-[#f3f0ea] focus:border-[#f59e0b] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#a8a29e] mb-1.5">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#262422] bg-[#121110] px-4 py-3 text-sm text-[#f3f0ea] focus:border-[#f59e0b] focus:outline-none"
            >
              <option value="">Select a category</option>
              <option value="Photo Studio">Photo Studio</option>
              <option value="Audio Recording">Audio Recording</option>
              <option value="Video Production">Video Production</option>
              <option value="Dance Studio">Dance Studio</option>
              <option value="Podcast Lounge">Podcast Lounge</option>
              <option value="Film Stage">Film Stage</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#a8a29e] mb-1.5">Hourly Rate ($)</label>
            <input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[#262422] bg-[#121110] px-4 py-3 text-sm text-[#f3f0ea] focus:border-[#f59e0b] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#a8a29e] mb-1.5">Security Deposit ($)</label>
            <input
              type="number"
              name="securityDeposit"
              value={formData.securityDeposit}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#262422] bg-[#121110] px-4 py-3 text-sm text-[#f3f0ea] focus:border-[#f59e0b] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#a8a29e] mb-1.5">Max Capacity</label>
            <input
              type="number"
              name="maxCapacity"
              value={formData.maxCapacity}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[#262422] bg-[#121110] px-4 py-3 text-sm text-[#f3f0ea] focus:border-[#f59e0b] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#a8a29e] mb-1.5">Location / Address</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-[#262422] bg-[#121110] px-4 py-3 text-sm text-[#f3f0ea] focus:border-[#f59e0b] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#a8a29e] mb-1.5">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#262422] bg-[#121110] px-4 py-3 text-sm text-[#f3f0ea] focus:border-[#f59e0b] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#a8a29e] mb-1.5">Detailed Overview</label>
          <textarea
            name="overview"
            rows={4}
            value={formData.overview}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#262422] bg-[#121110] px-4 py-3 text-sm text-[#f3f0ea] focus:border-[#f59e0b] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#a8a29e] mb-1.5">Your Name</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#262422] bg-[#121110] px-4 py-3 text-sm text-[#f3f0ea] focus:border-[#f59e0b] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#a8a29e] mb-1.5">Your Email</label>
            <input
              type="email"
              name="ownerEmail"
              value={formData.ownerEmail}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#262422] bg-[#121110] px-4 py-3 text-sm text-[#f3f0ea] focus:border-[#f59e0b] focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-[#f59e0b] hover:bg-[#d97706] text-black font-bold rounded-xl transition-all cursor-pointer mt-6 shadow-lg"
        >
          {loading ? "Updating Studio..." : "Update Studio"}
        </button>
      </form>
    </div>
  );
}