import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { orderItems, orders, payments, products } from "@/db/schema";
import { getCurrentUser } from "@/lib/session-server";
import { buildPakasirPaymentUrl } from "@/lib/pakasir";
import { createOrderNumber } from "@/lib/orders";
import { logActivity } from "@/lib/activity";
import { canCheckout } from "@/lib/backend-guards.js";
import { productPriceForUser } from "@/lib/pricing.js";
import { getMarketplaceSettings } from "@/lib/sellers";
import { eq } from "drizzle-orm";

const checkoutSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().positive().default(1)
});

export async function POST(request: Request) {
  const current = await getCurrentUser();
  if (!current) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const form = await request.formData();
  const payload = checkoutSchema.parse({
    productId: form.get("productId"),
    quantity: form.get("quantity") ?? 1
  });

  const db = getDb();
  const settings = await getMarketplaceSettings();
  if (!canCheckout(settings)) {
    return NextResponse.json({ error: "Checkout sedang dinonaktifkan" }, { status: 403 });
  }

  const [product] = await db.select().from(products).where(eq(products.id, payload.productId)).limit(1);
  if (!product || product.status !== "active") {
    return NextResponse.json({ error: "Produk tidak tersedia" }, { status: 404 });
  }

  const orderNumber = createOrderNumber();
  const unitPrice = productPriceForUser(product, current.user);
  const amount = unitPrice * payload.quantity;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  const projectSlug = process.env.PAKASIR_PROJECT_SLUG;
  if (!projectSlug) {
    return NextResponse.json({ error: "PAKASIR_PROJECT_SLUG is not configured" }, { status: 500 });
  }

  const redirectUrl = `${appUrl}/dashboard/orders/${orderNumber}`;
  const paymentUrl = buildPakasirPaymentUrl({
    projectSlug,
    amount,
    orderId: orderNumber,
    redirectUrl
  });

  const [order] = await db.insert(orders).values({
    buyerId: current.user.id,
    orderNumber,
    status: "pending_payment",
    totalAmount: amount
  }).returning();

  await db.insert(orderItems).values({
    orderId: order.id,
    productId: product.id,
    sellerId: product.sellerId,
    quantity: payload.quantity,
    unitPrice,
    fulfillmentType: product.fulfillmentType,
    deliveryStatus: "pending"
  });

  await db.insert(payments).values({
    orderId: order.id,
    provider: "pakasir",
    providerReference: orderNumber,
    paymentUrl,
    amount,
    status: "pending"
  });

  await logActivity({
    actorId: current.user.id,
    action: "order.created",
    entityType: "order",
    entityId: order.id,
    metadata: { orderNumber, productId: product.id, quantity: payload.quantity, amount }
  });

  return NextResponse.redirect(paymentUrl, { status: 303 });
}
