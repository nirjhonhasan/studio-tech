"use client";

import { useState } from "react";
import EditStudioForm from "./EditeFile";
import { Studio } from "@/types/studio";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { ClientTokenForServer } from "@/lib/ClientTokenForServer";

interface EditDeleteBtnProps {
  studio: Studio;
}

const EditDeleteBtn = ({ studio }: EditDeleteBtnProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    const studioId = studio._id;

    if (!studioId) {
      alert("Studio ID not found!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this studio?")) return;

    try {
      // টোকেন ফেচ করার সঠিক পদ্ধতি
      const token = await ClientTokenForServer();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/studios/${studioId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast("Studio deleted successfully!");
        window.location.href = "/studios";
      } else {
        toast(data.msg || "Failed to delete studio.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast("Something went wrong!");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center gap-5">
        <button
          onClick={() => setIsOpen(true)}
          className="py-2.5 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          ✏️ Edit
        </button>
        <button
          onClick={handleDelete}
          className="py-2.5 px-4 bg-red-600/10 hover:bg-red-600/20 text-red-400 font-semibold border border-red-500/30 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          🗑️ Delete
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white text-xl z-10 cursor-pointer bg-[#121110] px-3 py-1 rounded-full border border-[#262422]"
            >
              ✕
            </button>
            <EditStudioForm studio={studio} onClose={() => setIsOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default EditDeleteBtn;