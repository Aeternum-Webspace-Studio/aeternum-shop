import Link from "next/link";
import { listAdminTickets } from "@/lib/tickets";
import { listWithdrawalRequests } from "@/lib/wallet";

export const dynamic = "force-dynamic";

export default async function AdminTicketsPage() {
  const tickets = await listAdminTickets();
  const withdrawals = await listWithdrawalRequests();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Ticket</h1>
      <p className="mt-2 text-sm text-muted">Semua ticket buyer dan seller.</p>
      <div className="mt-6 rounded-xl2 border border-border bg-surfaceSoft p-4 shadow-soft">
        <p className="text-xs uppercase tracking-wide text-muted">Withdrawal request</p>
        <p className="mt-2 text-2xl font-semibold">{withdrawals.length}</p>
      </div>
      <div className="mt-6 space-y-3">
        {tickets.length === 0 ? <div className="rounded-xl2 border border-border p-4 text-sm text-muted">Belum ada ticket.</div> : tickets.map((ticket) => (
          <Link key={ticket.id} href={`/admin/tickets/${ticket.id}`} className="block rounded-xl2 border border-border bg-white p-4 shadow-soft hover:bg-surfaceSoft">
            <p className="font-semibold">{ticket.subject}{ticket.subject.toLowerCase().includes("withdrawal") ? " · Withdrawal" : ""}</p>
            <p className="mt-1 text-sm text-muted">{ticket.status} · {ticket.buyerName}{ticket.orderNumber ? ` · ${ticket.orderNumber}` : ""}{ticket.sellerStoreName ? ` · ${ticket.sellerStoreName}` : ""}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
