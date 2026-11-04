import { MongoClient } from "mongodb";

// ---------------------------------------------------------------------------
// Shared MongoDB connection (single client, reused across the app).
// auth.ts and every API route import from here so we keep ONE connection pool.
// ---------------------------------------------------------------------------

const uri = process.env.MONGO_DB_URI as string;

// Cache the client on globalThis so Next.js hot-reload in dev doesn't open a
// new connection pool on every file change (standard Next.js pattern).
const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };

export const client = globalForMongo.mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

export const db = client.db("studio_tech_2026");
