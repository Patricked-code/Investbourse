import type { FastifyReply, FastifyRequest } from "fastify";
import { getInternalServiceToken, internalServiceHeaderName, isProductionRuntime } from "./security.js";

export function requireInternalServiceToken(request: FastifyRequest, reply: FastifyReply) {
  if (!isProductionRuntime()) return true;

  const expected = getInternalServiceToken();
  const received = request.headers[internalServiceHeaderName];
  const token = Array.isArray(received) ? received[0] : received;

  if (!expected || token !== expected) {
    reply.status(401).send({ ok: false, error: "INTERNAL_SERVICE_TOKEN_REQUIRED" });
    return false;
  }

  return true;
}

export function internalServiceHeaders() {
  const token = getInternalServiceToken();
  return token ? { [internalServiceHeaderName]: token } : {};
}
