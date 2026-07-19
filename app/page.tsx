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
    title: "Auto Delivery",
    text: "Bayar via Pakasir, stok digital langsung masuk ke dashboard buyer setelah webhook terverifikasi.",
    accent: "from-orange-500 to-amber-400"
  },
  {
    title: "Manual Seller",
    text: "Produk yang butuh proses khusus bisa diproses seller dengan status order yang tetap jelas.",
    accent: "from-slate-900 to-slate-700"
  },
  {
    title: "Reseller Price",
    text: "Seller dan admin bisa menyiapkan harga khusus untuk user yang sudah approved reseller.",
    accent: "from-sky-500 to-cyan-400"
  },
  {
    title: "Ticket Support",
    text: "Buyer bisa buka ticket setelah order untuk follow up masalah atau pertanyaan produk.",
    accent: "from-amber-500 to-orange-500"
  }
];

const stats = [
  { label: "Produk aktif", value: "120+" },
  { label: "Order selesai", value: "3.2K" },
  { label: "Rating rata-rata", value: "4.9/5" },
  { label: "Support respon", value: "< 1 jam" }
];

const testimonials = [
  {
    name: "Raka",
    role: "Buyer produk AI",
    text: "Tampilannya tegas, informasinya jelas, dan checkout-nya gampang. Enak dipakai buat beli cepat."
  },
  {
    name: "Nadia",
    role: "Seller reseller",
    text: "Panel produk dan stoknya tinggal dipakai. Cocok buat jualan produk digital tanpa ribet."
  },
  {
    name: "Fajar",
    role: "Admin/owner",
    text: "Flow order dan delivery-nya rapi. Buyer cepat paham, seller juga mudah kelola produk."
  }
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
              <p className="text-xs text-muted">Produk digital serba otomatis</p>
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

      <section className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-xl2 border-[3px] border-border bg-white p-6 shadow-soft md:p-8">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-primary">Bayar, langsung cek dashboard</span>
              <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-text">Instan · Aman · Seller verified</span>
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.92] tracking-tight md:text-7xl">
              Produk digital serba otomatis. Bayar, langsung dapat akses.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted md:text-lg">
              Beli akun AI, streaming, lisensi, dan tools premium. Order masuk dashboard, status jelas, dan produk auto/manual diproses tanpa chat panjang.
            </p>
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
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">Fast lane</p>
              <p className="mt-3 text-2xl font-black leading-tight">Instan, bergaransi, dan siap reseller.</p>
              <p className="mt-3 text-sm text-white/85">Flow transaksi pendek seperti toko digital otomatis: pilih produk, bayar, buka dashboard.</p>
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

      <section className="mx-auto max-w-7xl px-6 pb-6">
        <div className="grid gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-muted">{stat.label}</p>
              <p className="mt-3 text-3xl font-black text-primary">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Trending sekarang</p>
            <h2 className="mt-2 text-2xl font-black md:text-3xl">Produk yang cepat dibeli, mudah dicek, dan jelas statusnya</h2>
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
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Layanan utama</p>
            <h2 className="mt-2 text-2xl font-black md:text-3xl">Panel marketplace yang terasa seperti console operasional.</h2>
            <p className="mt-4 text-sm leading-7 text-muted">Buyer dapat status order. Seller dapat panel produk dan stok. Admin dapat kontrol semua transaksi dan support.</p>
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

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
              <p className="text-sm leading-7 text-muted">“{testimonial.text}”</p>
              <div className="mt-5 border-t-[2px] border-border pt-4">
                <p className="text-sm font-black">{testimonial.name}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted">{testimonial.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-xl2 border-[3px] border-border bg-primary p-6 text-white shadow-soft md:p-8">
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/75">Siap launch</p>
              <h2 className="mt-2 text-3xl font-black md:text-5xl">Siap jadi toko produk digital yang buyer percaya sejak halaman pertama.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85">Checkout, delivery, dashboard, dan webhook Pakasir sudah disiapkan untuk alur marketplace digital.</p>
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
