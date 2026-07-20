import { notFound } from "next/navigation";
import { getOrderItemForSeller } from "@/lib/orders";
import { getCurrentUser } from "@/lib/session-server";
import { findSellerProfileByUserId } from "@/lib/sellers";
import { canAccessSellerItem } from "@/lib/backend-guards.js";

export const dynamic = "force-dynamic";

export default async function SellerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const current = await getCurrentUser();
  if (!current) notFound();

  const { id } = await params;

  const sellerId = current.session.role === "seller" ? (await findSellerProfileByUserId(current.user.id))?.id ?? null : null;
  const item = await getOrderItemForSeller(id, sellerId);
  if (item && !canAccessSellerItem({ isAdmin: current.session.role === "admin", sellerId: item.sellerId, userSellerId: sellerId })) notFound();
  if (!item) notFound();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Detail Pesanan</h1>
      <p className="mt-2 text-sm text-muted">Delivery: {item.deliveryStatus} · Type: {item.fulfillmentType}</p>

      {item.deliveryContent ? (
        <pre className="mt-6 overflow-auto rounded-xl2 border-[3px] border-border bg-surfaceSoft p-4 text-xs text-text shadow-soft">{JSON.stringify(item.deliveryContent, null, 2)}</pre>
      ) : null}

      {item.fulfillmentType === "manual" && item.deliveryStatus !== "delivered" ? (
        <form className="mt-6 grid gap-3 rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft" method="post" action={`/api/seller/orders/${item.id}/deliver`}>
          <label className="text-sm font-black">Isi data produk manual</label>
          <textarea className="min-h-40 rounded-xl border-[3px] border-border bg-surfaceSoft px-4 py-3 text-sm" name="deliveryContent" placeholder='{"email":"","password":"","notes":""}' required />
          <button className="rounded-xl border-[3px] border-border bg-primary px-4 py-3 text-sm font-black text-white shadow-soft">Kirim ke Buyer</button>
        </form>
      ) : null}
    </div>
  );
}
