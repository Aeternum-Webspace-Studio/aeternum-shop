import { listRecentActivity } from "@/lib/activity";
import { listAdminOrders } from "@/lib/orders";
import { listAdminReviews } from "@/lib/reviews";
import { listSellerProfiles } from "@/lib/sellers";
import { listUsers } from "@/lib/users";

export const dynamic = "force-dynamic";

const formatDate = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short"
});

export default async function AdminPage() {
  const [users, sellers, orders, reviews, activity] = await Promise.all([
    listUsers(),
    listSellerProfiles(),
    listAdminOrders(),
    listAdminReviews(),
    listRecentActivity(8)
  ]);

  const paidOrders = orders.filter((order) => order.paymentStatus === "paid").length;

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Ringkasan Admin</h1>
      <p className="mt-2 text-sm text-muted">Kelola user, seller, produk, payment, ticket, dan paket custom.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl2 border border-border bg-surfaceSoft p-4">
          <p className="text-xs uppercase tracking-wide text-muted">User</p>
          <p className="mt-2 text-2xl font-semibold">{users.length}</p>
        </div>
        <div className="rounded-xl2 border border-border bg-surfaceSoft p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Seller</p>
          <p className="mt-2 text-2xl font-semibold">{sellers.length}</p>
        </div>
        <div className="rounded-xl2 border border-border bg-surfaceSoft p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Order</p>
          <p className="mt-2 text-2xl font-semibold">{orders.length}</p>
        </div>
        <div className="rounded-xl2 border border-border bg-surfaceSoft p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Payment</p>
          <p className="mt-2 text-2xl font-semibold">{paidOrders}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-xl2 border border-border bg-white p-4 shadow-soft">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Review</p>
              <p className="mt-2 text-2xl font-semibold">{reviews.length}</p>
            </div>
            <p className="text-sm text-muted">Ulasan aktif dan hidden</p>
          </div>
          <p className="mt-3 text-sm text-muted">Dashboard ini sekarang narik data nyata dari user, seller, order, review, dan aktivitas terbaru.</p>
        </div>
        <div className="rounded-xl2 border border-border bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-muted">Aktivitas terakhir</p>
          <div className="mt-3 space-y-3">
            {activity.length === 0 ? (
              <p className="text-sm text-muted">Belum ada aktivitas tercatat.</p>
            ) : (
              activity.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-border bg-surfaceSoft p-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-text">{entry.action.replaceAll(".", " ")}</p>
                      <p className="mt-1 text-muted">{entry.actorName ?? "System"} · {entry.actorRole ?? "system"}</p>
                    </div>
                    <p className="text-xs text-muted">{formatDate.format(entry.createdAt)}</p>
                  </div>
                  {entry.metadata && Object.keys(entry.metadata).length > 0 ? (
                    <p className="mt-2 text-xs text-muted">{JSON.stringify(entry.metadata)}</p>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
