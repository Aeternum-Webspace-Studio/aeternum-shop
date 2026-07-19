import Link from "next/link";
import { listOrderItemsBySellerId } from "@/lib/orders";
import { getCurrentUser } from "@/lib/session-server";
import { findSellerProfileByUserId } from "@/lib/sellers";

export const dynamic = "force-dynamic";

const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default async function SellerOrdersPage() {
  const current = await getCurrentUser();
  const sellerId = current?.session.role === "seller" ? (await findSellerProfileByUserId(current.user.id))?.id ?? null : null;
  const items = await listOrderItemsBySellerId(sellerId);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Pesanan Seller</h1>
      <p className="mt-2 text-sm text-muted">Order produk seller, termasuk manual delivery.</p>
      <div className="mt-6 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-xl2 border-[3px] border-border p-4 text-sm text-muted">Belum ada pesanan.</div>
        ) : (
          items.map((item) => (
            <Link key={item.itemId} href={`/seller/orders/${item.itemId}`} className="block rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft hover:bg-surfaceSoft">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-black">{item.productName}</p>
                  <p className="text-sm text-muted">{item.orderNumber} · {item.fulfillmentType} · {item.deliveryStatus}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-black">{formatMoney.format(item.paymentAmount)}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">{item.orderStatus}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
