import { and, desc, eq, ilike, or } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, productStocks, products } from "@/db/schema";

export async function listMarketplaceProducts(search = "") {
  const db = getDb();
  const query = search.trim();

  return db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      resellerPrice: products.resellerPrice,
      fulfillmentType: products.fulfillmentType,
      status: products.status,
      isCustomPackage: products.isCustomPackage,
      description: products.description,
      categoryName: categories.name,
      categorySlug: categories.slug
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      query
        ? and(eq(products.status, "active"), or(ilike(products.name, `%${query}%`), ilike(products.description, `%${query}%`), ilike(categories.name, `%${query}%`)))
        : eq(products.status, "active")
    )
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
      isCustomPackage: products.isCustomPackage,
      createdAt: products.createdAt
    })
    .from(products);

  return sellerId ? base.where(eq(products.sellerId, sellerId)).orderBy(desc(products.createdAt)) : base.orderBy(desc(products.createdAt));
}

export async function listCustomPackages() {
  const db = getDb();

  return db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      status: products.status,
      fulfillmentType: products.fulfillmentType,
      createdAt: products.createdAt
    })
    .from(products)
    .where(eq(products.isCustomPackage, true))
    .orderBy(desc(products.createdAt));
}

export async function countAvailableStock(productId: string) {
  const db = getDb();
  const rows = await db
    .select({ id: productStocks.id })
    .from(productStocks)
    .where(eq(productStocks.productId, productId));

  return rows.length;
}
