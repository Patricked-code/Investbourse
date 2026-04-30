import { NextResponse } from "next/server";
import { canAccessAdmin, getCurrentSession } from "@/lib/session";

const OFFICE_SERVICE_URL = process.env.OFFICE_SERVICE_URL ?? "http://localhost:4040";

export async function GET() {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.user.role)) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  const response = await fetch(`${OFFICE_SERVICE_URL}/office/client-messages`, { cache: "no-store" });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.user.role)) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  const body = await request.json();
  const response = await fetch(`${OFFICE_SERVICE_URL}/office/client-messages`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      ...body,
      senderType: "ADMIN",
      senderLabel: session.user.fullName,
      actorUserId: session.user.id,
    }),
  });

  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
