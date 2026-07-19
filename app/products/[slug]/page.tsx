import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { getReviewSummaryByProductId, listReviewsByProductId } from "@/lib/reviews";

export const dynamic = "force-dynamic";

const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

const checkoutSteps = [
  "Login atau daftar akun buyer",
  "Klik lanjut bayar dan selesaikan pembayaran Pakasir",
  "Cek akses produk dari dashboard order setelah status sukses"
];

const productHighlights = [
  "Invoice bisa dilacak",
  "Riwayat order tersimpan",
  "Bisa buka ticket support",
  "Review hanya dari pembeli"
];

function stars(rating: number) {
  return "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);
}

export default async function ProductDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  const reviewSummary = await getReviewSummaryByProductId(product.id);
  const reviews = await listReviewsByProductId(product.id, 3);
  const deliveryCopy = product.fulfillmentType === "auto"
    ? "Akses otomatis disiapkan setelah pembayaran terverifikasi."
    : "Seller memproses akses manual setelah pembayaran masuk.";

  return (
    <main className="aeternum-bg min-h-screen px-6 py-10 text-text">
      <div className="mx-auto max-w-6xl">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="hero-card reveal-up rounded-xl2 border-[3px] border-border p-6 shadow-soft md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Produk digital siap pakai</p>
            <h1 className="mt-3 text-4xl font-black leading-[0.95] tracking-tight md:text-6xl">{product.name}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted">{product.description}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted">
              {product.categoryName ? <span className="lift rounded-full border-[2px] border-border bg-white px-3 py-1 font-black">{product.categoryName}</span> : null}
              <span className="lift rounded-full border-[2px] border-border bg-white px-3 py-1 font-black">{product.fulfillmentType === "auto" ? "Akses cepat" : "Diproses seller"}</span>
              <span className="lift rounded-full border-[2px] border-border bg-white px-3 py-1 font-black">Support order</span>
              {product.isCustomPackage ? <span className="lift rounded-full border-[2px] border-border bg-white px-3 py-1 font-black">Paket khusus</span> : null}
            </div>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {productHighlights.map((item) => (
                <div key={item} className="rounded-xl border-[2px] border-border bg-white p-3 text-sm font-black shadow-soft">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <form className="sticky top-6 rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft" method="post" action="/api/checkout">
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="quantity" value={1} />
            <p className="text-xs font-black uppercase tracking-[0.18em] text-muted">Checkout</p>
            <p className="mt-2 text-3xl font-black">{formatMoney.format(product.price)}</p>
            {product.resellerPrice ? <p className="mt-1 text-sm font-semibold text-muted">Harga reseller tersedia: {formatMoney.format(product.resellerPrice)}</p> : null}
            <div className="mt-4 rounded-xl border-[2px] border-border bg-surfaceSoft p-4">
              <p className="text-sm font-black">Yang terjadi setelah bayar</p>
              <p className="mt-2 text-sm leading-6 text-muted">{deliveryCopy}</p>
            </div>
            <button className="lift shine mt-4 w-full rounded-xl border-[3px] border-border bg-primary px-4 py-3 text-sm font-black text-white shadow-soft">Lanjut ke Pembayaran Pakasir</button>
            <p className="mt-3 text-center text-xs leading-5 text-muted">Belum login? Kamu akan diarahkan ke login agar invoice dan akses produk tersimpan di akun.</p>
          </form>
        </section>

        <section className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="lift rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Akses produk</p>
            <p className="mt-2 text-sm leading-6 text-muted">{deliveryCopy}</p>
          </div>
          <div className="lift rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Pembayaran</p>
            <p className="mt-2 text-sm leading-6 text-muted">Checkout memakai Pakasir. Status pembayaran tersimpan di dashboard dan invoice tracker.</p>
          </div>
          <div className="lift rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Bantuan</p>
            <p className="mt-2 text-sm leading-6 text-muted">Kalau akses belum masuk atau ada kendala, buka ticket dari halaman order.</p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="hero-card rounded-xl2 border-[3px] border-border p-5 shadow-soft">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-muted">Cara beli</p>
            <div className="mt-4 space-y-3">
              {checkoutSteps.map((step, index) => (
                <div key={step} className="flex gap-3 rounded-xl border-[2px] border-border bg-white p-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-[2px] border-border bg-primary text-sm font-black text-white">{index + 1}</span>
                  <p className="text-sm font-semibold leading-6">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-muted">Detail dan instruksi</p>
            {product.instructions ? (
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted">{product.instructions}</p>
            ) : (
              <p className="mt-4 text-sm leading-7 text-muted">Instruksi produk akan tampil di halaman order setelah pembelian selesai.</p>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-muted">Rating dan komentar</p>
              <p className="mt-2 text-3xl font-black">
                {reviewSummary.count === 0 ? "Belum ada review" : `${reviewSummary.average.toFixed(1)}/5`}
              </p>
              <p className="mt-1 text-sm text-muted">{reviewSummary.count === 0 ? "Review muncul setelah pembeli menerima produk." : `${reviewSummary.count} komentar dari pembeli terverifikasi.`}</p>
            </div>
            <span className="rounded-full border-[2px] border-border bg-surfaceSoft px-4 py-2 text-sm font-black text-primary">
              {reviewSummary.count === 0 ? "☆☆☆☆☆" : stars(Math.round(reviewSummary.average))}
            </span>
          </div>
          {reviews.length > 0 ? (
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {reviews.map((review) => (
                <article key={review.id} className="lift rounded-xl border-[2px] border-border bg-surfaceSoft p-4 text-sm text-muted">
                  <p className="font-black text-primary">{stars(review.rating)}</p>
                  <p className="mt-2 font-semibold text-text">{review.buyerName}</p>
                  {review.comment ? <p className="mt-2 whitespace-pre-line leading-6">{review.comment}</p> : null}
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
