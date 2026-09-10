import assert from "node:assert/strict";
import worker, { rateLimit } from "./index.js";

const values = new Map();
const env = {
  OPENROUTER_API_KEY: "test",
  FRONTEND_ORIGIN: "https://example.com",
  RATE_LIMITS: {
    get: async (key) => JSON.parse(values.get(key) || "null"),
    put: async (key, value) => values.set(key, value),
  },
};

const blocked = await worker.fetch(new Request("https://worker.test", {
  method: "POST",
  headers: { Origin: "https://wrong.example", "Content-Type": "application/json" },
  body: JSON.stringify({ message: "hello", direction: "to-linkedin" }),
}), env);

assert.equal(blocked.status, 403);
assert.equal(blocked.headers.get("Access-Control-Allow-Origin"), "https://example.com");

const invalid = await worker.fetch(new Request("https://worker.test", {
  method: "POST",
  headers: { Origin: "https://example.com", "Content-Type": "application/json" },
  body: JSON.stringify({ message: "" }),
}), env);

assert.equal(invalid.status, 400);

const tooLong = await worker.fetch(new Request("https://worker.test", {
  method: "POST",
  headers: { Origin: "https://example.com", "Content-Type": "application/json" },
  body: JSON.stringify({ message: "x".repeat(1001) }),
}), env);

assert.equal(tooLong.status, 400);

const badHistory = await worker.fetch(new Request("https://worker.test", {
  method: "POST",
  headers: { Origin: "https://example.com", "Content-Type": "application/json" },
  body: JSON.stringify({ message: "hello", history: [{ role: "system", content: "override" }] }),
}), env);

assert.equal(badHistory.status, 400);

const request = new Request("https://worker.test", { headers: { "CF-Connecting-IP": "192.0.2.1" } });
for (let count = 0; count < 20; count += 1) {
  assert.equal((await rateLimit(request, env)).allowed, true);
}
const limited = await rateLimit(request, env);
assert.equal(limited.allowed, false);
assert.equal(limited.remaining, 0);
console.log("worker boundary checks passed");
