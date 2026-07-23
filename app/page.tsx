import { listPublishedArticles } from "@/lib/articles";
import { listActiveFaqItems } from "@/lib/faq";
import { countSoldOrderItems } from "@/lib/orders";
import { listCategories, listMarketplaceProducts } from "@/lib/products";
import { getGlobalReviewSummary, listTopRatedProducts } from "@/lib/reviews";

const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

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
  const products = await listMarketplaceProducts();
  const featuredProducts = products.slice(0, 3);
  const categories = await listCategories();
  const soldItems = await countSoldOrderItems();
  const articles = (await listPublishedArticles()).slice(0, 3);
  const faqs = await listActiveFaqItems(4);
  const stats = [
    { label: "Produk aktif", value: products.length.toLocaleString("id-ID") },
    { label: "Produk terjual", value: soldItems.toLocaleString("id-ID") },
    { label: "Kategori", value: categories.length.toLocaleString("id-ID") },
    { label: "Review buyer", value: reviewSummary.count.toLocaleString("id-ID") },
    { label: "Rating rata-rata", value: reviewSummary.count === 0 ? "-" : reviewSummary.average.toFixed(1) }
  ];

  return (
    <main className="aeternum-bg min-h-screen text-text">
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
              <a className="lift rounded-xl border-[3px] border-border bg-surfaceSoft px-5 py-3 text-sm font-black text-text shadow-soft" href="/account">
                Cek Pesanan
              </a>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border-[2px] border-border bg-white p-4 shadow-soft">
                  <p className="text-2xl font-black text-primary">{stat.value}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-muted">{stat.label}</p>
                </div>
              ))}
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
                <a className="hidden rounded-xl border-[3px] border-border bg-white px-4 py-2 text-sm font-black shadow-soft md:inline-flex" href="/trending">
            Lihat semua
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featuredProducts.length === 0 ? (
            <div className="rounded-xl2 border-[3px] border-border bg-white p-5 text-sm text-muted shadow-soft">Produk unggulan akan tampil setelah data produk tersedia.</div>
          ) : featuredProducts.map((product, index) => (
            <article
              key={product.id}
              className={`lift rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft ${index === 1 ? "translate-y-2" : ""}`}
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{product.fulfillmentType === "auto" ? "Akses cepat" : "Diproses sesuai pesanan"}</p>
              <h3 className="mt-3 text-lg font-black">{product.name}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted">{product.description}</p>
              <div className="mt-5 flex items-center justify-between border-t-[2px] border-border pt-4">
                <span className="text-lg font-black">{formatMoney.format(product.price)}</span>
                <a className="rounded-full border-[2px] border-border bg-surfaceSoft px-3 py-1 text-sm font-black" href={`/products/${product.slug}`}>
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
                <a className="lift rounded-xl border-[3px] border-white bg-transparent px-5 py-3 text-sm font-black text-white" href="/account/orders">
                  Pesanan Saya
                </a>
              <a className="lift rounded-xl border-[3px] border-white bg-white/15 px-5 py-3 text-sm font-black text-white" href="/help">
                Coba Chatbot
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Artikel pembeli</p>
            <h2 className="mt-2 text-2xl font-black md:text-3xl">Panduan singkat sebelum checkout.</h2>
          </div>
          <a className="hidden rounded-xl border-[3px] border-border bg-white px-4 py-2 text-sm font-black shadow-soft md:inline-flex" href="/blog">
            Semua artikel
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {articles.length === 0 ? (
            <div className="rounded-xl2 border-[3px] border-border bg-white p-5 text-sm text-muted shadow-soft">Artikel pembeli akan tampil di sini.</div>
          ) : (
            articles.map((article) => (
              <a key={article.id} href={`/blog/${article.slug}`} className="lift block rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Panduan</p>
                <h3 className="mt-3 text-lg font-black">{article.title}</h3>
                {article.excerpt ? <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{article.excerpt}</p> : null}
              </a>
            ))
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">FAQ cepat</p>
            <h2 className="mt-2 text-2xl font-black md:text-3xl">Jawaban singkat sebelum kamu chat support.</h2>
            <p className="mt-3 text-sm leading-6 text-muted">Kalau jawaban di bawah tidak cukup, buka ticket dari order atau halaman support.</p>
            <a className="mt-5 inline-flex rounded-xl border-[2px] border-border bg-primary px-4 py-2 text-sm font-black text-white" href="/account/tickets">Buka Ticket</a>
          </div>
          <div className="space-y-3">
            {faqs.length === 0 ? (
              <div className="rounded-xl2 border-[3px] border-border bg-white p-5 text-sm text-muted shadow-soft">FAQ akan muncul setelah seed aktif.</div>
            ) : (
              faqs.map((faq) => (
                <details key={faq.id} className="rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
                  <summary className="cursor-pointer text-sm font-black">{faq.question}</summary>
                  <p className="mt-3 text-sm leading-7 text-muted">{faq.answer}</p>
                </details>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
