import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { getReviewSummaryByProductId, listReviewsByProductId } from "@/lib/reviews";

export const dynamic = "force-dynamic";

const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export default async function ProductDetailPage({
  params
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  const reviewSummary = await getReviewSummaryByProductId(product.id);
  const reviews = await listReviewsByProductId(product.id, 3);

  return (
    <main className="aeternum-bg min-h-screen px-6 py-10 text-text">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Produk digital</p>
        <h1 className="reveal-up mt-2 text-3xl font-black tracking-tight md:text-5xl">{product.name}</h1>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
          {product.categoryName ? <span className="lift rounded-full border-[2px] border-border bg-white px-3 py-1 font-black">{product.categoryName}</span> : null}
          <span className="lift rounded-full border-[2px] border-border bg-white px-3 py-1 font-black">{product.fulfillmentType === "auto" ? "Akses cepat" : "Diproses sesuai pesanan"}</span>
          <span className="lift rounded-full border-[2px] border-border bg-white px-3 py-1 font-black">Garansi Support</span>
          {product.isCustomPackage ? <span className="lift rounded-full border-[2px] border-border bg-white px-3 py-1 font-black">Paket khusus</span> : null}
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="lift rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Akses produk</p>
            <p className="mt-2 text-sm text-muted">{product.fulfillmentType === "auto" ? "Akses produk tersedia setelah pembayaran berhasil." : "Pesanan diproses dengan status yang bisa kamu pantau."}</p>
          </div>
          <div className="lift rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Pembayaran</p>
            <p className="mt-2 text-sm text-muted">Bayar aman melalui halaman pembayaran resmi.</p>
          </div>
          <div className="lift rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Support</p>
            <p className="mt-2 text-sm text-muted">Bantuan tersedia dari halaman pesanan.</p>
          </div>
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-muted">{product.description}</p>
        <div className="hero-card mt-6 rounded-xl2 border-[3px] border-border p-5 shadow-soft">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-muted">Harga</p>
          <p className="mt-1 text-2xl font-black">{formatMoney.format(product.price)}</p>
          {product.resellerPrice ? <p className="mt-1 text-sm text-muted">Harga khusus: {formatMoney.format(product.resellerPrice)}</p> : null}
          {product.instructions ? <p className="mt-4 whitespace-pre-line text-sm text-muted">{product.instructions}</p> : null}
        </div>

        <div className="mt-6 rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-muted">Review</p>
          <p className="mt-2 text-sm text-muted">
            {reviewSummary.count === 0 ? "Belum ada review." : `${reviewSummary.average.toFixed(1)}/5 dari ${reviewSummary.count} review`}
          </p>
          {reviews.length > 0 ? (
            <div className="mt-4 space-y-3">
              {reviews.map((review) => (
                <article key={review.id} className="lift rounded-xl border border-border bg-surfaceSoft p-3 text-sm text-muted">
                  <p className="font-semibold text-text">{review.buyerName}</p>
                  <p className="mt-1">Rating: {review.rating}/5</p>
                  {review.comment ? <p className="mt-2 whitespace-pre-line">{review.comment}</p> : null}
                </article>
              ))}
            </div>
          ) : null}
        </div>

        <form className="mt-6 rounded-xl2 border-[3px] border-border bg-white p-5 shadow-soft" method="post" action="/api/checkout">
          <input type="hidden" name="productId" value={product.id} />
          <input type="hidden" name="quantity" value={1} />
          <button className="lift shine rounded-xl border-[3px] border-border bg-primary px-4 py-3 text-sm font-black text-white shadow-soft">Lanjut ke Pembayaran</button>
        </form>
      </div>
    </main>
  );
}
