import { NextResponse } from "next/server";
import { canAccessAdmin, getCurrentSession } from "@/lib/session";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

function escapeCsv(value: unknown) {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  const session = await getCurrentSession();

  if (!session || !canAccessAdmin(session.user.role)) {
    return NextResponse.json({ ok: false, error: "FORBIDDEN" }, { status: 403 });
  }

  const response = await fetch(`${API_BASE_URL}/api/contact-requests`, { cache: "no-store" });
  const payload = await response.json();

  if (!response.ok || payload?.ok === false) {
    return NextResponse.json(payload, { status: response.status });
  }

  const rows = payload.data ?? [];
  const headers = ["id", "fullName", "organization", "email", "requestType", "status", "message", "createdAt", "updatedAt"];
  const csv = [
    headers.map(escapeCsv).join(","),
    ...rows.map((row: Record<string, unknown>) => headers.map((header) => escapeCsv(row[header])).join(",")),
  ].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="investbourse-contact-requests-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
