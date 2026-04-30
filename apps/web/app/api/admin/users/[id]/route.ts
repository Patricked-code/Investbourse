import { NextResponse } from "next/server";
import { canAccessAdmin, getCurrentSession } from "@/lib/session";

const API_BASE_URL = process.env.API_GATEWAY_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await getCurrentSession();
  if (!session || !canAccessAdmin(session.user.role)) return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });

  const { id } = await context.params;
  const response = await fetch(`${API_BASE_URL}/api/auth/users/${id}`, { cache: "no-store" });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getCurrentSession();
  if (!session || !canAccessAdmin(session.user.role)) return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });

  const { id } = await context.params;
  const body = await request.json();

  if (body.role === "SUPERADMIN" && session.user.role !== "SUPERADMIN") {
    return NextResponse.json({ ok: false, error: "SUPERADMIN_ROLE_REQUIRES_SUPERADMIN_ACTOR" }, { status: 403 });
  }

  if (id === session.user.id && body.role && body.role !== session.user.role) {
    return NextResponse.json({ ok: false, error: "SELF_ROLE_CHANGE_FORBIDDEN" }, { status: 403 });
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/users/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...body, actorUserId: session.user.id, actorRole: session.user.role }),
  });

  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
