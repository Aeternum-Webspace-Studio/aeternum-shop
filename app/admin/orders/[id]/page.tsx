import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session-server";
import { getOrderDetailByNumber } from "@/lib/orders";

export const dynamic = "force-dynamic";

const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const current = await getCurrentUser();
  if (!current || current.session.role !== "admin") notFound();

  const { id } = await params;

  const detail = await getOrderDetailByNumber(id);
  if (!detail) notFound();

  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Admin order</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">{detail.order.orderNumber}</h1>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Status</p>
          <p className="mt-2 text-sm text-muted">{detail.order.status}</p>
        </div>
        <div className="rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Payment</p>
          <p className="mt-2 text-sm text-muted">{detail.payment?.status ?? "-"}</p>
        </div>
        <div className="rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Total</p>
          <p className="mt-2 text-sm text-muted">{formatMoney.format(detail.order.totalAmount)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {detail.order.status === "pending_payment" ? (
          <form className="rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft" method="post" action={`/api/admin/orders/${detail.order.orderNumber}/status`}>
            <input type="hidden" name="action" value="cancel" />
            <p className="text-sm font-black">Cancel unpaid order</p>
            <p className="mt-1 text-xs text-muted">Dipakai untuk order pending payment yang tidak jadi dibayar.</p>
            <button className="mt-4 rounded-xl border-[3px] border-border bg-surfaceSoft px-4 py-2 text-sm font-black">Cancel</button>
          </form>
        ) : null}

        {detail.payment?.status === "paid" || detail.order.status === "paid" || detail.order.status === "delivered" ? (
          <form className="rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft" method="post" action={`/api/admin/orders/${detail.order.orderNumber}/status`}>
            <input type="hidden" name="action" value="refund" />
            <p className="text-sm font-black">Refund paid order</p>
            <p className="mt-1 text-xs text-muted">Pakai setelah payment sukses bila order perlu dibatalkan dan dikembalikan.</p>
            <button className="mt-4 rounded-xl border-[3px] border-border bg-primary px-4 py-2 text-sm font-black text-white">Refund</button>
          </form>
        ) : null}

        {detail.order.status === "paid" || detail.order.status === "processing" ? (
          <form className="rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft" method="post" action={`/api/admin/orders/${detail.order.orderNumber}/status`}>
            <input type="hidden" name="action" value="fail" />
            <p className="text-sm font-black">Mark as failed</p>
            <p className="mt-1 text-xs text-muted">Untuk status order/payment yang gagal diproses.</p>
            <button className="mt-4 rounded-xl border-[3px] border-border bg-white px-4 py-2 text-sm font-black">Fail</button>
          </form>
        ) : null}
      </div>

      <div className="mt-6 space-y-3">
        {detail.items.map((item) => (
          <article key={item.id} className="rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
            <p className="text-sm font-black">{item.productName}</p>
            <p className="mt-1 text-sm text-muted">{item.fulfillmentType} · {item.deliveryStatus}</p>
            {item.deliveryContent ? <pre className="mt-3 overflow-auto rounded-xl border-[2px] border-border bg-surfaceSoft p-3 text-xs">{JSON.stringify(item.deliveryContent, null, 2)}</pre> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
