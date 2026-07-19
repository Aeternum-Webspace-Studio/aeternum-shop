import { notFound } from "next/navigation";
import { TicketDetail } from "@/components/ticket-detail";
import { getCurrentUser } from "@/lib/session-server";
import { getTicketDetail } from "@/lib/tickets";

export const dynamic = "force-dynamic";

export default async function DashboardTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const current = await getCurrentUser();
  if (!current) notFound();

  const { id } = await params;
  const detail = await getTicketDetail(id);
  if (!detail || detail.ticket.buyerId !== current.user.id) notFound();

  return <TicketDetail ticket={detail.ticket} messages={detail.messages} basePath="dashboard" />;
}
