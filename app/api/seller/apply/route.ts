import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/session-server";
import { applySellerProfile } from "@/lib/sellers";
import { slugify } from "@/lib/slug";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/activity";

const applySchema = z.object({
  storeName: z.string().min(3).max(80),
  storeSlug: z.string().min(3).max(80),
  description: z.string().max(500).optional()
});

export async function POST(request: NextRequest) {
  const current = await getCurrentUser();
  if (!current) return NextResponse.redirect(new URL("/login", request.url));

  const form = await request.formData();
  const payload = applySchema.parse({
    storeName: form.get("storeName"),
    storeSlug: form.get("storeSlug"),
    description: form.get("description") || undefined
  });

  const db = getDb();
  await db.update(users).set({ role: "seller", updatedAt: new Date() }).where(eq(users.id, current.user.id));

  const profile = await applySellerProfile(current.user.id, {
    storeName: payload.storeName,
    storeSlug: slugify(payload.storeSlug),
    description: payload.description ?? null
  });

  await logActivity({ actorId: current.user.id, action: "seller.applied", entityType: "seller_profile", entityId: profile?.id ?? current.user.id, metadata: { storeName: payload.storeName, storeSlug: payload.storeSlug } });

  return NextResponse.redirect(new URL("/dashboard/profile?seller=applied", request.url), { status: 303 });
}
