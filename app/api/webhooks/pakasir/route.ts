import { NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { orders, paymentEvents, payments } from "@/db/schema";
import { fetchPakasirTransactionDetail } from "@/lib/pakasir";
import { fulfillAutoDelivery, getOrderNotificationRecipient } from "@/lib/orders";
import { logActivity } from "@/lib/activity";
import { sendNotificationEmail } from "@/lib/email";
import { resolveWebhookPaymentOutcome } from "@/lib/backend-guards.js";

const webhookSchema = z.object({
  amount: z.number(),
  order_id: z.string(),
  project: z.string(),
  status: z.string(),
  payment_method: z.string().optional(),
  completed_at: z.string().optional()
});

type PaidWebhookResult =
  | { kind: "paid"; order: { id: string; orderNumber: string } }
  | { kind: "duplicate" }
  | { kind: "ignored" }
  | { kind: "error"; message: string; status: number };

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
  const result: PaidWebhookResult = await db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${body.order_id}))`);

    const [order] = await tx.select().from(orders).where(eq(orders.orderNumber, body.order_id)).limit(1);
    if (!order) return { kind: "error", message: "Order not found", status: 404 };

    const [payment] = await tx.select().from(payments).where(eq(payments.orderId, order.id)).limit(1);
    if (!payment) return { kind: "error", message: "Payment not found", status: 404 };
    const outcome = resolveWebhookPaymentOutcome({
      orderStatus: order.status,
      paymentStatus: payment.status,
      paymentAmount: payment.amount,
      webhookAmount: body.amount
    });

    if (outcome === "ignored") return { kind: "ignored" };
    if (outcome === "mismatch") return { kind: "error", message: "Payment amount mismatch", status: 400 };

    await tx.insert(paymentEvents).values({
      paymentId: payment.id,
      provider: "pakasir",
      eventType: body.status,
      payload: body
    });

    if (outcome === "duplicate") return { kind: "duplicate" };

    await tx.update(payments).set({ status: "paid", paidAt: new Date(), rawPayload: body, updatedAt: new Date() }).where(eq(payments.id, payment.id));
    await tx.update(orders).set({ status: "paid", paidAt: new Date(), updatedAt: new Date() }).where(eq(orders.id, order.id));

    return { kind: "paid", order: { id: order.id, orderNumber: order.orderNumber } };
  });

  if (result.kind === "error") {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  if (result.kind === "ignored") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (result.kind === "duplicate") {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const deliveryState = await fulfillAutoDelivery(result.order.id);
  const recipient = await getOrderNotificationRecipient(result.order.id);
  await sendNotificationEmail({
    to: recipient?.email,
    subject: `Payment ${result.order.orderNumber} berhasil`,
    text: deliveryState === "delivered"
      ? `Payment untuk invoice ${result.order.orderNumber} berhasil dan akses produk sudah tersedia di dashboard order.`
      : `Payment untuk invoice ${result.order.orderNumber} berhasil. Pesanan sedang diproses seller, pantau statusnya di dashboard order.`
  });
  await logActivity({
    actorId: null,
    action: "payment.paid",
    entityType: "order",
    entityId: result.order.id,
    metadata: { orderNumber: result.order.orderNumber, amount: body.amount, deliveryState }
  });

  return NextResponse.json({ ok: true });
}
