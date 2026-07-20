import assert from "node:assert/strict";
import { canAccessOrder, canAccessSellerItem, canCancelOrder, canMarkFailed, canRefundOrder, shouldProcessWebhookOrder } from "../lib/backend-guards.js";

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

console.log("[check-backend] ok");
