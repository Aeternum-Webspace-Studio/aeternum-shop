import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orders, paymentEvents, payments, users } from "@/db/schema";

export const dynamic = "force-dynamic";

const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default async function AdminPaymentsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string; event?: string }>;
}) {
  const params = await searchParams;
  const q = (params.q ?? "").trim().toLowerCase();
  const status = params.status ?? "";
  const eventType = (params.event ?? "").trim().toLowerCase();
  const db = getDb();
  const rows = (await db
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
    .orderBy(desc(payments.createdAt)))
    .filter((payment) => (!status || payment.status === status) && (!q || payment.orderNumber.toLowerCase().includes(q) || payment.buyerName.toLowerCase().includes(q) || (payment.providerReference ?? "").toLowerCase().includes(q)));
  const events = (await db
    .select({
      id: paymentEvents.id,
      eventType: paymentEvents.eventType,
      provider: paymentEvents.provider,
      payload: paymentEvents.payload,
      createdAt: paymentEvents.createdAt,
      orderNumber: orders.orderNumber,
      paymentStatus: payments.status
    })
    .from(paymentEvents)
    .leftJoin(payments, eq(paymentEvents.paymentId, payments.id))
    .leftJoin(orders, eq(payments.orderId, orders.id))
    .orderBy(desc(paymentEvents.createdAt)))
    .filter((event) => (!eventType || (event.eventType ?? "").toLowerCase().includes(eventType)) && (!q || (event.orderNumber ?? "").toLowerCase().includes(q)));

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Payment</h1>
      <p className="mt-2 text-sm text-muted">Log payment Pakasir.</p>
      <p className="mt-2 text-xs text-muted">{rows.length} payment · {events.length} callback</p>
      <form className="mt-6 grid gap-3 rounded-xl2 border border-border bg-white p-4 shadow-soft md:grid-cols-[1fr_180px_180px_auto]" action="/admin/payments">
        <input className="rounded-xl border border-border px-4 py-3 text-sm" name="q" defaultValue={params.q ?? ""} placeholder="Cari invoice, buyer, reference" />
        <select className="rounded-xl border border-border px-4 py-3 text-sm" name="status" defaultValue={status}>
          <option value="">Semua status</option>
          <option value="pending">pending</option>
          <option value="paid">paid</option>
          <option value="failed">failed</option>
          <option value="expired">expired</option>
          <option value="refunded">refunded</option>
        </select>
        <input className="rounded-xl border border-border px-4 py-3 text-sm" name="event" defaultValue={params.event ?? ""} placeholder="Event webhook" />
        <button className="rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white">Filter</button>
      </form>
      <div className="mt-6 space-y-3">
        {rows.length === 0 ? <div className="rounded-xl2 border border-border p-4 text-sm text-muted">Belum ada payment.</div> : rows.map((payment) => (
            <article key={payment.id} className="rounded-xl2 border border-border bg-white p-4 shadow-soft">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold">{payment.orderNumber}</p>
                <p className="mt-1 text-sm text-muted">{payment.buyerName} · {payment.status} · {formatMoney.format(payment.amount)}</p>
                <p className="mt-1 text-xs text-muted">{payment.providerReference}</p>
              </div>
              <Link className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium" href={`/admin/orders/${payment.orderNumber}`}>Buka order</Link>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Callback Pakasir</h2>
        <p className="mt-2 text-sm text-muted">Raw webhook payload untuk audit dan debugging payment.</p>
        <div className="mt-4 space-y-3">
          {events.length === 0 ? <div className="rounded-xl2 border border-border p-4 text-sm text-muted">Belum ada callback.</div> : events.map((event) => (
            <article key={event.id} className="rounded-xl2 border border-border bg-white p-4 shadow-soft">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <p className="font-semibold">{event.orderNumber ?? "Payment tanpa order"}</p>
                <p className="text-xs text-muted">{event.createdAt.toLocaleString("id-ID")}</p>
              </div>
              <p className="mt-1 text-sm text-muted">{event.provider} · {event.eventType ?? "unknown"} · payment {event.paymentStatus ?? "unknown"}</p>
              <details className="mt-3 rounded-xl border border-border bg-surfaceSoft p-3">
                <summary className="cursor-pointer text-xs font-medium text-muted">Raw payload</summary>
                <pre className="mt-3 max-h-72 overflow-auto text-xs leading-5 text-muted">{JSON.stringify(event.payload, null, 2)}</pre>
              </details>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
