import { notFound } from "next/navigation";
import { TicketDetail } from "@/components/ticket-detail";
import { getCurrentUser } from "@/lib/session-server";
import { findSellerProfileByUserId } from "@/lib/sellers";
import { getTicketDetail } from "@/lib/tickets";

export const dynamic = "force-dynamic";

export default async function SellerTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const current = await getCurrentUser();
  if (!current || current.session.role !== "seller") notFound();

  const sellerId = (await findSellerProfileByUserId(current.user.id))?.id ?? null;
  const { id } = await params;
  const detail = await getTicketDetail(id);
  if (!detail || !sellerId || detail.ticket.sellerId !== sellerId) notFound();

  return <TicketDetail ticket={detail.ticket} messages={detail.messages} basePath="seller" />;
}
