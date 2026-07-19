import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { products } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const db = getDb();
  const rows = await db.select().from(products).orderBy(desc(products.createdAt));

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Produk</h1>
      <p className="mt-2 text-sm text-muted">Daftar produk marketplace.</p>
      <div className="mt-6 space-y-3">
        {rows.length === 0 ? <div className="rounded-xl2 border border-border p-4 text-sm text-muted">Belum ada produk.</div> : rows.map((product) => (
          <article key={product.id} className="rounded-xl2 border border-border bg-white p-4 shadow-soft">
            <p className="font-semibold">{product.name}</p>
            <p className="mt-1 text-sm text-muted">{product.slug} · {product.fulfillmentType} · {product.status}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
