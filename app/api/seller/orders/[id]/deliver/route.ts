import { NextRequest, NextResponse } from "next/server";
import { getOrderItemForSeller, getOrderNotificationRecipient, submitManualDelivery } from "@/lib/orders";
import { getCurrentUser } from "@/lib/session-server";
import { findSellerProfileByUserId } from "@/lib/sellers";
import { logActivity } from "@/lib/activity";
import { sendNotificationEmail } from "@/lib/email";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const current = await getCurrentUser();
  if (!current || (current.session.role !== "seller" && current.session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const sellerId = current.session.role === "seller" ? (await findSellerProfileByUserId(current.user.id))?.id ?? null : null;
  const item = await getOrderItemForSeller(id, sellerId);
  if (!item || item.fulfillmentType !== "manual") {
    return NextResponse.json({ error: "Order item not found" }, { status: 404 });
  }

  const form = await request.formData();
  const raw = String(form.get("deliveryContent") ?? "");
  const deliveryContent = JSON.parse(raw) as Record<string, unknown>;
  await submitManualDelivery(id, deliveryContent);
  const recipient = await getOrderNotificationRecipient(item.orderId);
  await sendNotificationEmail({
    to: recipient?.email,
    subject: `Pesanan ${recipient?.orderNumber ?? "Aeternum Shop"} sudah delivered`,
    text: `Pesanan manual kamu sudah delivered. Login ke dashboard order untuk melihat detail akses produk.`
  });
  await logActivity({ actorId: current.user.id, action: "order.manual_delivered", entityType: "order_item", entityId: id, metadata: { role: current.session.role } });

  return NextResponse.redirect(new URL(`/seller/orders/${id}`, request.url), { status: 303 });
}
