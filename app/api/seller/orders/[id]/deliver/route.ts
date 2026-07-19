import { NextRequest, NextResponse } from "next/server";
import { getOrderItemForSeller, submitManualDelivery } from "@/lib/orders";
import { getCurrentUser } from "@/lib/session-server";
import { findSellerProfileByUserId } from "@/lib/sellers";
import { logActivity } from "@/lib/activity";

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
  await logActivity({ actorId: current.user.id, action: "order.manual_delivered", entityType: "order_item", entityId: id, metadata: { role: current.session.role } });

  return NextResponse.redirect(new URL(`/seller/orders/${id}`, request.url), { status: 303 });
}
