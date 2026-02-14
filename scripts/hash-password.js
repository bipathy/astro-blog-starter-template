#!/usr/bin/env node
// Usage: node scripts/hash-password.js "your-password-here"
// Outputs a PBKDF2 hash suitable for AUTH_PASSWORD_HASH env var.

const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/hash-password.js <password>");
  process.exit(1);
}

const ITERATIONS = 100_000;
const HASH_LENGTH = 32;
const SALT_LENGTH = 16;

async function hash() {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"],
  );

  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "HMAC", hash: "SHA-256", length: HASH_LENGTH * 8 },
    true,
    ["sign"],
  );

  const hashBuf = await crypto.subtle.exportKey("raw", key);
  const saltB64 = Buffer.from(salt).toString("base64");
  const hashB64 = Buffer.from(hashBuf).toString("base64");

  console.log(`\nAUTH_PASSWORD_HASH=${saltB64}:${hashB64}\n`);
  console.log("Add this to your .dev.vars file (local) or use:");
  console.log('  wrangler secret put AUTH_PASSWORD_HASH');
}

hash();
