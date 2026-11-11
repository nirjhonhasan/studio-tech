import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Studio } from "@/types/studio";
import SubmitPopOver from "@/components/site/SubmitPopOver";
import EditDeleteBtn from "@/components/editDeleteBtn/EditeDeleteBtn";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { TokenForServer } from "@/lib/TokenForServer";

interface StudioDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getStudioDetails(id: string): Promise<Studio | null> {
  try {
    const token = await TokenForServer()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/studios/${id}`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store"
    });

    if (!res.ok) {
      console.error(`Failed to fetch studio details for ID: ${id}, Status: ${res.status}`);
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.error("Error fetching studio details:", error);
    return null;
  }
}

export default async function StudioDetailsPage({ params }: StudioDetailsPageProps) {
  const { id } = await params;
  const studio = await getStudioDetails(id);

  if (!studio) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#121110] px-4 py-8 text-[#f3f0ea] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex justify-between items-center">
          <Link
            href="/studios"
            className="inline-flex items-center text-sm font-medium text-[#a8a29e] transition-colors hover:text-[#f59e0b]"
          >
            ← Back to Studios
          </Link>
          <EditDeleteBtn
            studio={{
              ...studio,
              _id: studio._id.toString()
            }}
          />
        </div>

        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="rounded-full bg-[#f59e0b]/10 px-3 py-1 text-xs font-semibold text-[#f59e0b]">
                {studio.category}
              </span>
              <span className="text-xs text-[#a8a29e]">
                ★ {studio.rating > 0 ? studio.rating.toFixed(1) : "New"}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#f3f0ea] sm:text-4xl">
              {studio.title}
            </h1>
            <p className="mt-1 text-sm text-[#a8a29e]">📍 {studio.location}</p>
          </div>
        </div>

        <div className="relative mb-10 h-[350px] w-full overflow-hidden rounded-2xl border border-[#262422] sm:h-[480px]">
          <Image
            src={studio.imageUrl || "https://images.unsplash.com/photo-1540655037529-dec987208707?w=800"}
            alt={studio.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#262422] bg-[#1a1816] p-5">
              <div>
                <p className="text-xs text-[#a8a29e]">Hosted by</p>
                <p className="font-semibold text-[#f3f0ea]">{studio.ownerName || "Studio Host"}</p>
                {studio.ownerEmail && (
                  <p className="text-xs text-[#a8a29e]">{studio.ownerEmail}</p>
                )}
              </div>
              <div className="border-l border-[#262422] pl-4">
                <p className="text-xs text-[#a8a29e]">Max Capacity</p>
                <p className="font-semibold text-[#f59e0b]">
                  👥 {studio.maxCapacity} People
                </p>
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-xl font-semibold text-[#f3f0ea]">
                About this Studio
              </h2>
              <p className="leading-relaxed text-[#a8a29e]">
                {studio.overview || "No detailed description provided for this studio yet."}
              </p>
            </div>

            {studio.amenities && studio.amenities.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-[#f3f0ea]">
                  Amenities
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {studio.amenities.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 rounded-lg border border-[#262422] bg-[#1a1816] px-4 py-3 text-sm text-[#f3f0ea]"
                    >
                      <span className="text-[#f59e0b]">✓</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-2xl border border-[#262422] bg-[#1a1816] p-6 shadow-xl">
              <div className="mb-6 flex items-baseline justify-between border-b border-[#262422] pb-6">
                <div>
                  <span className="text-3xl font-bold text-[#f59e0b]">
                    ${studio.hourlyRate}
                  </span>
                  <span className="text-sm text-[#a8a29e]"> / hour</span>
                </div>
                {studio.securityDeposit && (
                  <div className="text-right">
                    <span className="block text-xs text-[#a8a29e]">Deposit</span>
                    <span className="text-sm font-medium text-[#f3f0ea]">
                      ${studio.securityDeposit}
                    </span>
                  </div>
                )}
              </div>

              <SubmitPopOver studio={studio} />

              <p className="mt-4 text-center text-xs text-[#a8a29e]">
                You wont be charged yet. Instant confirmation upon host approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}