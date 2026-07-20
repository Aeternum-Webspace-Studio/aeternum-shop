import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { sellerProfiles } from "@/db/schema";

export async function findSellerProfileByUserId(userId: string) {
  const db = getDb();
  const [profile] = await db.select().from(sellerProfiles).where(eq(sellerProfiles.userId, userId)).limit(1);
  return profile ?? null;
}

export async function ensureSellerProfile(userId: string, storeName: string, storeSlug: string) {
  const db = getDb();
  const existing = await findSellerProfileByUserId(userId);
  if (existing) return existing;

  const [profile] = await db
    .insert(sellerProfiles)
    .values({
      userId,
      storeName,
      storeSlug,
      status: "approved"
    })
    .returning();

  return profile;
}

export async function listSellerProfiles() {
  const db = getDb();
  return db.select().from(sellerProfiles);
}

export async function findApprovedSellerProfileByUserId(userId: string) {
  const profile = await findSellerProfileByUserId(userId);
  return profile?.status === "approved" ? profile : null;
}
