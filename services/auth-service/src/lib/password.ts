import { randomBytes, pbkdf2Sync, timingSafeEqual } from "node:crypto";

const iterations = 120_000;
const keyLength = 64;
const digest = "sha512";

export function hashPassword(password: string) {
  const salt = randomBytes(32).toString("hex");
  const derivedKey = pbkdf2Sync(password, salt, iterations, keyLength, digest).toString("hex");
  return `pbkdf2$${iterations}$${keyLength}$${digest}$${salt}$${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string | null | undefined) {
  if (!storedHash) return false;

  const parts = storedHash.split("$");
  if (parts.length !== 6 || parts[0] !== "pbkdf2") return false;

  const parsedIterations = Number(parts[1]);
  const parsedKeyLength = Number(parts[2]);
  const parsedDigest = parts[3];
  const salt = parts[4];
  const expected = parts[5];

  const derived = pbkdf2Sync(password, salt, parsedIterations, parsedKeyLength, parsedDigest).toString("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const derivedBuffer = Buffer.from(derived, "hex");

  if (expectedBuffer.length !== derivedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, derivedBuffer);
}
