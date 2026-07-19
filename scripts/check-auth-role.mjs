import assert from "node:assert/strict";
import { resolveSessionRole } from "../lib/session-role.js";

assert.equal(resolveSessionRole("admin", "buyer"), "buyer");
assert.equal(resolveSessionRole("buyer", "admin"), "admin");
assert.equal(resolveSessionRole("seller", "seller"), "seller");

console.log("[check-auth-role] ok");
