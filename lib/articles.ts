import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { blogPosts, users } from "@/db/schema";

export async function listPublishedArticles() {
  const db = getDb();
  return db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      publishedAt: blogPosts.publishedAt,
      authorName: users.name
    })
    .from(blogPosts)
    .innerJoin(users, eq(blogPosts.authorId, users.id))
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt));
}

export async function getPublishedArticleBySlug(slug: string) {
  const db = getDb();
  const [article] = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: blogPosts.excerpt,
      content: blogPosts.content,
      publishedAt: blogPosts.publishedAt,
      authorName: users.name
    })
    .from(blogPosts)
    .innerJoin(users, eq(blogPosts.authorId, users.id))
    .where(eq(blogPosts.slug, slug))
    .limit(1);

  return article ?? null;
}

export async function listAdminArticles() {
  const db = getDb();
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}
