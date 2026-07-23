import { listRecentActivity } from "@/lib/activity";
import { listAdminOrders } from "@/lib/orders";
import { listAdminReviews } from "@/lib/reviews";
import { listSellerProfiles } from "@/lib/sellers";
import { listUsers } from "@/lib/users";
import { listOrderItemsBySellerId } from "@/lib/orders";
import { calculateMarketplaceCommission } from "@/lib/pricing.js";
import { getCurrentUser } from "@/lib/session-server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const formatDate = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short"
});

export default async function AdminPage() {
  const current = await getCurrentUser();
  if (!current) redirect("/login");
  if (current.session.role !== "admin") redirect(current.session.role === "seller" ? "/seller" : "/dashboard");

  const [users, sellers, orders, reviews, activity] = await Promise.all([
    listUsers(),
    listSellerProfiles(),
    listAdminOrders(),
    listAdminReviews(),
    listRecentActivity(8)
  ]);
  const allOrderItems = await listOrderItemsBySellerId(null);

  const paidOrders = orders.filter((order) => order.paymentStatus === "paid").length;
  const settledStatuses = new Set(["paid", "processing", "delivered"]);
  const settlementSummary = allOrderItems.filter((item) => settledStatuses.has(item.orderStatus)).reduce(
    (acc, item) => {
      const commission = calculateMarketplaceCommission(item.unitPrice * item.quantity);
      acc.gross += commission.grossAmount;
      acc.fee += commission.platformFee;
      acc.net += commission.sellerNetAmount;
      return acc;
    },
    { gross: 0, fee: 0, net: 0 }
  );
  const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Ringkasan Admin</h1>
      <p className="mt-2 text-sm text-muted">Kelola user, seller, produk, payment, ticket, dan paket custom.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-4 xl:grid-cols-5">
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
        <div className="rounded-xl2 border border-border bg-surfaceSoft p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Komisi</p>
          <p className="mt-2 text-2xl font-semibold">{formatMoney.format(settlementSummary.fee)}</p>
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

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl2 border border-border bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-muted">Gross settled</p>
          <p className="mt-2 text-2xl font-semibold">{formatMoney.format(settlementSummary.gross)}</p>
        </div>
        <div className="rounded-xl2 border border-border bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-muted">Fee platform</p>
          <p className="mt-2 text-2xl font-semibold">{formatMoney.format(settlementSummary.fee)}</p>
        </div>
        <div className="rounded-xl2 border border-border bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-muted">Net seller</p>
          <p className="mt-2 text-2xl font-semibold">{formatMoney.format(settlementSummary.net)}</p>
        </div>
      </div>
    </div>
  );
}
