import { and, eq, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { marketplaceSettings, sellerProfiles } from "@/db/schema";

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

export async function getMarketplaceSettings() {
  const db = getDb();
  const [settings] = await db.select().from(marketplaceSettings).limit(1);
  return settings ?? null;
}

export async function updateMarketplaceSettings(input: { appName: string; supportEmail?: string | null; announcement?: string | null; checkoutEnabled: boolean }) {
  const db = getDb();
  const existing = await getMarketplaceSettings();

  if (!existing) {
    const [settings] = await db.insert(marketplaceSettings).values(input).returning();
    return settings ?? null;
  }

  const [settings] = await db
    .update(marketplaceSettings)
    .set({
      appName: input.appName,
      supportEmail: input.supportEmail ?? null,
      announcement: input.announcement ?? null,
      checkoutEnabled: input.checkoutEnabled,
      updatedAt: new Date()
    })
    .where(eq(marketplaceSettings.id, existing.id))
    .returning();

  return settings ?? null;
}

export async function applySellerProfile(userId: string, input: { storeName: string; storeSlug: string; description?: string | null }) {
  const db = getDb();
  const existing = await findSellerProfileByUserId(userId);

  if (!existing) {
    const [profile] = await db
      .insert(sellerProfiles)
      .values({
        userId,
        storeName: input.storeName,
        storeSlug: input.storeSlug,
        description: input.description ?? null,
        status: "pending"
      })
      .returning();
    return profile ?? null;
  }

  const [profile] = await db
    .update(sellerProfiles)
    .set({
      storeName: input.storeName,
      storeSlug: input.storeSlug,
      description: input.description ?? null,
      status: "pending",
      updatedAt: new Date()
    })
    .where(eq(sellerProfiles.id, existing.id))
    .returning();

  return profile ?? null;
}

export async function updateSellerProfile(userId: string, input: { storeName: string; storeSlug: string; description?: string | null }) {
  const db = getDb();
  const existing = await findSellerProfileByUserId(userId);
  if (!existing) return { error: "missing" as const };

  const [slugOwner] = await db
    .select({ id: sellerProfiles.id })
    .from(sellerProfiles)
    .where(and(eq(sellerProfiles.storeSlug, input.storeSlug), ne(sellerProfiles.id, existing.id)))
    .limit(1);

  if (slugOwner) return { error: "slug_taken" as const };

  const [profile] = await db
    .update(sellerProfiles)
    .set({
      storeName: input.storeName,
      storeSlug: input.storeSlug,
      description: input.description ?? null,
      updatedAt: new Date()
    })
    .where(eq(sellerProfiles.id, existing.id))
    .returning();

  return { profile };
}
