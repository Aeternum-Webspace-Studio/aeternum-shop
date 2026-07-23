import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session-server";
import { findSellerProfileByUserId } from "@/lib/sellers";
import { getTicketDetail } from "@/lib/tickets";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const current = await getCurrentUser();
  if (!current) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const detail = await getTicketDetail(id);
  if (!detail) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

  const sellerId = current.session.role === "seller" ? (await findSellerProfileByUserId(current.user.id))?.id ?? null : null;
  const allowed = current.session.role === "admin" || detail.ticket.buyerId === current.user.id || (sellerId && detail.ticket.sellerId === sellerId);
  if (!allowed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    messages: detail.messages.map((message) => ({
      ...message,
      createdAt: message.createdAt.toISOString()
    }))
  });
}
