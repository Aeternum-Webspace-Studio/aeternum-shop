import Link from "next/link";
import { listMarketplaceProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default async function MarketplacePage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const q = (await searchParams).q ?? "";
  const products = await listMarketplaceProducts(q);
  const categories = [...new Set(products.map((product) => product.categoryName).filter((category): category is string => Boolean(category)))];

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

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.slice(0, 4).map((category) => (
            <span key={category} className="lift rounded-full border-[2px] border-border bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-text shadow-soft">
              {category}
            </span>
          ))}
        </div>

        <form className="reveal-up mt-6 flex flex-col gap-3 rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft md:flex-row" action="/marketplace">
          <input name="q" defaultValue={q} className="min-h-12 flex-1 rounded-xl border-[2px] border-border bg-surfaceSoft px-4 text-sm font-semibold outline-none" placeholder="Cari ChatGPT, Netflix, Canva, lisensi..." />
          <button className="lift shine rounded-xl border-[2px] border-border bg-primary px-5 py-3 text-sm font-black text-white shadow-soft">Cari Produk</button>
          {q ? <Link className="lift rounded-xl border-[2px] border-border bg-white px-5 py-3 text-center text-sm font-black" href="/marketplace">Reset</Link> : null}
        </form>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {products.length === 0 ? (
            <div className="rounded-xl2 border-[3px] border-border bg-white p-6 text-sm text-muted shadow-soft">{q ? "Produk tidak ditemukan." : "Belum ada produk aktif."}</div>
          ) : (
            products.map((product) => (
              <article key={product.id} className="lift rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{product.fulfillmentType === "auto" ? "Akses cepat" : "Diproses sesuai pesanan"}</p>
                <h2 className="mt-3 text-lg font-black">{product.name}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{product.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                  {product.categoryName ? <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 font-black">{product.categoryName}</span> : null}
                  <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 font-black">{product.status}</span>
                  {product.resellerPrice ? <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 font-black">Harga khusus tersedia</span> : null}
                </div>
                <div className="mt-5 flex items-center justify-between border-t-[2px] border-border pt-4">
                  <span className="text-lg font-black">{formatMoney.format(product.price)}</span>
                  <Link className="lift rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 text-sm font-black text-primary" href={`/products/${product.slug}`}>
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
