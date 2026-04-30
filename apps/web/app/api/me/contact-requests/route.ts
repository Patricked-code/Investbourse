import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/session";

const CONTACT_SERVICE_URL = process.env.CONTACT_SERVICE_URL ?? "http://localhost:4010";

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ ok: false, error: "UNAUTHORIZED" }, { status: 401 });
  }

  const response = await fetch(`${CONTACT_SERVICE_URL}/contact-requests/by-user/${session.user.id}`, { cache: "no-store" });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
