"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CirclePlus, LoaderCircle, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAuthUser } from "@/lib/auth-client";
import { STUDIO_CATEGORIES, type StudioFormData } from "@/types/studio";

// Select needs a { value: label } map so the trigger shows the label.
const CATEGORY_ITEMS = Object.fromEntries(STUDIO_CATEGORIES.map((c) => [c, c]));

// Preset amenities — the requirement asks for a "Tags/Checkboxes" list.
const AMENITY_OPTIONS = [
  "Cyc wall",
  "Blackout",
  "Acoustic panels",
  "Lighting grid",
  "Green room",
  "Makeup station",
  "Changing room",
  "4K cameras",
  "Mixing console",
  "Live room",
  "Projector",
  "Free parking",
];

const EMPTY_FORM: StudioFormData = {
  title: "",
  category: "",
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  location: "",
  imageUrl: "",
  amenities: [],
  overview: "",
};

export function AddStudioForm() {
  const router = useRouter();
  const { user, isPending } = useAuthUser(); // host info comes from the session, never typed

  const [formData, setFormData] = useState<StudioFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Wait for the session before showing anything (avoids flashing the form).
  if (isPending) {
    return (
      <div className="flex min-h-40 items-center justify-center gap-3 text-muted-foreground">
        <LoaderCircle className="size-5 animate-spin" /> Loading your host details…
      </div>
    );
  }

  /** Generic updater so every input writes through one helper. */
  function updateField<K extends keyof StudioFormData>(key: K, value: StudioFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    // Clear that field's error as soon as the user edits it again.
    setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  function toggleAmenity(amenity: string) {
    const has = formData.amenities.includes(amenity);
    updateField(
      "amenities",
      has
        ? formData.amenities.filter((item) => item !== amenity)
        : [...formData.amenities, amenity]
    );
  }

  /** Returns an object of field → error message (empty object = valid). */
  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (formData.title.trim().length < 5) next.title = "Give your studio a title of at least 5 characters.";
    if (!formData.category) next.category = "Pick the category that fits your space.";
    if (!formData.hourlyRate || Number(formData.hourlyRate) <= 0) next.hourlyRate = "Enter an hourly rate above $0.";
    if (formData.securityDeposit === "" || Number(formData.securityDeposit) < 0) next.securityDeposit = "Enter a deposit of $0 or more.";
    if (!formData.maxCapacity || Number(formData.maxCapacity) < 1) next.maxCapacity = "Capacity must be at least 1 guest.";
    if (formData.location.trim().length < 5) next.location = "Add the address or area of your studio.";
    if (!/^https?:\/\/.+/.test(formData.imageUrl.trim())) next.imageUrl = "Paste an image URL starting with http(s)://";
    if (formData.overview.trim().length < 20) next.overview = "Write at least 20 characters so creators know what to expect.";
    return next;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) return; // unreachable in practice — form only renders when signed in

    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      toast.error("Please fix the highlighted fields first.");
      return;
    }

    setIsSaving(true);

    // This is the exact payload the API inserts into the MongoDB `studios`
    // collection. Host info comes from the session, never from the form.
    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      hourlyRate: Number(formData.hourlyRate),
      securityDeposit: Number(formData.securityDeposit),
      maxCapacity: Number(formData.maxCapacity),
      location: formData.location.trim(),
      imageUrl: formData.imageUrl.trim(),
      amenities: formData.amenities,
      overview: formData.overview.trim(),
    };

    try {
      // Same-origin route handler — the HTTPOnly session cookie rides along.
      const response = await fetch("/api/studios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message ?? `Server responded with ${response.status}`);
      }

      toast.success("Studio listed successfully!");
      router.push("/my-listings");
      router.refresh(); // refresh server components so Explore shows it instantly
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save your studio. Please try again.");
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* --- Studio basics --- */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Studio Title" htmlFor="title" error={errors.title} className="sm:col-span-2">
          <Input
            id="title"
            value={formData.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="e.g. The Cyc Wall — Daylight Photo Studio"
            aria-invalid={Boolean(errors.title)}
          />
        </Field>

        <Field label="Category" htmlFor="category" error={errors.category}>
          <Select
            items={CATEGORY_ITEMS}
            value={formData.category || null}
            onValueChange={(value) => updateField("category", value ?? "")}
          >
            <SelectTrigger id="category" className="w-full" aria-invalid={Boolean(errors.category)}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {STUDIO_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Hourly Rate ($)" htmlFor="hourlyRate" error={errors.hourlyRate}>
          <Input
            id="hourlyRate"
            type="number"
            min="0"
            value={formData.hourlyRate}
            onChange={(event) => updateField("hourlyRate", event.target.value)}
            placeholder="45"
            aria-invalid={Boolean(errors.hourlyRate)}
          />
        </Field>

        <Field label="Security Deposit ($)" htmlFor="securityDeposit" error={errors.securityDeposit}>
          <Input
            id="securityDeposit"
            type="number"
            min="0"
            value={formData.securityDeposit}
            onChange={(event) => updateField("securityDeposit", event.target.value)}
            placeholder="100"
            aria-invalid={Boolean(errors.securityDeposit)}
          />
        </Field>

        <Field label="Max Capacity" htmlFor="maxCapacity" error={errors.maxCapacity}>
          <Input
            id="maxCapacity"
            type="number"
            min="1"
            value={formData.maxCapacity}
            onChange={(event) => updateField("maxCapacity", event.target.value)}
            placeholder="8"
            aria-invalid={Boolean(errors.maxCapacity)}
          />
        </Field>

        <Field label="Location / Address" htmlFor="location" error={errors.location} className="sm:col-span-2">
          <Input
            id="location"
            value={formData.location}
            onChange={(event) => updateField("location", event.target.value)}
            placeholder="House 12, Road 5, Banani, Dhaka"
            aria-invalid={Boolean(errors.location)}
          />
        </Field>

        <Field
          label="Image URL"
          htmlFor="imageUrl"
          error={errors.imageUrl}
          hint="Paste a link from imgbb, postimage or any image host."
          className="sm:col-span-2"
        >
          <Input
            id="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={(event) => updateField("imageUrl", event.target.value)}
            placeholder="https://i.ibb.co/your-studio-photo.jpg"
            aria-invalid={Boolean(errors.imageUrl)}
          />
        </Field>
      </div>

      {/* --- Amenities (checkbox grid) --- */}
      <Field label="Amenities" error={errors.amenities}>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {AMENITY_OPTIONS.map((amenity) => {
            const checked = formData.amenities.includes(amenity);
            return (
              <label
                key={amenity}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                  checked
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border hover:bg-muted"
                }`}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleAmenity(amenity)}
                  aria-label={amenity}
                />
                {amenity}
              </label>
            );
          })}
        </div>
      </Field>

      {/* --- Overview --- */}
      <Field label="Detailed Overview" htmlFor="overview" error={errors.overview}>
        <Textarea
          id="overview"
          rows={5}
          value={formData.overview}
          onChange={(event) => updateField("overview", event.target.value)}
          placeholder="Describe the space: what it's best for, the gear that's included, house rules, access hours…"
          aria-invalid={Boolean(errors.overview)}
        />
      </Field>

      {/* --- Host info: auto-filled from the auth session, read-only --- */}
      <fieldset className="rounded-xl border border-border bg-muted/40 p-4">
        <legend className="flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Lock className="size-3" /> Host details (from your account)
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your Name" htmlFor="ownerName">
            <Input id="ownerName" value={user?.name} readOnly tabIndex={-1} className="bg-muted/60 text-muted-foreground" />
          </Field>
          <Field label="Your Email" htmlFor="ownerEmail">
            <Input id="ownerEmail" type="email" value={user?.email} readOnly tabIndex={-1} className="bg-muted/60 text-muted-foreground" />
          </Field>
        </div>
      </fieldset>

      {/* --- Submit --- */}
      <div className="flex flex-col items-center gap-3 border-t border-border pt-5 sm:flex-row sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Your listing goes live on Explore Studios right after review.
        </p>
        <Button type="submit" size="lg" disabled={isSaving} className="gap-2 rounded-full px-6">
          {isSaving ? (
            <>
              <LoaderCircle className="size-4 animate-spin" /> Saving…
            </>
          ) : (
            <>
              <CirclePlus className="size-4" /> Add Studio
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

/** Label + control + inline error, so each form field reads as one row of JSX. */
function Field({
  label,
  htmlFor,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
