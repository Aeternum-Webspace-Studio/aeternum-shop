import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const db = getDb();
  const rows = await db.select().from(products).orderBy(desc(products.createdAt));

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Produk</h1>
      <p className="mt-2 text-sm text-muted">Daftar produk marketplace. Admin bisa tambah produk langsung dari sini.</p>

      <form className="mt-6 grid gap-3 rounded-xl2 border border-border bg-white p-4 shadow-soft" method="post" action="/api/seller/products">
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm" name="name" placeholder="Nama produk" required />
          <input className="rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm" name="price" type="number" placeholder="Harga" required />
        </div>
        <textarea className="min-h-28 rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm" name="description" placeholder="Deskripsi produk" required />
        <textarea className="min-h-24 rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm" name="instructions" placeholder="Instruksi produk" />
        <div className="grid gap-3 md:grid-cols-3">
          <select className="rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm" name="fulfillmentType" defaultValue="manual">
            <option value="auto">Auto</option>
            <option value="manual">Manual</option>
          </select>
          <select className="rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm" name="status" defaultValue="active">
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>
          <label className="flex items-center gap-2 rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm font-semibold">
            <input type="checkbox" name="isCustomPackage" /> Custom package
          </label>
        </div>
        <button className="rounded-xl border border-border bg-primary px-4 py-2 text-sm font-semibold text-white">Tambah produk</button>
      </form>

      <div className="mt-6 space-y-3">
        {rows.length === 0 ? <div className="rounded-xl2 border border-border p-4 text-sm text-muted">Belum ada produk.</div> : rows.map((product) => (
          <article key={product.id} className="rounded-xl2 border border-border bg-white p-4 shadow-soft">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="mt-1 text-sm text-muted">{product.slug} · {product.fulfillmentType} · {product.status}</p>
              </div>
              <Link href={`/seller/products/${product.id}`} className="rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm font-semibold">
                Edit
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
