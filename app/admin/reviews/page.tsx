import Link from "next/link";
import { getCurrentUser } from "@/lib/session-server";
import { listAdminReviews } from "@/lib/reviews";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const current = await getCurrentUser();
  if (!current || current.session.role !== "admin") return null;

  const reviews = await listAdminReviews();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Review</h1>
      <p className="mt-2 text-sm text-muted">Moderasi ulasan pembeli.</p>
      <div className="mt-6 space-y-3">
        {reviews.length === 0 ? <div className="rounded-xl2 border border-border p-4 text-sm text-muted">Belum ada review.</div> : reviews.map((review) => (
          <article key={review.id} className="rounded-xl2 border border-border bg-white p-4 shadow-soft">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-semibold">{review.productName}</p>
                <p className="mt-1 text-sm text-muted">{review.buyerName} · {review.rating}/5</p>
                {review.comment ? <p className="mt-2 text-sm text-muted">{review.comment}</p> : null}
              </div>
              <form method="post" action={`/api/admin/reviews/${review.id}/hide`}>
                <input type="hidden" name="hidden" value={review.isHidden ? "false" : "true"} />
                <button className={`rounded-xl border px-4 py-2 text-sm font-semibold ${review.isHidden ? "border-border bg-white" : "border-border bg-primary text-white"}`}>
                  {review.isHidden ? "Unhide" : "Hide"}
                </button>
              </form>
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted">{review.isHidden ? "Hidden" : "Visible"} · <Link href={`/products/${review.productSlug}`} className="font-black text-primary">Lihat produk</Link></p>
          </article>
        ))}
      </div>
    </div>
  );
}
