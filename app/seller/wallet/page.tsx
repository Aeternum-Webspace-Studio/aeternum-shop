import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session-server";
import { findSellerProfileByUserId } from "@/lib/sellers";
import { listOrderItemsBySellerId } from "@/lib/orders";
import { calculateMarketplaceCommission } from "@/lib/pricing.js";

export const dynamic = "force-dynamic";

const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
const settledStatuses = new Set(["paid", "processing", "delivered"]);

export default async function SellerWalletPage() {
  const current = await getCurrentUser();
  if (!current) redirect("/login");
  if (current.session.role !== "seller") redirect(current.session.role === "admin" ? "/admin" : "/dashboard");

  const sellerId = (await findSellerProfileByUserId(current.user.id))?.id ?? null;
  const items = await listOrderItemsBySellerId(sellerId);
  const settledItems = items.filter((item) => settledStatuses.has(item.orderStatus));

  const summary = settledItems.reduce(
    (acc, item) => {
      const commission = calculateMarketplaceCommission(item.unitPrice * item.quantity);
      acc.gross += commission.grossAmount;
      acc.fee += commission.platformFee;
      acc.net += commission.sellerNetAmount;
      return acc;
    },
    { gross: 0, fee: 0, net: 0 }
  );

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Wallet Seller</h1>
      <p className="mt-2 text-sm text-muted">Saldo dihitung dari order yang sudah paid, processing, atau delivered.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-muted">Gross settled</p>
          <p className="mt-2 text-2xl font-black">{formatMoney.format(summary.gross)}</p>
        </div>
        <div className="rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-muted">Fee platform</p>
          <p className="mt-2 text-2xl font-black">{formatMoney.format(summary.fee)}</p>
        </div>
        <div className="rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
          <p className="text-xs uppercase tracking-wide text-muted">Saldo siap tarik</p>
          <p className="mt-2 text-2xl font-black">{formatMoney.format(summary.net)}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl2 border-[3px] border-border bg-surfaceSoft p-4 shadow-soft">
        <p className="text-sm font-black">Request withdraw manual</p>
        <p className="mt-1 text-sm text-muted">Request akan masuk sebagai ticket agar admin bisa verifikasi saldo dan data payout sebelum pembayaran.</p>
        <form className="mt-4" method="post" action="/api/seller/withdrawals">
          <input type="hidden" name="amount" value={summary.net} />
          <button className="rounded-xl border-[3px] border-border bg-primary px-4 py-3 text-sm font-black text-white shadow-soft" disabled={summary.net <= 0}>Request withdraw {formatMoney.format(summary.net)}</button>
        </form>
      </div>

      <div className="mt-6 space-y-3">
        {settledItems.length === 0 ? (
          <div className="rounded-xl2 border-[3px] border-border bg-white p-4 text-sm text-muted shadow-soft">Belum ada saldo settled.</div>
        ) : (
          settledItems.slice(0, 8).map((item) => {
            const commission = calculateMarketplaceCommission(item.unitPrice * item.quantity);
            return (
              <article key={item.itemId} className="rounded-xl2 border-[3px] border-border bg-white p-4 shadow-soft">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-black">{item.productName}</p>
                    <p className="text-sm text-muted">{item.orderNumber} · {item.orderStatus}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-black">{formatMoney.format(commission.sellerNetAmount)}</p>
                    <p className="text-xs text-muted">Gross {formatMoney.format(commission.grossAmount)} · Fee {formatMoney.format(commission.platformFee)}</p>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
