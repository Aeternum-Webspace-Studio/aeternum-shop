import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { productStocks, products } from "@/db/schema";
import { getCurrentUser } from "@/lib/session-server";
import { ensureSellerProfile } from "@/lib/sellers";
import { eq } from "drizzle-orm";

const stockSchema = z.object({
  productId: z.string().uuid(),
  content: z.string().min(2)
});

export async function POST(request: Request) {
  const current = await getCurrentUser();
  if (!current || (current.session.role !== "seller" && current.session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const payload = stockSchema.parse({
    productId: form.get("productId"),
    content: form.get("content")
  });

  let sellerProfileId: string | null = null;
  if (current.session.role === "seller") {
    const sellerProfile = await ensureSellerProfile(current.user.id, `${current.user.name}'s Store`, `${current.user.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-store`);
    sellerProfileId = sellerProfile.id;

    const [ownedProduct] = await getDb()
      .select({ id: products.id, sellerId: products.sellerId })
      .from(products)
      .where(eq(products.id, payload.productId))
      .limit(1);

    if (!ownedProduct || ownedProduct.sellerId !== sellerProfileId) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
  }

  const db = getDb();
  const parsedContent = JSON.parse(payload.content) as Record<string, unknown>;

  await db.insert(productStocks).values({
    productId: payload.productId,
    content: parsedContent,
    status: "available"
  });

  return NextResponse.redirect(new URL(current.session.role === "admin" ? "/admin/products" : "/seller/stocks", request.url), { status: 303 });
}
