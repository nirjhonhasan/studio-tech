import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { listStudiosByOwner } from "@/lib/studios";

// ---------------------------------------------------------------------------
// GET /api/studios/mine → studios created by the logged-in user.
// The email comes from the session (HTTPOnly cookie), not from the URL,
// so one user can never read another user's list.
// ---------------------------------------------------------------------------
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json(
      { message: "You must be logged in." },
      { status: 401 }
    );
  }

  const studios = await listStudiosByOwner(session.user.email);
  return NextResponse.json(studios);
}
