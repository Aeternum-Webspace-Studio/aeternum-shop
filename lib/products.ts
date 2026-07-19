import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, productStocks, products } from "@/db/schema";

export async function listMarketplaceProducts() {
  const db = getDb();

  return db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      resellerPrice: products.resellerPrice,
      fulfillmentType: products.fulfillmentType,
      status: products.status,
      description: products.description,
      categoryName: categories.name,
      categorySlug: categories.slug
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.status, "active"))
    .orderBy(desc(products.createdAt));
}

export async function getProductBySlug(slug: string) {
  const db = getDb();
  const [product] = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      instructions: products.instructions,
      price: products.price,
      resellerPrice: products.resellerPrice,
      fulfillmentType: products.fulfillmentType,
      status: products.status,
      isCustomPackage: products.isCustomPackage,
      categoryName: categories.name,
      categorySlug: categories.slug
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);

  return product ?? null;
}

export async function listProductsBySellerId(sellerId: string | null) {
  const db = getDb();
  const base = db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      resellerPrice: products.resellerPrice,
      fulfillmentType: products.fulfillmentType,
      status: products.status,
      createdAt: products.createdAt
    })
    .from(products);

  return sellerId ? base.where(eq(products.sellerId, sellerId)).orderBy(desc(products.createdAt)) : base.orderBy(desc(products.createdAt));
}

export async function countAvailableStock(productId: string) {
  const db = getDb();
  const rows = await db
    .select({ id: productStocks.id })
    .from(productStocks)
    .where(eq(productStocks.productId, productId));

  return rows.length;
}
