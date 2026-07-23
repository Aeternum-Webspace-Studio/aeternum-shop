import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { sellerProfiles, sellerWithdrawalRequests, users } from "@/db/schema";

export async function createSellerWithdrawalRequest(input: { sellerId: string; userId: string; ticketId?: string | null; amount: number }) {
  const db = getDb();
  const [request] = await db.insert(sellerWithdrawalRequests).values({
    sellerId: input.sellerId,
    userId: input.userId,
    ticketId: input.ticketId ?? null,
    amount: input.amount,
    status: "requested"
  }).returning();
  return request ?? null;
}

export async function listWithdrawalRequests() {
  const db = getDb();
  return db
    .select({
      id: sellerWithdrawalRequests.id,
      amount: sellerWithdrawalRequests.amount,
      status: sellerWithdrawalRequests.status,
      createdAt: sellerWithdrawalRequests.createdAt,
      ticketId: sellerWithdrawalRequests.ticketId,
      sellerStoreName: sellerProfiles.storeName,
      userName: users.name
    })
    .from(sellerWithdrawalRequests)
    .innerJoin(sellerProfiles, eq(sellerWithdrawalRequests.sellerId, sellerProfiles.id))
    .innerJoin(users, eq(sellerWithdrawalRequests.userId, users.id))
    .orderBy(desc(sellerWithdrawalRequests.createdAt));
}
