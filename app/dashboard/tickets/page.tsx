import { getCurrentUser } from "@/lib/session-server";
import { listTicketsByBuyerId } from "@/lib/tickets";

export const dynamic = "force-dynamic";

export default async function DashboardTicketsPage() {
  const current = await getCurrentUser();
  const tickets = current ? await listTicketsByBuyerId(current.user.id) : [];

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Ticket</h1>
      <p className="mt-2 text-sm text-muted">Support buyer per order.</p>

      <form className="mt-6 grid gap-3 rounded-xl2 border border-border bg-white p-4 shadow-soft" method="post" action="/api/tickets">
        <label className="text-sm font-semibold">Subjek</label>
        <input name="subject" className="rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm" placeholder="Masalah order / akses / delivery" required />
        <button className="rounded-xl border border-border bg-primary px-4 py-2 text-sm font-semibold text-white">Buat ticket</button>
      </form>

      <div className="mt-6 space-y-3">
        {tickets.length === 0 ? (
          <div className="rounded-xl2 border border-border p-4 text-sm text-muted">Belum ada ticket.</div>
        ) : (
          tickets.map((ticket) => (
            <article key={ticket.id} className="rounded-xl2 border border-border bg-white p-4 shadow-soft">
              <p className="font-semibold">{ticket.subject}</p>
              <p className="mt-1 text-sm text-muted">{ticket.status}{ticket.orderNumber ? ` · ${ticket.orderNumber}` : ""}{ticket.sellerStoreName ? ` · ${ticket.sellerStoreName}` : ""}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
