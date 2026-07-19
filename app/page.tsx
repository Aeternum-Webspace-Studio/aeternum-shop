const categories = ["AI", "Streaming", "Tools", "Design", "Lisensi", "Bundle"];
const products = [
  {
    name: "ChatGPT Pro Share",
    tag: "Instan",
    price: "Rp 49.000",
    meta: "Rating 4.9 / 5 · 312 terjual"
  },
  {
    name: "CapCut Premium",
    tag: "Garansi Seller",
    price: "Rp 35.000",
    meta: "Rating 4.8 / 5 · 180 terjual"
  },
  {
    name: "Netflix Premium",
    tag: "Stok Ready",
    price: "Rp 59.000",
    meta: "Rating 4.7 / 5 · 249 terjual"
  }
];

const services = [
  {
    title: "Langsung ke dashboard",
    text: "Produk instan muncul di order setelah payment sukses.",
    accent: "from-orange-500 to-amber-400"
  },
  {
    title: "Dikerjakan seller",
    text: "Produk manual diproses seller sampai statusnya jelas.",
    accent: "from-slate-900 to-slate-700"
  },
  {
    title: "Harga reseller",
    text: "Akun reseller dapat harga khusus bila disetujui.",
    accent: "from-sky-500 to-cyan-400"
  },
  {
    title: "Support order",
    text: "Buka ticket langsung dari order kalau butuh bantuan.",
    accent: "from-amber-500 to-orange-500"
  }
];

const orderSteps = [
  { title: "Pilih produk", text: "Buka katalog dan cek tipe delivery." },
  { title: "Bayar", text: "Checkout diarahkan ke Pakasir." },
  { title: "Cek dashboard", text: "Data produk atau status manual tampil di order." }
];

export default function HomePage() {
  return (
    <main className="aeternum-bg min-h-screen text-text">
      <header className="sticky top-0 z-50 border-b-[3px] border-border bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border-[3px] border-border bg-primary px-3 py-2 text-sm font-black text-white shadow-soft">AS</div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">Aeternum Shop</p>
              <p className="text-xs text-muted">Digital goods marketplace</p>
            </div>
          </div>
          <nav className="hidden gap-6 text-sm font-medium md:flex">
            <a href="/marketplace">Marketplace</a>
            <a href="/dashboard/orders">Pesanan Saya</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/seller">Seller</a>
          </nav>
        </div>
      </header>

      <div className="border-b-[3px] border-border bg-primary py-3 text-white">
        <div className="mx-auto flex max-w-7xl gap-8 overflow-hidden px-6 text-xs font-black uppercase tracking-[0.24em]">
          <span className="whitespace-nowrap">AI Tools</span>
          <span className="whitespace-nowrap">Streaming</span>
          <span className="whitespace-nowrap">Lisensi</span>
          <span className="whitespace-nowrap">Reseller</span>
          <span className="whitespace-nowrap">Auto Delivery</span>
          <span className="whitespace-nowrap">Manual Seller</span>
          <span className="whitespace-nowrap">Ticket Support</span>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl2 border-[3px] border-border bg-white p-6 shadow-soft md:p-8">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-primary">Produk digital siap beli</span>
              <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-text">Auto delivery atau manual seller</span>
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.92] tracking-tight md:text-7xl">
              Beli produk digital tanpa alur ribet.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted md:text-lg">
              Cari akun AI, streaming, lisensi, dan tools premium. Bayar via Pakasir, lalu pantau produk dari dashboard order.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {orderSteps.map((step, index) => (
                <div key={step.title} className="rounded-xl border-[3px] border-border bg-surfaceSoft p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">0{index + 1}</p>
                  <p className="mt-2 text-sm font-black">{step.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">{step.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="rounded-xl border-[3px] border-border bg-primary px-5 py-3 text-sm font-black text-white shadow-soft" href="/marketplace">
                Mulai Belanja
              </a>
              <a className="rounded-xl border-[3px] border-border bg-white px-5 py-3 text-sm font-black text-text shadow-soft" href="/seller">
                Jadi Seller
              </a>
              <a className="rounded-xl border-[3px] border-border bg-surfaceSoft px-5 py-3 text-sm font-black text-text shadow-soft" href="/dashboard">
                Dashboard User
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-xl2 border-[3px] border-border bg-primary p-5 text-white shadow-soft">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">Cara beli</p>
              <p className="mt-3 text-2xl font-black leading-tight">Pilih produk, bayar, cek dashboard.</p>
              <p className="mt-3 text-sm text-white/85">Tidak perlu chat admin untuk produk instan. Produk manual tetap punya status order yang jelas.</p>
            </div>
            <div className="rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">Cari cepat</p>
              <div className="mt-3 border-[3px] border-border bg-surfaceSoft px-4 py-3 text-sm font-medium text-muted">
                Cari ChatGPT, Netflix, CapCut, Canva, lisensi...
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
            <h2 className="mt-2 text-2xl font-black md:text-3xl">Contoh kategori produk yang bisa dijual</h2>
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

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-xl2 border-[3px] border-border bg-white p-6 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Info penting</p>
            <h2 className="mt-2 text-2xl font-black md:text-3xl">Empat hal yang paling dicari buyer.</h2>
            <p className="mt-4 text-sm leading-7 text-muted">Biar tidak muter-muter, landing page cuma tampilkan hal yang benar-benar dipakai buat ambil keputusan beli.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <article key={service.title} className={`rounded-xl2 border-[3px] border-border bg-gradient-to-br ${service.accent} p-[3px] shadow-soft`}>
                <div className="h-full rounded-[7px] bg-white p-5">
                  <h3 className="text-lg font-black">{service.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{service.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-xl2 border-[3px] border-border bg-primary p-6 text-white shadow-soft md:p-8">
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/75">Mulai dari katalog</p>
              <h2 className="mt-2 text-3xl font-black md:text-5xl">Lihat produk, pilih yang cocok, lanjut bayar.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85">Landing page tidak perlu banyak janji. Buyer butuh produk, harga, instruksi, dan status order yang jelas.</p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <a className="rounded-xl border-[3px] border-white bg-white px-5 py-3 text-sm font-black text-primary" href="/marketplace">
                Lihat Marketplace
              </a>
              <a className="rounded-xl border-[3px] border-white bg-transparent px-5 py-3 text-sm font-black text-white" href="/seller">
                Masuk Seller Panel
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
