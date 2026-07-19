import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { blogPosts } from "@/db/schema";
import { getCurrentUser } from "@/lib/session-server";
import { slugify } from "@/lib/slug";
import { logActivity } from "@/lib/activity";

const articleSchema = z.object({
  title: z.string().min(5),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(20),
  status: z.enum(["draft", "published"]).default("draft")
});

export async function POST(request: Request) {
  const current = await getCurrentUser();
  if (!current || current.session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const payload = articleSchema.parse({
    title: form.get("title"),
    excerpt: form.get("excerpt") || undefined,
    content: form.get("content"),
    status: form.get("status") || "draft"
  });

  const db = getDb();
  const slug = `${slugify(payload.title)}-${Math.random().toString(36).slice(2, 6)}`;
  await db.insert(blogPosts).values({
    authorId: current.user.id,
    title: payload.title,
    slug,
    excerpt: payload.excerpt ?? null,
    content: payload.content,
    status: payload.status,
    publishedAt: payload.status === "published" ? new Date() : null
  });
  await logActivity({ actorId: current.user.id, action: "article.created", entityType: "blog_post", entityId: slug, metadata: { status: payload.status } });

  return NextResponse.redirect(new URL("/admin/blog", request.url), { status: 303 });
}
