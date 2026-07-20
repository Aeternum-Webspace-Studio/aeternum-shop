import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/session-server";
import { getOrderDetailByNumber, getOrderNotificationRecipient, setAdminOrderStatus } from "@/lib/orders";
import { logActivity } from "@/lib/activity";
import { sendNotificationEmail } from "@/lib/email";

const statusSchema = z.object({ action: z.enum(["cancel", "refund", "fail"]) });

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const current = await getCurrentUser();
  if (!current || current.session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const form = await request.formData();
  const payload = statusSchema.parse({ action: form.get("action") });

  const detail = await getOrderDetailByNumber(id);
  if (!detail) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (payload.action === "cancel" && detail.order.status !== "pending_payment") {
    return NextResponse.json({ error: "Only pending orders can be cancelled" }, { status: 400 });
  }

  const updated = await setAdminOrderStatus(detail.order.id, payload.action);
  if (!updated) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const recipient = await getOrderNotificationRecipient(detail.order.id);
  await sendNotificationEmail({
    to: recipient?.email,
    subject: `Status order ${detail.order.orderNumber} diperbarui`,
    text:
      payload.action === "cancel"
        ? `Order ${detail.order.orderNumber} dibatalkan oleh admin. Jika payment masih pending, status pembayaran akan ditutup.`
        : payload.action === "refund"
          ? `Order ${detail.order.orderNumber} ditandai refunded oleh admin.`
          : `Order ${detail.order.orderNumber} ditandai failed oleh admin.`
  });

  await logActivity({
    actorId: current.user.id,
    action: `order.${payload.action}`,
    entityType: "order",
    entityId: detail.order.id,
    metadata: { orderNumber: detail.order.orderNumber, action: payload.action }
  });

  return NextResponse.redirect(new URL(`/admin/orders/${detail.order.orderNumber}`, request.url), { status: 303 });
}
