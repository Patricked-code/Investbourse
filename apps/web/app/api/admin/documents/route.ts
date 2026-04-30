import { NextResponse } from "next/server";
import { canAccessAdmin, getCurrentSession } from "@/lib/session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function GET() {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.user.role)) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  const response = await fetch(`${API_BASE_URL}/api/office/documents`, { cache: "no-store" });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.user.role)) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  const body = await request.json();
  const response = await fetch(`${API_BASE_URL}/api/office/documents`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...body, actorUserId: session.user.id, uploadedByLabel: session.user.fullName }),
  });

  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
