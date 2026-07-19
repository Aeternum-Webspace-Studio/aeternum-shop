import Link from "next/link";
import { listMarketplaceProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default async function MarketplacePage() {
  const products = await listMarketplaceProducts();

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-text">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Marketplace</h1>
            <p className="mt-2 text-sm text-muted">Tempat jual beli produk digital dengan filter kategori dan badge delivery.</p>
          </div>
          <div className="rounded-full border border-border bg-white px-4 py-2 text-sm text-muted">Search dan filter menyusul</div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.length === 0 ? (
            <div className="rounded-xl2 border border-border bg-white p-6 text-sm text-muted">Belum ada produk aktif.</div>
          ) : (
            products.map((product) => (
              <article key={product.id} className="rounded-xl2 border border-border bg-white p-5 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{product.fulfillmentType === "auto" ? "Auto Kirim" : "Manual Seller"}</p>
                <h2 className="mt-3 text-lg font-semibold">{product.name}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{product.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                  {product.categoryName ? <span className="rounded-full bg-surfaceSoft px-3 py-1">{product.categoryName}</span> : null}
                  <span className="rounded-full bg-surfaceSoft px-3 py-1">{product.status}</span>
                  {product.resellerPrice ? <span className="rounded-full bg-surfaceSoft px-3 py-1">Reseller</span> : null}
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-lg font-semibold">{formatMoney.format(product.price)}</span>
                  <Link className="text-sm font-medium text-primary" href={`/products/${product.slug}`}>
                    Detail
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
