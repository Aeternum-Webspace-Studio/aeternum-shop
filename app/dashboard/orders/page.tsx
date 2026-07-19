import Link from "next/link";
import { listOrdersByBuyerId } from "@/lib/orders";
import { getCurrentUser } from "@/lib/session-server";

export const dynamic = "force-dynamic";

const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default async function DashboardOrdersPage() {
  const current = await getCurrentUser();
  const orders = current ? await listOrdersByBuyerId(current.user.id) : [];

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Pesanan</h1>
      <p className="mt-2 text-sm text-muted">Daftar pesanan buyer.</p>
      <div className="mt-6 space-y-3">
        {orders.length === 0 ? (
          <div className="rounded-xl2 border border-border p-4 text-sm text-muted">Belum ada pesanan.</div>
        ) : (
          orders.map((order) => (
            <Link key={order.id} href={`/dashboard/orders/${order.orderNumber}`} className="block rounded-xl2 border border-border p-4 hover:bg-surfaceSoft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">{order.orderNumber}</p>
                  <p className="text-sm text-muted">{order.status}</p>
                </div>
                <p className="font-semibold">{formatMoney.format(order.totalAmount)}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
