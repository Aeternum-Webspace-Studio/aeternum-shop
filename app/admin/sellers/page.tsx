import { listSellerProfiles } from "@/lib/sellers";

export const dynamic = "force-dynamic";

export default async function AdminSellersPage() {
  const sellers = await listSellerProfiles();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Seller</h1>
      <p className="mt-2 text-sm text-muted">Daftar toko seller.</p>
      <div className="mt-6 space-y-3">
        {sellers.length === 0 ? <div className="rounded-xl2 border border-border p-4 text-sm text-muted">Belum ada seller.</div> : sellers.map((seller) => (
          <article key={seller.id} className="rounded-xl2 border border-border bg-white p-4 shadow-soft">
            <p className="font-semibold">{seller.storeName}</p>
            <p className="mt-1 text-sm text-muted">/{seller.storeSlug} · {seller.status}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <form method="post" action={`/api/admin/sellers/${seller.id}`}>
                <input type="hidden" name="status" value="approved" />
                <button className="rounded-xl border border-border bg-primary px-3 py-2 text-xs font-black text-white">Approve</button>
              </form>
              <form method="post" action={`/api/admin/sellers/${seller.id}`}>
                <input type="hidden" name="status" value="suspended" />
                <button className="rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-xs font-black">Suspend</button>
              </form>
              <form method="post" action={`/api/admin/sellers/${seller.id}`}>
                <input type="hidden" name="status" value="rejected" />
                <button className="rounded-xl border border-border bg-white px-3 py-2 text-xs font-black">Reject</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
