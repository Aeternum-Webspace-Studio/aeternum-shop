import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addTicketMessage, getTicketDetail } from "@/lib/tickets";
import { getCurrentUser } from "@/lib/session-server";
import { findSellerProfileByUserId } from "@/lib/sellers";
import { logActivity } from "@/lib/activity";

const replySchema = z.object({ message: z.string().min(1).max(2000) });

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const current = await getCurrentUser();
  if (!current) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const detail = await getTicketDetail(id);
  if (!detail) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

  const sellerId = current.session.role === "seller" ? (await findSellerProfileByUserId(current.user.id))?.id ?? null : null;
  const allowed = current.session.role === "admin" || detail.ticket.buyerId === current.user.id || (sellerId && detail.ticket.sellerId === sellerId);
  if (!allowed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const payload = replySchema.parse({ message: form.get("message") });
  await addTicketMessage(id, current.user.id, payload.message);
  await logActivity({ actorId: current.user.id, action: "ticket.replied", entityType: "ticket", entityId: id, metadata: { role: current.session.role } });

  const prefix = current.session.role === "admin" ? "/admin" : current.session.role === "seller" ? "/seller" : "/dashboard";
  return NextResponse.redirect(new URL(`${prefix}/tickets/${id}`, request.url), { status: 303 });
}
