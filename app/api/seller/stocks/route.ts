import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { productStocks, products } from "@/db/schema";
import { getCurrentUser } from "@/lib/session-server";
import { ensureSellerProfile, findApprovedSellerProfileByUserId } from "@/lib/sellers";
import { eq } from "drizzle-orm";

const stockSchema = z.object({
  productId: z.string().uuid(),
  content: z.string().min(2)
});

const disableStockSchema = z.object({
  stockId: z.string().uuid()
});

export async function POST(request: Request) {
  const current = await getCurrentUser();
  if (!current || (current.session.role !== "seller" && current.session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (current.session.role === "seller" && !(await findApprovedSellerProfileByUserId(current.user.id))) {
    return NextResponse.json({ error: "Seller not approved" }, { status: 403 });
  }

  const form = await request.formData();
  const db = getDb();
  let sellerProfileId: string | null = null;
  if (current.session.role === "seller") {
    const sellerProfile = await ensureSellerProfile(current.user.id, `${current.user.name}'s Store`, `${current.user.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-store`);
    sellerProfileId = sellerProfile.id;
  }

  if (form.get("action") === "disable") {
    const payload = disableStockSchema.parse({ stockId: form.get("stockId") });
    const [stock] = await db
      .select({ id: productStocks.id, status: productStocks.status, sellerId: products.sellerId })
      .from(productStocks)
      .innerJoin(products, eq(productStocks.productId, products.id))
      .where(eq(productStocks.id, payload.stockId))
      .limit(1);

    if (!stock || (current.session.role === "seller" && stock.sellerId !== sellerProfileId)) {
      return NextResponse.json({ error: "Stock not found" }, { status: 404 });
    }

    if (stock.status === "available") {
      await db.update(productStocks).set({ status: "disabled" }).where(eq(productStocks.id, payload.stockId));
    }

    return NextResponse.redirect(new URL(current.session.role === "admin" ? "/admin/products" : "/seller/stocks", request.url), { status: 303 });
  }

  const payload = stockSchema.parse({
    productId: form.get("productId"),
    content: form.get("content")
  });

  if (current.session.role === "seller") {
    const [ownedProduct] = await getDb()
      .select({ id: products.id, sellerId: products.sellerId })
      .from(products)
      .where(eq(products.id, payload.productId))
      .limit(1);

    if (!ownedProduct || ownedProduct.sellerId !== sellerProfileId) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
  }

  let parsedContents: Record<string, unknown>[];
  try {
    const lines = payload.content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    parsedContents = lines.map((line) => JSON.parse(line) as Record<string, unknown>);
  } catch {
    return NextResponse.json({ error: "Content must be valid JSON per line" }, { status: 400 });
  }

  const stockRows: Array<{ productId: string; content: Record<string, unknown>; status: "available" }> = parsedContents.map((content) => ({
    productId: payload.productId,
    content,
    status: "available"
  }));

  await db.insert(productStocks).values(stockRows);

  return NextResponse.redirect(new URL(current.session.role === "admin" ? "/admin/products" : "/seller/stocks", request.url), { status: 303 });
}
