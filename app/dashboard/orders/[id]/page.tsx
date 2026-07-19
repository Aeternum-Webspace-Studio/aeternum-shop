import { getOrderDetailByNumber } from "@/lib/orders";
import { getCurrentUser } from "@/lib/session-server";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardOrderDetailPage({ params }: { params: { id: string } }) {
  const current = await getCurrentUser();
  if (!current) notFound();

  const detail = await getOrderDetailByNumber(params.id);
  if (!detail) notFound();

  if (current.session.role !== "admin" && detail.order.buyerId !== current.user.id) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Order {detail.order.orderNumber}</h1>
      <p className="mt-2 text-sm text-muted">Status: {detail.order.status}</p>
      <div className="mt-6 rounded-xl2 border border-border p-4 text-sm text-muted">
        <p>Payment: {detail.payment?.status ?? "-"}</p>
        <p>Total: {detail.order.totalAmount}</p>
      </div>
      <div className="mt-6 space-y-3">
        {detail.items.map((item) => (
          <article key={item.id} className="rounded-xl2 border border-border p-4">
            <p className="text-sm font-medium">Delivery: {item.deliveryStatus}</p>
            {item.deliveryContent ? <pre className="mt-3 overflow-auto rounded-xl bg-surfaceSoft p-3 text-xs text-text">{JSON.stringify(item.deliveryContent, null, 2)}</pre> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
