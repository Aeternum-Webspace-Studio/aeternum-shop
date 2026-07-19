import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";

export async function findUserByEmail(email: string) {
  const db = getDb();
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user ?? null;
}

export async function findUserById(id: string) {
  const db = getDb();
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user ?? null;
}

export async function listUsers() {
  const db = getDb();
  return db.select().from(users).orderBy(desc(users.createdAt));
}

export async function listResellerRequests() {
  const db = getDb();
  return db.select().from(users).where(eq(users.resellerStatus, "pending")).orderBy(desc(users.updatedAt));
}
