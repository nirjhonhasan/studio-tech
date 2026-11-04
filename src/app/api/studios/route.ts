import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/mongodb";
import { listStudios } from "@/lib/studios";
import { STUDIO_CATEGORIES } from "@/types/studio";

// ---------------------------------------------------------------------------
// GET /api/studios?category=Photo%20Studio&limit=6  → public list
// ---------------------------------------------------------------------------
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category") ?? undefined;
  const limitParam = Number(searchParams.get("limit"));
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? limitParam : 24;

  const studios = await listStudios({ category, limit });
  return NextResponse.json(studios);
}

// ---------------------------------------------------------------------------
// POST /api/studios → create a listing (requires a logged-in session)
// The session cookie is HTTPOnly, so this is the Challenge-1 security seam:
// unauthenticated requests are rejected with 401 before touching MongoDB.
// ---------------------------------------------------------------------------
export async function POST(request: Request) {
  // BetterAuth resolves the session from the HTTPOnly cookie.
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json(
      { message: "You must be logged in to add a studio." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  // Server-side validation — never trust the client.
  const errors: string[] = [];
  if (typeof body.title !== "string" || body.title.trim().length < 5) errors.push("Title must be at least 5 characters.");
  if (!STUDIO_CATEGORIES.includes(body.category)) errors.push("Category is invalid.");
  if (typeof body.hourlyRate !== "number" || body.hourlyRate <= 0) errors.push("Hourly rate must be above 0.");
  if (typeof body.securityDeposit !== "number" || body.securityDeposit < 0) errors.push("Security deposit must be 0 or more.");
  if (typeof body.maxCapacity !== "number" || body.maxCapacity < 1) errors.push("Max capacity must be at least 1.");
  if (typeof body.location !== "string" || body.location.trim().length < 5) errors.push("Location must be at least 5 characters.");
  if (typeof body.imageUrl !== "string" || !/^https?:\/\/.+/.test(body.imageUrl)) errors.push("Image URL must start with http(s)://");
  if (!Array.isArray(body.amenities)) errors.push("Amenities must be a list.");
  if (typeof body.overview !== "string" || body.overview.trim().length < 20) errors.push("Overview must be at least 20 characters.");

  if (errors.length > 0) {
    return NextResponse.json({ message: errors.join(" ") }, { status: 400 });
  }

  // Host info comes from the session, not the request body.
  const doc = {
    title: body.title.trim(),
    category: body.category,
    hourlyRate: body.hourlyRate,
    securityDeposit: body.securityDeposit,
    maxCapacity: body.maxCapacity,
    location: body.location.trim(),
    imageUrl: body.imageUrl.trim(),
    amenities: body.amenities,
    overview: body.overview.trim(),
    ownerName: session.user.name,
    ownerEmail: session.user.email,
    rating: 0, // no reviews yet
    createdAt: new Date(),
  };

  const result = await db.collection("studios").insertOne(doc);

  return NextResponse.json(
    { message: "Studio created.", id: result.insertedId.toString() },
    { status: 201 }
  );
}
