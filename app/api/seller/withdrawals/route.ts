import { NextResponse } from "next/server";
import { z } from "zod";
import { createTicket } from "@/lib/tickets";
import { findSellerProfileByUserId } from "@/lib/sellers";
import { getCurrentUser } from "@/lib/session-server";
import { logActivity } from "@/lib/activity";
import { sendNotificationEmail } from "@/lib/email";
import { createSellerWithdrawalRequest } from "@/lib/wallet";

const withdrawalSchema = z.object({
  amount: z.coerce.number().int().positive()
});

const formatMoney = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

export async function POST(request: Request) {
  const current = await getCurrentUser();
  if (!current) return NextResponse.redirect(new URL("/login", request.url));
  if (current.session.role !== "seller") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const seller = await findSellerProfileByUserId(current.user.id);
  if (!seller) return NextResponse.json({ error: "Seller profile not found" }, { status: 404 });

  const form = await request.formData();
  const payload = withdrawalSchema.parse({ amount: form.get("amount") ?? 0 });
  const amountText = formatMoney.format(payload.amount);
  const ticket = await createTicket({
    buyerId: current.user.id,
    sellerId: seller.id,
    subject: "Withdrawal request",
    message: `Seller ${seller.storeName} mengajukan withdrawal manual sebesar ${amountText}. Admin perlu verifikasi saldo dan data payout sebelum pembayaran.`
  });
  const withdrawal = await createSellerWithdrawalRequest({ sellerId: seller.id, userId: current.user.id, ticketId: ticket?.id ?? null, amount: payload.amount });

  await sendNotificationEmail({
    to: process.env.SUPPORT_EMAIL,
    subject: "Withdrawal request seller",
    text: `Withdrawal request dari ${seller.storeName} (${current.user.email}) sebesar ${amountText}. Ticket ID: ${ticket?.id ?? "unknown"}.`
  });

  await logActivity({
    actorId: current.user.id,
    action: "seller.withdrawal_requested",
    entityType: "seller_withdrawal_request",
    entityId: withdrawal?.id ?? ticket?.id ?? current.user.id,
    metadata: { sellerId: seller.id, ticketId: ticket?.id ?? null, amount: payload.amount }
  });

  return NextResponse.redirect(new URL("/seller/tickets", request.url), { status: 303 });
}
