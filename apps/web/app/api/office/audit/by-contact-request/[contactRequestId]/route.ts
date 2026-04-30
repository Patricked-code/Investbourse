import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

type RouteContext = {
  params: Promise<{ contactRequestId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { contactRequestId } = await context.params;
  const response = await fetch(`${API_BASE_URL}/api/office/audit/by-contact-request/${contactRequestId}`, { cache: "no-store" });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
