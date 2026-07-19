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
      <header className="border-b-[3px] border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border-[3px] border-border bg-primary px-3 py-2 text-sm font-black text-white shadow-soft">AS</div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">Aeternum Shop</p>
              <p className="text-xs text-muted">Digital marketplace with brutal edge</p>
            </div>
          </div>
          <nav className="hidden gap-6 text-sm font-medium md:flex">
            <a href="/marketplace">Marketplace</a>
            <a href="/blog">Blog</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/seller">Seller</a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-xl2 border-[3px] border-border bg-white p-8 shadow-soft">
            <p className="inline-flex rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-primary">
              Orange neurabrutal marketplace
            </p>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
              Marketplace produk digital yang berani, tajam, dan cepat jualan.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted md:text-lg">
              Beli akun digital, lisensi, dan bundle produk dengan payment Pakasir, dashboard seller/admin, serta delivery otomatis atau manual.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="rounded-xl border-[3px] border-border bg-primary px-5 py-3 text-sm font-black text-white shadow-soft" href="/marketplace">
                Mulai Belanja
              </a>
              <a className="rounded-xl border-[3px] border-border bg-white px-5 py-3 text-sm font-black text-text shadow-soft" href="/seller">
                Jadi Seller
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-xl2 border-[3px] border-border bg-primary p-5 text-white shadow-soft">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">Fast lane</p>
              <p className="mt-3 text-2xl font-black leading-tight">Auto Kirim, Manual Seller, Reseller Price</p>
            </div>
            <div className="rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">Cari cepat</p>
              <div className="mt-3 border-[3px] border-border bg-surfaceSoft px-4 py-3 text-sm font-medium text-muted">
                Search akun AI, Netflix, CapCut, lisensi...
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span key={category} className="rounded-full border-[2px] border-border bg-white px-3 py-1 text-xs font-black uppercase tracking-wide text-text">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Trending sekarang</p>
            <h2 className="mt-2 text-2xl font-black md:text-3xl">Produk yang paling cepat dipindai buyer</h2>
          </div>
          <a className="hidden rounded-xl border-[3px] border-border bg-white px-4 py-2 text-sm font-black shadow-soft md:inline-flex" href="/marketplace">
            Lihat semua
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {products.map((product, index) => (
            <article
              key={product.name}
              className={`rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft ${index === 1 ? "translate-y-2" : ""}`}
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{product.tag}</p>
              <h3 className="mt-3 text-lg font-black">{product.name}</h3>
              <p className="mt-2 text-sm text-muted">{product.meta}</p>
              <div className="mt-5 flex items-center justify-between border-t-[2px] border-border pt-4">
                <span className="text-lg font-black">{product.price}</span>
                <a className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 text-sm font-black" href="/marketplace">
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
