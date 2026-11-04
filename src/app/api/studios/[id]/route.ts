import { NextResponse } from "next/server";
import { getStudioById } from "@/lib/studios";

// ---------------------------------------------------------------------------
// GET /api/studios/[id] → public single-studio fetch (details page uses this)
// ---------------------------------------------------------------------------

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const studio = await getStudioById(id);

  if (!studio) {
    return NextResponse.json({ message: "Studio not found." }, { status: 404 });
  }

  return NextResponse.json(studio);
}
