import { countAvailableStock, listProductsBySellerId } from "@/lib/products";
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

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Stok</h1>
      <p className="mt-2 text-sm text-muted">Tambah stok digital untuk produk auto delivery.</p>

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
                  <textarea className="min-h-28 rounded-xl border border-border px-4 py-3 text-sm" name="content" placeholder='{"email":"","password":"","notes":""}' required />
                  <button className="rounded-xl bg-primary px-4 py-3 text-sm font-medium text-white">Tambah Stok</button>
                </form>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
