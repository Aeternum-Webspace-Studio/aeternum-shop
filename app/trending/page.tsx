import Link from "next/link";
import { listMarketplaceProducts } from "@/lib/products";
import { getReviewSummaryByProductId } from "@/lib/reviews";

export const dynamic = "force-dynamic";

const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default async function TrendingPage() {
  const products = await listMarketplaceProducts();
  const rows = await Promise.all(products.map(async (product) => ({ ...product, reviewSummary: await getReviewSummaryByProductId(product.id) })));

  return (
    <main className="aeternum-bg min-h-screen px-6 py-10 text-text">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Trending sekarang</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">Produk terbaru dan paling relevan</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">Halaman ini menampilkan produk aktif terbaru, termasuk produk manual yang ditambah admin atau seller selama statusnya aktif.</p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rows.length === 0 ? (
            <div className="rounded-xl2 border-[3px] border-border bg-white p-5 text-sm text-muted shadow-soft">Belum ada produk aktif.</div>
          ) : rows.map((product) => (
            <article key={product.id} className="lift hero-card rounded-xl2 border-[3px] border-border p-5 shadow-soft">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{product.fulfillmentType === "auto" ? "Akses cepat" : "Diproses sesuai pesanan"}</p>
              <h2 className="mt-3 text-xl font-black">{product.name}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-muted">{product.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                {product.categoryName ? <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 font-black">{product.categoryName}</span> : null}
                <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 font-black">{product.reviewSummary.count} review</span>
                {product.isCustomPackage ? <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 font-black">Custom package</span> : null}
              </div>
              <div className="mt-5 flex items-center justify-between border-t-[2px] border-border pt-4">
                <span className="text-lg font-black">{formatMoney.format(product.price)}</span>
                <Link className="rounded-full border-[2px] border-border bg-primary px-3 py-1 text-sm font-black text-white" href={`/products/${product.slug}`}>
                  Lihat detail
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
