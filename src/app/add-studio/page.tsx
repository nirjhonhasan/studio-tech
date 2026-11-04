import type { Metadata } from "next";
import { AddStudioForm } from "@/components/studio/add-studio-form";

export const metadata: Metadata = {
  title: "Add New Studio — StudioSpace",
};

// Add New Studio (private route) — the listing form that saves into the
// MongoDB `studios` collection via POST /api/studios.
export default function AddStudioPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">List your space</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Add New Studio</h1>
        <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted-foreground">
          Tell creators what makes your space special. The more detail you give,
          the faster your calendar fills up.
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <AddStudioForm />
      </div>
    </div>
  );
}
