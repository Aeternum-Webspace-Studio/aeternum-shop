import Link from "next/link";
import { getCurrentUser } from "@/lib/session-server";
import { findSellerProfileByUserId } from "@/lib/sellers";
import { listTicketsBySellerId } from "@/lib/tickets";

export const dynamic = "force-dynamic";

export default async function SellerTicketsPage() {
  const current = await getCurrentUser();
  const sellerId = current?.session.role === "seller" ? (await findSellerProfileByUserId(current.user.id))?.id ?? null : null;
  const tickets = await listTicketsBySellerId(sellerId);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Ticket Seller</h1>
      <p className="mt-2 text-sm text-muted">Ticket terkait produk seller.</p>
      <div className="mt-6 space-y-3">
        {tickets.length === 0 ? <div className="rounded-xl2 border border-border p-4 text-sm text-muted">Belum ada ticket.</div> : tickets.map((ticket) => (
          <Link key={ticket.id} href={`/seller/tickets/${ticket.id}`} className="block rounded-xl2 border border-border bg-white p-4 shadow-soft hover:bg-surfaceSoft">
            <p className="font-semibold">{ticket.subject}</p>
            <p className="mt-1 text-sm text-muted">{ticket.status} · {ticket.buyerName}{ticket.orderNumber ? ` · ${ticket.orderNumber}` : ""}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
