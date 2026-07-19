import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/session-server";
import { hideReview } from "@/lib/reviews";
import { logActivity } from "@/lib/activity";

const schema = z.object({ hidden: z.coerce.boolean() });

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const current = await getCurrentUser();
  if (!current || current.session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const form = await request.formData();
  const payload = schema.parse({ hidden: form.get("hidden") });
  await hideReview(id, payload.hidden);
  await logActivity({ actorId: current.user.id, action: payload.hidden ? "review.hidden" : "review.unhidden", entityType: "review", entityId: id });

  return NextResponse.redirect(new URL("/admin/reviews", request.url), { status: 303 });
}
