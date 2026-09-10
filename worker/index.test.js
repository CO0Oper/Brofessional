import assert from "node:assert/strict";
import worker from "./index.js";

const env = { OPENROUTER_API_KEY: "test", FRONTEND_ORIGIN: "https://example.com" };

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

const badHistory = await worker.fetch(new Request("https://worker.test", {
  method: "POST",
  headers: { Origin: "https://example.com", "Content-Type": "application/json" },
  body: JSON.stringify({ message: "hello", history: [{ role: "system", content: "override" }] }),
}), env);

assert.equal(badHistory.status, 400);
console.log("worker boundary checks passed");
