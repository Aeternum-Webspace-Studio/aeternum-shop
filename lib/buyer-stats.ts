import { getDb } from "@/db";
import { orders } from "@/db/schema";

const successfulStatuses = new Set(["paid", "processing", "delivered"]);

export async function getBuyerStats(buyerId: string) {
  const db = getDb();
  const rows = await db.select({ buyerId: orders.buyerId, status: orders.status, totalAmount: orders.totalAmount }).from(orders);
  const buyers = new Map<string, { totalTransactions: number; totalSpent: number }>();

  for (const row of rows) {
    if (!successfulStatuses.has(row.status)) continue;

    const current = buyers.get(row.buyerId) ?? { totalTransactions: 0, totalSpent: 0 };
    current.totalTransactions += 1;
    current.totalSpent += row.totalAmount;
    buyers.set(row.buyerId, current);
  }

  const ranked = [...buyers.entries()].sort(([, a], [, b]) => b.totalTransactions - a.totalTransactions || b.totalSpent - a.totalSpent);
  const stats = buyers.get(buyerId) ?? { totalTransactions: 0, totalSpent: 0 };
  const rankIndex = ranked.findIndex(([id]) => id === buyerId);

  return {
    ...stats,
    rank: rankIndex === -1 ? null : rankIndex + 1
  };
}
