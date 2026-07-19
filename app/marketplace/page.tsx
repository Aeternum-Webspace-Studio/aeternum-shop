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
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Marketplace</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">Produk digital yang tampil tegas.</h1>
            <p className="mt-2 text-sm text-muted">Tempat jual beli produk digital dengan filter kategori dan badge delivery.</p>
          </div>
          <div className="rounded-xl2 border-[3px] border-border bg-white px-4 py-2 text-sm font-black shadow-soft">Search dan filter menyusul</div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.length === 0 ? (
            <div className="rounded-xl2 border-[3px] border-border bg-white p-6 text-sm text-muted shadow-soft">Belum ada produk aktif.</div>
          ) : (
            products.map((product) => (
              <article key={product.id} className="rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{product.fulfillmentType === "auto" ? "Auto Kirim" : "Manual Seller"}</p>
                <h2 className="mt-3 text-lg font-black">{product.name}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{product.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                  {product.categoryName ? <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 font-black">{product.categoryName}</span> : null}
                  <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 font-black">{product.status}</span>
                  {product.resellerPrice ? <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 font-black">Reseller</span> : null}
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-lg font-black">{formatMoney.format(product.price)}</span>
                  <Link className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 text-sm font-black text-primary" href={`/products/${product.slug}`}>
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
