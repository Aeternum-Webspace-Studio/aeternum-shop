import assert from "node:assert/strict";
import { canAccessOrder, canAccessSellerItem, canCancelOrder, canClaimAutoStock, canMarkFailed, canRefundOrder, isDuplicatePaidWebhook, isWebhookAmountMatch, resolveWebhookPaymentOutcome, shouldProcessWebhookOrder } from "../lib/backend-guards.js";
import { productPriceForUser } from "../lib/pricing.js";

assert.equal(canAccessOrder({ isAdmin: true, buyerId: "buyer-1", userId: "any" }), true);
assert.equal(canAccessOrder({ isAdmin: false, buyerId: "buyer-1", userId: "buyer-1" }), true);
assert.equal(canAccessOrder({ isAdmin: false, buyerId: "buyer-1", userId: "buyer-2" }), false);

assert.equal(canAccessSellerItem({ isAdmin: true, sellerId: "seller-1", userSellerId: null }), true);
assert.equal(canAccessSellerItem({ isAdmin: false, sellerId: "seller-1", userSellerId: "seller-1" }), true);
assert.equal(canAccessSellerItem({ isAdmin: false, sellerId: "seller-1", userSellerId: "seller-2" }), false);

assert.equal(canCancelOrder("pending_payment"), true);
assert.equal(canCancelOrder("paid"), false);
assert.equal(canRefundOrder({ orderStatus: "paid", paymentStatus: "paid" }), true);
assert.equal(canRefundOrder({ orderStatus: "delivered", paymentStatus: "pending" }), true);
assert.equal(canRefundOrder({ orderStatus: "pending_payment", paymentStatus: "pending" }), false);
assert.equal(canMarkFailed("paid"), true);
assert.equal(canMarkFailed("processing"), true);
assert.equal(canMarkFailed("cancelled"), false);

assert.equal(shouldProcessWebhookOrder("pending_payment"), true);
assert.equal(shouldProcessWebhookOrder("paid"), true);
assert.equal(shouldProcessWebhookOrder("refunded"), false);

assert.equal(canClaimAutoStock("available"), true);
assert.equal(canClaimAutoStock("sold"), false);
assert.equal(canClaimAutoStock("disabled"), false);

assert.equal(isWebhookAmountMatch(35000, 35000), true);
assert.equal(isWebhookAmountMatch(35000, 34000), false);
assert.equal(isDuplicatePaidWebhook("paid"), true);
assert.equal(isDuplicatePaidWebhook("pending"), false);

assert.equal(resolveWebhookPaymentOutcome({ orderStatus: "pending_payment", paymentStatus: "pending", paymentAmount: 35000, webhookAmount: 35000 }), "paid");
assert.equal(resolveWebhookPaymentOutcome({ orderStatus: "pending_payment", paymentStatus: "paid", paymentAmount: 35000, webhookAmount: 35000 }), "duplicate");
assert.equal(resolveWebhookPaymentOutcome({ orderStatus: "pending_payment", paymentStatus: "pending", paymentAmount: 35000, webhookAmount: 34000 }), "mismatch");
assert.equal(resolveWebhookPaymentOutcome({ orderStatus: "cancelled", paymentStatus: "pending", paymentAmount: 35000, webhookAmount: 35000 }), "ignored");

assert.equal(productPriceForUser({ price: 10000, resellerPrice: 8000 }, { resellerStatus: "approved" }), 8000);
assert.equal(productPriceForUser({ price: 10000, resellerPrice: 8000 }, { resellerStatus: "pending" }), 10000);
assert.equal(productPriceForUser({ price: 10000, resellerPrice: null }, { resellerStatus: "approved" }), 10000);

console.log("[check-backend] ok");
