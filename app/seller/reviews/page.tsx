import { getCurrentUser } from "@/lib/session-server";
import { findSellerProfileByUserId } from "@/lib/sellers";
import { listReviewsBySellerId } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export default async function SellerReviewsPage() {
  const current = await getCurrentUser();
  const sellerId = current?.session.role === "seller" ? (await findSellerProfileByUserId(current.user.id))?.id ?? null : null;
  const reviews = await listReviewsBySellerId(sellerId);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Review</h1>
      <p className="mt-2 text-sm text-muted">Ulasan produk milikmu.</p>
      <div className="mt-6 space-y-3">
        {reviews.length === 0 ? <div className="rounded-xl2 border border-border p-4 text-sm text-muted">Belum ada review.</div> : reviews.map((review) => (
          <article key={review.id} className="rounded-xl2 border border-border bg-white p-4 shadow-soft">
            <p className="font-semibold">{review.productName}</p>
            <p className="mt-1 text-sm text-muted">{review.buyerName} · {review.rating}/5</p>
            {review.comment ? <p className="mt-2 text-sm text-muted">{review.comment}</p> : null}
          </article>
        ))}
      </div>
    </div>
  );
}
