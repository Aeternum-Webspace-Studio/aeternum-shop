export function productPriceForUser(product, user) {
  return user?.resellerStatus === "approved" && product.resellerPrice ? product.resellerPrice : product.price;
}

export function marketplaceCommissionBps() {
  const value = Number.parseInt(process.env.MARKETPLACE_COMMISSION_BPS ?? "1000", 10);
  return Number.isFinite(value) && value >= 0 && value <= 10000 ? value : 1000;
}

export function calculateMarketplaceCommission(amount, bps = marketplaceCommissionBps()) {
  const platformFee = Math.floor((amount * bps) / 10000);
  return { grossAmount: amount, platformFee, sellerNetAmount: amount - platformFee, commissionBps: bps };
}
