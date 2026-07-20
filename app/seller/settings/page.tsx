import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session-server";
import { findSellerProfileByUserId } from "@/lib/sellers";

export const dynamic = "force-dynamic";

export default async function SellerSettingsPage({ searchParams }: { searchParams: Promise<{ error?: string; updated?: string }> }) {
  const current = await getCurrentUser();
  if (!current || current.session.role !== "seller") notFound();

  const profile = await findSellerProfileByUserId(current.user.id);
  if (!profile) notFound();

  const params = await searchParams;

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Pengaturan seller</h1>
      <p className="mt-2 text-sm text-muted">Update identitas toko yang tampil di dashboard dan admin.</p>

      {params.updated ? <div className="mt-4 rounded-xl border border-border bg-surfaceSoft p-3 text-sm font-semibold">Pengaturan tersimpan.</div> : null}
      {params.error === "slug" ? <div className="mt-4 rounded-xl border border-border bg-white p-3 text-sm font-semibold text-primary">Slug toko sudah dipakai seller lain.</div> : null}

      <form className="mt-6 grid gap-4 rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft" method="post" action="/api/seller/settings">
        <label className="grid gap-2 text-sm font-black">
          Nama toko
          <input className="rounded-xl border-[2px] border-border bg-surfaceSoft px-4 py-3 text-sm" name="storeName" defaultValue={profile.storeName} required />
        </label>
        <label className="grid gap-2 text-sm font-black">
          Slug toko
          <input className="rounded-xl border-[2px] border-border bg-surfaceSoft px-4 py-3 text-sm" name="storeSlug" defaultValue={profile.storeSlug} required />
        </label>
        <label className="grid gap-2 text-sm font-black">
          Deskripsi
          <textarea className="min-h-32 rounded-xl border-[2px] border-border bg-surfaceSoft px-4 py-3 text-sm" name="description" defaultValue={profile.description ?? ""} />
        </label>
        <button className="rounded-xl border-[3px] border-border bg-primary px-4 py-3 text-sm font-black text-white shadow-soft">Simpan pengaturan</button>
      </form>
    </div>
  );
}
