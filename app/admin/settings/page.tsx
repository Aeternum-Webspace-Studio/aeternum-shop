import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session-server";
import { getMarketplaceSettings } from "@/lib/sellers";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({ searchParams }: { searchParams: Promise<{ updated?: string }> }) {
  const current = await getCurrentUser();
  if (!current || current.session.role !== "admin") notFound();

  const settings = await getMarketplaceSettings();
  const params = await searchParams;

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Pengaturan admin</h1>
      <p className="mt-2 text-sm text-muted">Konfigurasi operasional marketplace.</p>

      {params.updated ? <div className="mt-4 rounded-xl border border-border bg-surfaceSoft p-3 text-sm font-semibold">Pengaturan tersimpan.</div> : null}

      <form className="mt-6 grid gap-4 rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft" method="post" action="/api/admin/settings">
        <label className="grid gap-2 text-sm font-black">
          Nama aplikasi
          <input className="rounded-xl border-[2px] border-border bg-surfaceSoft px-4 py-3 text-sm" name="appName" defaultValue={settings?.appName ?? "Aeternum Shop"} required />
        </label>
        <label className="grid gap-2 text-sm font-black">
          Support email
          <input className="rounded-xl border-[2px] border-border bg-surfaceSoft px-4 py-3 text-sm" name="supportEmail" type="email" defaultValue={settings?.supportEmail ?? ""} placeholder="support@aeternum.biz.id" />
        </label>
        <label className="grid gap-2 text-sm font-black">
          Announcement
          <textarea className="min-h-32 rounded-xl border-[2px] border-border bg-surfaceSoft px-4 py-3 text-sm" name="announcement" defaultValue={settings?.announcement ?? ""} placeholder="Pesan promo atau info operasional singkat" />
        </label>
        <label className="flex items-center gap-3 text-sm font-black">
          <input type="checkbox" name="checkoutEnabled" defaultChecked={settings?.checkoutEnabled ?? true} />
          Checkout aktif
        </label>
        <button className="rounded-xl border-[3px] border-border bg-primary px-4 py-3 text-sm font-black text-white shadow-soft">Simpan pengaturan</button>
      </form>
    </div>
  );
}
