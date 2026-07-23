export function productPriceForUser(product: { price: number; resellerPrice: number | null }, user?: { resellerStatus: string } | null): number;
export function marketplaceCommissionBps(): number;
export function calculateMarketplaceCommission(amount: number, bps?: number): { grossAmount: number; platformFee: number; sellerNetAmount: number; commissionBps: number };
