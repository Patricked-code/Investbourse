import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";

const API_BASE_URL = process.env.API_GATEWAY_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });

  const response = await fetch(`${API_BASE_URL}/api/office/client-messages/by-user/${session.user.id}`, { cache: "no-store" });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });

  const body = await request.json();
  const response = await fetch(`${API_BASE_URL}/api/office/client-messages`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...body, userId: session.user.id, senderType: "CLIENT", senderLabel: session.user.fullName, actorUserId: session.user.id }),
  });

  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
