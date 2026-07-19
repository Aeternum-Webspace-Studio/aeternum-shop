import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { faqItems } from "@/db/schema";

export async function listActiveFaqItems(limit = 6) {
  const db = getDb();

  return db
    .select({ id: faqItems.id, question: faqItems.question, answer: faqItems.answer })
    .from(faqItems)
    .where(eq(faqItems.isActive, true))
    .orderBy(asc(faqItems.createdAt))
    .limit(limit);
}
