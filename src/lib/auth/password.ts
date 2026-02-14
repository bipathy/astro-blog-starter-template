const ITERATIONS = 100_000;
const HASH_LENGTH = 32;
const SALT_LENGTH = 16;

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const key = await deriveKey(password, salt);
  const hash = await crypto.subtle.exportKey("raw", key);

  const saltB64 = uint8ToBase64(salt);
  const hashB64 = uint8ToBase64(new Uint8Array(hash));
  return `${saltB64}:${hashB64}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [saltB64, expectedHashB64] = storedHash.split(":");
  if (!saltB64 || !expectedHashB64) return false;

  const salt = base64ToUint8(saltB64);
  const key = await deriveKey(password, salt);
  const hash = await crypto.subtle.exportKey("raw", key);

  const actual = new Uint8Array(hash);
  const expected = base64ToUint8(expectedHashB64);

  if (actual.length !== expected.length) return false;

  // Constant-time comparison
  let diff = 0;
  for (let i = 0; i < actual.length; i++) {
    diff |= actual[i] ^ expected[i];
  }
  return diff === 0;
}

async function deriveKey(
  password: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"],
  );

  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: "HMAC", hash: "SHA-256", length: HASH_LENGTH * 8 },
    true,
    ["sign"],
  );
}

function uint8ToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function base64ToUint8(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}
