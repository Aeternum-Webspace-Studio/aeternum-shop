import { NextResponse } from "next/server";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders, paymentEvents, payments } from "@/db/schema";
import { fetchPakasirTransactionDetail } from "@/lib/pakasir";
import { fulfillAutoDelivery } from "@/lib/orders";
import { logActivity } from "@/lib/activity";

const webhookSchema = z.object({
  amount: z.number(),
  order_id: z.string(),
  project: z.string(),
  status: z.string(),
  payment_method: z.string().optional(),
  completed_at: z.string().optional()
});

export async function POST(request: Request) {
  const body = webhookSchema.parse(await request.json());
  const projectSlug = process.env.PAKASIR_PROJECT_SLUG ?? "";
  const apiKey = process.env.PAKASIR_API_KEY ?? "";

  if (!projectSlug || !apiKey) {
    return NextResponse.json({ error: "Pakasir not configured" }, { status: 500 });
  }

  if (body.project !== projectSlug) {
    return NextResponse.json({ error: "Invalid project" }, { status: 400 });
  }

  const detail = await fetchPakasirTransactionDetail({
    projectSlug,
    amount: body.amount,
    orderId: body.order_id,
    apiKey
  });

  if (!detail?.transaction || detail.transaction.status !== "completed") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const db = getDb();
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, body.order_id)).limit(1);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const [payment] = await db.select().from(payments).where(and(eq(payments.orderId, order.id), eq(payments.amount, body.amount))).limit(1);
  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  await db.insert(paymentEvents).values({
    paymentId: payment.id,
    provider: "pakasir",
    eventType: body.status,
    payload: body
  });

  if (payment.status === "paid") {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  await db.update(payments).set({ status: "paid", paidAt: new Date(), rawPayload: body, updatedAt: new Date() }).where(eq(payments.id, payment.id));
  await db.update(orders).set({ status: "paid", paidAt: new Date(), updatedAt: new Date() }).where(eq(orders.id, order.id));

  const deliveryState = await fulfillAutoDelivery(order.id);
  await logActivity({
    actorId: null,
    action: "payment.paid",
    entityType: "order",
    entityId: order.id,
    metadata: { orderNumber: order.orderNumber, amount: body.amount, deliveryState }
  });

  return NextResponse.json({ ok: true });
}
