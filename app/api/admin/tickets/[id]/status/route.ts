import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/session-server";
import { updateTicketStatus } from "@/lib/tickets";

const statusSchema = z.object({ status: z.enum(["open", "pending", "closed"]) });

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const current = await getCurrentUser();
  if (!current || current.session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const form = await request.formData();
  const payload = statusSchema.parse({ status: form.get("status") });
  await updateTicketStatus(id, payload.status);

  return NextResponse.redirect(new URL(`/admin/tickets/${id}`, request.url), { status: 303 });
}
