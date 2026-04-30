import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";

const API_BASE_URL = process.env.API_GATEWAY_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });

  const response = await fetch(`${API_BASE_URL}/api/contact-requests/by-user/${session.user.id}`, { cache: "no-store" });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
