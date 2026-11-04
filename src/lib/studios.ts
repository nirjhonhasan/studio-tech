import { ObjectId } from "mongodb";
import { db } from "./mongodb";
import type { Studio } from "@/types/studio";

// ---------------------------------------------------------------------------
// Server-side data access for the `studios` collection.
// API routes and server components import from here — never from the client.
// ---------------------------------------------------------------------------

export function studiosCollection() {
  return db.collection("studios");
}

/** Raw document shape in MongoDB. */
interface StudioDoc {
  _id: ObjectId;
  title: string;
  category: string;
  imageUrl: string;
  hourlyRate: number;
  securityDeposit?: number;
  maxCapacity: number;
  amenities: string[];
  overview?: string;
  rating?: number;
  location: string;
  ownerName: string;
  ownerEmail: string;
  createdAt?: Date;
}

/** Convert a MongoDB document into the Studio shape the UI expects. */
function mapStudio(doc: StudioDoc): Studio {
  return {
    id: doc._id.toString(),
    title: doc.title,
    category: doc.category as Studio["category"],
    image: doc.imageUrl,
    hourlyRate: doc.hourlyRate,
    securityDeposit: doc.securityDeposit,
    maxCapacity: doc.maxCapacity,
    amenities: doc.amenities ?? [],
    overview: doc.overview,
    rating: doc.rating ?? 0,
    location: doc.location,
    hostName: doc.ownerName,
    ownerEmail: doc.ownerEmail,
    createdAt: doc.createdAt?.toISOString(),
  };
}

/** List studios, newest first. Optional category filter + result limit. */
export async function listStudios(options: { category?: string; limit?: number } = {}): Promise<Studio[]> {
  const { category, limit = 24 } = options;

  const query = category ? { category } : {};
  const docs = await studiosCollection()
    .find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return docs.map((doc) => mapStudio(doc as unknown as StudioDoc));
}

/** Fetch a single studio by its id (returns null for bad ids or misses). */
export async function getStudioById(id: string): Promise<Studio | null> {
  if (!ObjectId.isValid(id)) return null;
  const doc = await studiosCollection().findOne({ _id: new ObjectId(id) });
  return doc ? mapStudio(doc as StudioDoc) : null;
}
