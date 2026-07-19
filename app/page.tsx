const categories = ["AI", "Streaming", "Tools", "Design", "Lisensi", "Bundle"];
const products = [
  {
    name: "ChatGPT Pro Share",
    tag: "Auto Kirim",
    price: "Rp 49.000",
    meta: "Rating 4.9 • 312 terjual"
  },
  {
    name: "CapCut Premium",
    tag: "Manual Seller",
    price: "Rp 35.000",
    meta: "Rating 4.8 • 180 terjual"
  },
  {
    name: "Netflix Premium",
    tag: "Stok Ready",
    price: "Rp 59.000",
    meta: "Rating 4.7 • 249 terjual"
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-text">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-semibold text-primary">Aeternum Shop</p>
            <p className="text-xs text-muted">Marketplace produk digital</p>
          </div>
          <nav className="hidden gap-6 text-sm text-muted md:flex">
            <a href="/marketplace">Marketplace</a>
            <a href="/blog">Blog</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/seller">Seller</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted shadow-soft">
              Auto delivery, manual seller, reseller price
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
              Marketplace produk digital yang cepat, jelas, dan terpercaya.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted md:text-lg">
              Beli akun digital, lisensi, dan bundle produk dengan pembayaran Pakasir, dashboard rapi, dan delivery otomatis atau manual.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-white shadow-soft" href="/marketplace">
                Mulai Belanja
              </a>
              <a className="rounded-full border border-border bg-white px-5 py-3 text-sm font-medium text-text" href="/seller">
                Jadi Seller
              </a>
            </div>
          </div>

          <div className="rounded-xl2 border border-border bg-white p-6 shadow-soft">
            <p className="text-sm font-medium text-muted">Cari produk cepat</p>
            <div className="mt-3 rounded-full border border-border bg-surfaceSoft px-4 py-3 text-sm text-muted">
              Search akun AI, Netflix, CapCut, lisensi...
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((category) => (
                <span key={category} className="rounded-full border border-border bg-surfaceSoft px-3 py-1 text-xs font-medium text-text">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {products.map((product) => (
            <article key={product.name} className="rounded-xl2 border border-border bg-white p-5 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">{product.tag}</p>
              <h2 className="mt-3 text-lg font-semibold">{product.name}</h2>
              <p className="mt-2 text-sm text-muted">{product.meta}</p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-lg font-semibold">{product.price}</span>
                <a className="text-sm font-medium text-primary" href="/marketplace">
                  Detail
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
