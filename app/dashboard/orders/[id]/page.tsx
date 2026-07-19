import { getOrderDetailByNumber } from "@/lib/orders";
import { getCurrentUser } from "@/lib/session-server";
import { getReviewByOrderItemId } from "@/lib/reviews";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

function stars(rating: number) {
  return "★★★★★".slice(0, rating) + "☆☆☆☆☆".slice(0, 5 - rating);
}

export default async function DashboardOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const current = await getCurrentUser();
  if (!current) notFound();

  const { id } = await params;

  const detail = await getOrderDetailByNumber(id);
  if (!detail) notFound();

  const items = await Promise.all(
    detail.items.map(async (item) => ({
      item,
      review: item.deliveryStatus === "delivered" ? await getReviewByOrderItemId(item.id) : null
    }))
  );

  if (current.session.role !== "admin" && detail.order.buyerId !== current.user.id) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Order {detail.order.orderNumber}</h1>
      <p className="mt-2 text-sm text-muted">Status: {detail.order.status}</p>
      <div className="mt-6 rounded-xl2 border border-border p-4 text-sm text-muted">
        <p>Payment: {detail.payment?.status ?? "-"}</p>
        <p>Total: {formatMoney.format(detail.order.totalAmount)}</p>
      </div>
      <div className="mt-6 space-y-3">
        {items.map(({ item, review }) => {
          return (
            <article key={item.id} className="rounded-xl2 border border-border p-4">
              <p className="text-sm font-medium">{item.productName}</p>
              <p className="mt-1 text-sm text-muted">Delivery: {item.deliveryStatus}</p>
              {item.deliveryContent ? <pre className="mt-3 overflow-auto rounded-xl bg-surfaceSoft p-3 text-xs text-text">{JSON.stringify(item.deliveryContent, null, 2)}</pre> : null}

              {review ? (
                <div className="mt-4 rounded-xl border border-border bg-surfaceSoft p-3 text-sm text-muted">
                  <p className="font-semibold text-text">Review tersimpan</p>
                  <p className="mt-1 font-black text-primary">{stars(review.rating)} · {review.rating}/5</p>
                  {review.comment ? <p className="mt-1 whitespace-pre-line">{review.comment}</p> : null}
                </div>
              ) : item.deliveryStatus === "delivered" ? (
                <form className="mt-4 grid gap-3 rounded-xl border border-border bg-surfaceSoft p-3" method="post" action="/api/reviews">
                  <input type="hidden" name="orderItemId" value={item.id} />
                  <div>
                    <p className="text-sm font-black text-text">Bantu pembeli lain dengan review singkat</p>
                    <p className="mt-1 text-xs text-muted">Ceritakan apakah akses cepat, instruksi jelas, dan produk sesuai deskripsi.</p>
                  </div>
                  <label className="text-sm font-semibold">Rating</label>
                  <select name="rating" defaultValue="5" className="rounded-xl border border-border bg-white px-3 py-2 text-sm">
                    <option value="5">5 - Sangat puas</option>
                    <option value="4">4 - Puas</option>
                    <option value="3">3 - Cukup</option>
                    <option value="2">2 - Kurang</option>
                    <option value="1">1 - Bermasalah</option>
                  </select>
                  <label className="text-sm font-semibold">Komentar</label>
                  <textarea name="comment" className="min-h-28 rounded-xl border border-border bg-white px-3 py-2 text-sm" placeholder="Contoh: akses cepat masuk, instruksi jelas, cocok untuk kerja harian." />
                  <button className="rounded-xl border border-border bg-primary px-4 py-2 text-sm font-semibold text-white">Kirim review</button>
                </form>
              ) : null}
            </article>
          );
        })}
      </div>

      <form className="mt-6 grid gap-3 rounded-xl2 border border-border bg-white p-4 shadow-soft" method="post" action="/api/tickets">
        <input type="hidden" name="orderId" value={detail.order.id} />
        <label className="text-sm font-semibold">Buka ticket untuk order ini</label>
        <input name="subject" className="rounded-xl border border-border bg-surfaceSoft px-3 py-2 text-sm" placeholder="Jelaskan masalahnya singkat" required />
        <button className="rounded-xl border border-border bg-primary px-4 py-2 text-sm font-semibold text-white">Kirim ke support</button>
      </form>
    </div>
  );
}
