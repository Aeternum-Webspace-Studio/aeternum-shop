import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/session-server";
import { updateMarketplaceSettings } from "@/lib/sellers";
import { logActivity } from "@/lib/activity";

const settingsSchema = z.object({
  appName: z.string().min(2).max(80),
  supportEmail: z.string().email().optional(),
  announcement: z.string().max(500).optional(),
  checkoutEnabled: z.coerce.boolean().default(true)
});

export async function POST(request: NextRequest) {
  const current = await getCurrentUser();
  if (!current || current.session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const payload = settingsSchema.parse({
    appName: form.get("appName"),
    supportEmail: form.get("supportEmail") || undefined,
    announcement: form.get("announcement") || undefined,
    checkoutEnabled: form.get("checkoutEnabled") === "on"
  });

  const settings = await updateMarketplaceSettings({
    appName: payload.appName,
    supportEmail: payload.supportEmail ?? null,
    announcement: payload.announcement ?? null,
    checkoutEnabled: payload.checkoutEnabled
  });

  await logActivity({ actorId: current.user.id, action: "admin.settings_updated", entityType: "marketplace_settings", entityId: settings?.id ?? current.user.id, metadata: { appName: payload.appName, checkoutEnabled: payload.checkoutEnabled } });
  return NextResponse.redirect(new URL("/admin/settings?updated=1", request.url), { status: 303 });
}
