export function canAccessOrder(input: { isAdmin: boolean; buyerId: string; userId: string }): boolean;
export function canAccessSellerItem(input: { isAdmin: boolean; sellerId: string | null; userSellerId: string | null }): boolean;
export function canCancelOrder(status: "pending_payment" | "paid" | "processing" | "delivered" | "cancelled" | "refunded" | "failed"): boolean;
export function canRefundOrder(input: { orderStatus: "pending_payment" | "paid" | "processing" | "delivered" | "cancelled" | "refunded" | "failed"; paymentStatus: "pending" | "paid" | "failed" | "expired" | "refunded" | null }): boolean;
export function canMarkFailed(status: "pending_payment" | "paid" | "processing" | "delivered" | "cancelled" | "refunded" | "failed"): boolean;
export function shouldProcessWebhookOrder(status: "pending_payment" | "paid" | "processing" | "delivered" | "cancelled" | "refunded" | "failed"): boolean;
