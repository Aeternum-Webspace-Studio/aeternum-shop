import Link from "next/link";
import { listCategories, listMarketplaceProducts } from "@/lib/products";
import { productPriceForUser } from "@/lib/pricing.js";
import { getReviewSummaryByProductId } from "@/lib/reviews";
import { getCurrentUser } from "@/lib/session-server";
import { getMarketplaceSettings } from "@/lib/sellers";

export const dynamic = "force-dynamic";

const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default async function MarketplacePage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const q = params.q ?? "";
  const category = params.category ?? "";
  const current = await getCurrentUser();
  const settings = await getMarketplaceSettings();
  const [products, categories] = await Promise.all([listMarketplaceProducts(q, category), listCategories()]);
  const productsWithReviews = await Promise.all(
    products.map(async (product) => ({
      ...product,
      reviewSummary: await getReviewSummaryByProductId(product.id)
    }))
  );

  return (
    <main className="aeternum-bg min-h-screen px-6 py-10 text-text">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Marketplace</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">Cari produk digital yang siap dipakai.</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted">Bandingkan produk dari harga, kategori, cara akses, dan ulasan sebelum membeli.</p>
          </div>
          <div className="floaty rounded-xl2 border-[3px] border-border bg-white px-4 py-2 text-sm font-black shadow-soft">Akses Cepat · Order Jelas</div>
        </div>

        {settings?.checkoutEnabled === false ? (
          <div className="mt-4 rounded-xl2 border-[3px] border-border bg-surfaceSoft p-4 text-sm font-semibold text-muted shadow-soft">Checkout sedang dinonaktifkan admin untuk sementara.</div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.slice(0, 6).map((item) => (
            <Link key={item.slug} href={`/marketplace?category=${item.slug}`} className={`lift rounded-full border-[2px] border-border px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] shadow-soft ${category === item.slug ? "bg-primary text-white" : "bg-white text-text"}`}>
              {item.name}
            </Link>
          ))}
        </div>

        <form className="reveal-up mt-6 flex flex-col gap-3 rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft md:flex-row" action="/marketplace">
          <input name="q" defaultValue={q} className="min-h-12 flex-1 rounded-xl border-[2px] border-border bg-surfaceSoft px-4 text-sm font-semibold outline-none" placeholder="Cari ChatGPT, Netflix, Canva, lisensi..." />
          {category ? <input type="hidden" name="category" value={category} /> : null}
          <button className="lift shine rounded-xl border-[2px] border-border bg-primary px-5 py-3 text-sm font-black text-white shadow-soft">Cari Produk</button>
          {q || category ? <Link className="lift rounded-xl border-[2px] border-border bg-white px-5 py-3 text-center text-sm font-black" href="/marketplace">Reset</Link> : null}
        </form>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {productsWithReviews.length === 0 ? (
            <div className="rounded-xl2 border-[3px] border-border bg-white p-6 text-sm text-muted shadow-soft">{q || category ? "Produk tidak ditemukan." : "Belum ada produk aktif."}</div>
          ) : (
            productsWithReviews.map((product) => (
              <article key={product.id} className="lift hero-card rounded-xl2 border-[3px] border-border p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <p className="rounded-full border-[2px] border-border bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-primary">{product.fulfillmentType === "auto" ? "Akses cepat" : "Diproses"}</p>
                  <p className="rounded-full border-[2px] border-border bg-primary px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-white">
                    {product.reviewSummary.count === 0 ? "Baru" : `${product.reviewSummary.average.toFixed(1)}/5`}
                  </p>
                </div>
                <h2 className="mt-4 text-xl font-black leading-tight">{product.name}</h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{product.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                  {product.categoryName ? <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 font-black">{product.categoryName}</span> : null}
                  <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 font-black">Status aktif</span>
                  <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 font-black">{product.reviewSummary.count} review</span>
                  {productPriceForUser(product, current?.user) !== product.price ? <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 font-black">Harga reseller aktif</span> : product.resellerPrice ? <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 font-black">Harga khusus tersedia</span> : null}
                </div>
                <div className="mt-5 flex items-center justify-between border-t-[2px] border-border pt-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted">Mulai dari</p>
                    <span className="text-xl font-black">{formatMoney.format(productPriceForUser(product, current?.user))}</span>
                  </div>
                  <Link className="lift rounded-full border-[2px] border-border bg-primary px-4 py-2 text-sm font-black text-white" href={`/products/${product.slug}`}>
                    Lihat detail
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
