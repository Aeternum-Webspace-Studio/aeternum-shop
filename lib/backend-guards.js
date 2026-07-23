export function canAccessOrder({ isAdmin, buyerId, userId }) {
  return isAdmin || buyerId === userId;
}

export function canAccessSellerItem({ isAdmin, sellerId, userSellerId }) {
  return isAdmin || (userSellerId !== null && sellerId === userSellerId);
}

export function canCancelOrder(status) {
  return status === "pending_payment";
}

export function canRefundOrder({ orderStatus, paymentStatus }) {
  return paymentStatus === "paid" || orderStatus === "paid" || orderStatus === "delivered";
}

export function canMarkFailed(status) {
  return status === "paid" || status === "processing";
}

export function shouldProcessWebhookOrder(status) {
  return status === "pending_payment" || status === "paid";
}

export function canClaimAutoStock(status) {
  return status === "available";
}

export function isWebhookAmountMatch(paymentAmount, webhookAmount) {
  return paymentAmount === webhookAmount;
}

export function isDuplicatePaidWebhook(paymentStatus) {
  return paymentStatus === "paid";
}
