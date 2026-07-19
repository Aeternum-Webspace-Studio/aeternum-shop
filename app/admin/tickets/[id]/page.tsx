import { notFound } from "next/navigation";
import { TicketDetail } from "@/components/ticket-detail";
import { getCurrentUser } from "@/lib/session-server";
import { getTicketDetail } from "@/lib/tickets";

export const dynamic = "force-dynamic";

export default async function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const current = await getCurrentUser();
  if (!current || current.session.role !== "admin") notFound();

  const { id } = await params;
  const detail = await getTicketDetail(id);
  if (!detail) notFound();

  return <TicketDetail ticket={detail.ticket} messages={detail.messages} basePath="admin" />;
}
