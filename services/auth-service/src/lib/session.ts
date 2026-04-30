import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { assertProductionSecret } from "@investbourse/config/security";

const sessionTtlSeconds = 60 * 60 * 8;

type SessionPayload = {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
  nonce: string;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET ?? process.env.JWT_SECRET;
  assertProductionSecret("AUTH_SECRET_OR_JWT_SECRET", secret);

  if (!secret) {
    return "investbourse-development-session-secret";
  }

  return secret;
}

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString("base64url");
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createSessionToken(input: { id: string; email: string; role: string }) {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: input.id,
    email: input.email,
    role: input.role,
    iat: now,
    exp: now + sessionTtlSeconds,
    nonce: randomBytes(16).toString("hex"),
  };

  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null) {
  if (!token) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expected = sign(encodedPayload);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== signatureBuffer.length || !timingSafeEqual(expectedBuffer, signatureBuffer)) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as SessionPayload;
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp < now) return null;

  return payload;
}

export const sessionCookieName = "investbourse_session";
export const sessionMaxAge = sessionTtlSeconds;
