import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orderItems, orders, sellerProfiles, ticketMessages, tickets, users } from "@/db/schema";

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

export async function listAdminTickets() {
  const db = getDb();

  return db
    .select({
      id: tickets.id,
      subject: tickets.subject,
      status: tickets.status,
      createdAt: tickets.createdAt,
      buyerName: users.name,
      orderNumber: orders.orderNumber,
      sellerStoreName: sellerProfiles.storeName
    })
    .from(tickets)
    .innerJoin(users, eq(tickets.buyerId, users.id))
    .leftJoin(orders, eq(tickets.orderId, orders.id))
    .leftJoin(sellerProfiles, eq(tickets.sellerId, sellerProfiles.id))
    .orderBy(desc(tickets.createdAt));
}

export async function listTicketsBySellerId(sellerId: string | null) {
  const db = getDb();
  const base = db
    .select({
      id: tickets.id,
      subject: tickets.subject,
      status: tickets.status,
      createdAt: tickets.createdAt,
      buyerName: users.name,
      orderNumber: orders.orderNumber
    })
    .from(tickets)
    .innerJoin(users, eq(tickets.buyerId, users.id))
    .leftJoin(orders, eq(tickets.orderId, orders.id));

  return sellerId ? base.where(eq(tickets.sellerId, sellerId)).orderBy(desc(tickets.createdAt)) : base.orderBy(desc(tickets.createdAt));
}

export async function getTicketDetail(ticketId: string) {
  const db = getDb();
  const [ticket] = await db
    .select({
      id: tickets.id,
      buyerId: tickets.buyerId,
      sellerId: tickets.sellerId,
      orderId: tickets.orderId,
      subject: tickets.subject,
      status: tickets.status,
      createdAt: tickets.createdAt,
      buyerName: users.name,
      orderNumber: orders.orderNumber,
      sellerStoreName: sellerProfiles.storeName
    })
    .from(tickets)
    .innerJoin(users, eq(tickets.buyerId, users.id))
    .leftJoin(orders, eq(tickets.orderId, orders.id))
    .leftJoin(sellerProfiles, eq(tickets.sellerId, sellerProfiles.id))
    .where(eq(tickets.id, ticketId))
    .limit(1);
  if (!ticket) return null;

  const messages = await db
    .select({
      id: ticketMessages.id,
      message: ticketMessages.message,
      createdAt: ticketMessages.createdAt,
      senderName: users.name,
      senderRole: users.role
    })
    .from(ticketMessages)
    .innerJoin(users, eq(ticketMessages.senderId, users.id))
    .where(eq(ticketMessages.ticketId, ticketId))
    .orderBy(asc(ticketMessages.createdAt));

  return { ticket, messages };
}

export async function addTicketMessage(ticketId: string, senderId: string, message: string) {
  const db = getDb();
  await db.insert(ticketMessages).values({ ticketId, senderId, message });
  await db.update(tickets).set({ status: "pending", updatedAt: new Date() }).where(eq(tickets.id, ticketId));
}

export async function updateTicketStatus(ticketId: string, status: "open" | "pending" | "closed") {
  const db = getDb();
  await db.update(tickets).set({ status, closedAt: status === "closed" ? new Date() : null, updatedAt: new Date() }).where(eq(tickets.id, ticketId));
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
