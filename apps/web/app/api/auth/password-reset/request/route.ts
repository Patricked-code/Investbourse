import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_GATEWAY_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch(`${API_BASE_URL}/api/auth/password-reset/request`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
