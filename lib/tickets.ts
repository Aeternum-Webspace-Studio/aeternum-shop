import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orderItems, orders, sellerProfiles, tickets } from "@/db/schema";

export async function listTicketsByBuyerId(buyerId: string) {
  const db = getDb();

  return db
    .select({
      id: tickets.id,
      subject: tickets.subject,
      status: tickets.status,
      createdAt: tickets.createdAt,
      orderNumber: orders.orderNumber,
      sellerStoreName: sellerProfiles.storeName
    })
    .from(tickets)
    .leftJoin(orders, eq(tickets.orderId, orders.id))
    .leftJoin(sellerProfiles, eq(tickets.sellerId, sellerProfiles.id))
    .where(eq(tickets.buyerId, buyerId))
    .orderBy(desc(tickets.createdAt));
}

export async function createTicket(input: { buyerId: string; subject: string; orderId?: string | null; sellerId?: string | null }) {
  const db = getDb();
  const [ticket] = await db
    .insert(tickets)
    .values({
      buyerId: input.buyerId,
      orderId: input.orderId ?? null,
      sellerId: input.sellerId ?? null,
      subject: input.subject
    })
    .returning();

  return ticket ?? null;
}

export async function getSellerIdForOrder(orderId: string) {
  const db = getDb();
  const [item] = await db.select({ sellerId: orderItems.sellerId }).from(orderItems).where(eq(orderItems.orderId, orderId)).limit(1);
  return item?.sellerId ?? null;
}
