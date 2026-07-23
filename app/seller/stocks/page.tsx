import { countAvailableStock, listProductsBySellerId, listStocksBySellerId } from "@/lib/products";
import { getCurrentUser } from "@/lib/session-server";
import { findSellerProfileByUserId } from "@/lib/sellers";

export const dynamic = "force-dynamic";

export default async function SellerStocksPage() {
  const current = await getCurrentUser();
  const sellerId = current?.session.role === "seller" ? (await findSellerProfileByUserId(current.user.id))?.id ?? null : null;
  const products = await listProductsBySellerId(sellerId);
  const productsWithStock = await Promise.all(
    products.map(async (product) => ({
      ...product,
      available: await countAvailableStock(product.id)
    }))
  );
  const stocks = await listStocksBySellerId(sellerId);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Stok</h1>
      <p className="mt-2 text-sm text-muted">Tambah stok digital untuk produk auto delivery. Bisa satu JSON, atau banyak JSON per baris.</p>

      <div className="mt-6 space-y-4">
        {productsWithStock.length === 0 ? (
          <div className="rounded-xl2 border border-border p-4 text-sm text-muted">Belum ada produk.</div>
        ) : (
          productsWithStock.map((product) => (
            <article key={product.id} className="rounded-xl2 border border-border p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-semibold">{product.name}</h2>
                  <p className="text-sm text-muted">{product.slug}</p>
                  <p className="mt-2 text-sm text-muted">Stok tersedia: {product.available}</p>
                </div>
                <form className="grid gap-3 md:w-[360px]" method="post" action="/api/seller/stocks">
                  <input type="hidden" name="productId" value={product.id} />
                  <textarea className="min-h-28 rounded-xl border border-border px-4 py-3 text-sm" name="content" placeholder={'{"email":"akun1@mail.com","password":"..."}\n{"email":"akun2@mail.com","password":"..."}'} required />
                  <button className="rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white">Tambah Stok Bulk</button>
                </form>
              </div>
            </article>
          ))
        )}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight">Stok terbaru</h2>
        <p className="mt-2 text-sm text-muted">Disable stok available kalau data salah. Stok sold tidak bisa diubah dari sini.</p>
        <div className="mt-4 space-y-3">
          {stocks.length === 0 ? <div className="rounded-xl2 border border-border p-4 text-sm text-muted">Belum ada stok.</div> : stocks.map((stock) => (
            <article key={stock.id} className="rounded-xl2 border border-border bg-white p-4 shadow-soft">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-semibold">{stock.productName}</p>
                  <p className="mt-1 text-sm text-muted">{stock.status} · {stock.createdAt.toLocaleString("id-ID")}</p>
                  <pre className="mt-3 max-h-40 overflow-auto rounded-xl border border-border bg-surfaceSoft p-3 text-xs leading-5 text-muted">{JSON.stringify(stock.content, null, 2)}</pre>
                </div>
                {stock.status === "available" ? (
                  <form method="post" action="/api/seller/stocks">
                    <input type="hidden" name="action" value="disable" />
                    <input type="hidden" name="stockId" value={stock.id} />
                    <button className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium text-muted">Disable</button>
                  </form>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
