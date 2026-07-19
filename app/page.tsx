import { getGlobalReviewSummary, listTopRatedProducts } from "@/lib/reviews";

const products = [
  {
    name: "ChatGPT Pro Share",
    tag: "Akses cepat",
    price: "Rp 49.000",
    meta: "Cocok buat kerja, riset, dan tugas harian."
  },
  {
    name: "CapCut Premium",
    tag: "Order jelas",
    price: "Rp 35.000",
    meta: "Proses pembelian transparan sampai akses diterima."
  },
  {
    name: "Netflix Premium",
    tag: "Support aktif",
    price: "Rp 59.000",
    meta: "Kalau ada kendala, buka ticket dari order."
  }
];

const orderSteps = [
  { title: "Pilih produk", text: "Temukan akun, tools, lisensi, atau bundle sesuai kebutuhan." },
  { title: "Bayar aman", text: "Pembayaran diproses melalui halaman pembayaran resmi." },
  { title: "Terima akses", text: "Detail pembelian dan akses produk tersimpan rapi di akunmu." }
];

const badges = [
  "Harga jelas",
  "Pembayaran aman",
  "Akses tersimpan",
  "Bantuan order"
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const reviewSummary = await getGlobalReviewSummary();
  const topRatedProducts = await listTopRatedProducts(3);

  return (
    <main className="aeternum-bg min-h-screen text-text">
      <header className="sticky top-0 z-50 border-b-[3px] border-border bg-white/95 shadow-[0_5px_0_#111827] backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img className="h-11 w-11 rounded-lg shadow-soft" src="/icon.svg" alt="Aeternum Shop" />
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">Aeternum Shop</p>
              <p className="text-xs text-muted">Toko produk digital terpercaya</p>
            </div>
          </div>
          <nav className="hidden gap-6 text-sm font-medium md:flex">
            <a href="/marketplace">Marketplace</a>
            <a href="/dashboard/orders">Pesanan Saya</a>
            <a href="/dashboard">Dashboard</a>
          </nav>
        </div>
      </header>

      <div className="border-b-[3px] border-border bg-primary py-3 text-white">
        <div className="ticker-track mx-auto flex max-w-7xl gap-8 overflow-hidden px-6 text-xs font-black uppercase tracking-[0.24em]">
          <span className="whitespace-nowrap">AI Tools</span>
          <span className="whitespace-nowrap">Streaming</span>
          <span className="whitespace-nowrap">Lisensi</span>
          <span className="whitespace-nowrap">Pantau Pesanan</span>
          <span className="whitespace-nowrap">Akses Cepat</span>
          <span className="whitespace-nowrap">Harga Jelas</span>
          <span className="whitespace-nowrap">Ticket Support</span>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="hero-card reveal-up rounded-xl2 border-[3px] border-border p-6 shadow-soft md:p-8">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-primary">Produk digital siap beli</span>
              <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-text">Bayar aman, akses tersimpan</span>
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.92] tracking-tight md:text-7xl">
              Beli akun premium dan tools digital dengan proses yang jelas.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted md:text-lg">
              Pilih produk yang kamu butuhkan, lihat harga dengan jelas, bayar aman, lalu terima akses dan riwayat pembelian di akunmu.
            </p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {orderSteps.map((step, index) => (
                <div key={step.title} className="lift rounded-xl border-[3px] border-border bg-surfaceSoft p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">0{index + 1}</p>
                  <p className="mt-2 text-sm font-black">{step.title}</p>
                  <p className="mt-1 text-xs leading-5 text-muted">{step.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span key={badge} className="lift rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-text">
                  {badge}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="lift shine rounded-xl border-[3px] border-border bg-primary px-5 py-3 text-sm font-black text-white shadow-soft" href="/marketplace">
                Mulai Belanja
              </a>
              <a className="lift rounded-xl border-[3px] border-border bg-surfaceSoft px-5 py-3 text-sm font-black text-text shadow-soft" href="/dashboard">
                Cek Pesanan
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="floaty shine rounded-xl2 border-[3px] border-border bg-primary p-5 text-white shadow-soft">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">Rating pembeli</p>
              <p className="mt-3 text-4xl font-black leading-tight">{reviewSummary.count === 0 ? "Belum ada" : `${reviewSummary.average.toFixed(1)}/5`}</p>
              <p className="mt-3 text-sm text-white/85">{reviewSummary.count === 0 ? "Ulasan pembeli akan tampil setelah pesanan selesai dan dinilai." : `Berdasarkan ${reviewSummary.count} ulasan pembeli yang sudah selesai bertransaksi.`}</p>
            </div>
            {topRatedProducts.length === 0 ? (
              <div className="lift rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
                <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">Belum ada rating</p>
                <p className="mt-3 text-sm leading-6 text-muted">Rating produk akan muncul setelah pembeli menyelesaikan pesanan dan memberi ulasan.</p>
              </div>
            ) : (
              topRatedProducts.map((product) => (
                <a key={product.productId} href={`/products/${product.productSlug}`} className="lift block rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft hover:bg-surfaceSoft">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black">{product.productName}</p>
                      <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-primary">{product.reviewCount} review</p>
                    </div>
                    <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 text-sm font-black">{product.averageRating.toFixed(1)}/5</span>
                  </div>
                  {product.latestReview?.comment ? <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">"{product.latestReview.comment}"</p> : null}
                  {product.latestReview ? <p className="mt-3 text-xs font-black text-text">{product.latestReview.buyerName}</p> : null}
                </a>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Trending sekarang</p>
            <h2 className="mt-2 text-2xl font-black md:text-3xl">Produk yang paling sering dicari pembeli</h2>
          </div>
          <a className="hidden rounded-xl border-[3px] border-border bg-white px-4 py-2 text-sm font-black shadow-soft md:inline-flex" href="/marketplace">
            Lihat semua
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {products.map((product, index) => (
            <article
              key={product.name}
              className={`lift rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft ${index === 1 ? "translate-y-2" : ""}`}
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{product.tag}</p>
              <h3 className="mt-3 text-lg font-black">{product.name}</h3>
              <p className="mt-2 text-sm text-muted">{product.meta}</p>
              <div className="mt-5 flex items-center justify-between border-t-[2px] border-border pt-4">
                <span className="text-lg font-black">{product.price}</span>
                <a className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 text-sm font-black" href="/marketplace">
                  Cek produk
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="shine rounded-xl2 border-[3px] border-border bg-primary p-6 text-white shadow-soft md:p-8">
          <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/75">Mulai dari katalog</p>
              <h2 className="mt-2 text-3xl font-black md:text-5xl">Temukan produk yang cocok, lalu lanjutkan pembelian dengan tenang.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85">Setiap produk menampilkan harga, cara akses, ulasan, dan bantuan order agar kamu bisa membeli tanpa tebak-tebakan.</p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <a className="lift rounded-xl border-[3px] border-white bg-white px-5 py-3 text-sm font-black text-primary" href="/marketplace">
                Lihat Marketplace
              </a>
              <a className="lift rounded-xl border-[3px] border-white bg-transparent px-5 py-3 text-sm font-black text-white" href="/dashboard/orders">
                Pesanan Saya
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t-[3px] border-border bg-white px-6 py-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <img className="h-10 w-10 rounded-lg shadow-soft" src="/icon.svg" alt="Aeternum Shop" />
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-primary">Aeternum Shop</p>
                <p className="text-xs text-muted">Produk digital dengan proses pembelian yang jelas.</p>
              </div>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted">Cari produk, bayar aman, pantau pesanan, dan hubungi support kalau butuh bantuan.</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <a className="lift rounded-full border-[2px] border-border bg-surfaceSoft px-4 py-2 text-sm font-black" href="/marketplace">Marketplace</a>
            <a className="lift rounded-full border-[2px] border-border bg-surfaceSoft px-4 py-2 text-sm font-black" href="/dashboard/orders">Pesanan</a>
            <a className="lift rounded-full border-[2px] border-border bg-surfaceSoft px-4 py-2 text-sm font-black" href="/dashboard/tickets">Support</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
