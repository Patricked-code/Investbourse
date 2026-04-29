import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function GET() {
  const response = await fetch(`${API_BASE_URL}/api/seo-pages`, { next: { revalidate: 300 } });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
