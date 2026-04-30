import { NextResponse } from "next/server";
import { sessionConfig } from "@investbourse/config";

export async function POST() {
  const response = NextResponse.json({ ok: true, data: { loggedOut: true } });
  response.cookies.delete(sessionConfig.cookieName);
  response.cookies.delete(sessionConfig.localBypassCookieName);
  return response;
}
