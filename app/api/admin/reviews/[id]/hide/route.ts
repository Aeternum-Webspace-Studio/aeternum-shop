import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/session-server";
import { hideReview } from "@/lib/reviews";

const schema = z.object({ hidden: z.coerce.boolean() });

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const current = await getCurrentUser();
  if (!current || current.session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const form = await request.formData();
  const payload = schema.parse({ hidden: form.get("hidden") });
  await hideReview(id, payload.hidden);

  return NextResponse.redirect(new URL("/admin/reviews", request.url), { status: 303 });
}
