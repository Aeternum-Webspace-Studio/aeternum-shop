import { NextResponse } from "next/server";
import { getBuyerStats } from "@/lib/buyer-stats";
import { getCurrentUser } from "@/lib/session-server";

export async function GET() {
  const current = await getCurrentUser();
  if (!current) return NextResponse.json({ stats: null });

  return NextResponse.json({ stats: await getBuyerStats(current.user.id) });
}
