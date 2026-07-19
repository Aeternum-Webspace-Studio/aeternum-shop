import Link from "next/link";
import { listAdminOrders } from "@/lib/orders";
import { getCurrentUser } from "@/lib/session-server";

export const dynamic = "force-dynamic";

const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default async function AdminOrdersPage() {
  const current = await getCurrentUser();
  if (!current || current.session.role !== "admin") {
    return <div><h1 className="text-3xl font-semibold tracking-tight">Pesanan</h1><p className="mt-2 text-sm text-muted">Admin only.</p></div>;
  }

  const orders = await listAdminOrders();

  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Admin order dashboard</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">Pesanan</h1>
      <p className="mt-2 text-sm text-muted">Semua order, payment, dan status delivery.</p>

      <div className="mt-6 space-y-3">
        {orders.length === 0 ? (
          <div className="rounded-xl2 border-[3px] border-border bg-white p-4 text-sm text-muted shadow-soft">Belum ada order.</div>
        ) : (
          orders.map((order) => (
            <Link key={order.id} href={`/admin/orders/${order.orderNumber}`} className="block rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft hover:bg-surfaceSoft">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-black">{order.orderNumber}</p>
                  <p className="text-sm text-muted">{order.buyerName} · {order.buyerEmail}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="font-black">{formatMoney.format(order.totalAmount)}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted">{order.status} · {order.paymentStatus ?? "-"}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
