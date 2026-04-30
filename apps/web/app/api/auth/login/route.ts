import { NextResponse } from "next/server";
import { sessionConfig } from "@investbourse/config";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = await response.json();
  const nextResponse = NextResponse.json(payload, { status: response.status });

  if (response.ok && payload?.ok === true && payload?.data?.token) {
    nextResponse.cookies.set(sessionConfig.cookieName, payload.data.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: sessionConfig.maxAgeSeconds,
    });
  }

  return nextResponse;
}
