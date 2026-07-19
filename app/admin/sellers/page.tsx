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
          </article>
        ))}
      </div>
    </div>
  );
}
