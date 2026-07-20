import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/session-server";
import { findSellerProfileByUserId } from "@/lib/sellers";

export const dynamic = "force-dynamic";

export default async function DashboardProfilePage({ searchParams }: { searchParams: Promise<{ seller?: string }> }) {
  const current = await getCurrentUser();
  if (!current) notFound();

  const sellerProfile = current.session.role === "seller" ? await findSellerProfileByUserId(current.user.id) : null;
  const params = await searchParams;

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Profil</h1>
      <p className="mt-2 text-sm text-muted">Akun pembeli, status seller, dan identitas toko.</p>

      {params.seller === "applied" ? <div className="mt-4 rounded-xl border border-border bg-surfaceSoft p-3 text-sm font-semibold">Pengajuan seller berhasil dikirim.</div> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Akun</p>
          <p className="mt-2 font-black">{current.user.name}</p>
          <p className="mt-1 text-sm text-muted">{current.user.email}</p>
          <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-muted">Role: {current.session.role}</p>
        </div>

        <div className="rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Status seller</p>
          {sellerProfile ? (
            <>
              <p className="mt-2 font-black">{sellerProfile.storeName}</p>
              <p className="mt-1 text-sm text-muted">/{sellerProfile.storeSlug}</p>
              <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-muted">{sellerProfile.status}</p>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted">Belum ada pengajuan seller.</p>
          )}
        </div>
      </div>

      {current.session.role !== "seller" ? (
        <form className="mt-6 grid gap-4 rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft" method="post" action="/api/seller/apply">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Daftar seller</p>
            <h2 className="mt-2 text-xl font-black">Ajukan toko seller</h2>
            <p className="mt-1 text-sm text-muted">Status awal akan pending sampai admin approve.</p>
          </div>
          <label className="grid gap-2 text-sm font-black">
            Nama toko
            <input className="rounded-xl border-[2px] border-border bg-surfaceSoft px-4 py-3 text-sm" name="storeName" placeholder="Nama toko" required />
          </label>
          <label className="grid gap-2 text-sm font-black">
            Slug toko
            <input className="rounded-xl border-[2px] border-border bg-surfaceSoft px-4 py-3 text-sm" name="storeSlug" placeholder="slug-toko" required />
          </label>
          <label className="grid gap-2 text-sm font-black">
            Deskripsi
            <textarea className="min-h-32 rounded-xl border-[2px] border-border bg-surfaceSoft px-4 py-3 text-sm" name="description" placeholder="Jelaskan singkat toko yang akan dijual" />
          </label>
          <button className="rounded-xl border-[3px] border-border bg-primary px-4 py-3 text-sm font-black text-white shadow-soft">Kirim pengajuan seller</button>
        </form>
      ) : null}
    </div>
  );
}
