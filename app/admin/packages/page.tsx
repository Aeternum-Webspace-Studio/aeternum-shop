import { listCustomPackages } from "@/lib/products";

export const dynamic = "force-dynamic";

const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default async function AdminPackagesPage() {
  const packages = await listCustomPackages();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Paket Custom</h1>
      <p className="mt-2 text-sm text-muted">Buat paket custom sebagai produk biasa dengan flag khusus.</p>

      <form className="mt-6 grid gap-3 rounded-xl2 border border-border bg-white p-4 shadow-soft" method="post" action="/api/admin/packages">
        <input className="rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm" name="name" placeholder="Nama paket" required />
        <textarea className="min-h-32 rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm" name="description" placeholder="Deskripsi paket" required />
        <textarea className="min-h-28 rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm" name="instructions" placeholder="Instruksi paket" />
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm" name="price" type="number" placeholder="Harga normal" required />
          <input className="rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm" name="resellerPrice" type="number" placeholder="Harga reseller" />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <select className="rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm" name="fulfillmentType" defaultValue="manual">
            <option value="auto">Auto</option>
            <option value="manual">Manual</option>
          </select>
          <select className="rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm" name="status" defaultValue="draft">
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
        <button className="rounded-xl border border-border bg-primary px-4 py-2 text-sm font-semibold text-white">Simpan paket</button>
      </form>

      <div className="mt-6 space-y-3">
        {packages.length === 0 ? (
          <div className="rounded-xl2 border border-border p-4 text-sm text-muted">Belum ada paket custom.</div>
        ) : (
          packages.map((pkg) => (
            <article key={pkg.id} className="rounded-xl2 border border-border bg-white p-4 shadow-soft">
              <p className="font-semibold">{pkg.name}</p>
              <p className="mt-1 text-sm text-muted">{formatMoney.format(pkg.price)} · {pkg.fulfillmentType} · {pkg.status}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
