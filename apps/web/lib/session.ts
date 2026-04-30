import { cookies } from "next/headers";
import { sessionConfig } from "@investbourse/config";

const API_BASE_URL = process.env.API_GATEWAY_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(sessionConfig.cookieName)?.value;

  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
      cache: "no-store",
    });

    const payload = await response.json();
    if (!response.ok || payload?.ok === false) return null;

    return payload.data as {
      user: {
        id: string;
        fullName: string;
        organization?: string | null;
        email: string;
        role: "USER" | "ADMIN" | "SUPERADMIN";
        status: string;
      };
      session: { sub: string; email: string; role: string; exp: number };
    };
  } catch {
    return null;
  }
}

export function canAccessAdmin(role: string | undefined) {
  return role === "ADMIN" || role === "SUPERADMIN";
}

export function canManageSuperAdmin(role: string | undefined) {
  return role === "SUPERADMIN";
}

export async function requireUserSession() {
  const session = await getCurrentSession();
  if (!session) return { ok: false as const, status: 401, error: "UNAUTHORIZED" };
  return { ok: true as const, session };
}

export async function requireAdminSession() {
  const session = await getCurrentSession();
  if (!session) return { ok: false as const, status: 401, error: "UNAUTHORIZED" };
  if (!canAccessAdmin(session.user.role)) return { ok: false as const, status: 403, error: "FORBIDDEN" };
  return { ok: true as const, session };
}
