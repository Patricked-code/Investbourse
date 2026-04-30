import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sessionConfig } from "@investbourse/config";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionConfig.cookieName)?.value;

  if (!token) {
    return NextResponse.json({ ok: false, error: "NO_SESSION" }, { status: 401 });
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token }),
    cache: "no-store",
  });

  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
