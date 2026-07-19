import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders, payments, users } from "@/db/schema";

export const dynamic = "force-dynamic";

const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default async function AdminPaymentsPage() {
  const db = getDb();
  const rows = await db
    .select({
      id: payments.id,
      status: payments.status,
      amount: payments.amount,
      providerReference: payments.providerReference,
      createdAt: payments.createdAt,
      orderNumber: orders.orderNumber,
      buyerName: users.name
    })
    .from(payments)
    .innerJoin(orders, eq(payments.orderId, orders.id))
    .innerJoin(users, eq(orders.buyerId, users.id))
    .orderBy(desc(payments.createdAt));

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Payment</h1>
      <p className="mt-2 text-sm text-muted">Log payment Pakasir.</p>
      <div className="mt-6 space-y-3">
        {rows.length === 0 ? <div className="rounded-xl2 border border-border p-4 text-sm text-muted">Belum ada payment.</div> : rows.map((payment) => (
          <article key={payment.id} className="rounded-xl2 border border-border bg-white p-4 shadow-soft">
            <p className="font-semibold">{payment.orderNumber}</p>
            <p className="mt-1 text-sm text-muted">{payment.buyerName} · {payment.status} · {formatMoney.format(payment.amount)}</p>
            <p className="mt-1 text-xs text-muted">{payment.providerReference}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
